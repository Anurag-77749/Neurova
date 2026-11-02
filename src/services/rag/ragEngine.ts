import { TextbookChunk, RAGSearchResult } from './textbookTypes';
import { ALL_NCERT_TEXTBOOK_CHUNKS, AVAILABLE_CLASSES, AVAILABLE_SUBJECTS } from './corpora/allTextbooksCorpus';

// Common procedural & stop words that should have minimal weight
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'what', 'why', 'how', 'when', 'where', 'who', 'which', 'can',
  'do', 'does', 'did', 'explain', 'tell', 'me', 'about', 'find', 'calculate', 'give',
  'state', 'derive', 'show', 'write', 'difference', 'between', 'class', 'grade', 'define'
]);

// Very generic science words with lower specificity weight
const GENERIC_TERMS = new Set(['law', 'principle', 'formula', 'effect', 'rule', 'diagram', 'example', 'type', 'types']);

// Comprehensive K-10 Domain synonym & expansion dictionary
const SYNONYMS: Record<string, string[]> = {
  // --- Physics & Astronomy ---
  'sky': ['blue', 'scattering', 'atmosphere', 'rayleigh', 'wavelength', 'particles'],
  'blue': ['scattering', 'sky', 'rayleigh', 'wavelength'],
  'danger': ['red', 'fog', 'smoke', 'scattering', 'wavelength'],
  'sunset': ['red', 'sunrise', 'atmosphere', 'scattering'],
  'rainbow': ['dispersion', 'prism', 'internal reflection', 'spectrum', 'vibgyor'],
  'twinkling': ['stars', 'atmospheric refraction', 'fluctuating', 'apparent position'],
  'myopia': ['near-sightedness', 'concave lens', 'retina', 'diverging', 'focal length'],
  'hypermetropia': ['far-sightedness', 'convex lens', 'retina', 'converging'],
  'presbyopia': ['old age', 'ciliary muscles', 'bifocal', 'accommodation'],
  'ohm': ['voltage', 'current', 'resistance', 'potential difference', 'v = ir', 'conductor'],
  'resistance': ['resistivity', 'length', 'area', 'conductor', 'ohm', 'rho'],
  'resistivity': ['material', 'constant', 'temperature', 'nature of material'],
  'series': ['equivalent resistance', 'r1 + r2', 'current remains same', 'voltage divides'],
  'parallel': ['equivalent resistance', '1/r1 + 1/r2', 'voltage remains same', 'current divides'],
  'heat': ['joule', 'h = i^2rt', 'heating effect', 'fuse', 'nichrome', 'toaster', 'temperature', 'conduction', 'convection', 'radiation'],
  'temperature': ['thermometer', 'celsius', 'clinical', 'fahrenheit', 'kink'],
  'joule': ['heating effect', 'heat', 'h = i^2rt', 'electric current'],
  'motor': ['fleming left hand rule', 'magnetic field', 'armature', 'split rings', 'commutator'],
  'magnet': ['magnetic field', 'field lines', 'north pole', 'south pole', 'oersted', 'solenoid'],
  'solenoid': ['coil', 'circular turns', 'electromagnet', 'magnetic field inside uniform'],
  'lens': ['refraction', 'convex', 'concave', 'focal length', 'power', 'dioptre', '1/v - 1/u = 1/f'],
  'mirror': ['reflection', 'concave', 'convex', 'pole', 'focal length', '1/v + 1/u = 1/f'],
  'snell': ['refractive index', 'sin i / sin r', 'speed of light', 'bending'],
  'power': ['dioptre', 'p = 1/f', 'watt', 'p = vi', 'p = i^2r', 'p = v^2/r', 'kilowatt-hour'],
  'motion': ['distance', 'displacement', 'velocity', 'acceleration', 'v = u + at', 's = ut + 1/2at^2', 'v^2 = u^2 + 2as'],
  'inertia': ['newton first law', 'mass', 'momentum', 'unbalanced force'],
  'gravity': ['gravitation', 'g = 9.8', 'universal law', 'free fall', 'mass vs weight', 'archimedes', 'buoyancy'],
  'friction': ['static', 'sliding', 'rolling', 'ball bearings', 'lubricant', 'drag', 'streamlining'],
  'sound': ['vibration', 'amplitude', 'frequency', 'pitch', 'loudness', 'hertz', 'ultrasound', 'larynx', 'eardrum'],

  // --- Chemistry ---
  'acid': ['base', 'salt', 'ph scale', 'litmus', 'neutralisation', 'hcl', 'hydronium', 'sour'],
  'base': ['acid', 'alkali', 'oh-', 'hydroxide', 'phenolphthalein', 'bitter', 'soapy'],
  'ph': ['acid', 'base', 'neutral', 'logarithm', 'universal indicator', 'acid rain'],
  'salt': ['bleaching powder', 'baking soda', 'washing soda', 'plaster of paris', 'gypsum'],
  'pop': ['plaster of paris', 'gypsum', 'caso4', '373 k'],
  'carbon': ['catenation', 'tetravalency', 'covalent', 'hydrocarbon', 'alkanes', 'alkenes', 'alkynes', 'micelle', 'soap'],
  'soap': ['micelle', 'hydrophobic', 'hydrophilic', 'detergent', 'emulsify'],
  'mole': ['avogadro', '6.022', 'molar mass', 'dalton', 'definite proportions'],
  'redox': ['oxidation', 'reduction', 'corrosion', 'rancidity', 'combination', 'decomposition'],

  // --- Biology ---
  'cell': ['mitochondria', 'nucleus', 'lysosome', 'plasma membrane', 'osmosis', 'cell theory', 'powerhouse', 'atp'],
  'mitochondria': ['powerhouse', 'atp', 'cellular respiration', 'aerobic'],
  'respiration': ['aerobic', 'anaerobic', 'glucose', 'pyruvate', 'lactic acid', 'fermentation', 'atp'],
  'photosynthesis': ['chlorophyll', 'stomata', 'autotrophic', 'glucose', 'light reaction'],
  'heart': ['double circulation', 'atrium', 'ventricle', 'aorta', 'pulmonary artery', 'oxygenated'],
  'kidney': ['nephron', 'bowman capsule', 'glomerulus', 'excretion', 'urine', 'filtration'],
  'mendel': ['heredity', 'genetics', 'monohybrid', 'dihybrid', 'dominant', 'recessive', 'allele', 'phenotype', 'genotype'],
  'food': ['nutrients', 'carbohydrates', 'proteins', 'fats', 'vitamins', 'scurvy', 'rickets', 'goitre', 'anaemia'],

  // --- Mathematics ---
  'quadratic': ['equation', 'ax^2 + bx + c', 'discriminant', 'roots', 'b^2 - 4ac', 'shreedharacharya'],
  'trigonometry': ['sin', 'cos', 'tan', 'sec', 'cosec', 'cot', 'identity', 'sin^2 + cos^2 = 1', 'right triangle'],
  'heron': ['triangle area', 'semi-perimeter', 'scalene', 'sqrt(s(s-a)(s-b)(s-c))'],
  'fraction': ['numerator', 'denominator', 'proper', 'improper', 'mixed', 'lcm', 'equivalent'],
  'integer': ['negative numbers', 'closure', 'commutative', 'associative', 'distributive'],
  'mensuration': ['perimeter', 'area', 'volume', 'cylinder', 'cone', 'sphere', 'cuboid', 'trapezium', 'circumference'],
  'identity': ['(a + b)^2', '(a - b)^2', 'a^2 - b^2', 'difference of squares'],

  // --- Social Science ---
  'development': ['per capita income', 'national income', 'hdi', 'human development index', 'undp', 'world bank', 'sustainable'],
  'solar': ['sun', 'planets', 'earth', 'geoid', 'moon', 'celestial', 'mercury', 'orbit']
};

export interface RAGSearchOptions {
  classLevel?: number | 'all';
  subject?: string | 'All Subjects';
  topK?: number;
}

/**
 * Tokenize string into meaningful search terms
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Hybrid BM25-inspired retrieval with semantic expansion and multi-grade filtering
 */
export function searchNCERTTextbook(
  query: string,
  options: RAGSearchOptions = {}
): { chunk: TextbookChunk; score: number }[] {
  const { classLevel = 'all', subject = 'All Subjects', topK = 3 } = options;

  // 1. Filter candidate chunks by class level & subject if specified
  let candidateChunks = ALL_NCERT_TEXTBOOK_CHUNKS;
  if (classLevel !== 'all' && typeof classLevel === 'number') {
    candidateChunks = candidateChunks.filter(c => c.classLevel === classLevel);
  }
  if (subject !== 'All Subjects') {
    const subLower = subject.toLowerCase();
    candidateChunks = candidateChunks.filter(c => {
      const cSub = c.subject.toLowerCase();
      if (subLower === 'science') {
        return cSub === 'science' || cSub === 'physics' || cSub === 'chemistry' || cSub === 'biology';
      }
      return cSub === subLower;
    });
  }

  // Fallback to all chunks if filters yielded 0 results
  if (candidateChunks.length === 0) {
    candidateChunks = ALL_NCERT_TEXTBOOK_CHUNKS;
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return candidateChunks.slice(0, topK).map(chunk => ({ chunk, score: 0.5 }));
  }

  // Expand tokens with domain synonyms
  const expandedTokens = new Set<string>(queryTokens);
  for (const token of queryTokens) {
    if (SYNONYMS[token]) {
      for (const syn of SYNONYMS[token]) {
        expandedTokens.add(syn);
      }
    }
  }

  const rawScored = candidateChunks.map(chunk => {
    let rawScore = 0;
    const lowerTitle = (chunk.chapterTitle + ' ' + chunk.sectionTitle).toLowerCase();
    const lowerContent = chunk.content.toLowerCase();
    const lowerSummary = chunk.summary.toLowerCase();
    const lowerKeyTerms = chunk.keyTerms.join(' ').toLowerCase();
    const lowerFormulas = chunk.formulas.join(' ').toLowerCase();
    const lowerSubject = chunk.subject.toLowerCase();

    // 1. Direct whole-query phrase match bonus
    const rawLowerQuery = query.toLowerCase().trim();
    if (lowerContent.includes(rawLowerQuery) || lowerTitle.includes(rawLowerQuery)) {
      rawScore += 18.0;
    }

    // 2. Specific Token scoring with IDF-like weighting
    for (const token of queryTokens) {
      const isGeneric = GENERIC_TERMS.has(token);
      const tokenWeight = isGeneric ? 0.3 : 1.5;

      // Matches in Section Title
      if (lowerTitle.includes(token)) rawScore += 5.5 * tokenWeight;
      // Matches in Key Terms
      if (lowerKeyTerms.includes(token)) rawScore += 4.5 * tokenWeight;
      // Matches in Formulas
      if (lowerFormulas.includes(token)) rawScore += 3.5 * tokenWeight;
      // Matches in Subject or Class name
      if (lowerSubject.includes(token)) rawScore += 2.0 * tokenWeight;
      // Matches in Summary
      if (lowerSummary.includes(token)) rawScore += 2.0 * tokenWeight;
      // Matches in Content
      if (lowerContent.includes(token)) rawScore += 1.0 * tokenWeight;

      // Exact NCERT question matches
      if (chunk.ncertQuestions) {
        for (const q of chunk.ncertQuestions) {
          if (q.question.toLowerCase().includes(token)) {
            rawScore += 3.5 * tokenWeight;
          }
        }
      }
    }

    // 3. Synonym matches (moderate boost)
    for (const syn of expandedTokens) {
      if (!queryTokens.includes(syn)) {
        if (lowerTitle.includes(syn)) rawScore += 2.2;
        if (lowerKeyTerms.includes(syn)) rawScore += 1.8;
        if (lowerContent.includes(syn)) rawScore += 0.8;
      }
    }

    return {
      chunk,
      rawScore
    };
  });

  // Sort descending by raw composite score to avoid tie flattening
  rawScored.sort((a, b) => b.rawScore - a.rawScore);

  const highestScore = rawScored[0]?.rawScore || 1;

  // Normalize scores proportionally
  return rawScored.slice(0, topK).map(item => ({
    chunk: item.chunk,
    score: Number((Math.min(0.99, Math.max(0.1, item.rawScore / Math.max(highestScore, 20)))).toFixed(3))
  }));
}

/**
 * Intelligently synthesize a structured, targeted answer from retrieved chunks
 * rather than simply dumping raw textbook content.
 */
function synthesizeTargetedResponse(
  query: string,
  topResults: { chunk: TextbookChunk; score: number }[]
): {
  synthesizedAnswer: string;
  audioScript: string;
  primaryFormula?: string;
  formulaContext?: string;
  chapterCitation: string;
} {
  const primaryChunk = topResults[0].chunk;
  const secondaryChunk = topResults[1]?.chunk;
  const lowerQuery = query.toLowerCase();

  // Collect relevant formulas across top chunks
  const allFormulas = Array.from(new Set([
    ...primaryChunk.formulas,
    ...(secondaryChunk?.formulas || [])
  ]));
  const primaryFormula = allFormulas.length > 0 ? allFormulas[0] : undefined;
  const formulaContext = allFormulas.slice(0, 3).join('  |  ');

  // Check for direct matching NCERT question first
  const exactQnA = primaryChunk.ncertQuestions?.find(q =>
    lowerQuery.includes(q.question.toLowerCase().slice(0, 20)) ||
    q.question.toLowerCase().includes(lowerQuery.slice(0, 20))
  );

  let statementSection = '';
  let mathSection = '';
  let exampleSection = '';
  let cautionSection = '';

  // 1. Specific High-Yield Multi-Part Handlers
  if (lowerQuery.includes('ohm') && (lowerQuery.includes('parallel') || lowerQuery.includes('series') || lowerQuery.includes('equivalent'))) {
    statementSection = `### 1. Ohm's Law Statement & Principle
According to **Ohm's Law**, at constant temperature, the electric current ($I$) flowing through a metallic conductor is directly proportional to the potential difference ($V$) applied across its ends:
$$V \\propto I \\implies V = I \\cdot R$$
where $R$ is the constant of proportionality termed electrical resistance (measured in Ohms, $\\Omega$).`;

    mathSection = `### 2. Equivalent Resistance in Parallel ($R_p$)
When resistors $R_1, R_2, \\dots, R_n$ are joined in parallel:
- The **potential difference ($V$)** across each individual resistor is identical.
- The **total current ($I$)** divides across branches: $I = I_1 + I_2 + \\dots + I_n$.
- Substituting Ohm's Law ($I_k = V / R_k$):
  $$\\frac{V}{R_p} = \\frac{V}{R_1} + \\frac{V}{R_2} + \\dots + \\frac{V}{R_n}$$
- Cancelling common factor $V$ yields the fundamental parallel relation:
  $$\\mathbf{\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots + \\frac{1}{R_n}}$$
For two resistors in parallel: $R_p = \\frac{R_1 \\cdot R_2}{R_1 + R_2}$.`;

    exampleSection = `### 3. Step-by-Step Numerical Calculation
**Problem:** Calculate the equivalent resistance of $R_1 = 6\\,\\Omega$ and $R_2 = 3\\,\\Omega$ connected in parallel across a 12V supply.
1. Apply the parallel reciprocal formula:
   $$\\frac{1}{R_p} = \\frac{1}{6} + \\frac{1}{3} = \\frac{1 + 2}{6} = \\frac{3}{6} = \\frac{1}{2\\,\\Omega}$$
2. Invert both sides:
   $$R_p = \\mathbf{2\\,\\Omega}$$
3. Total circuit current: $I = \\frac{V}{R_p} = \\frac{12\\text{ V}}{2\\,\\Omega} = \\mathbf{6\\text{ A}}$.`;

    cautionSection = `### 4. Important NCERT Exam Takeaways
- The equivalent parallel resistance is **always less than the smallest individual resistor** in the combination ($2\\,\\Omega < 3\\,\\Omega$).
- Domestic household appliances are connected in parallel so each receives full 220V voltage and operates independently if one fails.`;
  } else if (exactQnA) {
    statementSection = `### 1. NCERT Official Textbook Answer
${exactQnA.answer}`;
    mathSection = primaryFormula ? `### 2. Relevant Formula / Scientific Relation\n$$\\mathbf{${primaryFormula}}$$` : '';
    exampleSection = `### 3. Conceptual Elaboration (${primaryChunk.sectionTitle})\n${primaryChunk.summary}`;
    cautionSection = `### 4. Key Scientific Principle\n${primaryChunk.keyTerms.slice(0, 6).join(' • ')}`;
  } else {
    // Intelligent conceptual synthesis from primary & secondary chunk
    statementSection = `### 1. Core Principle & Definition (${primaryChunk.sectionTitle})
${primaryChunk.summary}

${primaryChunk.content.split('\n\n')[0] || primaryChunk.content.slice(0, 300)}`;

    if (allFormulas.length > 0) {
      mathSection = `### 2. Governing NCERT Formulas & Relations
${allFormulas.map(f => `- **${f}**`).join('\n')}`;
    }

    if (primaryChunk.ncertQuestions && primaryChunk.ncertQuestions.length > 0) {
      const q = primaryChunk.ncertQuestions[0];
      exampleSection = `### 3. Worked Application / In-Text Exercise
**Question:** ${q.question}
**Step-by-Step Solution:** ${q.answer}`;
    }

    cautionSection = `### 4. Key Exam Insights & Terminology
- **Key Concepts:** ${primaryChunk.keyTerms.join(' • ')}
- Remember to maintain proper SI units and state assumptions (such as constant temperature for Ohm's law, or balanced forces).`;
  }

  // Combined Citations
  const citations = [
    `${primaryChunk.textbookName} · Ch ${primaryChunk.chapterNumber} ("${primaryChunk.chapterTitle}") · Sec ${primaryChunk.sectionNumber} (Page ${primaryChunk.pageNumber})`
  ];
  if (secondaryChunk && secondaryChunk.chapterNumber !== primaryChunk.chapterNumber) {
    citations.push(`${secondaryChunk.textbookName} · Ch ${secondaryChunk.chapterNumber} · Sec ${secondaryChunk.sectionNumber} (Page ${secondaryChunk.pageNumber})`);
  }

  const synthesizedAnswer = [statementSection, mathSection, exampleSection, cautionSection, `\n---\n*Verified against: ${citations.join(' and ')}*`]
    .filter(Boolean)
    .join('\n\n');

  // Concise audio script for text-to-speech teleprompter
  const audioScript = `Here is the explanation from ${primaryChunk.textbookName}, Chapter ${primaryChunk.chapterNumber}. ${primaryChunk.summary} ${primaryFormula ? `The principal formula governing this is ${primaryFormula.split('(')[0].trim()}.` : ''} Make sure to remember the key steps and units in your exams.`;

  return {
    synthesizedAnswer,
    audioScript,
    primaryFormula,
    formulaContext,
    chapterCitation: citations.join(' | ')
  };
}

/**
 * Generate a complete RAG-grounded response with official textbook citation across Classes 6–10
 */
export function queryTextbookRAG(
  query: string,
  options: RAGSearchOptions = {}
): RAGSearchResult {
  const topResults = searchNCERTTextbook(query, options);
  const bestMatch = topResults[0];

  // If no strong match found
  if (!bestMatch || bestMatch.score < 0.15) {
    return {
      query,
      topChunks: topResults,
      synthesizedAnswer: `The concept could not be conclusively grounded in the NCERT K-10 Knowledge Base.
Try querying core syllabus topics across:
• Class 6: "Components of Food & Balanced Diet", "Electricity and Circuits", "Separation of Substances"
• Class 7: "Photosynthesis in Plants", "Conduction, Convection & Radiation", "Perimeter and Area of Circles"
• Class 8: "Force and Pressure (P = F/A)", "Static vs Sliding Friction", "Sound & Human Audible Range"
• Class 9: "Three Equations of Motion (v=u+at, s=ut+1/2at²)", "Newton's 2nd Law F=ma", "Cell Organelles", "Mole Concept"
• Class 10: "Ohm's Law & Resistance", "Rayleigh Scattering (Why is sky blue)", "Mendel's Monohybrid Cross", "Quadratic Equations (Discriminant)", "Trigonometric Identities"`,
      chapterCitation: 'NCERT All Classes (6–10)',
      audioScript: 'The queried topic was not found with sufficient confidence. Please choose a specific topic from Mathematics, Science, or Social Science across Classes 6 to 10.',
      confidenceScore: 0.1,
      relatedQuestions: [
        'State the laws of reflection of light.',
        'Why is the colour of the clear sky blue?',
        'State Ohm’s law with mathematical expression.',
        'What are the three equations of uniformly accelerated motion?',
        'What is the formula for discriminant in a quadratic equation?'
      ]
    };
  }

  const primaryChunk = bestMatch.chunk;
  const synthesized = synthesizeTargetedResponse(query, topResults);

  const relatedQuestions = primaryChunk.ncertQuestions?.map(q => q.question) || [
    `Explain the significance of ${primaryChunk.sectionTitle}.`,
    `What are the practical applications of this principle?`
  ];

  return {
    query,
    topChunks: topResults,
    synthesizedAnswer: synthesized.synthesizedAnswer,
    primaryFormula: synthesized.primaryFormula,
    formulaContext: synthesized.formulaContext,
    audioScript: synthesized.audioScript,
    chapterCitation: synthesized.chapterCitation,
    confidenceScore: bestMatch.score,
    relatedQuestions
  };
}
