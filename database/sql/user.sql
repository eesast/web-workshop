-- PostgreSQL
create table if not exists public.user (
  uuid uuid default gen_random_uuid() not null,
  username text not null unique,
  password text not null,
  primary key (uuid)
);

insert into public.user (uuid, username, password) values
('00000000-0000-0000-0000-000000000000', 'admin', md5('123456')),
('00000000-0000-0000-0000-000000000001', '张三', md5('张三')),
('00000000-0000-0000-0000-000000000002', '李四', md5('李四')),
('00000000-0000-0000-0000-000000000003', '王五', md5('王五')),
('00000000-0000-0000-0000-000000000004', '赵六', md5('赵六'));
