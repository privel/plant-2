import { GameProvider } from "./game/GameContext";
import GameScreen from "./game/GameScreen";

export default function GameRoute() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}


/*import { Link } from "expo-router";

<Link href="/game">
  <Text>Перейти к игре</Text>
</Link>
 */