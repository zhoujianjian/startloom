-- 创建数据库
CREATE DATABASE IF NOT EXISTS starloom DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE starloom;

-- 用户表
CREATE TABLE IF NOT EXISTS t_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    email VARCHAR(100) COMMENT '邮箱',
    password VARCHAR(100) COMMENT '密码',
    wallet_address VARCHAR(100) COMMENT '钱包地址',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像',
    vip_level INT DEFAULT 0 COMMENT 'VIP等级',
    vip_expire_time DATETIME COMMENT 'VIP过期时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '是否删除',
    UNIQUE KEY uk_email (email),
    UNIQUE KEY uk_wallet (wallet_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 聊天组表
CREATE TABLE IF NOT EXISTS t_chat_group (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '聊天组ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    title VARCHAR(100) COMMENT '标题',
    type VARCHAR(20) COMMENT '类型',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '是否删除',
    KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天组表';

-- 聊天消息表
CREATE TABLE IF NOT EXISTS t_chat_message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
    group_id BIGINT NOT NULL COMMENT '聊天组ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role VARCHAR(20) NOT NULL COMMENT '角色(user/assistant)',
    content TEXT COMMENT '内容',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted INT DEFAULT 0 COMMENT '是否删除',
    KEY idx_group_id (group_id),
    KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息表';
