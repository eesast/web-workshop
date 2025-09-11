-- PostgreSQL
create table if not exists public.room (
  uuid uuid default gen_random_uuid() not null,
  name text not null unique,
  intro text not null,
  invite_code text not null unique,
  created_at timestamp default current_timestamp not null,
  primary key (uuid)
);

insert into public.room (uuid, name, intro, invite_code) values
('00000000-0000-0000-0000-100000000001', '公共聊天室', '欢迎加入公共聊天室', 'gD9jE4'),
('00000000-0000-0000-0000-100000000002', '聊天室1', '这是一个聊天室', 'oC3kY5'),
('00000000-0000-0000-0000-100000000003', '聊天室2', '这是一个聊天室', 'uE8aY9'),
('00000000-0000-0000-0000-100000000004', '聊天室3', '这是一个聊天室', 'aF2jR6');
