-- PostgreSQL
-- 依赖 user.sql、room.sql 先执行
-- 便签纸：每个用户在每个会议中可以创建一个便签纸，仅自己可见
-- （可见性由 Hasura 的行级权限控制，如 filter: {user_uuid: {_eq: X-Hasura-User-Id}}）
create table if not exists public.sticker (
  uuid uuid default gen_random_uuid() not null,
  user_uuid uuid not null,
  room_uuid uuid not null,
  content text not null,
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp not null,
  primary key (uuid),
  -- 每个用户在每个会议中只有一个便签纸，同时便于 upsert
  constraint sticker_user_uuid_room_uuid_key unique (user_uuid, room_uuid)
);
alter table public.sticker
add constraint sticker_user_uuid_fkey foreign key (user_uuid) references public.user (uuid) on update cascade on delete cascade;
alter table public.sticker
add constraint sticker_room_uuid_fkey foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade;

-- updated_at 自动更新触发器（与 log.sql 中的定义相同，重复执行无副作用）
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

drop trigger if exists sticker_set_updated_at on public.sticker;
create trigger sticker_set_updated_at
before update on public.sticker
for each row execute function public.set_updated_at();

insert into public.sticker (user_uuid, room_uuid, content) values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', '张三的便签：记得预习下一节'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000001', '李四的便签：带上作业');
