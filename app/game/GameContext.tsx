import React, { createContext, useContext, useState } from "react";
import { PlantType, seedOptions } from "./plants";
import { PlantState, applyWater, applyFertilizer, applySunlight, calculateGrowth } from "./PlantEngine";

const GameContext = createContext<any>(null);

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const initialPlant = seedOptions[0];
  const [plantState, setPlantState] = useState<PlantState>({
    plant: initialPlant,
    water: 0,
    fertilizer: 0,
    sunlight: 0,
    growth: 0,
  });

  const water = () => setPlantState((prev) => calculateGrowth(applyWater(prev)));
  const fertilize = () => setPlantState((prev) => calculateGrowth(applyFertilizer(prev)));
  const sun = () => setPlantState((prev) => calculateGrowth(applySunlight(prev)));

  return (
    <GameContext.Provider value={{ plantState, water, fertilize, sun }}>
      {children}
    </GameContext.Provider>
  );
};
