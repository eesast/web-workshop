-- 创建用户表
CREATE TABLE "public"."user" (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建房间表
CREATE TABLE "public"."room" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_by INTEGER REFERENCES "public"."user"(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建用户-房间关联表（多对多关系）
CREATE TABLE "public"."user_room" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "public"."user"(id),
  room_id INTEGER NOT NULL REFERENCES "public"."room"(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, room_id)
);

-- 创建消息表
CREATE TABLE "public"."message" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES "public"."user"(id),
  room_id INTEGER NOT NULL REFERENCES "public"."room"(id),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);