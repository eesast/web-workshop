-- 每个用户在每个会议中最多拥有一张私有便签
create table if not exists public.note (
  uuid uuid default gen_random_uuid() not null,
  user_uuid uuid not null,
  room_uuid uuid not null,
  content text not null default '',
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp not null,
  primary key (uuid),
  unique (user_uuid, room_uuid),
  foreign key (user_uuid) references public.user (uuid) on update cascade on delete cascade,
  foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade
);
