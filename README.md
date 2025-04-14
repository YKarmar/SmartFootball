# ⚽ SmartSoccer: Personalized Football Activity Analysis App

SmartSoccer is a digital health app that leverages **Apple Watch** sensor data to detect football activities, estimate the playing field, generate personalized heatmaps, and provide actionable suggestions. It also features a **natural language dialog assistant** powered by LLMs, enabling users to explore their training history and receive customized feedback.

---

## 📌 Features

### 🛰️ Apple Watch Data Collection
- Gathers motion and biometric data via GPS, accelerometer, gyroscope, and heart rate sensors.

### 🧠 Football Activity Recognition
- Detects whether a football session is in progress.
- Triggers further analysis only during valid gameplay.

### 📏 Field Boundary Estimation
- Uses GPS trace clustering to infer the field boundary and size.
- Supports informal and irregular field shapes.

### 🔥 Heatmap Generation
- Visualizes spatial movement density.
- Identifies user’s activity bias and position habits.

### 📝 Personalized Suggestions
- Provides recommendations based on heatmap and movement:
  - Position balance (left vs. right)
  - Zone overuse detection
  - Endurance distribution

### 📚 Activity Logging & Historical Data
- Stores session data in a structured format using **MySQL**.
- Supports long-term tracking and performance comparison.

### 💬 LLM-based Dialog Assistant
- Allows users to ask:
  - “Where did I run most in my last match?”
  - “How has my coverage improved this month?”
- Backed by **Python APIs** integrating LLMs and clustering models.

### 🎨 UI Display & Interaction
- Clean visual interface built with **React Native + TypeScript**
- Features:
  - Heatmap viewer
  - Suggestion dashboard
  - LLM chat interface

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
|--------------|------------------------------------------|
| Frontend     | **React Native + TypeScript**            |
| Backend (AI) | **Python** (LLM APIs, clustering)        |
| Backend Core | **Java** (Spring Boot / REST services)   |
| Database     | **MySQL**                                |
| Wearable     | **Apple Watch** (HealthKit, CoreMotion)  |
| LLM API      | DeepSeek / OpenAI GPT                    |
| Visualization| D3.js / React Native Charts              |

---
