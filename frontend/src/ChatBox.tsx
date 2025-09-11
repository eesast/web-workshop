import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Scroll, Text } from "./Components";

// 新增库react-contexify 用来右键回复某一条消息
import { useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';

// 创建一个自定义的右键菜单组件 以确保右键菜单的位置正确
import { createPortal } from 'react-dom';
import React from "react";

interface CustomContextMenuProps {
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
  message: any;
  onReply: (message: any) => void;
}

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
  position,
  visible,
  onClose,
  message,
  onReply
}) => {
  if (!visible) return null;

  // 复制消息
  const handleCopy = () => {
    console.log("copied message: ", message.content);
    navigator.clipboard.writeText(message.content);
    onClose();
  };

  // 回复消息
  const handleReply = () => {
    console.log("reply to ", message.user.username, ": ", message.content);
    onReply(message);
    onClose();
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '120px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          borderBottom: '1px solid #eee',
        }}
        onClick={handleCopy}
      >
        复制
      </div>
      <div
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
        }}
        onClick={handleReply}
      >
        回复
      </div>
    </div>,
    document.body
  );
};



// 新增回复状态接口
interface ReplyState {
  message: graphql.GetMessagesByRoomSubscription["message"][0] | null;
  visible: boolean;
}

interface ChatBoxProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, room, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 增加 回复状态 常量
  const [reply, setReply] = useState<ReplyState>({ message: null, visible: false });

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
        replied_to_uuid: reply.message?.uuid || null  // 增加 消息回复
      },
    });
    if (result.errors) {
      console.error(result.errors);
      message.error("发送消息失败！");
    }
    else {
      // 发送成功后清除回复状态
      setReply({ message: null, visible: false });
    }

    setText("");
    setLoading(false);
  };

  // 处理回复消息
  const handleReply = (message: graphql.GetMessagesByRoomSubscription["message"][0]) => {
    setReply({ message, visible: true });
    const input = document.querySelector('input[placeholder="输入消息"]') as HTMLInputElement;
    input?.focus();
  };

  // 取消回复
  const cancelReply = () => {
    setReply({ message: null, visible: false });
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


      {/* 回复提示 */}
      {reply.visible && reply.message && (
        <div style={{
          padding: "8px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <Text size="small">回复 {reply.message.user.username}: </Text>
            <Text size="small" style={{ color: "#666" }}>
              {reply.message.content.length > 30
                ? reply.message.content.substring(0, 30) + "..."
                : reply.message.content}
            </Text>
          </div>
          <Button type="link" size="small" onClick={cancelReply}>取消</Button>
        </div>
      )}

      {/* 修改下行 增加onReply */}
      <MessageFeed user={user} messages={data?.message} onReply={handleReply} />
      <div
        className="need-interaction"
        style={{
          marginTop: "12px",
          display: "flex",
          width: "100%",
        }}
      >
        {/* Input增加onPressEnter，按下Enter键可以发送消息 */}
        <Input
          placeholder="输入消息"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: "18px", height: "40px" }}
          onPressEnter={handleSend}
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
  onReply: (message: graphql.GetMessagesByRoomSubscription["message"][0]) => void;  // 新增 消息回复相关
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
            key={message.uuid || index}
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
  message: graphql.GetMessagesByRoomSubscription["message"][0];
  onReply: (message: graphql.GetMessagesByRoomSubscription["message"][0]) => void;
}

const MENU_ID = 'blahblah';

const MessageBubble: React.FC<MessageBubbleProps> = ({ user, message, onReply }) => {
  const isSelf = user.uuid === message.user.uuid;
  const dateUTC = new Date(message.created_at);
  const date = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
  );

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  // 设置右键菜单的可见性与位置
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  function handleContextMenu(event:any){
      event.preventDefault();

      // 设置菜单位置为鼠标点击位置
      setMenuPosition({
        x: event.clientX,
        y: event.clientY
      });

      setMenuVisible(true);

      show({
        event,
        props: {
          message: message,
          onReply: onReply
        }
      });
  }

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  // 点击页面其他区域关闭菜单
  React.useEffect(() => {
    const handleClick = () => setMenuVisible(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);


  // const handleItemClick = ({ id, props }: any) => {
  //   switch (id) {
  //     case "reply":
  //       console.log("reply to message:", props.message);
  //       props.onReply(props.message);
  //       break;
  //     case "copy":
  //       console.log("copy message content:", props.message.content);
  //       navigator.clipboard.writeText(props.message.content);
  //       break;
  //   }
  // };

  return (
    <>
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
        <Text style={{ wordBreak: "break-all" }}>{message.content}</Text>
        {/* 显示被回复的消息内容 */}
        {message.replied_to_message && (
          <div style={{
            padding: "4px 8px",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "4px",
            marginBottom: "4px",
            fontSize: "12px",
            color: "#666"
          }}>
            回复 {message.replied_to_message.user.username}: {message.replied_to_message.content}
          </div>
        )}
      </Bubble>

    </div>

    <CustomContextMenu
        position={menuPosition}
        visible={menuVisible}
        onClose={handleCloseMenu}
        message={message}
        onReply={onReply}
      />
    </>
  );

};

export default ChatBox;
