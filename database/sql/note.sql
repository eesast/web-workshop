-- PostgreSQL
-- 第11讲作业（选项 C：会议便签纸）
-- 需求：用户可以为每个会议创建一张便签纸，便签纸仅自己可见。
--   * 每人每会议最多一张：由 UNIQUE(user_uuid, room_uuid) 保证
--   * 仅创建者本人可见：由 Hasura 权限层（session 变量 X-Hasura-User-Id）
--     控制，见 database/hasura/metadata/databases/workshop/tables/public_note.yaml
-- 本文件依赖 user.sql、room.sql 已先执行（外键引用 user、room）。
create table if not exists public.note (
  id uuid default gen_random_uuid() not null,
  user_uuid uuid not null,
  room_uuid uuid not null,
  content text not null,
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp not null,
  primary key (id),
  unique (user_uuid, room_uuid)
);
alter table public.note
add constraint note_user_uuid_fkey foreign key (user_uuid) references public.user (uuid) on update cascade on delete cascade;
alter table public.note
add constraint note_room_uuid_fkey foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade;

-- 触发器：修改便签内容时自动刷新 updated_at
create or replace function public.note_set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$;
create trigger trg_note_set_updated_at before update on public.note
for each row execute function public.note_set_updated_at();

insert into public.note (user_uuid, room_uuid, content) values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', '大家好，我是张三！这是咱们房间的便签纸。待办：今天 15:00 讨论暑培答辩分组。'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000001', '收到！我来准备演示用的投影和电脑。'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000001', '（王五）我负责记录会议纪要～'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000002', '（张三在聊天室1的私人便签）别忘了下周还书。'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '（赵六）成语接龙战绩存档：心安理得→得过且过→过目不忘。');
