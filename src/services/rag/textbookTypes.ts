export interface TextbookChunk {
  id: string;
  classLevel: number;
  subject: string;
  textbookName: string; // e.g. "NCERT Science Class 10"
  chapterNumber: number;
  chapterTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  pageNumber: number;
  content: string;
  formulas: string[];
  keyTerms: string[];
  ncertQuestions?: {
    question: string;
    answer: string;
  }[];
  summary: string;
}

export interface RAGSearchResult {
  query: string;
  topChunks: {
    chunk: TextbookChunk;
    score: number; // 0 to 1
  }[];
  synthesizedAnswer: string;
  primaryFormula?: string;
  formulaContext?: string;
  audioScript: string;
  chapterCitation: string;
  confidenceScore: number;
  relatedQuestions: string[];
}
