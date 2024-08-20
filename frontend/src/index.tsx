import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { ApolloProvider } from "@apollo/client";
import { message } from "antd";
import "./index.css";
import { client } from "./apollo";
import * as graphql from "./graphql";
import Dice from "./Dice";
import Timer from "./Timer";
import getUser from "./getUser";
import MainPanel from "./MainPanel";
import LoginPage from "./LoginPage";
import ChatBox from "./ChatBox";
import FileShare from "./FileShare";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL!;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

const App = () => {
  const user = getUser();
  const [chatBoxList, setChatBoxList] = useState<number[]>([]);
  const [fileShareList, setFileShareList] = useState<number[]>([]);

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

  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
      <MainPanel
        user={user}
        rooms={data?.user_room}
        refetchRooms={refetch}
        addChatBox={addChatBox}
        addFileShare={addFileShare}
      />
      <Dice />
      <Timer />
      {chatBoxList.map((idx) => (
        <ChatBox
          user={user}
          room={data?.user_room[idx].room}
          handleClose={() => removeChatBox(idx)}
        />
      ))}
      {fileShareList.map((idx) => (
        <FileShare
          room={data?.user_room[idx].room}
          handleClose={() => removeFileShare(idx)}
        />
      ))}
    </div>
  );
};

const domNode = document.getElementById("root");
const root = createRoot(domNode!);
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <App /> },
]);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
