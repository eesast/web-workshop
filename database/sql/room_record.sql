-- PostgreSQL
create table if not exists public.room_record (
  uuid uuid default gen_random_uuid() not null,
  room_uuid uuid not null,
  content text not null,
  created_at timestamp with time zone default current_timestamp not null,
  updated_at timestamp with time zone default current_timestamp not null,
  primary key (uuid),
  constraint room_record_room_uuid_fkey
    foreign key (room_uuid)
    references public.room (uuid)
    on update cascade
    on delete cascade
);

create or replace function public.update_room_record_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$;

drop trigger if exists room_record_set_updated_at on public.room_record;

create trigger room_record_set_updated_at
before update on public.room_record
for each row
execute function public.update_room_record_updated_at();
