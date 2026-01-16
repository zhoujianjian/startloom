-- 手动执行的定时任务脚本（Flyway不支持DELIMITER语法）
-- 请在MySQL客户端中手动执行此脚本

-- 1. 首先开启事件调度器
SET GLOBAL event_scheduler = ON;

-- 2. 创建清理过期会话的定时任务（每10分钟执行）
DROP EVENT IF EXISTS clean_expired_sessions;
CREATE EVENT clean_expired_sessions
ON SCHEDULE EVERY 10 MINUTE
DO DELETE FROM online_session WHERE last_active < DATE_SUB(NOW(), INTERVAL 30 MINUTE);

-- 3. 创建清理过期日志的定时任务（每天凌晨3点执行，保留7天）
DROP EVENT IF EXISTS clean_old_event_logs;
CREATE EVENT clean_old_event_logs
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 3 HOUR
DO DELETE FROM event_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 4. 查看已创建的事件
SHOW EVENTS;
