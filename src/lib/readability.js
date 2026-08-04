function countSyllables(word) {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!normalized) return 0;
  if (normalized.length <= 3) return 1;
  const trimmed = normalized.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function analyzeReadability(text) {
  const words = text.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) || [];
  const sentences = text.match(/[.!?]+/g) || [];
  if (words.length < 20) return null;

  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const syllableCount = words.reduce((total, word) => total + countSyllables(word), 0);
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;
  const gradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  const readingEase = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;

  return {
    wordCount,
    gradeLevel: Number(gradeLevel.toFixed(1)),
    readingEase: Number(readingEase.toFixed(1)),
    targetMet: gradeLevel >= 6.5 && gradeLevel <= 7.5,
  };
}