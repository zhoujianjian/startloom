-- =============================================
-- V5: 通用商品表 + 系统配置表
-- =============================================

-- 通用商品/服务表
CREATE TABLE IF NOT EXISTS `product` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `product_type` VARCHAR(30) NOT NULL COMMENT '商品类型: master_service-大师服务, vip_plan-VIP套餐, course-课程',
    `product_code` VARCHAR(50) DEFAULT '' COMMENT '商品编码',
    `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
    `subtitle` VARCHAR(200) DEFAULT '' COMMENT '副标题',
    `description` TEXT COMMENT '详细描述',
    `icon` VARCHAR(100) DEFAULT '' COMMENT '图标',
    `cover_image` VARCHAR(500) DEFAULT '' COMMENT '封面图片',
    `images` TEXT COMMENT '图片列表(JSON)',
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '现价',
    `original_price` DECIMAL(10,2) DEFAULT 0 COMMENT '原价',
    `cost_price` DECIMAL(10,2) DEFAULT 0 COMMENT '成本价',
    `currency` VARCHAR(10) DEFAULT 'CNY' COMMENT '货币',
    `stock` INT DEFAULT -1 COMMENT '库存: -1无限',
    `sales_count` INT DEFAULT 0 COMMENT '销量',
    `limit_per_user` INT DEFAULT 0 COMMENT '每人限购',
    `valid_days` INT DEFAULT 0 COMMENT '有效天数',
    `valid_start` DATETIME DEFAULT NULL,
    `valid_end` DATETIME DEFAULT NULL,
    `tag` VARCHAR(30) DEFAULT '' COMMENT '标签: hot/new/recommend',
    `group_code` VARCHAR(50) DEFAULT '' COMMENT '分组编码',
    `category_id` BIGINT DEFAULT 0,
    `extra` JSON COMMENT '扩展配置',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `is_recommend` TINYINT DEFAULT 0,
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-下架 1-上架',
    `create_by` VARCHAR(50) DEFAULT '',
    `update_by` VARCHAR(50) DEFAULT '',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_product_code` (`product_code`),
    KEY `idx_product_type` (`product_type`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通用商品表';

-- 通用配置表
CREATE TABLE IF NOT EXISTS `sys_config` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `config_group` VARCHAR(50) NOT NULL DEFAULT 'system' COMMENT '配置分组',
    `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
    `config_value` TEXT COMMENT '配置值',
    `config_type` VARCHAR(20) DEFAULT 'string' COMMENT '值类型',
    `config_name` VARCHAR(100) DEFAULT '' COMMENT '配置名称',
    `description` VARCHAR(500) DEFAULT '' COMMENT '说明',
    `default_value` VARCHAR(500) DEFAULT '' COMMENT '默认值',
    `options` TEXT COMMENT '可选值(JSON)',
    `sort_order` INT DEFAULT 0,
    `is_public` TINYINT DEFAULT 0 COMMENT '是否公开',
    `is_system` TINYINT DEFAULT 0 COMMENT '是否系统配置',
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_group_key` (`config_group`, `config_key`),
    KEY `idx_group` (`config_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 初始化大师服务商品
INSERT INTO `product` (`product_type`, `product_code`, `name`, `subtitle`, `icon`, `price`, `original_price`, `tag`, `sort_order`, `extra`) VALUES
('master_service', 'MS_BAZI', '八字精批', '详解命盘格局，分析一生运势', '📊', 199.00, 399.00, 'hot', 1, '{"delivery": "24小时内"}'),
('master_service', 'MS_HEHUN', '姻缘合婚', '双方八字合盘，婚姻吉凶预测', '💑', 299.00, 599.00, '', 2, '{"delivery": "48小时内"}'),
('master_service', 'MS_LIUNIAN', '流年运势', '2026年运势详批，把握关键时机', '📅', 99.00, 199.00, 'new', 3, '{"delivery": "12小时内"}'),
('master_service', 'MS_CAIYUN', '事业财运', '事业方向指引，财运旺衰分析', '💰', 168.00, 336.00, '', 4, '{"delivery": "24小时内"}');

-- 初始化大师服务配置
INSERT INTO `sys_config` (`config_group`, `config_key`, `config_value`, `config_type`, `config_name`, `is_public`, `is_system`, `sort_order`) VALUES
('master', 'banner_title', '命理疑惑？大师为您亲自解答', 'string', 'Banner标题', 1, 1, 1),
('master', 'banner_subtitle', '20年资深命理师，一对一深度解析，助您趋吉避凶', 'string', 'Banner副标题', 1, 1, 2),
('master', 'wechat_id', 'tianji_master', 'string', '微信号', 1, 1, 3),
('master', 'wechat_qrcode', '', 'image', '微信二维码', 1, 1, 4),
('master', 'consult_time', '9:00 - 22:00', 'string', '咨询时间', 1, 1, 5),
('master', 'discount_tip', '首次咨询可享 <strong>8折优惠</strong>', 'text', '优惠提示', 1, 1, 6),
('master', 'contact_tip', '添加时请备注「八字咨询」，优先回复', 'string', '添加提示', 1, 1, 7),
('master', 'trust_user_count', '10000+', 'string', '服务用户数', 1, 1, 10),
('master', 'trust_good_rate', '98%', 'string', '好评率', 1, 1, 11),
('master', 'trust_experience', '20年', 'string', '从业经验', 1, 1, 12),
('master', 'trust_service_time', '7×24h', 'string', '服务时间', 1, 1, 13);
