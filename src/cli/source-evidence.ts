import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface SourceEvidenceFile {
  path: string;
  sha256: string;
  sizeBytes: number;
  modifiedAt: string;
}

export interface SourceEvidenceManifest {
  schemaVersion: 'novel-dev.source-evidence.v1';
  algorithm: 'sha256';
  generatedAt: string;
  digest: string;
  fileCount: number;
  files: SourceEvidenceFile[];
}

export interface SourceEvidenceComparison {
  status: 'no-sources' | 'not-recorded' | 'matched' | 'mismatch';
  currentDigest?: string;
  recordedDigest?: string;
  changedPaths: string[];
}

export async function buildSourceEvidenceManifest(
  rootDir: string,
  sourcePaths: string[],
  generatedAt = new Date().toISOString()
): Promise<SourceEvidenceManifest> {
  const files = await collectSourceEvidence(rootDir, sourcePaths);
  const digest = hashStableJson({
    algorithm: 'sha256',
    files: files.map(file => ({
      path: file.path,
      sha256: file.sha256,
      sizeBytes: file.sizeBytes,
    })),
  });

  return {
    schemaVersion: 'novel-dev.source-evidence.v1',
    algorithm: 'sha256',
    generatedAt,
    digest,
    fileCount: files.length,
    files,
  };
}

export function extractSourceEvidenceManifest(report: unknown): SourceEvidenceManifest | undefined {
  if (!report || typeof report !== 'object') {
    return undefined;
  }
  const candidate = (report as { sourceEvidence?: unknown; source_evidence?: unknown }).sourceEvidence
    ?? (report as { sourceEvidence?: unknown; source_evidence?: unknown }).source_evidence;
  if (!candidate || typeof candidate !== 'object') {
    return undefined;
  }
  const manifest = candidate as Partial<SourceEvidenceManifest>;
  if (
    manifest.schemaVersion !== 'novel-dev.source-evidence.v1'
    || manifest.algorithm !== 'sha256'
    || typeof manifest.digest !== 'string'
    || !Array.isArray(manifest.files)
  ) {
    return undefined;
  }
  return manifest as SourceEvidenceManifest;
}

export function compareSourceEvidence(
  recorded: SourceEvidenceManifest | undefined,
  current: SourceEvidenceManifest
): SourceEvidenceComparison {
  if (current.fileCount === 0) {
    return {
      status: 'no-sources',
      currentDigest: current.digest,
      recordedDigest: recorded?.digest,
      changedPaths: [],
    };
  }

  if (!recorded) {
    return {
      status: 'not-recorded',
      currentDigest: current.digest,
      changedPaths: current.files.map(file => file.path).slice(0, 20),
    };
  }

  if (recorded.digest === current.digest) {
    return {
      status: 'matched',
      currentDigest: current.digest,
      recordedDigest: recorded.digest,
      changedPaths: [],
    };
  }

  return {
    status: 'mismatch',
    currentDigest: current.digest,
    recordedDigest: recorded.digest,
    changedPaths: diffEvidencePaths(recorded, current).slice(0, 20),
  };
}

async function collectSourceEvidence(
  rootDir: string,
  sourcePaths: string[]
): Promise<SourceEvidenceFile[]> {
  const files = new Set<string>();
  const resolvedRoot = path.resolve(rootDir);
  for (const sourcePath of sourcePaths) {
    for (const filePath of await collectExistingFiles(sourcePath)) {
      files.add(path.resolve(filePath));
    }
  }

  const evidence = await Promise.all(
    Array.from(files)
      .sort((a, b) => normalizeEvidencePath(resolvedRoot, a).localeCompare(normalizeEvidencePath(resolvedRoot, b)))
      .map(async filePath => {
        const [content, stat] = await Promise.all([
          fs.readFile(filePath),
          fs.stat(filePath),
        ]);
        return {
          path: normalizeEvidencePath(resolvedRoot, filePath),
          sha256: hashBuffer(content),
          sizeBytes: stat.size,
          modifiedAt: stat.mtime.toISOString(),
        };
      })
  );
  return evidence;
}

async function collectExistingFiles(targetPath: string): Promise<string[]> {
  const stat = await statOptional(targetPath);
  if (!stat) {
    return [];
  }
  if (stat.isFile()) {
    return [targetPath];
  }
  if (!stat.isDirectory()) {
    return [];
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(entry => collectExistingFiles(path.join(targetPath, entry.name)))
  );
  return nested.flat();
}

async function statOptional(filePath: string): Promise<import('node:fs').Stats | undefined> {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

function diffEvidencePaths(
  recorded: SourceEvidenceManifest,
  current: SourceEvidenceManifest
): string[] {
  const currentByPath = new Map(current.files.map(file => [file.path, file]));
  const recordedByPath = new Map(recorded.files.map(file => [file.path, file]));
  const paths = new Set([...currentByPath.keys(), ...recordedByPath.keys()]);
  return Array.from(paths)
    .sort()
    .filter(filePath => {
      const currentFile = currentByPath.get(filePath);
      const recordedFile = recordedByPath.get(filePath);
      return (
        currentFile?.sha256 !== recordedFile?.sha256
        || currentFile?.sizeBytes !== recordedFile?.sizeBytes
      );
    });
}

function normalizeEvidencePath(rootDir: string, filePath: string): string {
  return path.relative(rootDir, filePath).split(path.sep).join('/');
}

function hashBuffer(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

function hashStableJson(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}
