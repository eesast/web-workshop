import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Link, Scroll, Text } from "./Components";

type Message = graphql.GetMessagesByRoomSubscription["message"][0];

interface ChatBoxProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, room, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

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
        reply_to_id: replyTo?.uuid,
      },
    });
    if (result.errors) {
      console.error(result.errors);
      message.error("发送消息失败！");
    }
    setText("");
    setReplyTo(null);
    setLoading(false);
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
      <MessageFeed user={user} messages={data?.message} onReply={setReplyTo} />
      {replyTo && (
        <div
          className="need-interaction"
          style={{
            marginTop: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            size="small"
            style={{
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            回复 {replyTo.user.username}：{replyTo.content}
          </Text>
          <Button
            type="link"
            style={{ width: "24px", height: "24px", fontSize: "12px", padding: 0 }}
            onClick={() => setReplyTo(null)}
          >
            ✕
          </Button>
        </div>
      )}
      <div
        className="need-interaction"
        style={{
          marginTop: "12px",
          display: "flex",
          width: "100%",
        }}
      >
        <Input
          placeholder="输入消息"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: "18px", height: "40px" }}
        />
        <Button
          style={{ height: "40px", fontSize: "18px", marginLeft: "12px" }}
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
  onReply: (message: Message) => void;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ user, messages, onReply }) => {
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
            key={index}
          >
            <MessageBubble user={user} message={message} onReply={onReply} />
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
  message: Message;
  onReply: (message: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  user,
  message,
  onReply,
}) => {
  const isSelf = user.uuid === message.user.uuid;
  const dateUTC = new Date(message.created_at);
  const date = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
  );
  return (
    <div
      style={{
        margin: "6px 0",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          marginLeft: "12px",
          marginRight: "12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text size="small">{message.user.username}</Text>
        <Text size="small" style={{ marginLeft: "6px" }}>
          {date.toLocaleString("zh-CN")}
        </Text>
        <Link style={{ marginLeft: "6px" }} onClick={() => onReply(message)}>
          回复
        </Link>
      </div>
      <Bubble
        style={{
          minHeight: "24px",
          width: "fit-content",
          maxWidth: "80%",
          backgroundColor: isSelf
            ? "rgba(4, 190, 2, 0.25)"
            : "rgba(255, 255, 255, 0.25)",
        }}
      >
        {message.replied_message && (
          <div
            style={{
              marginBottom: "4px",
              padding: "4px 8px",
              borderRadius: "6px",
              backgroundColor: "rgba(0, 0, 0, 0.06)",
            }}
          >
            <Text size="small">
              回复 {message.replied_message.user.username}：
              {message.replied_message.content}
            </Text>
          </div>
        )}
        <Text style={{ wordBreak: "break-all" }}>{message.content}</Text>
      </Bubble>
    </div>
  );
};

export default ChatBox;
