create table if not exists public.note (
  user_uuid  uuid   not null,
  room_uuid  uuid   not null,
  content    text   not null,
  created_at timestamp default current_timestamp not null,
  primary key (user_uuid, room_uuid),
  foreign key (user_uuid) references public.user (uuid) on update cascade on delete cascade,
  foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade
);
