-- 创建用户表
CREATE TABLE IF NOT EXISTS public.user (
  uuid UUID DEFAULT gen_random_uuid() NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  PRIMARY KEY (uuid)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_username ON public.user(username);

-- 插入测试数据
INSERT INTO public.user (uuid, username, password) VALUES
('00000000-0000-0000-0000-000000000000', 'admin', 'admin123'),
('00000000-0000-0000-0000-000000000001', '张三', 'zhangsan123'),
('00000000-0000-0000-0000-000000000002', '李四', 'lisi123'),
('00000000-0000-0000-0000-000000000003', '王五', 'wangwu123'),
('00000000-0000-0000-0000-000000000004', '赵六', 'zhaoliu123')
ON CONFLICT (username) DO NOTHING;
