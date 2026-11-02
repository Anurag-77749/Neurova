import { TextbookChunk } from '../textbookTypes';
import { CLASS_6_CHUNKS } from './class6Corpus';
import { CLASS_7_CHUNKS } from './class7Corpus';
import { CLASS_8_CHUNKS } from './class8Corpus';
import { CLASS_9_CHUNKS } from './class9Corpus';
import { CLASS_10_EXPANDED_CHUNKS } from './class10Corpus';
import { CLASS_10_PHYSICS_CHUNKS } from '../class10PhysicsCorpus';

export const ALL_NCERT_TEXTBOOK_CHUNKS: TextbookChunk[] = [
  ...CLASS_6_CHUNKS,
  ...CLASS_7_CHUNKS,
  ...CLASS_8_CHUNKS,
  ...CLASS_9_CHUNKS,
  ...CLASS_10_PHYSICS_CHUNKS,
  ...CLASS_10_EXPANDED_CHUNKS
];

export const AVAILABLE_CLASSES = [6, 7, 8, 9, 10];
export const AVAILABLE_SUBJECTS = [
  'All Subjects',
  'Physics',
  'Chemistry',
  'Biology',
  'Science',
  'Mathematics',
  'Social Science'
];

export function getChunksForClass(classLevel: number): TextbookChunk[] {
  return ALL_NCERT_TEXTBOOK_CHUNKS.filter(c => c.classLevel === classLevel);
}

export function getChunksForSubject(subject: string): TextbookChunk[] {
  if (subject === 'All Subjects') return ALL_NCERT_TEXTBOOK_CHUNKS;
  return ALL_NCERT_TEXTBOOK_CHUNKS.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
}
