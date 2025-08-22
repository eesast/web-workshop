-- 添加回复功能相关列和索引
ALTER TABLE public.message
ADD COLUMN IF NOT EXISTS parent_uuid uuid REFERENCES public.message(uuid);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_message_parent_uuid ON public.message(parent_uuid);