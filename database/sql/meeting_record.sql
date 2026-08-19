-- PostgreSQL
create table if not exists public.meeting_record (
  uuid uuid default gen_random_uuid() not null,
  room_uuid uuid not null,
  content text not null,
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp not null,
  primary key (uuid)
);

alter table public.meeting_record
add constraint meeting_record_room_uuid_fkey
foreign key (room_uuid)
references public.room (uuid)
on update cascade
on delete cascade;

insert into public.meeting_record (room_uuid, content) values
('00000000-0000-0000-0000-100000000001', '讨论本次会议的主要议题'),
('00000000-0000-0000-0000-100000000001', '确定下一步任务安排');
