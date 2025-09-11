SET check_function_bodies = false;
CREATE TABLE public.message (
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    user_uuid uuid NOT NULL,
    room_uuid uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reply_to_uuid uuid
);
CREATE TABLE public.room (
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    intro text NOT NULL,
    invite_code text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE public."user" (
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);
CREATE TABLE public.user_room (
    user_uuid uuid NOT NULL,
    room_uuid uuid NOT NULL
);
ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_invite_code_key UNIQUE (invite_code);
ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_name_key UNIQUE (name);
ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.user_room
    ADD CONSTRAINT user_room_pkey PRIMARY KEY (user_uuid, room_uuid);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);
ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_room_uuid_fkey FOREIGN KEY (room_uuid) REFERENCES public.room(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES public."user"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_room
    ADD CONSTRAINT user_room_room_uuid_fkey FOREIGN KEY (room_uuid) REFERENCES public.room(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_room
    ADD CONSTRAINT user_room_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES public."user"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
