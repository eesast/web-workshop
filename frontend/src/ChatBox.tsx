import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Scroll, Text, ContextMenu } from "./Components";

interface ChatBoxProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, room, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [replyingMessage, setReplyingMessage] =
    useState<graphql.GetMessagesByRoomSubscription["message"][0] | null>(null);
  const [menuPosition, setMenuPosition] =
    useState<{ x: number; y: number } | null>(null);
  const [menuMessage, setMenuMessage] =
    useState<graphql.GetMessagesByRoomSubscription["message"][0] | null>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { data, error } = graphql.useGetMessagesByRoomSubscription({
    skip: !room,
    variables: { room_uuid: room?.uuid },
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
      setLoading(false);
      return;
    }

    let contentToSend = text;
    if (replyingMessage) {
      const header = `↩︎ 回复 @${replyingMessage.user.username}: ${replyingMessage.content}`;
      contentToSend = `${header}\n${text}`;
    }

    const result = await addMessageMutation({
      variables: {
        user_uuid: user?.uuid,
        room_uuid: room?.uuid,
        content: contentToSend,
      },
    });

    if (result.errors) {
      console.error(result.errors);
      message.error("发送消息失败！");
    }
    setText("");
    setReplyingMessage(null);
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

  if (!user || !room) return null;

  return (
    <Card
      ref={chatBoxRef}
      style={{
        width: "300px",
        height: "500px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Close />
      <Container style={{ margin: "6px" }}>
        <Text>
          <strong>{room.name}</strong>
        </Text>
        <Text size="small" style={{ marginTop: "6px", marginBottom: "6px" }}>
          {room.intro}
        </Text>
      </Container>

      <Scroll style={{ flex: 1 }}>
        <MessageFeed
          user={user}
          messages={data?.message}
          onRightClick={(e, msg) => {
            e.preventDefault();
            setMenuPosition({ x: e.clientX, y: e.clientY });
            setMenuMessage(msg);
          }}
        />
      </Scroll>

      {replyingMessage && (
        <Bubble style={{ background: "rgba(0,0,0,0.08)", margin: "6px", width: "90%" }}>
          <Text size="small">
            正在回复 @{replyingMessage.user.username}: {replyingMessage.content}
          </Text>
        </Bubble>
      )}

      <div className="need-interaction" style={{ display: "flex", marginTop: "6px" }}>
        <Input
          placeholder={replyingMessage ? `@${replyingMessage.user.username} ` : "输入消息"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: "18px", height: "40px", flex: 1 }}
        />
        <Button
          style={{ height: "40px", fontSize: "18px", marginLeft: "6px" }}
          onClick={handleSend}
          type="primary"
          loading={loading}
        >
          <strong>发送</strong>
        </Button>
      </div>

      <ContextMenu
        parentRef={chatBoxRef}
        position={menuPosition}
        onClose={() => {
          setMenuPosition(null);
          setMenuMessage(null);
        }}
        items={[
          {
            label: "回复",
            onClick: () => {
              if (menuMessage) setReplyingMessage(menuMessage);
            },
          },
        ]}
      />
    </Card>
  );
};

interface MessageFeedProps {
  user: user;
  messages: graphql.GetMessagesByRoomSubscription["message"] | undefined;
  onRightClick: (
    e: React.MouseEvent,
    msg: graphql.GetMessagesByRoomSubscription["message"][0]
  ) => void;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ user, messages, onRightClick }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return messages ? (
    <>
      {messages.map((message, index) => (
        <div ref={index === messages.length - 1 ? bottomRef : null} key={index}>
          <MessageBubble user={user} message={message} onRightClick={onRightClick} />
        </div>
      ))}
    </>
  ) : (
    <Container style={{ height: "100%" }}>
      <Spin size="large" />
    </Container>
  );
};

interface MessageBubbleProps {
  user: user;
  message: graphql.GetMessagesByRoomSubscription["message"][0];
  onRightClick: (
    e: React.MouseEvent,
    msg: graphql.GetMessagesByRoomSubscription["message"][0]
  ) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ user, message, onRightClick }) => {
  const isSelf = user.uuid === message.user.uuid;
  const dateUTC = new Date(message.created_at);
  const date = new Date(dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000);

  const [firstLine, ...restLines] = message.content.split("\n");
  const isReplyLike = firstLine.startsWith("↩︎ 回复 @");
  const bodyText = isReplyLike ? restLines.join("\n") : message.content;

  return (
    <div
      style={{
        margin: "6px 0",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
      onContextMenu={(e) => onRightClick(e, message)}
    >
      <div style={{ marginLeft: "12px", marginRight: "12px" }}>
        <Text size="small">{message.user.username}</Text>
        <Text size="small" style={{ marginLeft: "6px" }}>
          {date.toLocaleString("zh-CN")}
        </Text>
      </div>

      {isReplyLike && (
        <Bubble
          style={{
            minHeight: "20px",
            width: "fit-content",
            maxWidth: "72%",
            backgroundColor: "rgba(0,0,0,0.08)",
            marginBottom: "2px",
          }}
        >
          <Text size="small" style={{ wordBreak: "break-all" }}>
            {firstLine}
          </Text>
        </Bubble>
      )}

      <Bubble
        style={{
          minHeight: "24px",
          width: "fit-content",
          maxWidth: "80%",
          backgroundColor: isSelf ? "rgba(4, 190, 2, 0.25)" : "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Text style={{ wordBreak: "break-all" }}>{bodyText}</Text>
      </Bubble>
    </div>
  );
};

export default ChatBox;
