import { useEffect, useRef, useState } from "react";

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const timer = useRef<null | NodeJS.Timeout>(null);
  const [countdownStart, setCountdownStart] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    if (countdownStart) {
      timer.current = setInterval(() => setTime((time) => time - 1), 1000);
    } else {
      timer.current && clearInterval(timer.current);
    }
  }, [countdownStart]);

  useEffect(() => {
    if (time <= 0) {
      setCountdownStart(false);
      setTime(0);
    }
  }, [time]);

  const handleReset = () => {
    setCountdownStart(false);
    setTime(countdownTime);
  };

  const handleClear = () => {
    setCountdownStart(false);
    setTime(0);
  };

  return (
    <div
      style={{
        width: "250px",
        height: "300px",
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
        <strong>
          {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}{time % 60}
        </strong>
      </span>
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ fontSize: "18px" }}>倒计时</span>
          <input
            type="number"
            value={countdownTime}
            onChange={(e) => setCountdownTime(parseInt(e.target.value))}
            style={{
              marginLeft: "12px",
              marginRight: "12px",
              width: "80px",
              fontSize: "18px",
            }}
          />
          <span style={{ fontSize: "18px" }}>秒</span>
        </div>
        <div style={{ marginTop: "24px" }}>
          <button
            style={{
              width: "100px",
              fontSize: "18px",
              height: "40px",
              cursor: "pointer",
            }}
            onClick={handleReset}
          >
            预备
          </button>
          <button
            style={{
              width: "100px",
              marginLeft: "12px",
              fontSize: "18px",
              height: "40px",
              cursor: "pointer",
            }}
            onClick={() => setCountdownStart(true)}
          >
            开始
          </button>
        </div>
        <div style={{ marginTop: "12px" }}>
          <button
            style={{
              width: "100px",
              fontSize: "18px",
              height: "40px",
              cursor: "pointer",
            }}
            onClick={() => setCountdownStart(false)}
          >
            暂停
          </button>
          <button
            style={{
              width: "100px",
              marginLeft: "12px",
              fontSize: "18px",
              height: "40px",
              cursor: "pointer",
            }}
            onClick={handleClear}
          >
            清零
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
