-- PostgreSQL
create table if not exists public.note (
  user_uuid uuid not null,
  room_uuid uuid not null,
  content text default '' not null,
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp not null,
  primary key (user_uuid, room_uuid)
);
alter table public.note
add constraint note_user_uuid_fkey foreign key (user_uuid) references public.user (uuid) on update cascade on delete cascade;
alter table public.note
add constraint note_room_uuid_fkey foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade;

-- 触发器：自动维护 updated_at
create or replace function public.set_note_updated_at()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

drop trigger if exists note_set_updated_at on public.note;
create trigger note_set_updated_at
before update on public.note
for each row execute function public.set_note_updated_at();

insert into public.note (user_uuid, room_uuid, content) values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', '记得带钥匙'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000001', '明天交作业');
