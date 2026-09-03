alter table "public"."message"
  add constraint "message_reply_to_id_fkey"
  foreign key ("reply_to_id")
  references "public"."message"
  ("uuid") on update restrict on delete restrict;
