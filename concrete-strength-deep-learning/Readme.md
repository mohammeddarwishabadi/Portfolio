# 🏗️ Concrete Strength Prediction using Deep Learning

## Overview
A Deep Learning project using Keras neural networks to predict concrete compressive strength based on material composition. The project explores the impact of normalization, epoch count, and network depth on model performance through systematic experimentation.

## Dataset
- **Source:** UCI Machine Learning Repository (via IBM)
- **Features:** 7 concrete ingredients (Cement, Slag, Fly Ash, Water, Superplasticizer, Coarse Aggregate, Fine Aggregate)
- **Target:** Concrete Compressive Strength (MPa)

## Experiments Conducted

| Part | Hidden Layers | Normalization | Epochs | Description |
|------|:---:|:---:|:---:|-------------|
| A | 1 | ❌ | 50 | Baseline model |
| B | 1 | ✅ | 50 | Effect of normalization |
| C | 1 | ✅ | 100 | Effect of more epochs |
| D | 3 | ✅ | 100 | Effect of deeper network |

Each experiment runs **50 iterations** with different random splits to ensure statistical reliability.

## Key Findings
- Normalization significantly reduces MSE
- Increasing epochs improves model convergence
- Deeper networks (3 hidden layers) achieve better performance

## Model Architecture
```
Input Layer (7 features)
    → Dense(10, ReLU) × n_hidden
    → Dense(1, Linear)

Optimizer: Adam
Loss: Mean Squared Error
```

## Tech Stack
- **DL:** Python, Keras, TensorFlow, NumPy, Pandas
- **Dashboard:** React, TypeScript, Vite

## Project Structure
```
concrete-strength-deep-learning/
├── Source Code/
│   └── SourceCode.ipynb       # Neural network experiments
├── src/                        # Dashboard
│   ├── utils/
│   ├── App.tsx
│   ├── data.ts
│   └── main.tsx
├── index.html
├── package.json
└── Preview.url
```

## Evaluation
- Mean Squared Error (MSE) — Mean and Standard Deviation across 50 runs

## How to Run
**ML Model:**
1. Open `Source Code/SourceCode.ipynb` in Jupyter Notebook
2. Run all cells sequentially

**Dashboard:**
1. `npm install`
2. `npm run dev`

## Author
**Mohammed Darwish Abadi**
📧 mo.darwish.abadi@gmail.com

## 🔗 Live Preview
https://019c8925-7eb0-73cd-ba4a-983b4ac86d9d.arena.site/
