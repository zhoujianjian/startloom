-- 埋点统计表（优化版 - 单表查询 + 基数配置）

-- 实时统计表（核心表，单表查询）
CREATE TABLE IF NOT EXISTS site_stats (
    id INT PRIMARY KEY DEFAULT 1,
    -- 基数配置（假数据基础）
    base_total_count BIGINT DEFAULT 128650 COMMENT '总测算基数',
    base_today_count INT DEFAULT 1280 COMMENT '今日测算基数',
    base_online_count INT DEFAULT 38 COMMENT '在线人数基数',
    -- 真实数据
    real_total_count BIGINT DEFAULT 0 COMMENT '真实总测算次数',
    real_today_count INT DEFAULT 0 COMMENT '真实今日测算次数',
    real_online_count INT DEFAULT 0 COMMENT '真实在线人数',
    -- 日期标记（用于重置今日数据）
    today_date DATE NULL COMMENT '当前日期',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站点统计表';

-- 初始化统计数据
INSERT INTO site_stats (id, base_total_count, base_today_count, base_online_count, today_date) 
VALUES (1, 128650, 1280, 38, CURDATE())
ON DUPLICATE KEY UPDATE id = 1;

-- 工具统计表（单表，冗余设计）
CREATE TABLE IF NOT EXISTS tool_stats (
    tool_id VARCHAR(50) PRIMARY KEY,
    tool_name VARCHAR(100) COMMENT '工具名称',
    tool_icon VARCHAR(20) COMMENT '工具图标',
    category VARCHAR(50) COMMENT '分类',
    -- 基数
    base_total INT DEFAULT 0 COMMENT '总使用基数',
    base_today INT DEFAULT 0 COMMENT '今日使用基数',
    -- 真实数据
    real_total BIGINT DEFAULT 0 COMMENT '真实总使用次数',
    real_today INT DEFAULT 0 COMMENT '真实今日使用次数',
    -- 日期标记
    today_date DATE NULL COMMENT '当前日期',
    sort_order INT DEFAULT 0 COMMENT '排序',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具统计表';

-- 初始化工具数据（带基数）
INSERT INTO tool_stats (tool_id, tool_name, tool_icon, category, base_total, base_today, sort_order, today_date) VALUES
('zodiac-match', '生肖配对', '🐲', 'match', 12580, 156, 1, CURDATE()),
('constellation-match', '星座配对', '⭐', 'match', 11230, 142, 2, CURDATE()),
('fate-test', '缘分测试', '💘', 'match', 8960, 98, 3, CURDATE()),
('name-match', '姓名配对', '💑', 'match', 6540, 76, 4, CURDATE()),
('daily-sign', '今日运势', '🎋', 'fortune', 15680, 198, 5, CURDATE()),
('taisui', '犯太岁查询', '🐉', 'fortune', 9870, 112, 6, CURDATE()),
('peach-blossom', '桃花运测试', '🌸', 'fortune', 7650, 89, 7, CURDATE()),
('wealth-test', '财运测试', '💰', 'fortune', 8920, 102, 8, CURDATE()),
('wuxing', '五行查询', '🌈', 'fortune', 5430, 62, 9, CURDATE()),
('name-test', '姓名测试', '✍️', 'naming', 18960, 215, 10, CURDATE()),
('baby-name', '宝宝起名', '👶', 'naming', 6780, 78, 11, CURDATE()),
('company-name', '公司起名', '🏢', 'naming', 4560, 52, 12, CURDATE()),
('dream', '周公解梦', '🌙', 'divination', 14320, 168, 13, CURDATE()),
('tarot', '塔罗牌占卜', '🎯', 'divination', 5670, 65, 14, CURDATE()),
('guanyin', '观音灵签', '📿', 'divination', 7890, 91, 15, CURDATE()),
('past-life', '前世今生', '🌀', 'divination', 4320, 49, 16, CURDATE()),
('lucky-day', '黄道吉日', '📅', 'life', 6540, 75, 17, CURDATE()),
('wedding-day', '结婚吉日', '💍', 'life', 3210, 37, 18, CURDATE()),
('move-day', '搬家吉日', '🏠', 'life', 2890, 33, 19, CURDATE()),
('phone-test', '手机测吉凶', '📱', 'life', 5670, 65, 20, CURDATE()),
('plate-test', '车牌测吉凶', '🚗', 'life', 3450, 40, 21, CURDATE()),
('fengshui-test', '家居风水', '🏡', 'life', 4120, 47, 22, CURDATE()),
('mbti-test', '性格测试', '🧠', 'fortune', 6780, 78, 23, CURDATE()),
('lucky-number', '幸运数字', '🔢', 'fortune', 3560, 41, 24, CURDATE()),
('birthday-flower', '生日花语', '💐', 'life', 2340, 27, 25, CURDATE())
ON DUPLICATE KEY UPDATE 
    tool_name = VALUES(tool_name),
    tool_icon = VALUES(tool_icon),
    category = VALUES(category),
    base_total = VALUES(base_total),
    base_today = VALUES(base_today),
    sort_order = VALUES(sort_order);

-- 事件日志表（简化版，只记录关键事件）
CREATE TABLE IF NOT EXISTS event_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(20) NOT NULL COMMENT '事件类型: pv/tool_use',
    tool_id VARCHAR(50) COMMENT '工具ID',
    session_id VARCHAR(64) COMMENT '会话ID',
    ip VARCHAR(50) COMMENT 'IP地址',
    device_type VARCHAR(10) COMMENT '设备类型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_tool_id (tool_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='事件日志表';

-- 在线会话表
CREATE TABLE IF NOT EXISTS online_session (
    session_id VARCHAR(64) PRIMARY KEY,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_last_active (last_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='在线会话表';

-- 注意：以下定时任务需要手动在MySQL中执行（Flyway不支持DELIMITER语法）
-- 需要先开启事件调度器: SET GLOBAL event_scheduler = ON;

-- 定时清理过期会话（每10分钟执行）
-- CREATE EVENT IF NOT EXISTS clean_expired_sessions
-- ON SCHEDULE EVERY 10 MINUTE
-- DO DELETE FROM online_session WHERE last_active < DATE_SUB(NOW(), INTERVAL 30 MINUTE);

-- 定时清理过期事件日志（保留7天，每天凌晨3点执行）
-- CREATE EVENT IF NOT EXISTS clean_old_event_logs
-- ON SCHEDULE EVERY 1 DAY STARTS CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 3 HOUR
-- DO DELETE FROM event_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
