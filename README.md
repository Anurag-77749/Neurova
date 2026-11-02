# NEUROVA — Academic Intelligence Operating System
> **An Intelligent Secondary Education Platform with Gemini AI Multimodal Vision, Synchronized Audio Teleprompter, and Unified Educator Oversight.**

[![Hackathon Project](https://img.shields.io/badge/Hackathon-Ready-0D9488?style=for-the-badge&logo=rocket)](https://neurova-ai.loca.lt)
[![Framework](https://img.shields.io/badge/React%2018-TypeScript-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Styling](https://img.shields.io/badge/Tailwind%20CSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![AI Engine](https://img.shields.io/badge/Google%20Gemini-3.1%20Flash%20Vision-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Math Engine](https://img.shields.io/badge/KaTeX-LaTeX%20Formulas-green?style=for-the-badge&logo=latex)](https://katex.org/)

---

## 🌐 Live Hackathon Deployment

- **Public Live Access (Phone, Tablet & Laptop)**: **[https://neurova-ai.loca.lt](https://neurova-ai.loca.lt)**  
  *(Tunnel Access Password if prompted: `152.59.205.245`)*
- **GitHub Repository**: **[https://github.com/polakonda-anurag/neurova-ai](https://github.com/polakonda-anurag/neurova-ai)**
- **Alternative 1-Click Vercel Deploy**: Ready for instant zero-config deployment via `vercel.json`.

---

## ⚡ Quick Demo Credentials (1-Click Access)

Every portal includes a **⚡ 1-Click Demo Launcher** on the sign-in cards, allowing instant evaluation with zero manual typing:

| Role | Portal / Access | Demo Credentials | Key Capabilities to Test |
| :--- | :--- | :--- | :--- |
| **Student** | **Student Portal** | **Class 10-D, Roll #21**<br>Password: `pass` | • Solve today's tasks across Physics & Math<br>• Upload handwritten solution notes (PDF/Images)<br>• Gemini AI Vision line-by-line verification<br>• Synchronized Audio Tutor with 3-speed teleprompter<br>• Real performance curve & 365-day consistency heatmap |
| **Teacher** | **Educator Suite** | **`teacher@neurova.edu`**<br>Password: `temp123` | • Publish 5–10 question homework assignments<br>• Inspect student worksheets in high-res lightbox<br>• Audit AI line-by-line diagnostic findings<br>• Record verified marks & qualitative feedback |
| **Admin** | **Institutional Console** | **`admin@neurova.edu`**<br>Password: `MasterAdmin#2026`<br>2-Step OTP: `482910` | • Institutional user provisioning<br>• Zero-knowledge password reset protocol<br>• Audit security logs & failed attempt lockouts |

---

## 🎯 The Problem & Pedagogical Vision

In secondary education (Classes 6 to 10 across CBSE, ICSE, and State curricula), two massive systemic bottlenecks persist:

1. **The Handwritten Feedback Void**: Students write mathematical derivations and scientific calculations on paper notebooks. Teachers have hours of paper-grading backlog, leaving students without rapid error correction at the step where the misconception occurred.
2. **Illusion of Competence**: Students passively read textbook solutions and assume they understand. When asked to articulate the reasoning out loud or calculate edge cases, their conceptual understanding breaks down.

**Neurova** solves this by providing:
- **Direct Optical Verification**: Students take a picture or attach their handwritten notebook page. The multimodal vision model reads each derivation step, evaluates sign conventions, detects algebraic or arithmetic errors, and provides targeted feedback.
- **Auditory Reteaching**: Generates a synchronized, rhythmic spoken explanation with 1x, 1.25x, and 1.5x pacing teleprompters and flashcard concept units.
- **Educator Empowerment**: Rather than replacing educators, Neurova arms teachers with high-resolution notebook zoom inspection, AI audit trails, and 1-click grading.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEUROVA CLIENT RUNTIME                          │
│                                                                        │
│   ┌─────────────────────┐   ┌───────────────────┐   ┌──────────────┐   │
│   │   Student Portal    │   │  Educator Suite   │   │ Admin Shield │   │
│   │ (Classes 6-10 A-D)  │   │  (Homework + Sub) │   │ (Governance) │   │
│   └──────────┬──────────┘   └─────────┬─────────┘   └──────┬───────┘   │
│              │                        │                    │           │
│              ▼                        ▼                    ▼           │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                  Client-Side State & Storage                   │   │
│   │   • Student Submissions Vault     • Homework Publisher Store   │   │
│   │   • AI Multimodal Vision Cache    • Argon2id Credential Engine │   │
│   └───────────────┬───────────────────────────┬────────────────────┘   │
└───────────────────┼───────────────────────────┼────────────────────────┘
                    │                           │
                    ▼                           ▼
      ┌───────────────────────────┐   ┌──────────────────────────┐
      │     Google Gemini AI      │   │    Web Speech Web API    │
      │   Multimodal Vision OCR   │   │  Synchronized Audio TTS  │
      │   (gemini-3.1-flash-lite) │   │  Multi-Speed Pacing Ticker│
      └───────────────────────────┘   └──────────────────────────┘
```

---

## 🚀 Key Technical Features

### 1. Gemini AI Multimodal Vision Verification
- Accepts high-resolution camera photographs (`image/jpeg`, `image/png`, `image/webp`) and multi-page documents (`application/pdf`).
- Analyzes handwriting line-by-line:
  $$\Delta = b^2 - 4ac, \quad x = \frac{-b \pm \sqrt{\Delta}}{2a}, \quad \frac{1}{f} = \frac{1}{v} - \frac{1}{u}$$
- Replaces generic text matching with actual mathematical step verification, flagging calculation errors, incorrect formula substitutions, and units omission.

### 2. Synchronized AI Voice Teleprompter
- Integrates continuous speech synthesis through the native browser `SpeechSynthesisUtterance` engine.
- Features a **rhythmic word-by-word streaming teleprompter** that keeps eyes aligned with audio narration.
- Allows real-time playback control with 1x (normal), 1.25x (accelerated), and 1.5x (revision pace).

### 3. Clean Analytics & Interactive Demo Benchmark
- **Today's Tasks Line Graph**: Real question scores vs. cohort benchmark average. Clean empty state when no assignments have been completed.
- **Curriculum Mastery Curve**: Cumulative proficiency tracking across Secondary Mathematics, Physics, Chemistry, and Biology.
- **365-Day Activity Heatmap**: Strict green multi-shade density reflecting committed study sprints and streak retention.
- **⚡ Bottom Demo Toggle**: One-click switch to populate simulated cohort data for hackathon judges and evaluations.

### 4. Zero-Knowledge Multi-Tenant Security
- Strict multi-tenant isolation by Class Level (6–10) and Section (A–D).
- Cryptographic hash verification and face-to-face lockout enforcement after 5 consecutive failed attempts.
- Fully masked API credentials preventing student token extraction.

---

## 💻 Tech Stack

- **UI & Architecture**: React 18, TypeScript 5.7, Vite 6.0
- **Styling & System**: Tailwind CSS v3.4, PostCSS, Framer Motion
- **Icons**: Lucide Icons
- **Mathematical Typesetting**: KaTeX 0.19 (LaTeX formula rendering)
- **AI Core**: Google Gemini 3.1 Flash Vision via Multimodal REST pipeline
- **Speech Engine**: Web Speech Synthesis API
- **Deployment**: Static SPA architecture with Vite chunk optimization, Vercel & Netlify configuration

---

## 🛠️ Local Development & Build

### Prerequisites
- Node.js 18+ or 20+
- `pnpm` (or `npm`)

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/polakonda-anurag/neurova-ai.git
cd neurova-ai

# 2. Navigate to neurova app directory
cd neurova

# 3. Install dependencies
pnpm install

# 4. Start local development server
pnpm dev
```

Open `http://localhost:5174/` in your browser.

### Production Build

```bash
pnpm build
```

The optimized, production-ready static bundle will be built in `neurova/dist`.

---

## 📱 Mobile & Responsive Testing

Neurova is engineered with responsive grid systems and fluid viewport scaling:
- **Mobile Phones (320px – 480px)**: Collapsible sidebar drawer, touch-friendly segmented controls, card lightboxes.
- **Tablets & iPads (768px – 1024px)**: Split-pane study hub, full-width teleprompter, touch-scrollable 52-week heatmap.
- **Laptops & Large Desktops (1280px+)**: Multi-column educator command dashboard, synchronized dual-pane worksheet comparison.

---

## 📜 Academic Scope (Classes 6 to 10)

- **Mathematics**: Algebraic Expressions & Identities, Quadratic Equations, Coordinate Geometry, Trigonometry, Statistics & Probability.
- **Physics**: Kinematics & Laws of Motion, Optics (Reflection & Refraction), Electricity & Ohm's Law, Gravitation, Work & Energy.
- **Chemistry**: Chemical Reactions & Equations, Acids, Bases & Salts, Carbon & Its Compounds, Periodic Classification.
- **Biology**: Life Processes (Photosynthesis & Respiration), Control & Coordination, Heredity & Evolution, Cellular Reproduction.

---

## 👥 Contributors & Credits

- **Polakonda Anurag Varma** — Lead Architect & Full-Stack Developer
- **Neurova Academic Intelligence Core** — Academic Year 2026–27

*Built with precision for educational transformation.*
