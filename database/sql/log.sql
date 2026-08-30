-- PostgreSQL
-- 依赖 room.sql 先执行
-- 会议记录：一个会议可以有多条记录，记录没有创建者
create table if not exists public.log (
  uuid uuid default gen_random_uuid() not null,
  room_uuid uuid not null,
  content text not null,
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp not null,
  primary key (uuid)
);
alter table public.log
add constraint log_room_uuid_fkey foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade;

-- updated_at 自动更新触发器（与 sticker.sql 中的定义相同，重复执行无副作用）
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

drop trigger if exists log_set_updated_at on public.log;
create trigger log_set_updated_at
before update on public.log
for each row execute function public.set_updated_at();

insert into public.log (room_uuid, content) values
('00000000-0000-0000-0000-100000000001', '会议记录：今天讨论了项目进度'),
('00000000-0000-0000-0000-100000000002', '会议记录：确定了下次会议时间');
