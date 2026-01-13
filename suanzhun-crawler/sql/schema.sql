-- 文章爬虫数据库表结构
-- 数据库: starloom

-- 1. 分类表（支持多级分类）
CREATE TABLE IF NOT EXISTS `category` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `parent_id` BIGINT DEFAULT 0 COMMENT '父分类ID，0表示顶级分类',
    `parent_name` VARCHAR(100) DEFAULT '' COMMENT '父分类名称(冗余)',
    `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
    `full_name` VARCHAR(200) DEFAULT '' COMMENT '完整分类路径，如: 基础/术语',
    `slug` VARCHAR(100) NOT NULL COMMENT '分类标识/URL路径',
    `icon` VARCHAR(200) DEFAULT '' COMMENT '分类图标',
    `description` VARCHAR(500) DEFAULT '' COMMENT '分类描述',
    `level` TINYINT DEFAULT 1 COMMENT '层级: 1-大分类 2-小分类',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `article_count` INT DEFAULT 0 COMMENT '文章数量(冗余)',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
    `create_by` VARCHAR(50) DEFAULT '' COMMENT '创建人',
    `update_by` VARCHAR(50) DEFAULT '' COMMENT '修改人',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_level` (`level`),
    KEY `idx_status` (`status`),
    UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章分类';

-- 2. 文章表（冗余分类信息，单表查询）
CREATE TABLE IF NOT EXISTS `article` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `category_id` BIGINT DEFAULT 0 COMMENT '分类ID',
    `category_name` VARCHAR(100) DEFAULT '' COMMENT '分类名称(冗余)',
    `parent_category_id` BIGINT DEFAULT 0 COMMENT '父分类ID(冗余)',
    `parent_category_name` VARCHAR(100) DEFAULT '' COMMENT '父分类名称(冗余)',
    `full_category` VARCHAR(200) DEFAULT '' COMMENT '完整分类路径(冗余)',
    `title` VARCHAR(500) NOT NULL COMMENT '文章标题',
    `summary` TEXT COMMENT '文章摘要',
    `content` LONGTEXT COMMENT '文章内容(纯文本)',
    `content_html` LONGTEXT COMMENT '原始HTML内容',
    `author` VARCHAR(100) DEFAULT '' COMMENT '作者',
    `tags` VARCHAR(500) DEFAULT '' COMMENT '标签(冗余)，逗号分隔',
    `source` VARCHAR(100) DEFAULT '' COMMENT '来源网站名称',
    `source_url` VARCHAR(500) NOT NULL COMMENT '原文链接',
    `cover_image` VARCHAR(500) DEFAULT '' COMMENT '封面图片',
    `images` TEXT COMMENT '文章图片列表(JSON)',
    `word_count` INT DEFAULT 0 COMMENT '字数',
    `publish_time` DATETIME COMMENT '原文发布时间',
    `view_count` INT DEFAULT 0 COMMENT '浏览量',
    `like_count` INT DEFAULT 0 COMMENT '点赞数',
    `collect_count` INT DEFAULT 0 COMMENT '收藏数',
    `comment_count` INT DEFAULT 0 COMMENT '评论数',
    `is_top` TINYINT DEFAULT 0 COMMENT '是否置顶: 0-否 1-是',
    `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐: 0-否 1-是',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-草稿 1-已发布 2-已删除',
    `crawl_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '爬取时间',
    `create_by` VARCHAR(50) DEFAULT '' COMMENT '创建人',
    `update_by` VARCHAR(50) DEFAULT '' COMMENT '修改人',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    UNIQUE KEY `uk_source_url` (`source_url`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_parent_category_id` (`parent_category_id`),
    KEY `idx_publish_time` (`publish_time`),
    KEY `idx_status` (`status`),
    KEY `idx_is_top` (`is_top`),
    KEY `idx_is_recommend` (`is_recommend`),
    KEY `idx_created_at` (`created_at`),
    FULLTEXT KEY `ft_title_content` (`title`, `content`) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='爬取文章';

-- 3. 标签表
CREATE TABLE IF NOT EXISTS `tag` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL COMMENT '标签名',
    `article_count` INT DEFAULT 0 COMMENT '文章数量(冗余)',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
    `create_by` VARCHAR(50) DEFAULT '' COMMENT '创建人',
    `update_by` VARCHAR(50) DEFAULT '' COMMENT '修改人',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    UNIQUE KEY `uk_name` (`name`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签';

-- =============================================
-- 4. 通用商品/服务表（高扩展设计）
-- 支持: 大师服务、VIP套餐、虚拟商品、课程等
-- =============================================
CREATE TABLE IF NOT EXISTS `product` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `product_type` VARCHAR(30) NOT NULL COMMENT '商品类型: master_service-大师服务, vip_plan-VIP套餐, course-课程, virtual-虚拟商品',
    `product_code` VARCHAR(50) DEFAULT '' COMMENT '商品编码(唯一标识，可用于业务逻辑)',
    `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
    `subtitle` VARCHAR(200) DEFAULT '' COMMENT '副标题/简短描述',
    `description` TEXT COMMENT '详细描述',
    `icon` VARCHAR(100) DEFAULT '' COMMENT '图标(emoji或图片URL)',
    `cover_image` VARCHAR(500) DEFAULT '' COMMENT '封面图片',
    `images` TEXT COMMENT '商品图片列表(JSON数组)',
    
    -- 价格相关
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '现价(分转元)',
    `original_price` DECIMAL(10,2) DEFAULT 0 COMMENT '原价(划线价)',
    `cost_price` DECIMAL(10,2) DEFAULT 0 COMMENT '成本价',
    `currency` VARCHAR(10) DEFAULT 'CNY' COMMENT '货币类型',
    
    -- 库存相关（虚拟商品可设为-1表示无限）
    `stock` INT DEFAULT -1 COMMENT '库存: -1无限, 0售罄, >0有限',
    `sales_count` INT DEFAULT 0 COMMENT '销量(冗余)',
    `limit_per_user` INT DEFAULT 0 COMMENT '每人限购: 0不限',
    
    -- 有效期相关（VIP/课程等）
    `valid_days` INT DEFAULT 0 COMMENT '有效天数: 0永久',
    `valid_start` DATETIME DEFAULT NULL COMMENT '生效开始时间',
    `valid_end` DATETIME DEFAULT NULL COMMENT '生效结束时间',
    
    -- 标签与分组
    `tag` VARCHAR(30) DEFAULT '' COMMENT '角标: hot-热门, new-新品, recommend-推荐, limited-限时',
    `group_code` VARCHAR(50) DEFAULT '' COMMENT '分组编码(用于前端展示分组)',
    `category_id` BIGINT DEFAULT 0 COMMENT '关联分类ID',
    
    -- 扩展字段（JSON存储灵活配置）
    `extra` JSON COMMENT '扩展配置(JSON): 如VIP权益、服务内容等',
    
    -- 排序与状态
    `sort_order` INT DEFAULT 0 COMMENT '排序(越小越前)',
    `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐: 0-否 1-是',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-下架 1-上架 2-预售',
    
    -- 审计字段
    `create_by` VARCHAR(50) DEFAULT '' COMMENT '创建人',
    `update_by` VARCHAR(50) DEFAULT '' COMMENT '修改人',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY `uk_product_code` (`product_code`),
    KEY `idx_product_type` (`product_type`),
    KEY `idx_group_code` (`group_code`),
    KEY `idx_status` (`status`),
    KEY `idx_sort` (`sort_order`),
    KEY `idx_type_status` (`product_type`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通用商品/服务表';

-- =============================================
-- 5. 通用配置表（合并支付配置、系统配置）
-- 通过 config_group 分组管理不同业务配置
-- =============================================
CREATE TABLE IF NOT EXISTS `sys_config` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `config_group` VARCHAR(50) NOT NULL DEFAULT 'system' COMMENT '配置分组: system-系统, payment-支付, master-大师服务, site-站点, seo-SEO',
    `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
    `config_value` TEXT COMMENT '配置值',
    `config_type` VARCHAR(20) DEFAULT 'string' COMMENT '值类型: string, number, boolean, json, text, image',
    `config_name` VARCHAR(100) DEFAULT '' COMMENT '配置名称(中文)',
    `description` VARCHAR(500) DEFAULT '' COMMENT '配置说明',
    `default_value` VARCHAR(500) DEFAULT '' COMMENT '默认值',
    `options` TEXT COMMENT '可选值(JSON数组，用于下拉选择)',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `is_public` TINYINT DEFAULT 0 COMMENT '是否公开(前端可读): 0-否 1-是',
    `is_system` TINYINT DEFAULT 0 COMMENT '是否系统配置(不可删除): 0-否 1-是',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY `uk_group_key` (`config_group`, `config_key`),
    KEY `idx_group` (`config_group`),
    KEY `idx_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通用配置表';

-- =============================================
-- 初始化商品数据 - 大师服务
-- =============================================
INSERT INTO `product` (`product_type`, `product_code`, `name`, `subtitle`, `description`, `icon`, `price`, `original_price`, `tag`, `sort_order`, `extra`) VALUES
('master_service', 'MS_BAZI', '八字精批', '详解命盘格局，分析一生运势', '资深命理师亲自批断，包含：命盘格局分析、五行喜忌、大运流年、事业财运、婚姻感情、健康运势等全方位解读。', '📊', 199.00, 399.00, 'hot', 1, '{"delivery": "24小时内", "format": "图文报告+语音解读"}'),
('master_service', 'MS_HEHUN', '姻缘合婚', '双方八字合盘，婚姻吉凶预测', '分析双方八字契合度，包含：五行互补、生肖配对、日柱合婚、婚姻宫位、子女缘分等深度解析。', '💑', 299.00, 599.00, '', 2, '{"delivery": "48小时内", "format": "图文报告"}'),
('master_service', 'MS_LIUNIAN', '流年运势', '2026年运势详批，把握关键时机', '详批来年运势走向，包含：整体运势、每月运程、事业机遇、财运起伏、感情变化、注意事项。', '📅', 99.00, 199.00, 'new', 3, '{"delivery": "12小时内", "format": "图文报告"}'),
('master_service', 'MS_CAIYUN', '事业财运', '事业方向指引，财运旺衰分析', '专项分析事业财运，包含：适合行业、发展方向、贵人方位、求财时机、投资建议。', '💰', 168.00, 336.00, '', 4, '{"delivery": "24小时内", "format": "图文报告"}'),
('master_service', 'MS_QIMING', '宝宝起名', '结合八字五行，起个好名字', '根据宝宝生辰八字，结合五行喜用、音韵美感、寓意内涵，提供3-5个精选名字方案。', '👶', 299.00, 599.00, 'recommend', 5, '{"delivery": "48小时内", "format": "起名报告+备选方案"}'),
('master_service', 'MS_ZEJI', '择吉选日', '婚嫁开业，选个好日子', '根据当事人八字，结合黄历吉凶，为婚嫁、开业、搬家、动土等重要事项选择吉日良辰。', '📆', 88.00, 168.00, '', 6, '{"delivery": "12小时内", "format": "吉日报告"}');

-- =============================================
-- 初始化配置数据 - 大师服务相关
-- =============================================
INSERT INTO `sys_config` (`config_group`, `config_key`, `config_value`, `config_type`, `config_name`, `description`, `is_public`, `is_system`, `sort_order`) VALUES
-- 大师服务配置
('master', 'banner_title', '命理疑惑？大师为您亲自解答', 'string', 'Banner标题', '大师服务区域的主标题', 1, 1, 1),
('master', 'banner_subtitle', '20年资深命理师，一对一深度解析，助您趋吉避凶', 'string', 'Banner副标题', '大师服务区域的副标题', 1, 1, 2),
('master', 'wechat_id', 'tianji_master', 'string', '微信号', '大师咨询微信号', 1, 1, 3),
('master', 'wechat_qrcode', '', 'image', '微信二维码', '大师微信二维码图片URL', 1, 1, 4),
('master', 'consult_time', '9:00 - 22:00', 'string', '咨询时间', '在线咨询时间段', 1, 1, 5),
('master', 'discount_tip', '首次咨询可享 <strong>8折优惠</strong>', 'text', '优惠提示', '弹窗底部优惠提示文案', 1, 1, 6),
('master', 'contact_tip', '添加时请备注「八字咨询」，优先回复', 'string', '添加提示', '添加微信时的提示语', 1, 1, 7),

-- 信任背书数据
('master', 'trust_user_count', '10000+', 'string', '服务用户数', '已服务用户数量', 1, 1, 10),
('master', 'trust_good_rate', '98%', 'string', '好评率', '用户好评率', 1, 1, 11),
('master', 'trust_experience', '20年', 'string', '从业经验', '大师从业年限', 1, 1, 12),
('master', 'trust_service_time', '7×24h', 'string', '服务时间', '在线服务时间', 1, 1, 13),

-- 站点基础配置
('site', 'site_name', '天机命理', 'string', '站点名称', '网站名称', 1, 1, 1),
('site', 'site_logo', '', 'image', '站点Logo', '网站Logo图片URL', 1, 1, 2),
('site', 'site_description', '传承千年易学智慧，专业八字命理服务', 'text', '站点描述', '网站描述，用于SEO', 1, 1, 3),
('site', 'site_keywords', '八字,命理,算命,运势,合婚', 'string', '站点关键词', '网站关键词，逗号分隔', 1, 1, 4),
('site', 'icp_number', '', 'string', 'ICP备案号', '网站ICP备案号', 1, 0, 5),
('site', 'contact_email', '', 'string', '联系邮箱', '网站联系邮箱', 1, 0, 6),

-- 功能开关
('system', 'master_service_enabled', 'true', 'boolean', '大师服务开关', '是否显示大师服务模块', 1, 1, 1),
('system', 'article_comment_enabled', 'false', 'boolean', '文章评论开关', '是否开启文章评论功能', 1, 1, 2),
('system', 'user_register_enabled', 'true', 'boolean', '用户注册开关', '是否允许新用户注册', 0, 1, 3);

