import React, { useState, useEffect, useRef } from 'react';
import { Button, InputNumber, Space, Typography, Card } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Timer: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const startTimer = () => {
    if (time === 0) {
      setTime(duration);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Space direction="vertical" size="small">
        <div>
          <Text>时长（秒）：</Text>
          <InputNumber
            min={1}
            max={3600}
            value={duration}
            onChange={(value) => setDuration(value || 60)}
            size="small"
            style={{ width: 60 }}
            disabled={isRunning}
          />
        </div>
        
        <Card size="small" style={{ background: '#f0f8ff', minWidth: 80 }}>
          <Text strong style={{ fontSize: '20px', fontFamily: 'monospace' }}>
            {formatTime(time)}
          </Text>
        </Card>
        
        <Space size="small">
          {!isRunning ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={startTimer}
              size="small"
            >
              开始
            </Button>
          ) : (
            <Button
              icon={<PauseCircleOutlined />}
              onClick={pauseTimer}
              size="small"
            >
              暂停
            </Button>
          )}
          
          <Button
            icon={<ReloadOutlined />}
            onClick={resetTimer}
            size="small"
          >
            重置
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default Timer;
