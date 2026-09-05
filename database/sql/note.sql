-- PostgreSQL
create table if not exists public.note (
  uuid uuid default gen_random_uuid() not null,
  room_uuid uuid not null,
  content text not null default '',
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp not null,
  primary key (uuid),
  foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade
);

-- 自动更新 updated_at 的触发器
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$;

drop trigger if exists note_set_updated_at on public.note;
create trigger note_set_updated_at
before update on public.note
for each row execute function public.set_updated_at();
