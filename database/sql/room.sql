-- 创建房间表
CREATE TABLE IF NOT EXISTS public.room (
  uuid UUID DEFAULT gen_random_uuid() NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  creator UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (uuid),
  FOREIGN KEY (creator) REFERENCES public.user(uuid) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_room_creator ON public.room(creator);
CREATE INDEX IF NOT EXISTS idx_room_created_at ON public.room(created_at);

-- 插入测试数据
INSERT INTO public.room (uuid, name, description, creator) VALUES
('10000000-0000-0000-0000-000000000000', '项目讨论会', '讨论新项目的开发计划', '00000000-0000-0000-0000-000000000000'),
('10000000-0000-0000-0000-000000000001', '技术分享会', '分享最新的技术趋势', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000002', '团队建设', '增进团队凝聚力', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (uuid) DO NOTHING;
