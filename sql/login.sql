-- -- 创建数据库
-- CREATE DATABASE IF NOT EXISTS login_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE login_db;

-- -- 用户表
-- CREATE TABLE users (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     username VARCHAR(50) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     email VARCHAR(100) NOT NULL UNIQUE,
--     phone VARCHAR(20),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 插入测试数据
-- INSERT INTO users (username, password, email, phone) VALUES 
-- ('admin', '123456', 'admin@example.com', '13800138000'); 