// Comprehensive Multidisciplinary Curriculum Database for AI Reteach
// Classes 6 to 10 covering Physics, Biology, Chemistry, Mathematics, and Science

export interface ActiveFormulaInfo {
  key: string;
  formula: string;
  name: string;
  category: string;
  context: string;
  variables: string;
  caution: string;
  tags: string[];
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  hint?: string;
  topic: string;
}

export interface WorkedExample {
  problem: string;
  steps: string[];
  answer: string;
  cautionNote?: string;
}

export interface HomeworkQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  problemText: string;
  steps: string[];
  finalAnswer: string;
  teacherTip: string;
}

export interface CurriculumTopic {
  id: string;
  classLevel: number;
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'Science' | 'Social Science';
  title: string;
  readingTime: string;
  summary: string;
  voiceScript: string;
  keyFormulas: string[];
  formulaInfo: ActiveFormulaInfo;
  intuition: string;
  workedExamples: WorkedExample[];
  commonPitfalls: string[];
  flashcards: Flashcard[];
  homeworkQuestions: HomeworkQuestion[];
}

export const ALL_CURRICULUM_TOPICS: CurriculumTopic[] = [
  {
    "id": "c10-phy-electricity",
    "classLevel": 10,
    "subject": "Physics",
    "title": "Electricity, Ohm's Law & Circuit Calculations",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Master Ohm's Law (V = IR), electric potential, resistance, and factors affecting resistivity with circuit diagrams and step-by-step numerical calculations.",
    "voiceScript": "Welcome to the AI Reteach masterclass on Electricity and Ohm's Law. Ohm's Law is the cornerstone of circuit analysis. It states that at a constant temperature, the potential difference across a conductor is directly proportional to the current flowing through it. Mathematically, V equals I times R. Resistance R is measured in Ohms. Remember that resistance increases with the length of the wire and decreases with its cross-sectional area, governed by R equals rho L divided by A. Never forget to keep temperature constant when stating Ohm's law, and always express resistance in Ohms and current in Amperes.",
    "keyFormulas": [
      "V = I \u00b7 R  (Ohm's Law: Potential Difference = Current \u00d7 Resistance)",
      "I = Q / t  (Current = Charge / Time, 1 A = 1 C/s)",
      "V = W / Q  (Potential Difference = Work Done / Charge, 1 V = 1 J/C)",
      "R = \u03c1 \u00b7 (L / A)  (Resistance = Resistivity \u00d7 Length / Area)"
    ],
    "formulaInfo": {
      "key": "ohms_law",
      "formula": "V = I \u00b7 R",
      "name": "Ohm's Law Principle",
      "category": "Current Electricity",
      "context": "Direct linear proportionality between voltage and current across an ohmic metallic conductor at constant temperature.",
      "variables": "V = Potential Difference (Volts, V), I = Electric Current (Amperes, A), R = Resistance (Ohms, \u03a9).",
      "caution": "Ohm's Law strictly holds only when temperature and other physical conditions remain constant. Non-ohmic devices like diodes do not obey it.",
      "tags": [
        "Physics",
        "Class 10",
        "Electricity",
        "Ohm's Law"
      ]
    },
    "intuition": "Think of an electric circuit like water flowing through a garden pipe. Voltage is the water pressure pushing from the pump, current is the rate of water flow in litres per second, and resistance is a narrow constriction or valve in the pipe slowing the water down.",
    "workedExamples": [
      {
        "problem": "A potential difference of 12 V is applied across an unknown resistor. A current of 2.5 mA flows through it. Calculate the resistance.",
        "steps": [
          "Identify given values: V = 12 V, I = 2.5 mA.",
          "Convert current into SI base units (Amperes): I = 2.5 \u00d7 10\u207b\u00b3 A = 0.0025 A.",
          "State Ohm's Law: V = I \u00b7 R  =>  R = V / I.",
          "Substitute: R = 12 / 0.0025 = 4800 \u03a9 = 4.8 k\u03a9."
        ],
        "answer": "R = 4800 \u03a9 (4.8 k\u03a9)",
        "cautionNote": "Always convert milliamperes (mA) to Amperes (A) by dividing by 1,000 before substituting!"
      },
      {
        "problem": "How much work is done in moving a charge of 2 Coulombs across two points having a potential difference of 12 V?",
        "steps": [
          "State formula relating work, charge, and potential difference: V = W / Q  =>  W = V \u00b7 Q.",
          "Substitute Q = 2 C and V = 12 V.",
          "W = 12 V \u00d7 2 C = 24 Joules."
        ],
        "answer": "W = 24 J",
        "cautionNote": "Work is measured in Joules (J), which equals Volt-Coulombs."
      },
      {
        "problem": "A copper wire of length L and area of cross-section A has resistance 4 \u03a9. What is the resistance of another copper wire of length L/2 and area 2A?",
        "steps": [
          "Original resistance: R\u2081 = \u03c1(L / A) = 4 \u03a9.",
          "New wire parameters: L\u2082 = L / 2, A\u2082 = 2A.",
          "New resistance: R\u2082 = \u03c1 \u00b7 (L/2) / (2A) = \u03c1(L / 4A) = (1/4) \u00b7 \u03c1(L / A).",
          "Substitute R\u2081: R\u2082 = (1/4) \u00d7 4 \u03a9 = 1 \u03a9."
        ],
        "answer": "R\u2082 = 1 \u03a9",
        "cautionNote": "Since both wires are copper at the same temperature, resistivity \u03c1 is identical."
      }
    ],
    "commonPitfalls": [
      "Forgetting unit conversions: substituting current in mA or time in minutes directly.",
      "Omitting the condition 'at constant temperature' when stating Ohm's law in board exams.",
      "Confusing resistance (geometry dependent) with resistivity (material property only)."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Electricity",
        "question": "State Ohm's Law with its mathematical formula.",
        "answer": "At constant temperature, potential difference is directly proportional to current: V = I \u00b7 R.",
        "hint": "V is proportional to I."
      },
      {
        "id": 2,
        "topic": "Electricity",
        "question": "What is the SI unit of electric potential difference?",
        "answer": "Volt (V), named after Alessandro Volta (1 V = 1 Joule / 1 Coulomb).",
        "hint": "Named after Volta."
      },
      {
        "id": 3,
        "topic": "Electricity",
        "question": "How does resistance of a wire change when its length is doubled?",
        "answer": "Resistance is doubled, because R is directly proportional to length (R \u221d L).",
        "hint": "R is directly proportional to L."
      },
      {
        "id": 4,
        "topic": "Electricity",
        "question": "How does resistance of a wire change when its cross-sectional area is tripled?",
        "answer": "Resistance becomes one-third (R/3), because R is inversely proportional to area (R \u221d 1/A).",
        "hint": "Inverse proportionality."
      },
      {
        "id": 5,
        "topic": "Electricity",
        "question": "Define 1 Ampere of electric current.",
        "answer": "1 Ampere is the flow of 1 Coulomb of charge through a cross-section per second (1 A = 1 C/s).",
        "hint": "1 Coulomb per second."
      },
      {
        "id": 6,
        "topic": "Electricity",
        "question": "Does the resistivity (\u03c1) of a metal depend on the length or thickness of the wire?",
        "answer": "No. Resistivity is an intrinsic property of the material and temperature, independent of dimensions.",
        "hint": "Material constant."
      },
      {
        "id": 7,
        "topic": "Electricity",
        "question": "Which instrument measures electric current, and how is it connected?",
        "answer": "An Ammeter measures current and is always connected in series because of low resistance.",
        "hint": "Low resistance series device."
      },
      {
        "id": 8,
        "topic": "Electricity",
        "question": "Which instrument measures potential difference, and how is it connected?",
        "answer": "A Voltmeter measures voltage and is always connected in parallel across the components.",
        "hint": "High resistance parallel device."
      },
      {
        "id": 9,
        "topic": "Electricity",
        "question": "What is the SI unit of electrical resistivity?",
        "answer": "Ohm-metre (\u03a9\u00b7m).",
        "hint": "Resistance times distance."
      },
      {
        "id": 10,
        "topic": "Electricity",
        "question": "Why are alloys like Nichrome used in electrical heating appliances rather than pure metals?",
        "answer": "Nichrome has higher resistivity than pure metals and does not oxidize (burn) easily at high temperatures.",
        "hint": "High resistivity and oxidation resistance."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c10-elec-1",
        "title": "Circuit Current & Resistance Evaluation",
        "difficulty": "Moderate",
        "problemText": "A 6 V battery is connected across a resistor. An ammeter reads 0.15 A. What is the value of the resistor?",
        "steps": [
          "Given: Voltage V = 6 V, Current I = 0.15 A.",
          "Apply Ohm's law formula: R = V / I.",
          "Calculate: R = 6 / 0.15 = 40 \u03a9.",
          "Verification: V = I \u00b7 R = 0.15 \u00d7 40 = 6.0 V."
        ],
        "finalAnswer": "R = 40 \u03a9",
        "teacherTip": "Always verify your answer by multiplying the calculated resistance by current to ensure you get the battery voltage."
      },
      {
        "id": "hw-c10-elec-2",
        "title": "Wire Stretching & Resistance Transformation",
        "difficulty": "Advanced",
        "problemText": "A wire of resistance 10 \u03a9 is stretched to double its original length without changing its mass. Find its new resistance.",
        "steps": [
          "Volume remains constant during stretching: V_vol = A\u2081 \u00b7 L\u2081 = A\u2082 \u00b7 L\u2082.",
          "Since L\u2082 = 2L\u2081, cross-sectional area becomes A\u2082 = A\u2081 / 2.",
          "Original resistance: R\u2081 = \u03c1(L\u2081 / A\u2081) = 10 \u03a9.",
          "New resistance: R\u2082 = \u03c1(L\u2082 / A\u2082) = \u03c1(2L\u2081 / (A\u2081/2)) = 4 \u00b7 \u03c1(L\u2081 / A\u2081) = 4 \u00d7 10 \u03a9 = 40 \u03a9."
        ],
        "finalAnswer": "R_new = 40 \u03a9",
        "teacherTip": "Remember that when a wire is stretched to n times its length, its new resistance becomes n\u00b2 times the original resistance!"
      }
    ]
  },
  {
    "id": "c10-phy-resistors",
    "classLevel": 10,
    "subject": "Physics",
    "title": "Resistors in Series & Parallel Combinations",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Calculate equivalent resistance in series (Rs = R1+R2) and parallel (1/Rp = 1/R1+1/R2) circuits with full current and voltage distribution breakdown.",
    "voiceScript": "Welcome to AI Reteach on Series and Parallel resistor combinations. In a series circuit, resistors are connected end to end. The electric current remains identical through every resistor, while the total potential difference is divided across them. Therefore, equivalent series resistance is simply R1 plus R2 plus R3. In a parallel circuit, all resistors connect across the same two common nodes. The potential difference is identical across each branch, but current divides. The reciprocal of equivalent parallel resistance equals the sum of the reciprocals: 1 over Rp equals 1 over R1 plus 1 over R2. A critical exam rule: parallel resistance is always lower than the smallest individual resistor in the circuit.",
    "keyFormulas": [
      "R_s = R\u2081 + R\u2082 + R\u2083 + ...  (Series: Current is constant, Voltages add)",
      "1 / R_p = 1 / R\u2081 + 1 / R\u2082 + 1 / R\u2083  (Parallel: Voltage is constant, Currents add)",
      "R_p = (R\u2081 \u00b7 R\u2082) / (R\u2081 + R\u2082)  (Shortcut for two resistors in parallel)",
      "I = I\u2081 + I\u2082 + ...  (Parallel branch current summation)"
    ],
    "formulaInfo": {
      "key": "parallel_resistance",
      "formula": "1 / R_p = 1 / R\u2081 + 1 / R\u2082 + ...",
      "name": "Parallel Resistor Combination Law",
      "category": "Circuit Networks",
      "context": "Calculates the effective reciprocal conductance and equivalent resistance of multiple parallel conductive paths.",
      "variables": "R_p = Equivalent parallel resistance (\u03a9), R\u2081, R\u2082 = Individual branch resistances (\u03a9).",
      "caution": "Do not forget to take the reciprocal at the final step! 1/R_p = 1/2 means R_p = 2 \u03a9, not 1/2 \u03a9.",
      "tags": [
        "Physics",
        "Class 10",
        "Circuits",
        "Parallel Combination"
      ]
    },
    "intuition": "Think of parallel resistors like multiple toll booth lanes on a highway. Adding more toll booths (even high-resistance ones) gives cars extra pathways to pass, which ALWAYS decreases the total traffic jam (resistance) compared to having just one toll booth.",
    "workedExamples": [
      {
        "problem": "State Ohm's Law and calculate equivalent resistance of 6 \u03a9 and 3 \u03a9 connected in parallel across a 12 V battery.",
        "steps": [
          "State Ohm's Law: At constant temperature, V = I \u00b7 R (current is directly proportional to potential difference).",
          "For parallel resistors, apply the reciprocal formula: 1 / R_p = 1 / R\u2081 + 1 / R\u2082.",
          "Substitute R\u2081 = 6 \u03a9, R\u2082 = 3 \u03a9: 1 / R_p = 1/6 + 1/3 = (1 + 2) / 6 = 3/6 = 1/2 \u03a9\u207b\u00b9.",
          "Invert to solve for R_p: R_p = 2 \u03a9.",
          "Total circuit current: I = V / R_p = 12 V / 2 \u03a9 = 6 A."
        ],
        "answer": "R_p = 2 \u03a9, Circuit Current I = 6 A",
        "cautionNote": "Equivalent parallel resistance is always smaller than the smallest branch resistor: 2 \u03a9 < 3 \u03a9."
      },
      {
        "problem": "Three resistors 5 \u03a9, 10 \u03a9, and 30 \u03a9 are connected in parallel to a 12 V battery. Calculate total circuit resistance and current through the 5 \u03a9 resistor.",
        "steps": [
          "Parallel resistance: 1/R_p = 1/5 + 1/10 + 1/30 = (6 + 3 + 1)/30 = 10/30 = 1/3.",
          "Invert: R_p = 3 \u03a9.",
          "Since voltage is constant (12 V) across all parallel branches, current through 5 \u03a9 is: I\u2081 = V / R\u2081 = 12 / 5 = 2.4 A."
        ],
        "answer": "R_p = 3 \u03a9, Current through 5 \u03a9 is 2.4 A",
        "cautionNote": "In parallel, each branch receives full battery voltage: V = 12 V."
      }
    ],
    "commonPitfalls": [
      "Adding parallel resistors directly like series: writing Rp = 6 + 3 = 9 \u03a9 instead of taking reciprocals.",
      "Forgetting to invert 1/Rp at the end of calculation.",
      "Assuming current is identical in parallel branches (only voltage is identical)."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Resistor Combinations",
        "question": "What is the formula for two resistors R1 and R2 connected in series?",
        "answer": "R_s = R\u2081 + R\u2082.",
        "hint": "Direct sum."
      },
      {
        "id": 2,
        "topic": "Resistor Combinations",
        "question": "What is the formula for two resistors in parallel?",
        "answer": "1/R_p = 1/R\u2081 + 1/R\u2082  or  R_p = (R\u2081\u00b7R\u2082) / (R\u2081 + R\u2082).",
        "hint": "Product over sum."
      },
      {
        "id": 3,
        "topic": "Resistor Combinations",
        "question": "Is current identical or divided in a series circuit?",
        "answer": "Current is identical through all components in a series circuit.",
        "hint": "One single loop."
      },
      {
        "id": 4,
        "topic": "Resistor Combinations",
        "question": "Is potential difference identical or divided across parallel branches?",
        "answer": "Potential difference is identical across each parallel branch.",
        "hint": "Common node connection."
      },
      {
        "id": 5,
        "topic": "Resistor Combinations",
        "question": "Why are household electric appliances connected in parallel?",
        "answer": "1. Each appliance gets full 220V voltage. 2. If one appliance is switched off or fails, others continue running normally. 3. Each appliance can have its own independent switch.",
        "hint": "Independent operation and constant voltage."
      },
      {
        "id": 6,
        "topic": "Resistor Combinations",
        "question": "What is the equivalent resistance of three 6 \u03a9 resistors in parallel?",
        "answer": "1/R_p = 1/6 + 1/6 + 1/6 = 3/6 = 1/2 => R_p = 2 \u03a9.",
        "hint": "R / n formula."
      },
      {
        "id": 7,
        "topic": "Resistor Combinations",
        "question": "What is the formula for n identical resistors of resistance R in parallel?",
        "answer": "R_p = R / n.",
        "hint": "Divide by number of resistors."
      },
      {
        "id": 8,
        "topic": "Resistor Combinations",
        "question": "What is the formula for n identical resistors of resistance R in series?",
        "answer": "R_s = n \u00b7 R.",
        "hint": "Multiply by number of resistors."
      },
      {
        "id": 9,
        "topic": "Resistor Combinations",
        "question": "How can you get an equivalent resistance of 4 \u03a9 from three 6 \u03a9 resistors?",
        "answer": "Connect two 6 \u03a9 resistors in parallel (yielding 3 \u03a9), and place the third 6 \u03a9 in series with them? No: connect two in series (12 \u03a9) in parallel with the third 6 \u03a9: (12 \u00d7 6)/(12 + 6) = 72/18 = 4 \u03a9.",
        "hint": "Two in series parallel with third."
      },
      {
        "id": 10,
        "topic": "Resistor Combinations",
        "question": "Which combination always yields an effective resistance lower than any individual resistor?",
        "answer": "Parallel combination.",
        "hint": "Multiple pathways."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c10-comb-1",
        "title": "Complex Series-Parallel Bridge Analysis",
        "difficulty": "Moderate",
        "problemText": "A circuit consists of a 4 \u03a9 resistor in series with a parallel combination of two 8 \u03a9 resistors. Find total circuit resistance.",
        "steps": [
          "Calculate parallel branch first: R_parallel = (8 \u00d7 8) / (8 + 8) = 64 / 16 = 4 \u03a9.",
          "Add the series resistor: R_total = R_series + R_parallel = 4 \u03a9 + 4 \u03a9 = 8 \u03a9.",
          "Verification: Two equal 8 \u03a9 parallel resistors yield 8/2 = 4 \u03a9, plus 4 \u03a9 in series = 8 \u03a9."
        ],
        "finalAnswer": "R_total = 8 \u03a9",
        "teacherTip": "Always simplify parallel clusters into a single equivalent resistor before summing series terms."
      }
    ]
  },
  {
    "id": "c10-bio-nutrition",
    "classLevel": 10,
    "subject": "Biology",
    "title": "Life Processes: Autotrophic Nutrition & Photosynthesis",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Understand chloroplast structure, stomatal gas exchange, chlorophyll light absorption, and the balanced chemical equation of photosynthesis.",
    "voiceScript": "Welcome to AI Reteach on Autotrophic Nutrition and Photosynthesis. Autotrophs like green plants take in carbon dioxide from the air and water from the soil, converting them into stored carbohydrates in the form of starch in the presence of sunlight and chlorophyll. The balanced master equation is: 6 CO2 plus 12 H2O in the presence of chlorophyll and light gives C6H12O6 plus 6 O2 plus 6 H2O. Remember the three main events: absorption of light energy by chlorophyll, conversion of light energy into chemical energy and splitting of water into hydrogen and oxygen, and reduction of carbon dioxide into carbohydrates. Stomata are tiny pores on the leaf surface guarded by bean-shaped guard cells that swell to open when water flows into them.",
    "keyFormulas": [
      "6 CO\u2082 + 12 H\u2082O --Sunlight + Chlorophyll--> C\u2086H\u2081\u2082O\u2086 + 6 O\u2082 + 6 H\u2082O",
      "Stomatal Pore Mechanism: Guard cells swell (turgid) -> pore opens; lose water (flaccid) -> pore closes",
      "Primary Energy Storage: Plants store energy as Starch; Animals store energy as Glycogen"
    ],
    "formulaInfo": {
      "key": "photosynthesis_eq",
      "formula": "6CO\u2082 + 12H\u2082O --Light / Chlorophyll--> C\u2086H\u2081\u2082O\u2086 + 6O\u2082 + 6H\u2082O",
      "name": "Photosynthesis Biochemical Equation",
      "category": "Autotrophic Metabolism",
      "context": "Light-driven reduction of inorganic carbon dioxide into organic glucose with photolytic oxygen release.",
      "variables": "CO\u2082 = Carbon Dioxide, H\u2082O = Water, C\u2086H\u2081\u2082O\u2086 = Glucose, O\u2082 = Byproduct Oxygen gas.",
      "caution": "Oxygen released during photosynthesis comes strictly from the photolysis (splitting) of water molecules (H\u2082O), NOT from carbon dioxide!",
      "tags": [
        "Biology",
        "Class 10",
        "Life Processes",
        "Photosynthesis"
      ]
    },
    "intuition": "Think of a plant leaf as a solar-powered biochemical factory. Chlorophyll acts as solar panels absorbing photons, water absorbed by roots provides electrons and hydrogen atoms, and carbon dioxide inhaled from stomatal chimneys is assembled into glucose fuel blocks.",
    "workedExamples": [
      {
        "problem": "Explain the three main steps that occur during photosynthesis. Do these steps have to take place one immediately after the other?",
        "steps": [
          "Step 1: Absorption of light energy by chlorophyll pigments.",
          "Step 2: Conversion of light energy into chemical energy and photolysis (splitting) of water molecules into hydrogen and oxygen.",
          "Step 3: Reduction of carbon dioxide into carbohydrates (glucose) by hydrogen.",
          "Sequential timing: No, they do not need to happen immediately one after the other. For instance, desert plants take up CO\u2082 at night to prevent water loss and form an intermediate, which is acted upon by sunlight absorbed during the day."
        ],
        "answer": "1. Light absorption, 2. Water photolysis & energy conversion, 3. CO\u2082 reduction. Desert plants separate these steps temporally.",
        "cautionNote": "Board exam favorite question: Desert plants open stomata at night to minimize transpiration."
      }
    ],
    "commonPitfalls": [
      "Assuming oxygen gas released during photosynthesis originates from CO\u2082 instead of H\u2082O photolysis.",
      "Forgetting that guard cell swelling opens stomatal pores, while shrinkage closes them.",
      "Stating that plants store carbohydrate reserves as glycogen (plants store starch; animals store glycogen)."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Photosynthesis",
        "question": "Write the balanced chemical equation of photosynthesis.",
        "answer": "6CO\u2082 + 12H\u2082O --Sunlight / Chlorophyll--> C\u2086H\u2081\u2082O\u2086 + 6O\u2082 + 6H\u2082O.",
        "hint": "6 CO2 + 12 H2O yields glucose."
      },
      {
        "id": 2,
        "topic": "Photosynthesis",
        "question": "Where does the oxygen released during photosynthesis come from?",
        "answer": "From the splitting (photolysis) of water (H\u2082O) molecules, not from carbon dioxide.",
        "hint": "Water splitting."
      },
      {
        "id": 3,
        "topic": "Photosynthesis",
        "question": "In what form do plants store excess carbohydrates?",
        "answer": "As Starch (internal energy reserve).",
        "hint": "Complex plant polysaccharide."
      },
      {
        "id": 4,
        "topic": "Photosynthesis",
        "question": "In what form do animals store reserve carbohydrates?",
        "answer": "As Glycogen in liver and muscles.",
        "hint": "Animal storage polymer."
      },
      {
        "id": 5,
        "topic": "Photosynthesis",
        "question": "What is the function of guard cells in plant leaves?",
        "answer": "Guard cells regulate the opening and closing of stomatal pores by changing their turgor pressure (swelling with water to open, shrinking to close).",
        "hint": "Bean-shaped gatekeepers."
      },
      {
        "id": 6,
        "topic": "Photosynthesis",
        "question": "Why do desert plants take in carbon dioxide at night?",
        "answer": "To prevent excessive water loss through transpiration during hot daylight hours.",
        "hint": "Transpiration prevention."
      },
      {
        "id": 7,
        "topic": "Photosynthesis",
        "question": "Which organelle is the site of photosynthesis in plant cells?",
        "answer": "Chloroplasts (containing chlorophyll pigments).",
        "hint": "Green plastid."
      },
      {
        "id": 8,
        "topic": "Photosynthesis",
        "question": "What chemical is used to test leaves for the presence of starch?",
        "answer": "Iodine solution (turns blue-black in the presence of starch).",
        "hint": "Blue-black indicator."
      },
      {
        "id": 9,
        "topic": "Photosynthesis",
        "question": "What is the function of potassium hydroxide (KOH) in the leaf bell-jar experiment?",
        "answer": "KOH absorbs carbon dioxide to create a CO\u2082-free environment and prove CO\u2082 is essential for photosynthesis.",
        "hint": "CO2 absorbent."
      },
      {
        "id": 10,
        "topic": "Photosynthesis",
        "question": "What is the raw material absorbed by plant roots from soil for protein synthesis?",
        "answer": "Nitrogen (in the form of nitrates or nitrites, or organic compounds prepared by bacteria).",
        "hint": "Essential nutrient for amino acids."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c10-bio-1",
        "title": "Guard Cell Mechanism & Transpiration Balance",
        "difficulty": "Moderate",
        "problemText": "Describe the mechanism by which stomata open and close in plants. Why do plants close their stomata when not performing photosynthesis?",
        "steps": [
          "Opening: When water flows into guard cells, they become turgid and swell, causing the curved outer walls to expand and pull open the stomatal aperture.",
          "Closing: When guard cells lose water, they become flaccid, straightening their inner thick walls and closing the pore.",
          "Rationale: Transpiration causes water vapor to evaporate rapidly through open stomata. Closing stomata conserves vital water when carbon dioxide is not needed for photosynthesis."
        ],
        "finalAnswer": "Turgidity opens pores; flaccidity closes them to prevent water loss.",
        "teacherTip": "Mention the difference in thickness: the inner wall facing the pore is thick and inelastic, while the outer wall is thin and elastic."
      }
    ]
  },
  {
    "id": "c10-bio-circulation",
    "classLevel": 10,
    "subject": "Biology",
    "title": "Life Processes: Double Circulation & Human Heart",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Master the 4-chambered human heart structure, pulmonary vs systemic circulation, valves, arteries vs veins, and blood pressure (120/80 mm Hg).",
    "voiceScript": "Welcome to AI Reteach on Human Heart and Double Circulation. The human heart is a muscular organ about the size of a fist, divided into four chambers: two upper atria and two lower ventricles. Humans exhibit double circulation, meaning blood passes through the heart twice during each complete circuit. Deoxygenated blood from the body enters the right atrium via the vena cava, passes to the right ventricle, and is pumped to the lungs via the pulmonary artery. In the lungs, carbon dioxide is released and oxygen is picked up. Oxygen-rich blood returns to the left atrium through pulmonary veins, flows into the thick-walled left ventricle, and is powerfully pumped to the entire body through the aorta. Valves ensure blood flows in one direction only without backward regurgitation.",
    "keyFormulas": [
      "Double Circulation: Pulmonary Circuit (Heart -> Lungs -> Heart) + Systemic Circuit (Heart -> Body -> Heart)",
      "Normal Blood Pressure: Systolic / Diastolic = 120 / 80 mm Hg (measured by Sphygmomanometer)",
      "Ventricles have much thicker muscular walls than Atria because they pump blood against high pressure to distant organs",
      "Arteries carry oxygenated blood under high pressure (thick elastic walls, no valves); Veins carry deoxygenated blood under low pressure (thin walls, possess valves)"
    ],
    "formulaInfo": {
      "key": "double_circulation",
      "formula": "Pulmonary Circuit (Right Ventricle -> Lungs -> Left Atrium) + Systemic Circuit (Left Ventricle -> Body -> Right Atrium)",
      "name": "Human Double Circulation Pathway",
      "category": "Cardiovascular Physiology",
      "context": "Two distinct closed loops ensuring complete physical separation of oxygenated and deoxygenated blood.",
      "variables": "Systolic Pressure = 120 mm Hg, Diastolic Pressure = 80 mm Hg.",
      "caution": "The pulmonary artery is the ONLY artery in the human body carrying deoxygenated blood; the pulmonary vein is the ONLY vein carrying oxygenated blood!",
      "tags": [
        "Biology",
        "Class 10",
        "Circulation",
        "Heart"
      ]
    },
    "intuition": "Think of the heart as a duplex pumping station. The right side is a regional purification pump sending used blue water to the aeration filters (lungs), while the left side is a high-pressure municipal booster station delivering fresh oxygenated water across the entire city (body).",
    "workedExamples": [
      {
        "problem": "Why is the separation of the right side and the left side of the heart useful in mammals and birds?",
        "steps": [
          "Mammals and birds are warm-blooded (endothermic) organisms that constantly require high amounts of energy to maintain a constant internal body temperature.",
          "Complete septal separation prevents any mixing of oxygenated and deoxygenated blood.",
          "This guarantees maximum oxygen saturation in systemic arterial blood, delivering highly efficient cellular respiration and ATP generation."
        ],
        "answer": "It prevents mixing of oxygenated and deoxygenated blood, ensuring highly efficient oxygen delivery to maintain constant warm-blooded body temperature.",
        "cautionNote": "Contrast with amphibians and reptiles, which have 3-chambered hearts and tolerate moderate mixing of blood."
      }
    ],
    "commonPitfalls": [
      "Calling pulmonary artery a carrier of oxygenated blood (it carries deoxygenated blood to the lungs).",
      "Forgetting that valves exist in veins to prevent backflow because venous blood pressure is low.",
      "Mixing up systolic (120 mm Hg, ventricular contraction) and diastolic (80 mm Hg, ventricular relaxation) pressures."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Circulation",
        "question": "Why is blood circulation in humans called double circulation?",
        "answer": "Because blood passes through the heart twice during each complete cycle (pulmonary circulation and systemic circulation).",
        "hint": "Two distinct passes."
      },
      {
        "id": 2,
        "topic": "Circulation",
        "question": "Which chamber of the heart has the thickest muscular wall and why?",
        "answer": "The left ventricle, because it has to pump blood under high pressure to all distant organs across the entire body.",
        "hint": "Pumps to systemic aorta."
      },
      {
        "id": 3,
        "topic": "Circulation",
        "question": "What is the function of heart valves?",
        "answer": "Valves (atrioventricular and semilunar) prevent the backward flow of blood when atria or ventricles contract.",
        "hint": "One-way gate."
      },
      {
        "id": 4,
        "topic": "Circulation",
        "question": "Which blood vessel carries deoxygenated blood from the heart to the lungs?",
        "answer": "Pulmonary Artery.",
        "hint": "Exception to the artery rule."
      },
      {
        "id": 5,
        "topic": "Circulation",
        "question": "Which blood vessel brings oxygenated blood from the lungs back to the left atrium?",
        "answer": "Pulmonary Vein.",
        "hint": "Exception to the vein rule."
      },
      {
        "id": 6,
        "topic": "Circulation",
        "question": "What is the normal blood pressure value in healthy adults?",
        "answer": "120 / 80 mm Hg (120 mm Hg systolic, 80 mm Hg diastolic).",
        "hint": "120 over 80."
      },
      {
        "id": 7,
        "topic": "Circulation",
        "question": "Which instrument is used to measure arterial blood pressure?",
        "answer": "Sphygmomanometer.",
        "hint": "Blood pressure cuff device."
      },
      {
        "id": 8,
        "topic": "Circulation",
        "question": "Name the cellular component of blood responsible for clotting at a wound site.",
        "answer": "Blood Platelets (Thrombocytes).",
        "hint": "Plug leaks and prevent hemorrhage."
      },
      {
        "id": 9,
        "topic": "Circulation",
        "question": "What is lymph and how does it differ from blood plasma?",
        "answer": "Lymph (tissue fluid) is colorless fluid containing white blood cells; it has less protein than blood plasma and lacks red blood cells.",
        "hint": "Tissue fluid with lymphocytes."
      },
      {
        "id": 10,
        "topic": "Circulation",
        "question": "Why do veins possess thin walls and valves, while arteries have thick elastic walls without valves?",
        "answer": "Arteries receive blood under high pumping pressure from the heart; veins have low pressure so thin walls suffice and valves are needed to prevent backward flow.",
        "hint": "Pressure differences."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c10-circ-1",
        "title": "Systemic and Pulmonary Circuit Pathway Tracing",
        "difficulty": "Moderate",
        "problemText": "Trace the step-by-step pathway of a red blood cell from the right atrium until it reaches the aorta.",
        "steps": [
          "1. Right Atrium receives deoxygenated blood from Vena Cava.",
          "2. Blood passes through tricuspid valve into Right Ventricle.",
          "3. Right Ventricle contracts, pumping blood through pulmonary valve into Pulmonary Artery.",
          "4. In Lung capillaries, carbon dioxide is exchanged for oxygen.",
          "5. Oxygenated blood returns via Pulmonary Veins into Left Atrium.",
          "6. Left Atrium passes blood through bicuspid (mitral) valve into Left Ventricle.",
          "7. Left Ventricle contracts, pumping oxygenated blood into the Aorta to supply body tissues."
        ],
        "finalAnswer": "Right Atrium -> Right Ventricle -> Pulmonary Artery -> Lungs -> Pulmonary Veins -> Left Atrium -> Left Ventricle -> Aorta.",
        "teacherTip": "Always pair each chamber with its corresponding valve and destination vessel."
      }
    ]
  },
  {
    "id": "c10-chem-acids-bases",
    "classLevel": 10,
    "subject": "Chemistry",
    "title": "Acids, Bases, Indicators & pH Scale",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Master the pH scale (0\u201314), hydronium ions (H3O+), neutralisation reactions, indicators (litmus, phenolphthalein), and everyday importance of pH.",
    "voiceScript": "Welcome to AI Reteach on Acids, Bases, and the pH scale. Acids produce hydrogen or hydronium ions, H3O+, in aqueous solution and turn blue litmus red. Bases produce hydroxide ions, OH-, in aqueous solution, feel soapy, and turn red litmus blue. The pH scale measures the concentration of hydrogen ions from 0 to 14, where 7 is strictly neutral. A pH less than 7 indicates an acidic solution, while a pH greater than 7 indicates a basic solution. When an acid reacts with a base, they neutralise each other to form salt and water. For example, HCl plus NaOH yields NaCl plus H2O. Remember, when diluting a concentrated acid, always add acid slowly into water with constant stirring, never water into acid, to prevent dangerous exothermic acid splashes.",
    "keyFormulas": [
      "pH = -log\u2081\u2080[H\u207a]  (Scale: 0 to 14; Acidic < 7, Neutral = 7, Basic > 7)",
      "Acid + Base --> Salt + Water  (Neutralisation: H\u207a + OH\u207b --> H\u2082O)",
      "Acid + Metal --> Salt + Hydrogen Gas (H\u2082 pops with burning splinter)",
      "Acid + Metal Carbonate --> Salt + Water + Carbon Dioxide (CO\u2082 turns lime water milky)"
    ],
    "formulaInfo": {
      "key": "ph_neutralisation",
      "formula": "Acid + Base --> Salt + Water  |  pH = -log\u2081\u2080[H\u207a]",
      "name": "Neutralisation Reaction & pH Scale",
      "category": "Chemical Solutions",
      "context": "Hydronium and hydroxide combination to form neutral water and ionic salt compounds.",
      "variables": "pH < 7 = Acidic, pH = 7 = Neutral, pH > 7 = Alkaline.",
      "caution": "ALWAYS add acid to water slowly with continuous stirring. NEVER pour water directly into concentrated acid due to violent exothermic boiling and localized splashing!",
      "tags": [
        "Chemistry",
        "Class 10",
        "Acids Bases",
        "pH Scale"
      ]
    },
    "intuition": "Think of the pH scale like a seesaw. In the exact centre (pH 7), positive hydrogen ions and negative hydroxide ions are perfectly balanced. Tipping towards 0 means an avalanche of acidic H+ ions, while tipping towards 14 means an excess of basic OH- ions.",
    "workedExamples": [
      {
        "problem": "Solution A has a pH of 6 and Solution B has a pH of 8. Which solution has more hydrogen ion concentration? Which of this is acidic and which is basic?",
        "steps": [
          "The pH value is inversely proportional to hydrogen ion concentration: lower pH means higher [H\u207a].",
          "Solution A (pH 6) has lower pH than Solution B (pH 8), so Solution A has higher hydrogen ion concentration.",
          "Since pH < 7 indicates acidity, Solution A is acidic.",
          "Since pH > 7 indicates basicity, Solution B is basic."
        ],
        "answer": "Solution A has higher [H\u207a] and is acidic; Solution B is basic.",
        "cautionNote": "Each 1-unit decrease on the pH scale represents a tenfold (10\u00d7) increase in [H\u207a] ion concentration."
      }
    ],
    "commonPitfalls": [
      "Adding water directly into concentrated acid during dilution (causes violent exothermic steam explosion).",
      "Thinking a higher pH means a stronger acid (higher pH means more basic/alkaline).",
      "Confusing litmus indicators: Acids turn blue litmus RED, Bases turn red litmus BLUE."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Acids and Bases",
        "question": "What is the pH of a neutral solution at 25\u00b0C?",
        "answer": "pH = 7 (e.g. pure distilled water).",
        "hint": "Midpoint of 0 to 14."
      },
      {
        "id": 2,
        "topic": "Acids and Bases",
        "question": "What gas is evolved when an acid reacts with an active metal like Zinc?",
        "answer": "Hydrogen gas (H\u2082), which burns with a characteristic pop sound.",
        "hint": "Pop sound gas."
      },
      {
        "id": 3,
        "topic": "Acids and Bases",
        "question": "What happens to the colour of phenolphthalein in an acidic vs basic solution?",
        "answer": "Colourless in acidic solution, bright pink in basic solution.",
        "hint": "Pink in base."
      },
      {
        "id": 4,
        "topic": "Acids and Bases",
        "question": "Why does dry HCl gas not change the colour of dry litmus paper?",
        "answer": "HCl gas can only dissociate into H\u207a (H\u2083O\u207a) ions in the presence of water/moisture.",
        "hint": "Needs moisture to dissociate."
      },
      {
        "id": 5,
        "topic": "Acids and Bases",
        "question": "What is the chemical name and formula of Plaster of Paris?",
        "answer": "Calcium Sulphate Hemihydrate: CaSO\u2084\u00b7\u00bdH\u2082O.",
        "hint": "Half water of crystallisation."
      },
      {
        "id": 6,
        "topic": "Acids and Bases",
        "question": "Why is sodium hydrogen carbonate (baking soda) used as an antacid?",
        "answer": "It is a mild, non-corrosive basic salt that neutralises excess hydrochloric acid (HCl) in the stomach.",
        "hint": "Mild alkaline neutraliser."
      },
      {
        "id": 7,
        "topic": "Acids and Bases",
        "question": "What is acid rain defined as in terms of pH value?",
        "answer": "Rainwater having a pH value less than 5.6.",
        "hint": "pH below 5.6."
      },
      {
        "id": 8,
        "topic": "Acids and Bases",
        "question": "Name the acid naturally present in ant stings and nettle leaves.",
        "answer": "Methanoic acid (Formic acid, HCOOH).",
        "hint": "Stinging single-carbon carboxylic acid."
      },
      {
        "id": 9,
        "topic": "Acids and Bases",
        "question": "What is the chemical formula of bleaching powder?",
        "answer": "CaOCl\u2082 (Calcium oxychloride, prepared by reacting slaked lime with chlorine gas).",
        "hint": "CaOCl2."
      },
      {
        "id": 10,
        "topic": "Acids and Bases",
        "question": "At what pH does tooth decay begin in the human mouth?",
        "answer": "When mouth pH drops below 5.5, bacteria produce acids that corrode tooth enamel (calcium hydroxyapatite).",
        "hint": "Threshold 5.5."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c10-acid-1",
        "title": "Neutralisation & Dilution Safety Evaluation",
        "difficulty": "Easy",
        "problemText": "Why should water never be added to concentrated sulfuric acid? Write the neutralisation reaction between hydrochloric acid and sodium hydroxide.",
        "steps": [
          "1. Safety: Dilution of concentrated acid is highly exothermic. Adding water to acid causes localized boiling, generating steam pockets that splash corrosive acid outward.",
          "2. Rule: Always add concentrated acid dropwise into water with continuous stirring.",
          "3. Neutralisation equation: HCl(aq) + NaOH(aq) --> NaCl(aq) + H\u2082O(l) + Heat."
        ],
        "finalAnswer": "Water to acid causes steam splashes; HCl + NaOH -> NaCl + H\u2082O.",
        "teacherTip": "Always write physical state symbols (aq, l) in balanced chemical equations."
      }
    ]
  },
  {
    "id": "c10-math-quadratic",
    "classLevel": 10,
    "subject": "Mathematics",
    "title": "Quadratic Equations & Discriminant Nature of Roots",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Solve quadratic equations ax\u00b2 + bx + c = 0 using factoring, quadratic formula, and determine nature of roots with discriminant D = b\u00b2 - 4ac.",
    "voiceScript": "Welcome to AI Reteach on Quadratic Equations. A quadratic equation in variable x is an equation of degree two in the standard form ax squared plus bx plus c equals 0, where a is non-zero. The quadratic formula, also known as Shreedharacharya's formula, gives roots as x equals negative b plus or minus the square root of b squared minus 4ac, all divided by 2a. The term under the radical, b squared minus 4ac, is called the Discriminant, denoted by capital D. The discriminant tells you the exact nature of the roots before you even solve the equation: If D is greater than zero, there are two distinct real roots. If D equals zero, there are two equal real roots. And if D is less than zero, there are no real roots. Always arrange your equation in standard form before identifying coefficients a, b, and c.",
    "keyFormulas": [
      "Standard Quadratic Form: ax\u00b2 + bx + c = 0  (a \u2260 0)",
      "Quadratic Formula: x = [-b \u00b1 \u221a(b\u00b2 - 4ac)] / (2a)",
      "Discriminant: D = b\u00b2 - 4ac",
      "Nature of Roots: D > 0 => Two distinct real roots; D = 0 => Two equal real roots; D < 0 => No real roots"
    ],
    "formulaInfo": {
      "key": "quadratic_formula",
      "formula": "x = [-b \u00b1 \u221a(b\u00b2 - 4ac)] / (2a)  |  D = b\u00b2 - 4ac",
      "name": "Shreedharacharya Quadratic Formula",
      "category": "Second-Degree Polynomials",
      "context": "Universal algebraic solution for any quadratic equation and classification of root nature.",
      "variables": "a = Leading coefficient (a \u2260 0), b = Linear coefficient, c = Constant term, D = Discriminant.",
      "caution": "Remember the denominator is 2a, not just 2. Also pay close attention to signs: if b is negative (-5), then -b becomes positive (+5)!",
      "tags": [
        "Mathematics",
        "Class 10",
        "Algebra",
        "Quadratic Equations"
      ]
    },
    "intuition": "Graphically, a quadratic equation represents a parabola. The discriminant D measures how the parabola sits relative to the x-axis: D > 0 means the parabola dips below the axis and cuts it at two distinct points. D = 0 means its vertex just kisses the x-axis at one point. D < 0 means it floats completely above or below without ever touching the axis.",
    "workedExamples": [
      {
        "problem": "Find the nature of the roots of 2x\u00b2 - 4x + 3 = 0. If real roots exist, find them.",
        "steps": [
          "Compare with standard form ax\u00b2 + bx + c = 0: a = 2, b = -4, c = 3.",
          "Compute discriminant: D = b\u00b2 - 4ac = (-4)\u00b2 - 4(2)(3).",
          "D = 16 - 24 = -8.",
          "Since D < 0, the equation has no real roots."
        ],
        "answer": "D = -8 < 0, No real roots exist.",
        "cautionNote": "Do not attempt square root of a negative discriminant in real number domain."
      },
      {
        "problem": "Find the value of k for which the quadratic equation 2x\u00b2 + kx + 3 = 0 has two equal real roots.",
        "steps": [
          "Condition for two equal real roots: Discriminant D = b\u00b2 - 4ac = 0.",
          "Identify coefficients: a = 2, b = k, c = 3.",
          "Substitute into D: k\u00b2 - 4(2)(3) = 0  =>  k\u00b2 - 24 = 0.",
          "Solve for k: k\u00b2 = 24  =>  k = \u00b1\u221a24 = \u00b12\u221a6."
        ],
        "answer": "k = \u00b12\u221a6",
        "cautionNote": "Never forget the \u00b1 sign when taking square roots on both sides!"
      }
    ],
    "commonPitfalls": [
      "Forgetting the negative sign in front of b in the numerator: -(-4) = +4.",
      "Writing only the positive square root when solving k\u00b2 = 24 (forgetting negative root -2\u221a6).",
      "Dividing only the radical by 2a instead of dividing the entire numerator (-b \u00b1 \u221aD)."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Quadratic Equations",
        "question": "What is the standard form of a quadratic equation?",
        "answer": "ax\u00b2 + bx + c = 0, where a, b, c are real numbers and a \u2260 0.",
        "hint": "Degree 2 standard layout."
      },
      {
        "id": 2,
        "topic": "Quadratic Equations",
        "question": "Write the formula for the discriminant (D) of ax\u00b2 + bx + c = 0.",
        "answer": "D = b\u00b2 - 4ac.",
        "hint": "Under the radical."
      },
      {
        "id": 3,
        "topic": "Quadratic Equations",
        "question": "What is the condition for a quadratic equation to have two distinct real roots?",
        "answer": "Discriminant D > 0 (b\u00b2 - 4ac > 0).",
        "hint": "Positive discriminant."
      },
      {
        "id": 4,
        "topic": "Quadratic Equations",
        "question": "What is the condition for a quadratic equation to have two equal real roots?",
        "answer": "Discriminant D = 0 (b\u00b2 - 4ac = 0).",
        "hint": "Zero discriminant."
      },
      {
        "id": 5,
        "topic": "Quadratic Equations",
        "question": "What is the nature of roots when D < 0?",
        "answer": "No real roots exist (roots are imaginary/complex).",
        "hint": "Negative under square root."
      },
      {
        "id": 6,
        "topic": "Quadratic Equations",
        "question": "State the quadratic formula (Shreedharacharya's formula).",
        "answer": "x = [-b \u00b1 \u221a(b\u00b2 - 4ac)] / (2a).",
        "hint": "Minus b plus minus root D over 2a."
      },
      {
        "id": 7,
        "topic": "Quadratic Equations",
        "question": "What is the sum of roots of ax\u00b2 + bx + c = 0?",
        "answer": "Sum of roots (\u03b1 + \u03b2) = -b / a.",
        "hint": "Negative linear over leading coefficient."
      },
      {
        "id": 8,
        "topic": "Quadratic Equations",
        "question": "What is the product of roots of ax\u00b2 + bx + c = 0?",
        "answer": "Product of roots (\u03b1 \u00b7 \u03b2) = c / a.",
        "hint": "Constant over leading coefficient."
      },
      {
        "id": 9,
        "topic": "Quadratic Equations",
        "question": "Solve x\u00b2 - 9 = 0 using factoring.",
        "answer": "(x - 3)(x + 3) = 0 => x = 3 or x = -3.",
        "hint": "Difference of squares."
      },
      {
        "id": 10,
        "topic": "Quadratic Equations",
        "question": "Can a quadratic equation have more than two roots?",
        "answer": "No, by Fundamental Theorem of Algebra, a polynomial of degree n has at most n roots (degree 2 = at most 2 roots).",
        "hint": "Degree dictates max roots."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c10-quad-1",
        "title": "Quadratic Factorization & Real Roots",
        "difficulty": "Moderate",
        "problemText": "Solve for x: 6x\u00b2 - x - 2 = 0 using middle term splitting.",
        "steps": [
          "Product of a and c = 6 \u00d7 (-2) = -12. Sum = -1.",
          "Find factors of -12 that add to -1: -4 and +3.",
          "Split middle term: 6x\u00b2 - 4x + 3x - 2 = 0.",
          "Group pairwise: 2x(3x - 2) + 1(3x - 2) = 0.",
          "Factor common binomial: (3x - 2)(2x + 1) = 0.",
          "Solve roots: 3x - 2 = 0 => x = 2/3; 2x + 1 = 0 => x = -1/2."
        ],
        "finalAnswer": "x = 2/3, x = -1/2",
        "teacherTip": "Always verify by substituting either root back into the original equation to ensure it equals 0."
      }
    ]
  },
  {
    "id": "c9-phy-motion",
    "classLevel": 9,
    "subject": "Physics",
    "title": "Motion: 3 Equations of Uniform Acceleration",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Master speed, velocity, uniform acceleration, and the derivation and application of the 3 kinematic equations: v=u+at, s=ut+\u00bdat\u00b2, and v\u00b2=u\u00b2+2as.",
    "voiceScript": "Welcome to AI Reteach on Motion and the Three Kinematic Equations. Motion is defined as a change in position of an object over time relative to a reference frame. Speed is a scalar quantity measuring distance over time, whereas velocity is a vector quantity measuring displacement over time. When an object accelerates uniformly, its motion is governed by three fundamental equations: First, v equals u plus a t, relating final velocity to initial velocity, acceleration, and time. Second, s equals u t plus half a t squared, calculating total displacement. And third, v squared equals u squared plus 2 a s, relating velocities directly to distance without involving time. In free fall under Earth's gravity, substitute acceleration a with plus or minus 9.8 metres per second squared.",
    "keyFormulas": [
      "v = u + a \u00b7 t  (1st Kinematic Equation: Velocity-Time relation)",
      "s = u \u00b7 t + \u00bd \u00b7 a \u00b7 t\u00b2  (2nd Kinematic Equation: Position-Time relation)",
      "v\u00b2 = u\u00b2 + 2 \u00b7 a \u00b7 s  (3rd Kinematic Equation: Position-Velocity relation)",
      "a = (v - u) / t  (Acceleration rate of change of velocity, m/s\u00b2)"
    ],
    "formulaInfo": {
      "key": "kinematic_motion",
      "formula": "v = u + at  |  s = ut + \u00bdat\u00b2  |  v\u00b2 = u\u00b2 + 2as",
      "name": "Equations of Uniformly Accelerated Motion",
      "category": "Classical Kinematics",
      "context": "Governing equations for rectilinear motion with constant acceleration in a straight line.",
      "variables": "u = Initial velocity (m/s), v = Final velocity (m/s), a = Acceleration (m/s\u00b2), t = Time (s), s = Distance (m).",
      "caution": "These three equations apply strictly when acceleration is uniform (constant). If acceleration changes with time, calculus methods must be used.",
      "tags": [
        "Physics",
        "Class 9",
        "Motion",
        "Kinematics"
      ]
    },
    "intuition": "Think of a car pulling onto an empty highway. Its initial speed u is the cruise speed before stepping on the accelerator. Stepping on the gas provides steady acceleration a. Each passing second adds a metres per second to its speedometer, directly matching v = u + at.",
    "workedExamples": [
      {
        "problem": "A car accelerates uniformly from 18 km/h to 36 km/h in 5 seconds. Calculate the acceleration and distance covered by the car in that time.",
        "steps": [
          "Convert velocities from km/h to m/s by multiplying by 5/18:",
          "Initial velocity u = 18 \u00d7 (5/18) = 5 m/s.",
          "Final velocity v = 36 \u00d7 (5/18) = 10 m/s. Time t = 5 s.",
          "Calculate acceleration: a = (v - u) / t = (10 - 5) / 5 = 1 m/s\u00b2.",
          "Calculate distance using 2nd equation: s = ut + \u00bdat\u00b2 = (5)(5) + 0.5(1)(5\u00b2) = 25 + 12.5 = 37.5 m."
        ],
        "answer": "Acceleration a = 1 m/s\u00b2, Distance s = 37.5 m",
        "cautionNote": "Always convert km/h to m/s using the factor 5/18 before calculating!"
      }
    ],
    "commonPitfalls": [
      "Using velocities in km/h directly with time in seconds without converting to m/s.",
      "Confusing scalar distance (total path length) with vector displacement (shortest straight-line vector).",
      "Assigning the wrong sign to acceleration during deceleration or braking (a should be negative)."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Motion",
        "question": "State the three equations of uniformly accelerated motion.",
        "answer": "1. v = u + at; 2. s = ut + \u00bdat\u00b2; 3. v\u00b2 = u\u00b2 + 2as.",
        "hint": "Three golden kinematic laws."
      },
      {
        "id": 2,
        "topic": "Motion",
        "question": "What is the conversion factor to convert speed from km/h to m/s?",
        "answer": "Multiply by 5/18 (since 1000 m / 3600 s = 5/18).",
        "hint": "5 over 18."
      },
      {
        "id": 3,
        "topic": "Motion",
        "question": "Can an object have zero displacement even if it has traveled a non-zero distance?",
        "answer": "Yes, if the object returns back to its starting point (e.g. completing a full circular lap).",
        "hint": "Returning to start."
      },
      {
        "id": 4,
        "topic": "Motion",
        "question": "What does the slope of a distance-time graph represent?",
        "answer": "Speed of the object.",
        "hint": "Rise over run on distance vs time."
      },
      {
        "id": 5,
        "topic": "Motion",
        "question": "What does the slope of a velocity-time graph represent?",
        "answer": "Acceleration of the object.",
        "hint": "Rate of change of velocity."
      },
      {
        "id": 6,
        "topic": "Motion",
        "question": "What does the area under a velocity-time graph represent?",
        "answer": "Total distance (or displacement) traveled by the object.",
        "hint": "Integral / area."
      },
      {
        "id": 7,
        "topic": "Motion",
        "question": "What is the SI unit of acceleration?",
        "answer": "Metre per second squared (m/s\u00b2).",
        "hint": "m/s divided by seconds."
      },
      {
        "id": 8,
        "topic": "Motion",
        "question": "What is the value of acceleration due to gravity (g) near the Earth's surface?",
        "answer": "Approximately 9.8 m/s\u00b2.",
        "hint": "Standard gravity value."
      },
      {
        "id": 9,
        "topic": "Motion",
        "question": "A body starts from rest. What is its initial velocity (u)?",
        "answer": "u = 0 m/s.",
        "hint": "Rest means zero initial speed."
      },
      {
        "id": 10,
        "topic": "Motion",
        "question": "A moving train comes to a stop after brakes are applied. What is its final velocity (v)?",
        "answer": "v = 0 m/s.",
        "hint": "Stopping means zero final speed."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c9-mot-1",
        "title": "Braking Distance and Retardation",
        "difficulty": "Moderate",
        "problemText": "A train moving at 90 km/h applies brakes producing a uniform retardation of -0.5 m/s\u00b2. How far will the train go before it is brought to rest?",
        "steps": [
          "Convert initial velocity: u = 90 \u00d7 (5/18) = 25 m/s.",
          "Final velocity at rest: v = 0 m/s. Acceleration a = -0.5 m/s\u00b2.",
          "Apply 3rd equation: v\u00b2 = u\u00b2 + 2as  =>  0\u00b2 = 25\u00b2 + 2(-0.5)s.",
          "0 = 625 - 1\u00b7s  =>  s = 625 m."
        ],
        "finalAnswer": "Distance s = 625 m",
        "teacherTip": "Notice that the negative sign of retardation perfectly cancels the negative sign from transposing 625."
      }
    ]
  },
  {
    "id": "c9-bio-cell",
    "classLevel": 9,
    "subject": "Biology",
    "title": "Cell: The Fundamental Unit of Life & Organelles",
    "readingTime": "5 min read \u2022 3 min audio",
    "summary": "Explore cell theory, plasma membrane permeability, osmosis, and organelle functions (Mitochondria, Ribosomes, Golgi apparatus, Lysosomes).",
    "voiceScript": "Welcome to AI Reteach on The Fundamental Unit of Life: The Cell. Cells are the basic structural and functional units of all living organisms, discovered by Robert Hooke in 1665. The cell is enveloped by a selectively permeable plasma membrane composed of lipids and proteins. Plant cells have an additional rigid cellulose cell wall outside the plasma membrane providing structural strength. Key organelles to remember include: First, Mitochondria, known as the powerhouse of the cell because they produce energy in the form of ATP molecules. Mitochondria have their own DNA and ribosomes, allowing them to make some of their own proteins. Second, Ribosomes, the sites of protein synthesis. Third, Lysosomes, known as suicide bags because when a cell is damaged, their powerful digestive enzymes digest the cell itself. And fourth, the Nucleus, the control centre containing genetic chromosomes.",
    "keyFormulas": [
      "Cell Theory: All organisms composed of cells; cell is basic unit of life; all cells arise from pre-existing cells (Virchow)",
      "ATP: Adenosine Triphosphate ('Energy Currency of the Cell')",
      "Osmosis: Net diffusion of water across a selectively permeable membrane from higher to lower water potential",
      "Semi-Autonomous Organelles: Mitochondria and Plastids possess their own circular DNA and 70S ribosomes"
    ],
    "formulaInfo": {
      "key": "cell_organelles",
      "formula": "C\u2086H\u2081\u2082O\u2086 + 6O\u2082 --Mitochondria--> 6CO\u2082 + 6H\u2082O + ATP",
      "name": "Mitochondrial Cellular Respiration",
      "category": "Cell Biology",
      "context": "Oxidative phosphorylation producing ATP chemical currency within mitochondrial cristae folds.",
      "variables": "ATP = Adenosine Triphosphate, Cristae = Inner membrane folds maximizing surface area.",
      "caution": "Mitochondria and Plastids are semi-autonomous because they have their own DNA and ribosomes, unlike the endoplasmic reticulum or Golgi apparatus.",
      "tags": [
        "Biology",
        "Class 9",
        "Cell Structure",
        "Organelles"
      ]
    },
    "intuition": "Think of a living cell as a self-contained miniature city. The nucleus is city hall holding the master blueprints, mitochondria are electric power plants generating ATP electricity, ribosomes are manufacturing factories, the Golgi apparatus is the postal shipping depot, and lysosomes are the municipal waste disposal and recycling fleet.",
    "workedExamples": [
      {
        "problem": "What will happen if an animal cell (like an RBC) is placed in a hypotonic solution versus a hypertonic solution?",
        "steps": [
          "Hypotonic solution: Surrounding water concentration is higher than inside the cell. Water enters the cell via endosmosis. The cell swells and may eventually burst because animal cells lack a rigid cell wall.",
          "Hypertonic solution: Surrounding solution has higher solute concentration (lower water potential). Water leaves the cell via exosmosis. The cell shrinks (crenates).",
          "Isotonic solution: Equal concentrations; dynamic equilibrium with no net water movement; cell size remains unchanged."
        ],
        "answer": "Hypotonic -> swells/bursts; Hypertonic -> shrinks/crenates; Isotonic -> unchanged.",
        "cautionNote": "Plant cells do not burst in hypotonic solutions because their rigid cellulose cell wall exerts turgor pressure resisting rupture."
      }
    ],
    "commonPitfalls": [
      "Calling lysosomes the powerhouse of the cell (mitochondria are the powerhouse; lysosomes are suicide bags).",
      "Forgetting that osmosis is strictly the movement of water across a selectively permeable membrane.",
      "Thinking animal cells have a cell wall (only plant, fungal, and bacterial cells have cell walls)."
    ],
    "flashcards": [
      {
        "id": 1,
        "topic": "Cell Structure",
        "question": "Who discovered cells and in what year?",
        "answer": "Robert Hooke in 1665 (observed dead cork cells under a primitive microscope).",
        "hint": "Cork slice 1665."
      },
      {
        "id": 2,
        "topic": "Cell Structure",
        "question": "Why are mitochondria called the 'powerhouses of the cell'?",
        "answer": "Because they generate cellular energy in the form of ATP (Adenosine Triphosphate) through cellular respiration.",
        "hint": "ATP energy generation."
      },
      {
        "id": 3,
        "topic": "Cell Structure",
        "question": "Why are lysosomes called 'suicide bags'?",
        "answer": "If cellular metabolism is damaged or during cell death, lysosomes burst and their hydrolytic digestive enzymes digest their own cell.",
        "hint": "Autolytic digestion."
      },
      {
        "id": 4,
        "topic": "Cell Structure",
        "question": "Which organelle is responsible for synthesizing proteins in the cell?",
        "answer": "Ribosomes (present freely in cytoplasm or attached to Rough Endoplasmic Reticulum).",
        "hint": "Protein synthesis factory."
      },
      {
        "id": 5,
        "topic": "Cell Structure",
        "question": "What is the primary function of the Golgi apparatus?",
        "answer": "Packaging, modification, storage, and dispatch of cellular products in vesicles.",
        "hint": "Cellular shipping hub."
      },
      {
        "id": 6,
        "topic": "Cell Structure",
        "question": "Which two organelles possess their own DNA and ribosomes?",
        "answer": "Mitochondria and Plastids (chloroplasts).",
        "hint": "Semi-autonomous organelles."
      },
      {
        "id": 7,
        "topic": "Cell Structure",
        "question": "What is the main chemical constituent of plant cell walls?",
        "answer": "Cellulose (a complex structural carbohydrate).",
        "hint": "Insoluble fiber polymer."
      },
      {
        "id": 8,
        "topic": "Cell Structure",
        "question": "What is plasmolysis in plant cells?",
        "answer": "Shrinkage of protoplasm away from the cell wall when a plant cell loses water in a hypertonic solution.",
        "hint": "Cell wall detachment."
      },
      {
        "id": 9,
        "topic": "Cell Structure",
        "question": "What is the full form of ATP?",
        "answer": "Adenosine Triphosphate.",
        "hint": "Energy currency acronym."
      },
      {
        "id": 10,
        "topic": "Cell Structure",
        "question": "What is the difference between prokaryotic and eukaryotic cells?",
        "answer": "Prokaryotes lack a defined membrane-bound nucleus and organelles (e.g. bacteria); eukaryotes possess a true nucleus and membrane-bound organelles (e.g. plants, animals).",
        "hint": "True nucleus vs primitive."
      }
    ],
    "homeworkQuestions": [
      {
        "id": "hw-c9-cell-1",
        "title": "Organelle Comparative Function Analysis",
        "difficulty": "Moderate",
        "problemText": "Differentiate between Rough Endoplasmic Reticulum (RER) and Smooth Endoplasmic Reticulum (SER) in terms of structure and function.",
        "steps": [
          "Structure: RER has ribosomes studded on its outer surface; SER lacks ribosomes and has a smooth tubular appearance.",
          "RER Function: Actively synthesizes and folds secretory proteins.",
          "SER Function: Synthesizes lipids and steroid hormones, and detoxifies poisons and drugs in vertebrate liver cells.",
          "Membrane Biogenesis: Proteins from RER and lipids from SER combine to build new cell membranes."
        ],
        "finalAnswer": "RER has ribosomes and makes proteins; SER lacks ribosomes and makes lipids/detoxifies.",
        "teacherTip": "Mention membrane biogenesis to secure full marks in long-answer questions."
      }
    ]
  }
];

export const AVAILABLE_GRADES = [10, 9, 8, 7, 6];
export const AVAILABLE_SUBJECTS = ['Physics', 'Biology', 'Chemistry', 'Mathematics', 'Science'];

export function getTopicsByGradeAndSubject(grade: number, subject: string): CurriculumTopic[] {
  return ALL_CURRICULUM_TOPICS.filter(t => {
    const gradeMatch = t.classLevel === grade;
    if (subject === 'All Subjects' || subject === 'Science') {
      return gradeMatch;
    }
    return gradeMatch && t.subject.toLowerCase() === subject.toLowerCase();
  });
}

export function findTopicById(id: string): CurriculumTopic | undefined {
  return ALL_CURRICULUM_TOPICS.find(t => t.id === id);
}
