import React, { useEffect } from "react";
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
      <MainPanel user={user} rooms={data?.user_room} refetchRooms={refetch} />
      <Dice />
      <Timer />
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
