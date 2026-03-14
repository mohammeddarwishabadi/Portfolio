# 🌧️ Rainfall Prediction in Australia

## Overview
A Machine Learning project that predicts whether it will rain tomorrow in Australia using multiple classification and regression algorithms, trained on a comprehensive weather dataset (2008-2017) from the Australian Bureau of Meteorology.

## Dataset
- **Source:** Australian Government's Bureau of Meteorology
- **Period:** 2008 - 2017
- **Features:** 22 weather attributes including temperature, humidity, wind speed, pressure, and cloud coverage
- **Target:** RainTomorrow (Yes/No)

## Algorithms Implemented

| Algorithm | Type |
|-----------|------|
| Linear Regression | Regression |
| K-Nearest Neighbors (KNN) | Classification |
| Decision Tree | Classification |
| Logistic Regression | Classification |
| Support Vector Machine (SVM) | Classification |

## Evaluation Metrics
- Accuracy Score
- Jaccard Index
- F1-Score
- Log Loss (Logistic Regression only)
- Mean Absolute Error (Linear Regression)
- Mean Squared Error (Linear Regression)
- R²-Score (Linear Regression)

## Data Preprocessing
- One Hot Encoding for categorical variables (WindGustDir, WindDir9am, WindDir3pm, RainToday)
- Binary encoding for target variable (RainTomorrow)
- Feature scaling and cleaning

## Tech Stack
- **ML:** Python, Scikit-learn, Pandas, NumPy
- **Dashboard:** React, TypeScript, Vite

## Project Structure
```
rainfall-prediction-ml/
├── Source Code/
│   └── SourceCode.ipynb       # Full ML pipeline
├── src/                        # Dashboard
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── Preview.url
```

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
https://019c83d5-dac9-7b1e-9bbe-b571828155b8.arena.site/
