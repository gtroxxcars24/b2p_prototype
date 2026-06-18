import { CARS, Car } from "./cars";

export interface Auction {
  id: string;
  title: string;
  venue: string;
  area: string;
  date: string; // e.g. "Sat, 21 Jun"
  time: string; // e.g. "11:00 AM"
  distanceKm: number;
  startingPrice: number;
  inspected: boolean;
  carIds: string[];
  hue: number;
  status: "confirmed" | "gathering-intent";
  /** intent gating */
  intentThreshold: number; // number of interested intents to clear
  intentCount: number; // current
}

const L = 100000;

export const AUCTIONS: Auction[] = [
  {
    id: "elite-pragati",
    title: "Elite Auction · Premium SUVs & Sedans",
    venue: "Pragati Maidan, Hall 7",
    area: "Central Delhi",
    date: "Sat, 21 Jun",
    time: "11:00 AM",
    distanceKm: 6.2,
    startingPrice: 9.4 * L,
    inspected: true,
    carIds: [
      "fortuner-2021", "xuv700-2022", "bmw3-2020", "harrier-2021", "seltos-2021",
      "verna-2022", "skoda-slavia-2022", "innova-2020", "kushaq-2022", "creta-2022", "city-2021",
    ],
    hue: 244,
    status: "confirmed",
    intentThreshold: 20,
    intentCount: 23,
  },
  {
    id: "gurugram-hatch",
    title: "Elite Auction · Hatchbacks 5L+",
    venue: "Sector 29 Grounds",
    area: "Gurugram",
    date: "Sun, 22 Jun",
    time: "10:30 AM",
    distanceKm: 18.4,
    startingPrice: 4.1 * L,
    inspected: true,
    carIds: [
      "swift-2021", "baleno-2021", "venue-2021", "altroz-2021", "swift-vxi-2022",
      "wagonr-2021", "i20-2019", "seltos-2021", "verna-2022", "kushaq-2022",
    ],
    hue: 162,
    status: "confirmed",
    intentThreshold: 15,
    intentCount: 17,
  },
];

/** Candidate cars CARS24 is considering stocking — gated behind buy-intent (§8.2). */
export interface Candidate {
  id: string;
  make: string;
  model: string;
  imaginMake: string;
  imaginModel: string;
  variant: string;
  year: number;
  km: number;
  indicativePrice: number;
  conditionGrade: number;
  hue: number;
  intentThreshold: number;
  intentCount: number;
}

export const CANDIDATES: Candidate[] = [
  {
    id: "cand-fortuner",
    make: "Toyota",
    model: "Fortuner",
    imaginMake: "toyota",
    imaginModel: "fortuner",
    variant: "4x2 AT",
    year: 2021,
    km: 41200,
    indicativePrice: 32.5 * L,
    conditionGrade: 4,
    hue: 28,
    intentThreshold: 12,
    intentCount: 9,
  },
  {
    id: "cand-xuv700",
    make: "Mahindra",
    model: "XUV700",
    imaginMake: "mahindra",
    imaginModel: "xuv700",
    variant: "AX7 L",
    year: 2022,
    km: 33800,
    indicativePrice: 19.8 * L,
    conditionGrade: 5,
    hue: 200,
    intentThreshold: 10,
    intentCount: 8,
  },
  {
    id: "cand-bmw3",
    make: "BMW",
    model: "3 Series",
    imaginMake: "bmw",
    imaginModel: "3-series",
    variant: "330i M Sport",
    year: 2020,
    km: 38100,
    indicativePrice: 34.0 * L,
    conditionGrade: 4,
    hue: 220,
    intentThreshold: 14,
    intentCount: 6,
  },
];

export const auctionCars = (a: Auction): Car[] =>
  a.carIds.map((id) => CARS.find((c) => c.id === id)!).filter(Boolean);

export const auctionById = (id: string) => AUCTIONS.find((a) => a.id === id);
