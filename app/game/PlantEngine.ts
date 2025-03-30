import { PlantType } from "./plants";

export type PlantState = {
  plant: PlantType;
  water: number;
  fertilizer: number;
  sunlight: number;
  growth: number; // 0..1
};

export const applyWater = (state: PlantState): PlantState => {
  return { ...state, water: state.water + 1 };
};

export const applyFertilizer = (state: PlantState): PlantState => {
  return { ...state, fertilizer: state.fertilizer + 1 };
};

export const applySunlight = (state: PlantState): PlantState => {
  return { ...state, sunlight: state.sunlight + 1 };
};

export const calculateGrowth = (state: PlantState): PlantState => {
  const { plant, water, fertilizer, sunlight } = state;
  const waterScore = Math.min(water / plant.waterNeed, 1);
  const fertilizerScore = Math.min(fertilizer / plant.fertilizerNeed, 1);
  const sunlightScore = Math.min(sunlight / plant.sunlightNeed, 1);
  const growth = ((waterScore + fertilizerScore + sunlightScore) / 3) * plant.growthRate;

  return { ...state, growth };
};
