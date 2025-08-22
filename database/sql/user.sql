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


const { ValidationError } = require('graphql-errors');

async function createUser(parent, args, context, info) {
  // 验证用户名长度
  if (args.data.username.length < 3 || args.data.username.length > 30) {
    throw new ValidationError('Username must be between 3 and 30 characters');
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(args.data.email)) {
    throw new ValidationError('Invalid email format');
  }

  // 调用原始mutation
  return context.hasura.mutation.createUser({...args.data});
}
