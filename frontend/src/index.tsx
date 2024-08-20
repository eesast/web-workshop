import React, { Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { ApolloProvider } from "@apollo/client";
import { message } from "antd";
import Draggable from "react-draggable";
import "./index.css";
import { client } from "./apollo";
import * as graphql from "./graphql";
import Dice from "./Dice";
import Timer from "./Timer";
import getUser from "./getUser";

const MainPanel = React.lazy(() => import("./MainPanel"));
const LoginPage = React.lazy(() => import("./LoginPage"));
const ChatBox = React.lazy(() => import("./ChatBox"));
const FileShare = React.lazy(() => import("./FileShare"));

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL!;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

interface MyDraggableProps {
  oid: string;
  currentDrag: string;
  setCurrentDrag: (oid: string) => void;
  style?: React.CSSProperties;
}

const MyDraggable: React.FC<React.PropsWithChildren<MyDraggableProps>> = ({
  oid,
  currentDrag,
  setCurrentDrag,
  children,
  style,
}) => {
  return (
    <Draggable
      bounds="body"
      grid={[4, 4]}
      onStart={() => setCurrentDrag(oid)}
      cancel=".need-interaction"
    >
      <div
        style={{
          ...style,
          height: "fit-content",
          width: "fit-content",
          zIndex: currentDrag === oid ? 99 : 0,
        }}
      >
        {children}
      </div>
    </Draggable>
  );
};

const App = () => {
  const user = getUser();
  const [chatBoxList, setChatBoxList] = useState<number[]>([]);
  const [fileShareList, setFileShareList] = useState<number[]>([]);
  const [currentDrag, setCurrentDrag] = useState<string>("");

  const draggableProps = {
    currentDrag,
    setCurrentDrag,
  };

  const addChatBox = (idx: number) => {
    if (!chatBoxList.includes(idx)) {
      setChatBoxList([...chatBoxList, idx]);
    }
  };
  const addFileShare = (idx: number) => {
    if (!fileShareList.includes(idx)) {
      setFileShareList([...fileShareList, idx]);
    }
  };
  const removeChatBox = (idx: number) => {
    setChatBoxList(chatBoxList.filter((id) => id !== idx));
  };
  const removeFileShare = (idx: number) => {
    setFileShareList(fileShareList.filter((id) => id !== idx));
  };

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  const { data, error, refetch } = graphql.useGetJoinedRoomsQuery({
    skip: !user,
    variables: {
      user_uuid: user?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取房间列表失败！");
    }
  }, [error]);

  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
      <Suspense fallback={null}>
        <MainPanel
          user={user}
          rooms={data?.user_room}
          refetchRooms={refetch}
          addChatBox={addChatBox}
          addFileShare={addFileShare}
        />
      </Suspense>
      <MyDraggable key="dice" oid="dice" {...draggableProps}>
        <Dice />
      </MyDraggable>
      <MyDraggable key="timer" oid="timer" {...draggableProps}>
        <Timer />
      </MyDraggable>
      {chatBoxList.map((idx) => (
        <MyDraggable
          key={`chat-${idx}`}
          oid={`chat-${idx}`}
          style={{ position: "absolute", right: 0 }}
          {...draggableProps}
        >
          <Suspense fallback={null}>
            <ChatBox
              user={user}
              room={data?.user_room[idx].room}
              handleClose={() => removeChatBox(idx)}
            />
          </Suspense>
        </MyDraggable>
      ))}
      {fileShareList.map((idx) => (
        <MyDraggable
          key={`file-${idx}`}
          oid={`file-${idx}`}
          style={{ position: "absolute", right: 0 }}
          {...draggableProps}
        >
          <Suspense fallback={null}>
            <FileShare
              room={data?.user_room[idx].room}
              handleClose={() => removeFileShare(idx)}
            />
          </Suspense>
        </MyDraggable>
      ))}
    </div>
  );
};

const domNode = document.getElementById("root");
const root = createRoot(domNode!);
const router = createHashRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <App /> },
]);
root.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </Suspense>
  </React.StrictMode>
);
