import React, { useState } from 'react';
import { Button, InputNumber, Space, Typography, Card } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Dice: React.FC = () => {
  const [result, setResult] = useState<number>(0);
  const [sides, setSides] = useState<number>(6);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    setRolling(true);
    
    // 模拟骰子滚动动画
    setTimeout(() => {
      const randomResult = Math.floor(Math.random() * sides) + 1;
      setResult(randomResult);
      setRolling(false);
    }, 500);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Space direction="vertical" size="small">
        <div>
          <Text>面数：</Text>
          <InputNumber
            min={2}
            max={100}
            value={sides}
            onChange={(value) => setSides(value || 6)}
            size="small"
            style={{ width: 60 }}
          />
        </div>
        
        <Button
          type="primary"
          icon={<QuestionOutlined  />}
          onClick={rollDice}
          loading={rolling}
          size="small"
        >
          掷骰子
        </Button>
        
        {result > 0 && (
          <Card size="small" style={{ background: '#f0f8ff' }}>
            <Text strong style={{ fontSize: '18px' }}>
              结果：{result}
            </Text>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default Dice;
