import { useState } from "react";
import { Button, Card, Text } from "./Components";

const Dice: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const handleRoll = () => {
    setValue(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <Card style={{ width: "150px", height: "150px" }}>
      <Text size="extra">
        <strong>{value}</strong>
      </Text>
      <Button
        style={{ marginTop: "12px", width: "120px" }}
        onClick={handleRoll}
      >
        <strong>摇骰子🎲</strong>
      </Button>
    </Card>
  );
};

export default Dice;
