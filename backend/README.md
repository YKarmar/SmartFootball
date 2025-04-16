# SmartFootball 后端服务

本文档描述了SmartFootball应用的后端服务架构和开发指南。

## 服务架构

### 1. Java核心服务 (java-service-api)
处理核心业务逻辑，包括：
- 用户认证和授权
- 数据存储和管理
- 业务规则处理
- API网关

### 2. Python AI服务 (py-ai-api)
处理AI相关功能，包括：
- 传感器数据分析
- 活动识别
- 个性化建议生成
- LLM对话助手

## 技术栈

### Java服务
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL Connector
- JWT认证

### Python服务
- FastAPI
- TensorFlow
- OpenAI API
- NumPy
- Pandas

## API文档

### Java服务 API
- 基础URL: `http://localhost:8080/api/v1`
- Swagger文档: `http://localhost:8080/swagger-ui.html`

### Python服务 API
- 基础URL: `http://localhost:8000/api/v1`
- Swagger文档: `http://localhost:8000/docs`

## 开发指南

### 环境设置
1. 安装Java 11或更高版本
2. 安装Python 3.8或更高版本
3. 安装MySQL 8.0
4. 配置环境变量（参考.env.example）

### 本地开发
1. 启动MySQL服务
2. 运行数据库迁移
3. 启动Java服务
4. 启动Python服务

### 测试
- Java服务: `./mvnw test`
- Python服务: `pytest`

## 部署指南

### Docker部署
使用提供的docker-compose.yml文件进行部署：
```bash
docker-compose up -d
```

### 手动部署
参考各个服务的部署文档：
- [Java服务部署指南](java-service-api/README.md)
- [Python服务部署指南](py-ai-api/README.md)

## 监控和日志

### 日志位置
- Java服务: `logs/java-service.log`
- Python服务: `logs/python-service.log`

### 监控指标
- API响应时间
- 错误率
- 资源使用情况
- AI模型性能

## 故障排除

常见问题及解决方案：
1. 数据库连接问题
2. 服务启动失败
3. API超时
4. AI模型性能问题

## 安全指南

1. 所有API必须使用HTTPS
2. 实现适当的认证和授权
3. 加密敏感数据
4. 定期更新依赖包
5. 遵循安全最佳实践 