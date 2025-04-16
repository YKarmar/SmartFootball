# SmartFootball

SmartFootball是一个基于Apple Watch的智能足球训练助手应用，通过分析用户的训练数据提供个性化的训练建议。

## 项目结构

```
SmartFootball/
├── database/           # 数据库相关文件
│   ├── migrations/     # 数据库迁移脚本
│   ├── seeds/         # 初始化数据
│   ├── schema.sql     # 数据库表结构
│   └── README.md      # 数据库设计文档
│
├── backend/           # 后端服务
│   ├── java-service-api/  # Java核心服务
│   └── py-ai-api/        # Python AI服务
│
└── frontend/          # 前端应用
    ├── src/           # 源代码
    ├── components/    # 可复用组件
    ├── screens/       # 页面组件
    ├── services/      # API服务
    ├── types/         # TypeScript类型定义
    ├── utils/         # 工具函数
    └── assets/        # 静态资源
```

## 功能特点

- 实时收集Apple Watch传感器数据
- 智能分析训练表现
- 提供个性化训练建议
- 追踪训练进度和成就
- 社交分享功能

## 技术栈

### 前端
- React Native
- TypeScript
- Redux
- React Navigation

### 后端
- Java Spring Boot
- Python FastAPI
- MySQL
- TensorFlow

### 开发工具
- Docker
- Git
- VS Code

## 开始使用

### 环境要求
- Node.js >= 14
- Python >= 3.8
- Java >= 11
- MySQL >= 8.0
- Docker (可选)

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/SmartFootball.git
cd SmartFootball
```

2. 安装依赖
```bash
# 前端依赖
cd frontend
npm install

# 后端依赖
cd ../backend/java-service-api
./mvnw install

cd ../py-ai-api
pip install -r requirements.txt
```

3. 配置数据库
```bash
cd ../database
mysql -u root -p < schema.sql
```

4. 启动服务
```bash
# 使用Docker Compose（推荐）
docker-compose up

# 或分别启动各个服务
# 前端
cd frontend
npm start

# Java后端
cd backend/java-service-api
./mvnw spring-boot:run

# Python AI服务
cd backend/py-ai-api
uvicorn main:app --reload
```

## 开发指南

- [前端开发指南](frontend/README.md)
- [后端开发指南](backend/README.md)
- [数据库设计文档](database/README.md)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

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
- Identifies user's activity bias and position habits.

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
  - "Where did I run most in my last match?"
  - "How has my coverage improved this month?"
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
