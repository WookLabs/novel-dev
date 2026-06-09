/**
 * chapter-cast.mjs
 *
 * Pure function to extract the character cast from a chapter JSON object.
 *
 * Priority:
 *  1. chapterJson.scene_cast if non-empty array
 *  2. unique union of chapterJson.scenes[].characters if any scenes have non-empty character arrays
 *  3. chapterJson.meta.characters if present
 *  4. else []
 *
 * Deduplicates while preserving first-seen order.
 */

/**
 * Extract the cast from a chapter JSON object.
 *
 * @param {object} chapterJson - parsed chapter JSON
 * @returns {string[]} deduplicated list of character ids/names in first-seen order
 */
export function extractChapterCast(chapterJson) {
  // 1. scene_cast if non-empty
  if (Array.isArray(chapterJson.scene_cast) && chapterJson.scene_cast.length > 0) {
    return dedupe(chapterJson.scene_cast);
  }

  // 2. union of scenes[].characters if any non-empty character arrays exist
  if (Array.isArray(chapterJson.scenes) && chapterJson.scenes.length > 0) {
    const fromScenes = [];
    for (const scene of chapterJson.scenes) {
      if (Array.isArray(scene.characters) && scene.characters.length > 0) {
        fromScenes.push(...scene.characters);
      }
    }
    if (fromScenes.length > 0) {
      return dedupe(fromScenes);
    }
  }

  // 3. meta.characters if present
  if (chapterJson.meta && Array.isArray(chapterJson.meta.characters) && chapterJson.meta.characters.length > 0) {
    return dedupe(chapterJson.meta.characters);
  }

  // 4. empty
  return [];
}

/**
 * Deduplicate an array while preserving first-seen order.
 * @param {any[]} arr
 * @returns {any[]}
 */
function dedupe(arr) {
  const seen = new Set();
  const result = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}
