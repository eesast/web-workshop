import React, { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin, Mentions } from "antd";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Scroll, Text } from "./Components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const { Option } = Mentions;
interface ChatBoxProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}
type MessageType = graphql.GetMessagesByRoomSubscription["message"][0];
interface MessageFeedProps {
  user: user;
  messages: graphql.GetMessagesByRoomSubscription["message"] | undefined;
  showContext?: (e: React.MouseEvent, msg: MessageType) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, room, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data, error } = graphql.useGetMessagesByRoomSubscription({
    skip: !room,
    variables: {
      room_uuid: room?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取消息失败！");
    }
  }, [error]);

  const [addMessageMutation] = graphql.useAddMessageMutation();

  const handleSend = async () => {
    setLoading(true);
    if (!text) {
      message.error("消息不能为空！");
      return setLoading(false);
    }
    const result = await addMessageMutation({
      variables: {
        user_uuid: user?.uuid,
        room_uuid: room?.uuid,
        content: text,
      },
    });
    if (result.errors) {
      console.error(result.errors);
      message.error("发送消息失败！");
    }
    setText("");
    setLoading(false);
  };
  
  async function recallMessage(msg: any) {
    if (!user) return message.error("请先登录");
    if (!msg || !msg.user) return message.error("消息数据不完整");
    if (msg.user.uuid !== user.uuid) return message.error("只能撤回自己的消息");

    const raw = msg.created_at as string | undefined;
    let created = null;
    if (raw) {
      const fixed = raw.replace(/\.(\d{3})\d+$/, ".$1").replace(/(?<!Z)$/, "Z");
      created = dayjs.utc(fixed);
    }
    const now = dayjs.utc();
    const diffSeconds = created ? now.diff(created, "second") : 0;

    console.debug("recall debug", { uuid: msg.uuid, raw: msg.created_at, parsed: created && created.toISOString(), now: now.toISOString(), diffSeconds });

    if (created === null) {
    } else {
      if (diffSeconds < -5) {
        console.warn("服务器时间可能在未来（clock skew）", { diffSeconds });
      }
      if (diffSeconds > 120) return message.error("发送超过2分钟，不能撤回");
    }

    if (!window.confirm("确认撤回该条消息？")) return;

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(process.env.REACT_APP_HASURA_HTTPLINK!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-hasura-now": new Date().toISOString(),
        },
        body: JSON.stringify({
          query: `
            mutation RecallMessage($uuid: uuid!, $content: String!) {
              update_message_by_pk(pk_columns: {uuid: $uuid}, _set: {content: $content}) {
                uuid
              }
            }
          `,
          variables: { uuid: msg.uuid, content: "（此条消息已被撤回）" },
        }),
      });
      const j = await resp.json();
      if (j.errors) {
        console.error("recall errors:", j.errors);
        return message.error("撤回失败");
      }
      message.success("撤回成功");
    } catch (err) {
      console.error(err);
      message.error("撤回失败");
    }
  }

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

  const [ctxVisible, setCtxVisible] = useState(false);
  const [ctxX, setCtxX] = useState(0);
  const [ctxY, setCtxY] = useState(0);
  const [ctxMsg, setCtxMsg] = useState<any>(null);

  function openCtx(e: React.MouseEvent, msg: any) {
    e.preventDefault();
    e.stopPropagation();
    setCtxMsg(msg);
    setCtxX(e.clientX + window.pageXOffset);
    setCtxY(e.clientY + window.pageYOffset);
    setCtxVisible(true);
  }
  function closeCtx() {
    setCtxVisible(false);
    setCtxMsg(null);
  }
  async function onClickRecallFromCtx() {
    if (ctxMsg) {
      await recallMessage(ctxMsg);
    }
    closeCtx();
  }
  useEffect(() => {
    function onDocClick() { closeCtx(); }
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, []);
   
  if (!user || !room) {
    return null;
  }
  return (
    <Card style={{ width: "300px", height: "500px" }}>
      <Close />
      <Container style={{ margin: "6px" }}>
        <Text>
          <strong>{room.name}</strong>
        </Text>
        <Text size="small" style={{ marginTop: "6px", marginBottom: "6px" }}>
          {room.intro}
        </Text>
      </Container>

      <MessageFeed
        user={user}
        messages={data?.message}
        showContext= { openCtx  }
      />          
      {ctxVisible && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            top: ctxY,
            zIndex: 99999,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: 4,
            padding: 6,
            minWidth: 120,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "6px 8px", cursor: "pointer" }} onClick={onClickRecallFromCtx}>
            撤回
          </div>
        </div>
      )}

      <div
        className="need-interaction"
        style={{
          marginTop: "12px",
          display: "flex",
          width: "100%",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Mentions
          style={{ flex: 1, fontSize: 16 }}
          value={text}
          onChange={(v) => setText(v)}
          placeholder={user ? "输入消息，使用 @ 提及用户" : "请先登录"}
          disabled={!user}
          autoSize={{ minRows: 1, maxRows: 4 }}
        >
          {(() => {
            const setNames = new Set<string>();
            if (data?.message) {
              data.message.forEach((m) => {
                if (m?.user?.username) setNames.add(m.user.username);
                else if (m?.user?.uuid) setNames.add(m.user.uuid);
              });
            }
            if (user?.username) setNames.add(user.username);
            else if (user?.uuid) setNames.add(user.uuid);
            setNames.add("All");
            return Array.from(setNames).map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ));
          })()}
        </Mentions>
        <Button
          style={{ height: 40, fontSize: 18 }}
          onClick={handleSend}
          type="primary"
          loading={loading}
        >
          <strong>发送</strong>
        </Button>
      </div>

    </Card>
  );
};

interface MessageFeedProps {
  user: user;
  messages: graphql.GetMessagesByRoomSubscription["message"] | undefined;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ user, messages, showContext }) => { 
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Scroll>
      {messages ? (
        messages.map((message, index) => (
          <div
            ref={index === messages.length - 1 ? bottomRef : null}
            key={message.uuid || index}
          >
           
            <MessageBubble user={user} message={message} onContextMenu={showContext} />
          </div>
        ))
      ) : (
        <Container style={{ height: "100%" }}>
          <Spin size="large" />
        </Container>
      )}
    </Scroll>
  );
};

interface MessageBubbleProps {
  user: user;
  message: MessageType;
  onContextMenu?: (e: React.MouseEvent, msg: MessageType) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ user, message, onContextMenu }) => {
  const isSelf = user.uuid === message.user.uuid;
  const dateUTC = new Date(message.created_at);
  const date = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
  );
  const currentName = user.username || user.uuid;
  const mentionedForMe =
    !!message.content &&
    (message.content.includes("@All") || message.content.includes(`@${currentName}`));
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu && onContextMenu(e, message);
      }}
      style={{
        margin: "6px 0",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ marginLeft: "12px", marginRight: "12px" }}>
        <Text size="small">{message.user.username}</Text>
        <Text size="small" style={{ marginLeft: "6px" }}>
          {date.toLocaleString("zh-CN")}
        </Text>
      </div>
      {/* <Bubble
        style={{
          minHeight: "24px",
          width: "fit-content",
          maxWidth: "80%",
          backgroundColor: isSelf
            ? "rgba(4, 190, 2, 0.25)"
            : "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Text style={{ wordBreak: "break-all" }}>{message.content}</Text>
      </Bubble> */}
       <Bubble
        style={{
          minHeight: "24px",
          width: "fit-content",
          maxWidth: "80%",
          backgroundColor: isSelf ? "rgba(4, 190, 2, 0.25)" : "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Text
          style={{
            wordBreak: "break-all",
            fontSize: mentionedForMe ? 18 : undefined,
            color: mentionedForMe ? "red" : undefined,
            fontWeight: mentionedForMe ? 600 : undefined,
          }}
        >
          {message.content}
        </Text>
      </Bubble>
    </div>
  );
};

export default ChatBox;
