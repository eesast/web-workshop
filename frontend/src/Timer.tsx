import { useEffect, useRef, useState } from "react";
import { Button, Card, Container, Text } from "./Components";
import { Input } from "antd";

interface TimerProps {
  setTime: (time: number) => void;
  setStart: (start: boolean) => void;
}

const Countdown: React.FC<TimerProps> = ({
  setTime,
  setStart: setCountdownStart,
}) => {
  const [countdownTime, setCountdownTime] = useState(0);

  const handleReset = () => {
    setCountdownStart(false);
    setTime(countdownTime);
  };

  const handleClear = () => {
    setCountdownStart(false);
    setTime(0);
  };

  return (
    <Container style={{ marginTop: "24px" }}>
      <div>
        <Text>倒计时</Text>
        <Input
          type="number"
          value={countdownTime}
          onChange={(e) => setCountdownTime(parseInt(e.target.value))}
          style={{
            marginLeft: "12px",
            marginRight: "12px",
            height: "28px",
            width: "80px",
            fontSize: "18px",
          }}
        />
        <Text>秒</Text>
      </div>
      <div style={{ marginTop: "24px" }}>
        <Button style={{ width: "100px" }} onClick={handleReset}>
          预备
        </Button>
        <Button
          style={{ width: "100px", marginLeft: "12px" }}
          onClick={() => setCountdownStart(true)}
        >
          开始
        </Button>
      </div>
      <div style={{ marginTop: "12px" }}>
        <Button
          style={{ width: "100px" }}
          onClick={() => setCountdownStart(false)}
        >
          暂停
        </Button>
        <Button
          style={{ width: "100px", marginLeft: "12px" }}
          onClick={handleClear}
        >
          清零
        </Button>
      </div>
    </Container>
  );
};

const Stopwatch: React.FC<TimerProps> = ({
  setTime,
  setStart: setStopwatchStart,
}) => {
  const handleReset = () => {
    setStopwatchStart(false);
    setTime(0);
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <Button style={{ width: "72px" }} onClick={() => setStopwatchStart(true)}>
        开始
      </Button>
      <Button
        style={{ width: "72px", marginLeft: "12px" }}
        onClick={() => setStopwatchStart(false)}
      >
        暂停
      </Button>
      <Button
        style={{ width: "72px", marginLeft: "12px" }}
        onClick={handleReset}
      >
        清零
      </Button>
    </div>
  );
};

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const timer = useRef<null | NodeJS.Timeout>(null);
  const [mode, setMode] = useState<"countdown" | "stopwatch">("countdown");
  const [countdownStart, setCountdownStart] = useState(false);
  const [stopwatchStart, setStopwatchStart] = useState(false);

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

  useEffect(() => {
    if (stopwatchStart) {
      timer.current = setInterval(() => setTime((time) => time + 1), 1000);
    } else {
      timer.current && clearInterval(timer.current);
    }
  }, [stopwatchStart]);

  return (
    <Card
      style={{
        width: "250px",
        height: mode === "countdown" ? "320px" : "216px",
      }}
    >
      <Text size="extra">
        <strong>
          {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}{time % 60}
        </strong>
      </Text>
      <div style={{ marginTop: "12px" }}>
        <Button style={{ width: "100px" }} onClick={() => setMode("countdown")}>
          <strong>倒计时</strong>
        </Button>
        <Button
          style={{ width: "100px", marginLeft: "12px" }}
          onClick={() => setMode("stopwatch")}
        >
          <strong>计时器</strong>
        </Button>
      </div>
      {mode === "countdown" ? (
        <Countdown setTime={setTime} setStart={setCountdownStart} />
      ) : (
        <Stopwatch setTime={setTime} setStart={setStopwatchStart} />
      )}
    </Card>
  );
};

export default Timer;
