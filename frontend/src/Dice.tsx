import { useState } from "react";

const Dice: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const handleRoll = () => {
    setValue(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <div
      style={{
        width: "150px",
        height: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px",
        margin: "12px",
        borderRadius: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 0 18px rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span style={{ fontSize: "80px" }}>
        <strong>{value}</strong>
      </span>
      <button
        style={{
          marginTop: "12px",
          height: "40px",
          width: "120px",
          fontSize: "18px",
          cursor: "pointer",
        }}
        onClick={handleRoll}
      >
        <strong>摇骰子🎲</strong>
      </button>
    </div>
  );
};

export default Dice;
