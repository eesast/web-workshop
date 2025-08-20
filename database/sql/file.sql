-- 创建文件表
CREATE TABLE IF NOT EXISTS public.file (
  uuid UUID DEFAULT gen_random_uuid() NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  filesize INTEGER NOT NULL CHECK (filesize > 0),
  filetype TEXT NOT NULL,
  uploader UUID NOT NULL,
  room UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (uuid),
  FOREIGN KEY (uploader) REFERENCES public.user(uuid) ON DELETE CASCADE,
  FOREIGN KEY (room) REFERENCES public.room(uuid) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_file_room ON public.file(room);
CREATE INDEX IF NOT EXISTS idx_file_uploader ON public.file(uploader);
CREATE INDEX IF NOT EXISTS idx_file_created_at ON public.file(created_at);

-- 插入测试数据
INSERT INTO public.file (filename, filepath, filesize, filetype, uploader, room) VALUES
('项目计划书.pdf', 'uploads/project-plan.pdf', 1024000, 'application/pdf', '00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000000'),
('技术文档.docx', 'uploads/tech-doc.docx', 512000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
('会议记录.txt', 'uploads/meeting-notes.txt', 2048, 'text/plain', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000000'),
('团队照片.jpg', 'uploads/team-photo.jpg', 2048000, 'image/jpeg', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002');
