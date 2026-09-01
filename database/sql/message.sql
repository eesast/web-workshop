-- PostgreSQL
create table if not exists public.message (
  uuid uuid default gen_random_uuid() not null,
  user_uuid uuid not null,
  room_uuid uuid not null,
  content text not null,
  created_at timestamp default current_timestamp not null,
  reply_to uuid,
  primary key (uuid)
);
alter table public.message
add constraint message_user_uuid_fkey foreign key (user_uuid) references public.user (uuid) on update cascade on delete cascade;
alter table public.message
add constraint message_room_uuid_fkey foreign key (room_uuid) references public.room (uuid) on update cascade on delete cascade;
alter table public.message
add constraint message_reply_to_fkey foreign key (reply_to) references public.message (uuid) on update cascade on delete set null;
alter table public.message
add constraint message_no_self_reply check (reply_to is null or reply_to <> uuid);
alter table public.message
add constraint message_reply_to_unique unique (reply_to);

create or replace function public.check_message_reply() returns trigger as $$
begin
  if new.reply_to is not null then
    if exists (
      select 1 from public.message
      where uuid = new.reply_to and reply_to is not null
    ) then
      raise exception 'cannot reply to a reply (multi-level reply is not allowed)';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists message_reply_check on public.message;
create trigger message_reply_check
before insert or update of reply_to on public.message
for each row execute function public.check_message_reply();

insert into public.message (user_uuid, room_uuid, content) values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', '大家好，我叫张三'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000001', '大家好，我是李四'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000001', '大家好，叫我王五'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000001', '大家好，俺叫赵六'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000001', '今天天气真好'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000001', '吃了吗您'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000001', 'How are you'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', 'I am fine, thank you'),

('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000002', '这是我们俩的私聊哦'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000002', '好的'),

('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000003', '成语接龙：心安理得'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '得过且过'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000003', '过目不忘'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000003', '忘恩负义'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '义无反顾'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000003', '顾全大局'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000003', '局促不安'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '安然无恙'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000003', '恙无伤大'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000003', '大有可为'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '为民除害'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000003', '害人不浅'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000003', '浅尝辄止'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '止于至善'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '好了，今天就到这里吧');

update public.message set created_at = '2021-01-01 00:00:00' where room_uuid = '00000000-0000-0000-0000-100000000002';

insert into public.message (uuid, user_uuid, room_uuid, content) values
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', '有谁能听到我说话吗？');
insert into public.message (uuid, user_uuid, room_uuid, content, reply_to) values
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000001', '我能听到，怎么啦？', '00000000-0000-0000-0000-000000000101');
