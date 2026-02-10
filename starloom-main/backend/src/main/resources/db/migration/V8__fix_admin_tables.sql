-- 修复管理员表结构 - 直接使用t_user表管理管理员
-- 删除独立的admin_user表（如果存在）
DROP TABLE IF EXISTS `admin_user`;

-- 确保t_user表有正确的role字段
ALTER TABLE `t_user` 
ADD COLUMN IF NOT EXISTS `role` varchar(20) DEFAULT 'user' COMMENT '用户角色: user/admin/super_admin' AFTER `wallet_address`;

-- 创建默认管理员账户（如果不存在）
INSERT INTO `t_user` (`email`, `password`, `nickname`, `role`, `create_time`, `update_time`) 
SELECT 'admin@starloom.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', '系统管理员', 'admin', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `t_user` WHERE `email` = 'admin@starloom.com' AND `role` IN ('admin', 'super_admin')
);

-- 创建页面访问表（如果不存在）
CREATE TABLE IF NOT EXISTS `page_view` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `session_id` varchar(100) DEFAULT NULL COMMENT '会话ID',
    `user_id` varchar(50) DEFAULT NULL COMMENT '用户ID',
    `page_url` varchar(500) NOT NULL COMMENT '页面URL',
    `page_title` varchar(200) DEFAULT NULL COMMENT '页面标题',
    `referrer` varchar(500) DEFAULT NULL COMMENT '来源页面',
    `user_agent` text COMMENT '用户代理',
    `ip` varchar(45) DEFAULT NULL COMMENT 'IP地址',
    `device_type` varchar(20) DEFAULT NULL COMMENT '设备类型',
    `browser` varchar(50) DEFAULT NULL COMMENT '浏览器',
    `os` varchar(50) DEFAULT NULL COMMENT '操作系统',
    `stay_time` bigint(20) DEFAULT NULL COMMENT '停留时间(秒)',
    `visit_time` datetime NOT NULL COMMENT '访问时间',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_visit_time` (`visit_time`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='页面访问记录表';

-- 创建用户行为表（如果不存在）
CREATE TABLE IF NOT EXISTS `user_behavior` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `user_id` varchar(50) DEFAULT NULL COMMENT '用户ID',
    `session_id` varchar(100) DEFAULT NULL COMMENT '会话ID',
    `event_type` varchar(50) NOT NULL COMMENT '事件类型',
    `event_name` varchar(100) NOT NULL COMMENT '事件名称',
    `page_url` varchar(500) DEFAULT NULL COMMENT '页面URL',
    `target_url` varchar(500) DEFAULT NULL COMMENT '目标URL',
    `properties` text COMMENT '事件属性(JSON)',
    `ip` varchar(45) DEFAULT NULL COMMENT 'IP地址',
    `device_type` varchar(20) DEFAULT NULL COMMENT '设备类型',
    `user_agent` text COMMENT '用户代理',
    `duration` bigint(20) DEFAULT NULL COMMENT '持续时间(毫秒)',
    `success` tinyint(1) DEFAULT '1' COMMENT '是否成功',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_event_type` (`event_type`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户行为记录表';

-- 创建每日统计表（如果不存在）
CREATE TABLE IF NOT EXISTS `daily_stats` (
    `stats_date` date NOT NULL COMMENT '统计日期',
    `page_views` int(11) DEFAULT '0' COMMENT '页面访问量',
    `unique_visitors` int(11) DEFAULT '0' COMMENT '独立访客数',
    `new_users` int(11) DEFAULT '0' COMMENT '新用户数',
    `bounce_rate` int(11) DEFAULT '0' COMMENT '跳出率(%)',
    `total_users` int(11) DEFAULT '0' COMMENT '总用户数',
    `active_users` int(11) DEFAULT '0' COMMENT '活跃用户数',
    `vip_users` int(11) DEFAULT '0' COMMENT 'VIP用户数',
    `new_vip_users` int(11) DEFAULT '0' COMMENT '新VIP用户数',
    `total_orders` int(11) DEFAULT '0' COMMENT '总订单数',
    `paid_orders` int(11) DEFAULT '0' COMMENT '已支付订单数',
    `cancelled_orders` int(11) DEFAULT '0' COMMENT '取消订单数',
    `total_revenue` decimal(10,2) DEFAULT '0.00' COMMENT '总收入',
    `vip_revenue` decimal(10,2) DEFAULT '0.00' COMMENT 'VIP收入',
    `avg_online_time` int(11) DEFAULT '0' COMMENT '平均在线时长(分钟)',
    `peak_online_count` int(11) DEFAULT '0' COMMENT '峰值在线人数',
    `error_count` int(11) DEFAULT '0' COMMENT '错误次数',
    `api_calls` int(11) DEFAULT '0' COMMENT 'API调用次数',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`stats_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日统计表';
