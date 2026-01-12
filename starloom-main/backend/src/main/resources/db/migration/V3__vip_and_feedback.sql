-- =============================================
-- 会员套餐表 - 存储会员套餐配置
-- =============================================
CREATE TABLE IF NOT EXISTS t_vip_plan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '套餐名称',
    code VARCHAR(30) NOT NULL UNIQUE COMMENT '套餐编码(3month/1year/5year等)',
    duration_days INT NOT NULL COMMENT '有效天数',
    original_price DECIMAL(10,2) NOT NULL COMMENT '原价(元)',
    current_price DECIMAL(10,2) NOT NULL COMMENT '现价(元)',
    discount VARCHAR(20) DEFAULT NULL COMMENT '折扣标签(如5折)',
    badge VARCHAR(20) DEFAULT NULL COMMENT '角标(如推荐/热销)',
    vip_level INT NOT NULL DEFAULT 1 COMMENT '会员等级(1普通/2黄金/3钻石)',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态(0禁用/1启用)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员套餐表';

-- 初始化套餐数据
INSERT INTO t_vip_plan (name, code, duration_days, original_price, current_price, discount, badge, vip_level, sort_order) VALUES
('3个月会员', '3month', 90, 98.00, 98.00, NULL, NULL, 1, 1),
('1年会员', '1year', 365, 258.00, 258.00, NULL, '推荐', 2, 2),
('5年会员', '5year', 1825, 1796.00, 898.00, '5折', '热销', 3, 3);

-- =============================================
-- 会员权益表 - 存储各等级会员权益
-- =============================================
CREATE TABLE IF NOT EXISTS t_vip_benefit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '权益名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '权益编码',
    description VARCHAR(500) DEFAULT NULL COMMENT '权益描述',
    icon VARCHAR(200) DEFAULT NULL COMMENT '图标URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态(0禁用/1启用)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员权益表';

-- =============================================
-- 会员等级权益关联表 - 配置各等级拥有的权益
-- =============================================
CREATE TABLE IF NOT EXISTS t_vip_level_benefit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vip_level INT NOT NULL COMMENT '会员等级(0普通用户/1普通会员/2黄金会员/3钻石会员)',
    benefit_id BIGINT NOT NULL COMMENT '权益ID',
    benefit_value VARCHAR(100) DEFAULT NULL COMMENT '权益值(如部分/全部/具体数量)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_level_benefit (vip_level, benefit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员等级权益关联表';

-- 初始化权益数据
INSERT INTO t_vip_benefit (name, code, description, sort_order) VALUES
('名人八字库', 'famous_bazi', '查看名人八字案例', 1),
('情感功能专业版', 'emotion_pro', '情感分析专业功能', 2),
('五行能量专业版', 'wuxing_pro', '五行能量分析专业功能', 3),
('系统评估概要', 'system_summary', '系统评估概要功能', 4),
('系统评估格局', 'system_pattern', '系统评估格局功能', 5),
('问灵开发功能', 'spirit_dev', '问灵开发功能', 6),
('神煞设置', 'shensha_setting', '神煞设置功能', 7),
('格局取用注释', 'pattern_note', '格局取用注释功能', 8),
('命宫身宫设置', 'palace_setting', '命宫身宫设置功能', 9),
('地支藏干设置', 'dizhi_setting', '地支藏干设置功能', 10),
('刑冲破害设置', 'xingchong_setting', '刑冲破害设置功能', 11),
('人元司令分野设置', 'renyuan_setting', '人元司令分野设置功能', 12),
('合盘五行图', 'hepan_wuxing', '合盘五行图功能', 13),
('AI问卦次数', 'ai_chat_count', 'AI问卦每日次数', 14);

-- 初始化等级权益关联(钻石会员-等级3)
INSERT INTO t_vip_level_benefit (vip_level, benefit_id, benefit_value) 
SELECT 3, id, '全部' FROM t_vip_benefit;

-- 初始化等级权益关联(黄金会员-等级2)
INSERT INTO t_vip_level_benefit (vip_level, benefit_id, benefit_value) 
SELECT 2, id, CASE WHEN code = 'famous_bazi' THEN '部分' ELSE '全部' END FROM t_vip_benefit;

-- 初始化等级权益关联(普通会员-等级1，只有基础权益)
INSERT INTO t_vip_level_benefit (vip_level, benefit_id, benefit_value) 
SELECT 1, id, '全部' FROM t_vip_benefit WHERE code IN ('system_summary', 'ai_chat_count');

-- =============================================
-- 用户订单表 - 存储会员购买订单
-- =============================================
CREATE TABLE IF NOT EXISTS t_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(64) NOT NULL UNIQUE COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    plan_id BIGINT NOT NULL COMMENT '套餐ID',
    plan_name VARCHAR(50) NOT NULL COMMENT '套餐名称',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    pay_method VARCHAR(20) DEFAULT NULL COMMENT '支付方式(wechat/alipay)',
    pay_time DATETIME DEFAULT NULL COMMENT '支付时间',
    status TINYINT DEFAULT 0 COMMENT '状态(0待支付/1已支付/2已取消/3已退款)',
    remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户订单表';

-- =============================================
-- 用户留言表 - 存储用户反馈留言
-- =============================================
CREATE TABLE IF NOT EXISTS t_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT DEFAULT NULL COMMENT '用户ID(可为空，支持匿名)',
    nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    contact VARCHAR(100) DEFAULT NULL COMMENT '联系方式',
    content TEXT NOT NULL COMMENT '留言内容',
    images VARCHAR(1000) DEFAULT NULL COMMENT '图片URL(JSON数组)',
    type VARCHAR(20) DEFAULT 'feedback' COMMENT '类型(feedback反馈/suggestion建议/bug问题)',
    status TINYINT DEFAULT 0 COMMENT '状态(0待处理/1已处理/2已回复)',
    reply TEXT DEFAULT NULL COMMENT '回复内容',
    reply_time DATETIME DEFAULT NULL COMMENT '回复时间',
    reply_by BIGINT DEFAULT NULL COMMENT '回复人ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户留言表';

-- =============================================
-- 修改用户表 - 添加手机号和微信号字段
-- =============================================
ALTER TABLE t_user ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL COMMENT '手机号' AFTER email;
ALTER TABLE t_user ADD COLUMN IF NOT EXISTS wechat VARCHAR(50) DEFAULT NULL COMMENT '微信号' AFTER phone;
ALTER TABLE t_user MODIFY COLUMN vip_level INT DEFAULT 0 COMMENT '会员等级(0普通/1普通会员/2黄金/3钻石)';

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_phone ON t_user(phone);
CREATE INDEX IF NOT EXISTS idx_user_wechat ON t_user(wechat);
