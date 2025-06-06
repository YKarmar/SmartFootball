-- 创建数据库
CREATE DATABASE IF NOT EXISTS smart_football CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smart_football;

-- 用户表
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    age INTEGER,
    height FLOAT,
    weight FLOAT,
    position VARCHAR(255),
    skill_level VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 训练数据表
CREATE TABLE IF NOT EXISTS training_data (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_start TIMESTAMP NOT NULL,
    session_end TIMESTAMP NOT NULL,
    accelerometer_data JSON,
    gyroscope_data JSON,
    heart_rate_data JSON,
    gps_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 活动记录表
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration INT NOT NULL,
    distance FLOAT,
    calories_burned FLOAT,
    average_heart_rate FLOAT,
    max_heart_rate FLOAT,
    activity_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 训练建议表
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Apple Health data table
CREATE TABLE IF NOT EXISTS apple_health_data (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    workout_type VARCHAR(50),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    duration_seconds INT,
    distance_meters DECIMAL(10,2),
    total_energy_burned DECIMAL(8,2),
    heart_rate_samples JSON,
    location_samples JSON,
    accelerometer_samples JSON,
    gyroscope_samples JSON,
    source_name VARCHAR(100),
    source_version VARCHAR(50),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_start_date (user_id, start_date),
    INDEX idx_workout_type (workout_type),
    INDEX idx_imported_at (imported_at)
);

-- Create indexes for better performance
CREATE INDEX idx_training_data_user_session ON training_data(user_id, session_start);
CREATE INDEX idx_activities_user_time ON activities(user_id, start_time);
CREATE INDEX idx_recommendations_user_status ON recommendations(user_id, status);
CREATE INDEX idx_recommendations_type ON recommendations(recommendation_type);
CREATE INDEX idx_apple_health_user_date ON apple_health_data(user_id, start_date DESC);

