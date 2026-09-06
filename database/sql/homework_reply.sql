-- 作业三：聊天室消息支持回复之前的某条消息（单层回复）
-- 设计：给 message 增加可空的 reply_to 列，自引用 message.uuid。
-- 被回复的消息删除时 reply_to 置空，避免出现悬空引用。

alter table public.message
  add column if not exists reply_to uuid;

alter table public.message
  drop constraint if exists message_reply_to_fkey;

alter table public.message
  add constraint message_reply_to_fkey
  foreign key (reply_to) references public.message (uuid)
  on delete set null;
