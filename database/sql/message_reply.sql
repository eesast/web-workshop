alter table public.message
add column if not exists parent_uuid uuid;

alter table public.message
add constraint parent_uuid_fkey
foreign key (parent_uuid) references public.message(uuid)
on delete set null;
