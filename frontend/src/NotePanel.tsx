import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Card, Container, Text } from "./Components";

// 便签纸（第11讲 C 的数据库设计 + 第13讲前端界面）
// 每个用户在某个会议只有一张便签，仅创建者本人可见（Hasura 权限由
// X-Hasura-User-Id 会话变量保证，本组件无需也不能指定 user_uuid）。
const GET_MY_NOTE = gql`
  query getMyNoteInRoom($room_uuid: uuid!) {
    note(where: { room_uuid: { _eq: $room_uuid } }) {
      id
      content
      created_at
      updated_at
    }
  }
`;

const CREATE_NOTE = gql`
  mutation createNote($room_uuid: uuid!, $content: String!) {
    insert_note_one(object: { room_uuid: $room_uuid, content: $content }) {
      id
      content
      updated_at
    }
  }
`;

const UPDATE_NOTE = gql`
  mutation updateNote($id: uuid!, $content: String!) {
    update_note_by_pk(pk_columns: { id: $id }, _set: { content: $content }) {
      id
      content
      updated_at
    }
  }
`;

const AUTO_SAVE_DELAY_MS = 1000;

type SaveStatus = "loading" | "empty" | "saving" | "saved" | "error";

interface NotePanelProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

interface NoteRow {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CreateNoteMutationResult {
  insert_note_one?: { id: string; content: string; updated_at: string } | null;
}
interface UpdateNoteMutationResult {
  update_note_by_pk?: { id: string; content: string; updated_at: string } | null;
}

const formatTime = (value?: string) => {
  if (!value) return "";
  const dateUTC = new Date(value);
  if (Number.isNaN(dateUTC.getTime())) return "";
  const date = new Date(dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000);
  return date.toLocaleString("zh-CN");
};

const NotePanel: React.FC<NotePanelProps> = ({ user, room, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [lastSavedAt, setLastSavedAt] = useState<string>("");

  const initialized = useRef(false);
  const saveTimer = useRef<number | null>(null);
  const saveInFlight = useRef(false);
  const textRef = useRef<string>("");
  textRef.current = text;
  const noteIdRef = useRef<string | null>(null);
  noteIdRef.current = noteId;

  const { data, loading: queryLoading, error: queryError } = useQuery<
    { note: NoteRow[] },
    { room_uuid: string }
  >(GET_MY_NOTE, {
    skip: !room,
    variables: { room_uuid: room?.uuid ?? "" },
    fetchPolicy: "network-only",
  });

  const [createNoteMutation] = useMutation<
    CreateNoteMutationResult,
    { room_uuid: string; content: string }
  >(CREATE_NOTE);
  const [updateNoteMutation] = useMutation<
    UpdateNoteMutationResult,
    { id: string; content: string }
  >(UPDATE_NOTE);

  // 初次加载：从服务器读取自己在该会议的便签（若有）
  const remoteNote = data?.note?.[0];
  useEffect(() => {
    if (!queryLoading && !initialized.current) {
      initialized.current = true;
      if (remoteNote) {
        setNoteId(remoteNote.id);
        setText(remoteNote.content ?? "");
        setLastSavedAt(remoteNote.updated_at);
        setStatus("saved");
      } else {
        setStatus("empty");
      }
    }
  }, [queryLoading, remoteNote]);

  useEffect(() => {
    if (queryError) {
      console.error(queryError);
      message.error("获取便签失败！");
      setStatus("error");
    }
  }, [queryError]);

  // 卸载时清理未触发的自动保存定时器
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, []);

  const doSave = async () => {
    if (!room || saveInFlight.current) return;
    const content = textRef.current;
    const existingId = noteIdRef.current;
    // 尚未创建便签且内容为空 -> 无需保存
    if (!existingId && content.trim() === "") {
      setStatus("empty");
      return;
    }
    saveInFlight.current = true;
    setStatus("saving");
    try {
      if (existingId) {
        const result = await updateNoteMutation({
          variables: { id: existingId, content },
        });
        if (!result.data?.update_note_by_pk) {
          throw new Error("update returned empty result");
        }
        setLastSavedAt(result.data.update_note_by_pk.updated_at);
      } else {
        const result = await createNoteMutation({
          variables: { room_uuid: room.uuid, content },
        });
        if (!result.data?.insert_note_one) {
          throw new Error("create returned empty result");
        }
        const newId = result.data.insert_note_one.id;
        setNoteId(newId);
        setLastSavedAt(result.data.insert_note_one.updated_at);
      }
      setStatus("saved");
    } catch (err) {
      console.error(err);
      message.error("保存便签失败！");
      setStatus("error");
    } finally {
      saveInFlight.current = false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    // 已有便签（即使清空也要保存）；或已有内容待创建 -> 进入“待保存”
    const shouldSave = noteIdRef.current !== null || value.trim() !== "";
    setStatus(shouldSave ? "saving" : "empty");
    saveTimer.current = window.setTimeout(() => {
      void doSave();
    }, AUTO_SAVE_DELAY_MS);
  };

  const handleBlur = () => {
    // 失焦立即保存，避免关窗丢内容
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    void doSave();
  };

  const Close = () => (
    <Button
      type="link"
      style={{
        width: "40px",
        height: "40px",
        fontSize: "12px",
        position: "absolute",
        right: 0,
        top: 0,
      }}
      className="need-interaction"
      onClick={handleClose}
    >
      ❌
    </Button>
  );

  if (!user || !room) {
    return null;
  }

  const statusText: Record<SaveStatus, string> = {
    loading: "",
    empty: "还没有便签，输入内容后会自动创建（仅自己可见）",
    saving: "正在自动保存…",
    saved: `已自动保存于 ${formatTime(lastSavedAt)}`,
    error: "保存失败，修改后会重试",
  };

  return (
    <Card style={{ width: "300px", height: "500px" }}>
      <Close />
      <Container style={{ margin: "6px" }}>
        <Text>
          <strong>{room.name}</strong>
        </Text>
        <Text size="small" style={{ marginTop: "6px", marginBottom: "6px" }}>
          便签纸 · 仅自己可见
        </Text>
      </Container>
      {queryLoading ? (
        <Container style={{ height: "60%" }}>
          <Spin size="large" />
        </Container>
      ) : (
        <>
          <div className="need-interaction" style={{ flex: 1, width: "100%" }}>
            <Input.TextArea
              value={text}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="记录这个会议的要点、待办……"
              autoSize={{ minRows: 10, maxRows: 18 }}
              style={{ fontSize: "16px", background: "rgba(255,255,255,0.35)" }}
            />
          </div>
          <Container style={{ margin: "6px" }}>
            <Text size="small" style={{ color: status === "error" ? "#cf1322" : "#888" }}>
              {queryLoading ? "" : statusText[status]}
            </Text>
          </Container>
        </>
      )}
    </Card>
  );
};

export default NotePanel;
