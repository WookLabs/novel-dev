#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const CONTENT_LIMIT = 240_000;

const SKILL_OUTPUTS = {
  '00-brainstorm': {
    label: 'Brainstorm',
    patterns: ['meta/brainstorm-result.md', 'meta/brainstorm*.md'],
  },
  '01-blueprint-gen': {
    label: 'Blueprint',
    patterns: ['BLUEPRINT.md', 'blueprint*.md', 'meta/blueprint*.json', 'meta/blueprint*.md'],
  },
  '02-blueprint-review': {
    label: 'Blueprint Review',
    patterns: ['reviews/blueprint*.json', 'reviews/blueprint*.md', 'reviews/*blueprint*.json', 'reviews/*blueprint*.md'],
  },
  '03-init': {
    label: 'Project Init',
    patterns: ['CLAUDE.md', 'meta/project.json', 'meta/style-guide.json'],
  },
  '04-design': {
    label: 'Design',
    patterns: [
      'meta/style-guide.json',
      'world/*.json',
      'world/**/*.json',
      'characters/*.json',
      'characters/**/*.json',
      'plot/*.json',
      'plot/**/*.json',
    ],
  },
  '04-design-review': {
    label: 'Design Review',
    patterns: ['reviews/design*.json', 'reviews/design*.md', 'reviews/*design*.json', 'reviews/*design*.md'],
  },
  '05-gen-plot': {
    label: 'Plot Generation',
    patterns: ['plot/*.json', 'plot/**/*.json', 'chapters/chapter_*.json'],
  },
  '05-plot-review': {
    label: 'Plot Review',
    patterns: ['reviews/plot*.json', 'reviews/plot*.md', 'reviews/*plot*.json', 'reviews/*plot*.md'],
  },
  '06-write': {
    label: 'Chapter Write',
    patterns: ['chapters/chapter_*.md', 'chapters/chapter_*.json', 'context/summaries/*.md'],
  },
  '07-act-review': {
    label: 'Act Review',
    patterns: ['reviews/chapter_*_review.json', 'reviews/act*.json', 'reviews/act*.md', 'reviews/team/*.json'],
  },
  '07-write-act': {
    label: 'Write Act',
    patterns: ['chapters/chapter_*.md', 'chapters/chapter_*.json', 'context/summaries/*.md'],
  },
  '08-write-all': {
    label: 'Write All',
    patterns: [
      'chapters/chapter_*.md',
      'chapters/chapter_*.json',
      'context/summaries/*.md',
      'reviews/*.json',
      'reviews/**/*.json',
    ],
  },
  '09-revise': {
    label: 'Revise',
    patterns: ['chapters/chapter_*.md', 'reviews/*revision*.json', 'reviews/*revise*.json', 'reviews/team/*.json'],
  },
  '10-resume': {
    label: 'Resume',
    patterns: ['CLAUDE.md', 'meta/project.json', 'reviews/team/*.json', 'status*.json', 'status*.md'],
  },
  help: {
    label: 'Help',
    patterns: [],
  },
  quickstart: {
    label: 'Quickstart',
    patterns: ['CLAUDE.md', 'BLUEPRINT.md', 'meta/project.json'],
  },
  'revise-pipeline': {
    label: 'Revision Pipeline',
    patterns: ['reviews/*revision*.json', 'reviews/team/*.json', 'chapters/chapter_*.md'],
  },
  'revision-team-gate': {
    label: 'Revision Team Gate',
    patterns: ['reviews/team/*.json', 'reviews/*revision*.json'],
  },
  stats: {
    label: 'Stats',
    patterns: ['stats/*.json', 'stats/*.md', 'reviews/*stats*.json', 'exports/*stats*.md'],
  },
  status: {
    label: 'Status',
    patterns: ['status*.json', 'status*.md', 'CLAUDE.md', 'meta/project.json'],
  },
  'style-library': {
    label: 'Style Library',
    patterns: ['meta/style-guide.json', 'meta/style-library.json', 'styles/*.json', 'styles/*.md'],
  },
  'verify-chapter': {
    label: 'Verify Chapter',
    patterns: ['reviews/chapter_*_verification.json', 'reviews/chapter_*_review.json', 'reviews/team/*.json'],
  },
  'verify-design': {
    label: 'Verify Design',
    patterns: ['reviews/design*.json', 'reviews/design*.md', 'reviews/*design*.json'],
  },
  'write-2pass': {
    label: 'Write 2-Pass',
    patterns: ['chapters/chapter_*.md', 'reviews/*2pass*.json', 'reviews/team/*.json'],
  },
  'write-3pass': {
    label: 'Write 3-Pass',
    patterns: ['chapters/chapter_*.md', 'reviews/*3pass*.json', 'reviews/team/*.json'],
  },
  'write-act-2pass': {
    label: 'Write Act 2-Pass',
    patterns: ['chapters/chapter_*.md', 'reviews/*2pass*.json', 'reviews/team/*.json'],
  },
  'write-act-3pass': {
    label: 'Write Act 3-Pass',
    patterns: ['chapters/chapter_*.md', 'reviews/*3pass*.json', 'reviews/team/*.json'],
  },
  'write-act-parallel': {
    label: 'Write Act Parallel',
    patterns: ['chapters/chapter_*.md', 'reviews/team/*.json'],
  },
  'write-parallel': {
    label: 'Write Parallel',
    patterns: ['chapters/chapter_*.md', 'reviews/team/*.json'],
  },
};

function parseArgs(argv) {
  const args = {
    resultRoot: join(REPO_ROOT, 'result'),
    output: undefined,
    skillsDir: join(REPO_ROOT, 'skills'),
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--result-root' && argv[i + 1]) {
      args.resultRoot = argv[++i];
    } else if (arg === '--output' && argv[i + 1]) {
      args.output = argv[++i];
    } else if (arg === '--skills-dir' && argv[i + 1]) {
      args.skillsDir = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  args.output ??= join(args.resultRoot, 'viewer.html');
  return args;
}

function printHelp() {
  console.log(`Novel Result Viewer

Usage:
  node scripts/result-viewer.mjs [--result-root result] [--output result/viewer.html]

Options:
  --result-root DIR   Result directory containing novel projects
  --output FILE       HTML file to write
  --skills-dir DIR    Skill directory used to list every skill`);
}

function listSkillNames(skillsDir) {
  if (!existsSync(skillsDir)) return Object.keys(SKILL_OUTPUTS).sort();

  return readdirSync(skillsDir)
    .filter(entry => statSync(join(skillsDir, entry)).isDirectory())
    .sort();
}

function listProjects(resultRoot) {
  if (!existsSync(resultRoot)) return [];

  return readdirSync(resultRoot)
    .filter(entry => {
      const fullPath = join(resultRoot, entry);
      return statSync(fullPath).isDirectory();
    })
    .sort()
    .map(name => ({
      name,
      path: join(resultRoot, name),
    }));
}

function walkFiles(rootDir) {
  if (!existsSync(rootDir)) return [];

  const result = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current).sort()) {
      const fullPath = join(current, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        stack.push(fullPath);
      } else {
        const relPath = normalizePath(relative(rootDir, fullPath));
        result.push({
          fullPath,
          relPath,
          size: stat.size,
          modifiedAt: stat.mtime.toISOString(),
        });
      }
    }
  }

  return result.sort((a, b) => a.relPath.localeCompare(b.relPath));
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function globToRegex(pattern) {
  const source = normalizePath(pattern);
  let out = '^';

  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    const next = source[i + 1];
    if (char === '*' && next === '*') {
      out += '.*';
      i++;
    } else if (char === '*') {
      out += '[^/]*';
    } else {
      out += char.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
    }
  }

  out += '$';
  return new RegExp(out, 'i');
}

function matchFiles(files, patterns) {
  if (!patterns || patterns.length === 0) return [];

  const regexes = patterns.map(globToRegex);
  const matched = new Map();
  for (const file of files) {
    if (regexes.some(regex => regex.test(file.relPath))) {
      matched.set(file.relPath, file);
    }
  }

  return [...matched.values()].sort((a, b) => a.relPath.localeCompare(b.relPath));
}

function readTextFile(file) {
  const raw = readFileSync(file.fullPath, 'utf-8');
  if (raw.length > CONTENT_LIMIT) {
    return {
      content: `${raw.slice(0, CONTENT_LIMIT)}\n\n[truncated: ${raw.length - CONTENT_LIMIT} chars omitted]`,
      truncated: true,
    };
  }

  return { content: raw, truncated: false };
}

function summarizeProject(projectPath) {
  const projectJson = join(projectPath, 'meta', 'project.json');
  if (!existsSync(projectJson)) return {};

  try {
    const data = JSON.parse(readFileSync(projectJson, 'utf-8'));
    return {
      title: data.title || data.name || data.novel_title,
      genre: data.genre,
      status: data.status,
    };
  } catch {
    return {};
  }
}

function buildProjectModel(project, skillNames) {
  const files = walkFiles(project.path);
  const summary = summarizeProject(project.path);

  const skills = skillNames.map(name => {
    const definition = SKILL_OUTPUTS[name] ?? {
      label: name,
      patterns: [],
    };
    const outputs = matchFiles(files, definition.patterns);
    return {
      name,
      label: definition.label,
      patterns: definition.patterns,
      outputs,
    };
  });

  return {
    ...project,
    files,
    summary,
    skills,
  };
}

function renderHtml({ resultRoot, generatedAt, projects }) {
  const projectCount = projects.length;
  const fileCount = projects.reduce((sum, project) => sum + project.files.length, 0);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Novel Result Viewer</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7f4;
      --panel: #ffffff;
      --ink: #202124;
      --muted: #66716b;
      --line: #d9ded8;
      --accent: #0f766e;
      --accent-soft: #d9f0ec;
      --warn: #9a5b00;
      --warn-soft: #fff3d6;
      --code: #111827;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.55;
    }
    header {
      padding: 24px 32px 18px;
      border-bottom: 1px solid var(--line);
      background: #ffffff;
    }
    h1, h2, h3, h4 { margin: 0; letter-spacing: 0; }
    h1 { font-size: 28px; font-weight: 760; }
    h2 { font-size: 22px; margin-bottom: 8px; }
    h3 { font-size: 18px; }
    h4 { font-size: 15px; margin-bottom: 8px; }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
      color: var(--muted);
      font-size: 13px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 4px 10px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #fbfcfa;
    }
    main { padding: 24px 32px 44px; }
    .project {
      max-width: 1400px;
      margin: 0 auto 28px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
    }
    .project-head {
      padding: 20px 22px;
      border-bottom: 1px solid var(--line);
      background: #fbfcfa;
    }
    .project-body {
      display: grid;
      grid-template-columns: minmax(220px, 280px) 1fr;
      min-height: 420px;
    }
    .skill-nav {
      border-right: 1px solid var(--line);
      background: #f9faf7;
      padding: 14px;
    }
    .skill-link {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 8px;
      border-radius: 6px;
      color: var(--ink);
      text-decoration: none;
      font-size: 13px;
    }
    .skill-link:hover { background: var(--accent-soft); }
    .count {
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }
    .skills {
      padding: 18px;
      min-width: 0;
    }
    details.skill {
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
      background: #fff;
    }
    details.skill[open] > summary { border-bottom: 1px solid var(--line); }
    summary {
      cursor: pointer;
      padding: 12px 14px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      list-style: none;
    }
    summary::-webkit-details-marker { display: none; }
    .skill-title {
      display: flex;
      gap: 10px;
      align-items: baseline;
      min-width: 0;
    }
    .skill-name { font-weight: 720; }
    .skill-label { color: var(--muted); font-size: 13px; }
    .empty {
      margin: 14px;
      padding: 12px;
      background: var(--warn-soft);
      border: 1px solid #f0d692;
      border-radius: 6px;
      color: var(--warn);
      font-size: 13px;
    }
    .patterns {
      margin: 0 14px 14px;
      color: var(--muted);
      font-size: 12px;
    }
    .file {
      margin: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
    }
    .file-head {
      padding: 9px 11px;
      border-bottom: 1px solid var(--line);
      background: #f8fbfa;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
    }
    .path {
      font-family: Consolas, "Cascadia Mono", monospace;
      color: var(--accent);
      overflow-wrap: anywhere;
    }
    .file-meta { color: var(--muted); font-size: 12px; }
    .content { padding: 14px; overflow: auto; }
    pre {
      margin: 0;
      color: var(--code);
      font-family: Consolas, "Cascadia Mono", monospace;
      font-size: 13px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .markdown h1 { font-size: 21px; margin: 0 0 12px; }
    .markdown h2 { font-size: 18px; margin: 16px 0 8px; }
    .markdown h3 { font-size: 16px; margin: 14px 0 8px; }
    .markdown p { margin: 0 0 10px; }
    .no-projects {
      max-width: 720px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
    }
    @media (max-width: 860px) {
      header, main { padding-left: 18px; padding-right: 18px; }
      .project-body { grid-template-columns: 1fr; }
      .skill-nav { border-right: 0; border-bottom: 1px solid var(--line); }
    }
  </style>
</head>
<body>
  <header>
    <h1>Novel Result Viewer</h1>
    <div class="meta">
      <span class="pill">root: ${escapeHtml(normalizePath(resultRoot))}</span>
      <span class="pill">projects: ${projectCount}</span>
      <span class="pill">files: ${fileCount}</span>
      <span class="pill">generated: ${escapeHtml(generatedAt)}</span>
    </div>
  </header>
  <main>
    ${projects.length === 0 ? renderNoProjects() : projects.map(renderProject).join('\n')}
  </main>
</body>
</html>`;
}

function renderNoProjects() {
  return `<section class="no-projects">
    <h2>결과 프로젝트 없음</h2>
    <p>result 폴더 아래에 프로젝트 디렉터리가 생성되면 여기에 표시됩니다.</p>
  </section>`;
}

function renderProject(project) {
  const title = project.summary.title || project.name;
  const subtitle = [
    project.summary.genre ? `genre: ${project.summary.genre}` : null,
    project.summary.status ? `status: ${project.summary.status}` : null,
    `files: ${project.files.length}`,
  ].filter(Boolean);

  return `<section class="project" id="${htmlId(project.name)}">
    <div class="project-head">
      <h2>${escapeHtml(title)}</h2>
      <div class="meta">
        <span class="pill">${escapeHtml(project.name)}</span>
        ${subtitle.map(item => `<span class="pill">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
    <div class="project-body">
      <nav class="skill-nav">
        ${project.skills.map(skill => `<a class="skill-link" href="#${htmlId(project.name, skill.name)}"><span>${escapeHtml(skill.name)}</span><span class="count">${skill.outputs.length}</span></a>`).join('\n')}
      </nav>
      <div class="skills">
        ${project.skills.map(skill => renderSkill(project, skill)).join('\n')}
      </div>
    </div>
  </section>`;
}

function renderSkill(project, skill) {
  const isOpen = skill.outputs.length > 0 ? ' open' : '';
  return `<details class="skill"${isOpen} id="${htmlId(project.name, skill.name)}">
    <summary>
      <span class="skill-title">
        <span class="skill-name">${escapeHtml(skill.name)}</span>
        <span class="skill-label">${escapeHtml(skill.label)}</span>
      </span>
      <span class="count">${skill.outputs.length} files</span>
    </summary>
    ${skill.outputs.length === 0 ? renderEmptySkill(skill) : skill.outputs.map(renderFile).join('\n')}
  </details>`;
}

function renderEmptySkill(skill) {
  const patternText = skill.patterns.length > 0
    ? `<div class="patterns">patterns: ${escapeHtml(skill.patterns.join(', '))}</div>`
    : '<div class="patterns">persistent output: none declared</div>';
  return `<div class="empty">아직 생성 안 됨</div>${patternText}`;
}

function renderFile(file) {
  const { content, truncated } = readTextFile(file);
  return `<article class="file">
    <div class="file-head">
      <span class="path">${escapeHtml(file.relPath)}</span>
      <span class="file-meta">${formatBytes(file.size)} · ${escapeHtml(file.modifiedAt)}${truncated ? ' · truncated' : ''}</span>
    </div>
    <div class="content">
      ${renderContent(file.relPath, content)}
    </div>
  </article>`;
}

function renderContent(relPath, content) {
  if (relPath.toLowerCase().endsWith('.json')) {
    try {
      return `<pre>${escapeHtml(JSON.stringify(JSON.parse(content), null, 2))}</pre>`;
    } catch {
      return `<pre>${escapeHtml(content)}</pre>`;
    }
  }

  if (relPath.toLowerCase().endsWith('.md')) {
    return `<div class="markdown">${renderMarkdownLite(content)}</div>`;
  }

  return `<pre>${escapeHtml(content)}</pre>`;
}

function renderMarkdownLite(content) {
  return content
    .split(/\n{2,}/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${escapeHtml(heading[2])}</h${level}>`;
      }

      return `<p>${escapeHtml(trimmed).replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

function htmlId(...parts) {
  return parts
    .join('-')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const skillNames = listSkillNames(args.skillsDir);
  const projects = listProjects(args.resultRoot)
    .map(project => buildProjectModel(project, skillNames));
  const html = renderHtml({
    resultRoot: args.resultRoot,
    generatedAt: new Date().toISOString(),
    projects,
  });

  mkdirSync(dirname(args.output), { recursive: true });
  writeFileSync(args.output, html, 'utf-8');
  console.log(`Result viewer written: ${args.output}`);
}

main();
