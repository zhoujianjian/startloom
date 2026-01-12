-- =============================================
-- 支付配置表 - 存储支付方式配置
-- =============================================
CREATE TABLE IF NOT EXISTS t_payment_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type VARCHAR(20) DEFAULT 'string' COMMENT '配置类型(string/json/boolean)',
    description VARCHAR(200) COMMENT '配置说明',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付配置表';

-- 初始化支付配置
INSERT INTO t_payment_config (config_key, config_value, config_type, description) VALUES
-- 支付模式: qrcode(个人收款码) / official(正式商户)
('payment_mode', 'qrcode', 'string', '支付模式: qrcode-个人收款码, official-正式商户'),

-- 个人收款码配置
('qrcode_wechat', '', 'string', '微信个人收款码图片URL'),
('qrcode_alipay', '', 'string', '支付宝个人收款码图片URL'),
('qrcode_enabled_wechat', 'true', 'boolean', '是否启用微信收款码'),
('qrcode_enabled_alipay', 'true', 'boolean', '是否启用支付宝收款码'),

-- 正式商户配置 - 微信支付
('wxpay_enabled', 'false', 'boolean', '是否启用微信支付'),
('wxpay_appid', '', 'string', '微信支付AppID'),
('wxpay_mchid', '', 'string', '微信支付商户号'),
('wxpay_api_key', '', 'string', '微信支付API密钥'),
('wxpay_notify_url', '', 'string', '微信支付回调地址'),

-- 正式商户配置 - 支付宝
('alipay_enabled', 'false', 'boolean', '是否启用支付宝'),
('alipay_appid', '', 'string', '支付宝AppID'),
('alipay_private_key', '', 'string', '支付宝应用私钥'),
('alipay_public_key', '', 'string', '支付宝公钥'),
('alipay_notify_url', '', 'string', '支付宝回调地址'),

-- 通知配置
('notify_email', '', 'string', '订单通知邮箱'),
('notify_qq', '', 'string', '订单通知QQ号'),
('notify_enabled', 'true', 'boolean', '是否启用订单通知');

-- =============================================
-- 修改订单表 - 添加支付相关字段
-- =============================================
ALTER TABLE t_order ADD COLUMN IF NOT EXISTS pay_type VARCHAR(20) DEFAULT NULL COMMENT '支付类型(wechat/alipay)' AFTER pay_method;
ALTER TABLE t_order ADD COLUMN IF NOT EXISTS pay_mode VARCHAR(20) DEFAULT NULL COMMENT '支付模式(qrcode/official)' AFTER pay_type;
ALTER TABLE t_order ADD COLUMN IF NOT EXISTS trade_no VARCHAR(64) DEFAULT NULL COMMENT '第三方交易号' AFTER pay_mode;
ALTER TABLE t_order ADD COLUMN IF NOT EXISTS user_remark VARCHAR(200) DEFAULT NULL COMMENT '用户备注(如转账备注)' AFTER remark;
ALTER TABLE t_order ADD COLUMN IF NOT EXISTS admin_remark VARCHAR(200) DEFAULT NULL COMMENT '管理员备注' AFTER user_remark;
ALTER TABLE t_order ADD COLUMN IF NOT EXISTS confirm_time DATETIME DEFAULT NULL COMMENT '确认时间' AFTER pay_time;
ALTER TABLE t_order ADD COLUMN IF NOT EXISTS confirm_by VARCHAR(50) DEFAULT NULL COMMENT '确认人(admin/system)' AFTER confirm_time;
