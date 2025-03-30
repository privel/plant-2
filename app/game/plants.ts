export type PlantType = {
    name: string;
    image: any;
    description: string;
    waterNeed: number;
    fertilizerNeed: number;
    sunlightNeed: number;
    growthRate: number; // 0..1
  };
  
  export const seedOptions: PlantType[] = [
    {
      name: "Sunflower",
      image: require("../../assets/sunflower.jpg"),
      description: "Солнечник — растение, которое любит свет и приносит радость.",
      waterNeed: 5,
      fertilizerNeed: 3,
      sunlightNeed: 7,
      growthRate: 0.8,
    },
    {
      name: "Radish",
      image: require("../../assets/cress.jpg"),
      description: "Редис — быстрорастущее растение с острым вкусом.",
      waterNeed: 3,
      fertilizerNeed: 2,
      sunlightNeed: 4,
      growthRate: 1.0,
    },
    {
      name: "Mint",
      image: require("../../assets/mint.jpeg"),
      description: "Мята — ароматное растение, освежающее и полезное.",
      waterNeed: 4,
      fertilizerNeed: 4,
      sunlightNeed: 5,
      growthRate: 0.7,
    },
  ];
  