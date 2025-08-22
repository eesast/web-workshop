ALTER TABLE public.user
ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.user
ADD CONSTRAINT unique_user_email UNIQUE (email);

UPDATE public.user SET email = 'lch24@mails.tsinghua.edu.cn' WHERE username = '张三';