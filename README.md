# RhizoSense 🌱

**RhizoSense** is a full-stack agricultural dashboard and machine learning platform designed to track soil health, analyze deficiencies, and provide actionable, biofertilizer-focused recommendations for farmers. It features a complete farm onboarding flow and supports multiple Indian languages for wider accessibility.

## ⚠️ The Problem Statement

India has 140 million+ smallholder farmers. The government's Soil Health Card scheme tests their soil and gives them an NPK + pH report. That's it — purely chemical numbers.

The problem is that **soil health is biological, not just chemical.** The real actors in soil fertility are microorganisms:
- **Nitrogen-fixing bacteria** (like Rhizobium, Azotobacter) — pull nitrogen from the air into the soil so plants can absorb it.
- **Phosphate-solubilizing bacteria** (like Bacillus, Pseudomonas) — convert locked phosphate into a form roots can absorb.
- **Mycorrhizal fungi** — extend the root system, improving water and nutrient uptake.
- **Biocontrol agents** (like Trichoderma) — suppress soil-borne pathogens.

When these groups are deficient or imbalanced, no amount of NPK fertilizer fully fixes the problem. Farmers either pour in more chemical fertilizer (which is expensive, degrades soil long-term, and pollutes groundwater) or buy a generic biofertilizer sachet that may contain microbes completely wrong for their soil's specific deficiency profile.

**The gap:** There is no tool that goes from *"what's actually alive in this soil"* to *"here's exactly what you should add and how much."*

RhizoSense fills that gap.

## 💡 The Solution

Think of it as a blood test + prescription system for soil. 

A blood test doesn't just tell you a number in isolation — it compares your profile against reference ranges, flags what's low, and a doctor translates that into a specific medicine and dose. RhizoSense does the same thing for soil microbiomes:
1. A farmer or extension worker submits a soil sample to a partner lab.
2. The lab runs 16S rRNA or metagenomic sequencing on the sample.
3. RhizoSense's bioinformatics pipeline classifies every microbe present, groups them by function, and computes a health score.
4. The ML model flags which functional groups are deficient relative to what that crop + soil type + climate zone needs.
5. The recommendation engine outputs precise instructions: *"For your tomato field in this region, you're low on phosphate-solubilizers — apply Bacillus megaterium consortium at X g/acre before sowing."*
6. The farmer sees a plain-language summary on a regional-language mobile dashboard.

## 🚀 Core Features

### 1. Microbiome Health Scorer
Takes raw sequencing data (DNA reads), runs taxonomic classification to identify species abundance, and computes a 0–100 soil health score.
- **How it works:** Calculates alpha diversity (Shannon index, species richness), measures functional group completeness (e.g., N-fixers, P-solubilizers), and compares them against a reference database of healthy soils.
- **Why it matters:** Gives farmers a biological indicator and a single actionable number they can track season over season.

### 2. AI Biofertilizer Recommender
Maps the deficiency profile to a ranked list of commercially available biofertilizer products with specific dosage guidance.
- **How it works:** An XGBoost/Random Forest classifier takes functional group abundances, crop type, soil pH, region, and season to predict a deficiency category. A rule-based engine then matches this to compatible microbial consortia and calculates the dosage.
- **Why it's better:** It matches the specific gap in your soil, rather than offering a generic average.

### 3. Multilingual Farmer Dashboard
Translates technical outputs into a visual, easy-to-understand mobile/web interface in regional languages (Tamil, Telugu, Hindi, etc.).
- **What the farmer sees:** A circular health meter, key flags (healthy, borderline, deficient), primary recommendations, cost estimations, and seasonal trends.
- **Technical implementation:** Built with React, IndicTrans2 / Google Translate API, and Recharts.

### 4. Seasonal Tracking & Feedback Loop
Every soil submission is stored with the farmer's crop choice and location. After harvest, farmers log their yield outcome to create a labeled dataset.
- **Why it's a differentiator:** Over seasons, the recommendation model retrains on ground truth data, creating a compounding data advantage that generic biofertilizer companies lack.

### 5. Explainability Layer
Shows exactly which microbial markers drove the health score and recommendation.
- **Why it matters:** Avoids the "black box" AI problem. By showing exact bacterial names and roles, it builds trust with farmers, extension workers, and agricultural experts.

### 6. Cost Savings Estimator
Compares the cost of the recommended biofertilizer application against the farmer's current spend on chemical NPK fertilizers for the same field size.
- **Why it matters:** Proves the immediate economic value of transitioning to biological interventions.

## 🏗️ Architecture

**LAYER 1: INPUT**
- Soil sample collected ➔ Sequenced ➔ Raw FASTQ files uploaded to RhizoSense.

**LAYER 2: BIOINFORMATICS PIPELINE (Backend)**
- Quality control (FastQC / Trimmomatic)
- Taxonomic classification (Kraken2 or QIIME2 + SILVA database)
- OTU/ASV table generation & Functional group assignment
- Diversity index calculation (Shannon, Chao1, Simpson)

**LAYER 3: ML MODEL**
- Feature engineering ➔ Deficiency classifier (XGBoost/Random Forest) ➔ Health score model (weighted regression).
- Retraining pipeline for continuous learning.

**LAYER 4: RECOMMENDATION ENGINE**
- Deficiency category lookup ➔ Compatibility check ➔ Dosage calculation ➔ Ranked recommendation output.

**LAYER 5: API LAYER**
- FastAPI REST endpoints, JWT authentication, Lab integration webhooks, and Data validation.

**LAYER 6: FRONTEND (Farmer Dashboard)**
- React web app with Recharts, Language selection, and low-bandwidth fallback.

**LAYER 7: DATA STORAGE**
- PostgreSQL (farmer profiles, records), MongoDB (sequencing metadata), S3-compatible storage (FASTQ files).

**LAYER 8: FEEDBACK LOOP**
- Farmer logs harvest yield ➔ Retraining pipeline triggered ➔ New model version deployed.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Radix UI (shadcn/ui primitives)
- **Routing & State:** TanStack Router + TanStack Query
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### Backend
- **Framework:** FastAPI (Python)
- **Machine Learning:** Scikit-Learn, XGBoost, SHAP
- **Data Processing:** Pandas, NumPy
- **Server:** Uvicorn

## 📂 Project Structure

```text
sense/
├── Backend/               # FastAPI backend & ML models
│   ├── main.py            # API routes and endpoints
│   ├── train_model.py     # ML model training scripts
│   ├── precompute.py      # Data precomputation logic
│   └── requirements.txt   # Python dependencies
├── Frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components & dashboard sections
│   │   ├── lib/           # API client, i18n logic, and utilities
│   │   ├── routes/        # TanStack Router page routes
│   │   └── ...
│   ├── package.json       # Node dependencies and scripts
│   └── vite.config.ts     # Vite configuration
├── data/                  # Datasets for ML training
└── models/                # Serialized machine learning models
```

## ⚙️ Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd sense
```

### 2. Backend Setup
Navigate to the backend directory, create a virtual environment, and install dependencies:
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```
*The API will be available at http://localhost:8000*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Frontend
npm install
```

Run the frontend development server:
```bash
npm run dev
```
*The app will be available at http://localhost:5173*

## 📜 Available Scripts (Frontend)

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run format`: Formats code using Prettier.
- `npm run i18n:check`: Validates localization keys across all supported languages.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
