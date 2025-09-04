import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Scroll, Text } from "./Components";
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
const MENU_ID = 'reply-menu';

interface ChatBoxProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
  handleReply: (msg_uuid: any) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, room, handleClose, handleReply }) => {
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
      <MessageFeed user={user} messages={data?.message} handleReply={handleReply}/>
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
  handleReply: (msg_uuid: any) => void;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ user, messages, handleReply }) => {
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
            <MessageBubble user={user} message={message} handleReply={() => {handleReply(message.uuid)}}/>
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
  message: graphql.GetMessagesByRoomSubscription["message"][0];
  handleReply: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ user, message, handleReply }) => {
  const isSelf = user.uuid === message.user.uuid;
  const dateUTC = new Date(message.created_at);
  const date = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
  );

  const { show } = useContextMenu({
    id: `${MENU_ID}-${message.uuid}`,
  });

  function handleContextMenu(event: any){
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        return;
      }
      event.preventDefault();
      show({
        event,
        props: {
            key: 'value'
        },
        position: {
            x: 0,
            y: 0
        },
      })
  }
  // @ts-ignore
  const handleItemClick = (args: ItemParams<any, any>) => {
    const { id } = args;
    switch (id) {
      case "reply":
        handleReply();
        break;
      default:
        break;
      //etc...
    }
  }


  return (
    <div
      style={{
        margin: "6px 0",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
      onContextMenu={handleContextMenu}
    >
      <div style={{ marginLeft: "12px", marginRight: "12px" }}>
        <Text size="small">{message.user.username}</Text>
        <Text size="small" style={{ marginLeft: "6px" }}>
          {date.toLocaleString("zh-CN")}
        </Text>
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
          <Menu id={`${MENU_ID}-${message.uuid}`}>
              <Item id="reply" onClick={handleItemClick}>Reply</Item>
          </Menu>
        <Text style={{ wordBreak: "break-all" }}>{message.content}</Text>
      </Bubble>
    </div>
  );
};

export default ChatBox;
