import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import "./index.css";
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

  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
      <MainPanel user={user} />
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
