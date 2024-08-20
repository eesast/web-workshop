import { createRoot } from "react-dom/client";
import "./index.css";
import Dice from "./Dice";
import Timer from "./Timer";

const App = () => {
  return (
    <>
      <Dice />
      <Timer />
    </>
  );
};

const domNode = document.getElementById("root");
const root = createRoot(domNode!);
root.render(<App />);
