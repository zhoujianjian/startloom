-- 添加手机号和微信号字段到用户表
ALTER TABLE t_user ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL COMMENT '手机号';
ALTER TABLE t_user ADD COLUMN IF NOT EXISTS wechat VARCHAR(50) DEFAULT NULL COMMENT '微信号';

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_phone ON t_user(phone);
CREATE INDEX IF NOT EXISTS idx_user_wechat ON t_user(wechat);
