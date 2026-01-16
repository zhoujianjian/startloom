-- 给用户表添加角色字段

-- 添加 role 字段
-- 注意：如果字段已存在会报错，可以忽略或先检查
ALTER TABLE t_user ADD COLUMN role VARCHAR(20) DEFAULT 'user' COMMENT '用户角色: user-普通用户, admin-管理员';

-- 创建管理员账号的方法：
-- 方法1：先正常注册一个账号，然后执行：
-- UPDATE t_user SET role = 'admin' WHERE email = '你的邮箱' OR phone = '你的手机号';

-- 方法2：直接插入（密码需要用BCrypt加密）
-- 可以在Java中用 BCrypt.hashpw("你的密码") 生成加密密码
-- INSERT INTO t_user (email, password, nickname, role) 
-- VALUES ('admin@example.com', '加密后的密码', '管理员', 'admin');
