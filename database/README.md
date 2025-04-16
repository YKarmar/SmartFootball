# SmartFootball 数据库设计文档

本文档描述了SmartFootball应用的数据库结构设计。数据库使用MySQL，采用UTF-8编码以支持多语言字符。

## 数据库表结构

### 1. users（用户表）
存储用户的基本信息和个人资料。

字段说明：
- `id`: 用户唯一标识符 (UUID)
- `username`: 用户名，唯一
- `email`: 电子邮件，唯一
- `password_hash`: 密码哈希值
- `full_name`: 用户全名
- `age`: 年龄
- `height`: 身高
- `weight`: 体重
- `position`: 场上位置
- `skill_level`: 技能水平
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 2. training_data（训练数据表）
存储来自Apple Watch的原始传感器数据。

字段说明：
- `id`: 数据记录唯一标识符 (UUID)
- `user_id`: 关联的用户ID
- `session_start`: 训练会话开始时间
- `session_end`: 训练会话结束时间
- `accelerometer_data`: 加速度计数据 (JSON格式)
- `gyroscope_data`: 陀螺仪数据 (JSON格式)
- `heart_rate_data`: 心率数据 (JSON格式)
- `gps_data`: GPS位置数据 (JSON格式)
- `created_at`: 记录创建时间

### 3. activities（活动记录表）
记录用户的训练活动和相关统计数据。

字段说明：
- `id`: 活动唯一标识符 (UUID)
- `user_id`: 关联的用户ID
- `activity_type`: 活动类型
- `start_time`: 活动开始时间
- `end_time`: 活动结束时间
- `duration`: 持续时间（秒）
- `distance`: 距离（米）
- `calories_burned`: 消耗卡路里
- `average_heart_rate`: 平均心率
- `max_heart_rate`: 最大心率
- `activity_data`: 其他活动相关数据 (JSON格式)
- `created_at`: 记录创建时间

### 4. recommendations（训练建议表）
存储系统生成的个性化训练建议。

字段说明：
- `id`: 建议唯一标识符 (UUID)
- `user_id`: 关联的用户ID
- `recommendation_type`: 建议类型
- `title`: 建议标题
- `description`: 建议详细描述
- `priority`: 优先级（0-10）
- `status`: 状态（pending/completed/dismissed）
- `created_at`: 创建时间
- `updated_at`: 更新时间

## 数据关系
- 所有表都通过`user_id`与`users`表关联
- 使用级联删除确保数据一致性
- JSON字段用于存储复杂的结构化数据

## 注意事项
1. 所有表使用UUID作为主键
2. 时间戳字段自动更新
3. 外键关系确保数据完整性
4. JSON字段提供灵活的数据存储方案 