export type Fuel = "Petrol" | "Diesel" | "EV" | "CNG";
export type Transmission = "Automatic" | "Manual";
export type LotType = "owned" | "ocb";

export interface Defect {
  id: number;
  /** position on the schematic, 0-100 % of width/height */
  x: number;
  y: number;
  severity: "minor" | "major";
  area: string;
  note: string;
}

export interface Comp {
  variant: string;
  km: string;
  city: string;
  price: number; // in rupees
  date: string;
}

export interface Car {
  id: string;
  type: LotType;
  make: string;
  model: string;
  /** imagin.studio slugs for real car renders */
  imaginMake: string;
  imaginModel: string;
  variant: string;
  year: number;
  km: number; // odometer
  fuel: Fuel;
  transmission: Transmission;
  conditionGrade: number; // 1-5
  conditionLabel: string;
  hue: number; // for the gradient "photo"
  photos: number; // count of photo frames
  has360: boolean;
  hasAudio: boolean;
  minBid: number;
  reserve: number;
  fairValue: number;
  estResale: number;
  currentHighest: number;
  increment: number;
  demand: "High" | "Medium" | "Low";
  defects: Defect[];
  comps: Comp[];
  sellerQuote?: number; // OCB only
  obd2: { status: "Pass" | "Fault"; codes: string[] };
  paintMeter: string;
  tyreTread: string;
  history: {
    challan: string;
    loan: string;
    accident: string;
    service: string;
    vaahan: string;
  };
  netLandedCost: number;
}

const L = 100000;

export const CARS: Car[] = [
  {
    id: "swift-2021",
    type: "owned",
    make: "Maruti Suzuki",
    model: "Swift",
    imaginMake: "suzuki",
    imaginModel: "swift",
    variant: "ZXi Plus",
    year: 2021,
    km: 32400,
    fuel: "Petrol",
    transmission: "Manual",
    conditionGrade: 4,
    conditionLabel: "Good",
    hue: 244,
    photos: 6,
    has360: true,
    hasAudio: true,
    minBid: 4.1 * L,
    reserve: 4.1 * L,
    fairValue: 4.6 * L,
    estResale: 5.15 * L,
    currentHighest: 4.1 * L,
    increment: 5000,
    demand: "High",
    defects: [
      { id: 1, x: 22, y: 38, severity: "minor", area: "Front-left bumper", note: "Light scuff, paint intact" },
      { id: 2, x: 74, y: 60, severity: "minor", area: "Rear-right door", note: "Small dent, ~2cm" },
    ],
    comps: [
      { variant: "ZXi Plus", km: "29k", city: "Delhi", price: 4.55 * L, date: "12 Jun" },
      { variant: "ZXi", km: "41k", city: "Gurugram", price: 4.32 * L, date: "8 Jun" },
      { variant: "ZXi Plus", km: "35k", city: "Noida", price: 4.62 * L, date: "2 Jun" },
    ],
    obd2: { status: "Pass", codes: [] },
    paintMeter: "All panels original (120–140µm)",
    tyreTread: "Front 6mm · Rear 7mm",
    history: {
      challan: "None",
      loan: "No active lien",
      accident: "No major accident",
      service: "Full history, last @ 30k km",
      vaahan: "Verified ✓",
    },
    netLandedCost: 4.0 * L,
  },
  {
    id: "creta-2022",
    type: "owned",
    make: "Hyundai",
    model: "Creta",
    imaginMake: "hyundai",
    imaginModel: "creta",
    variant: "SX(O) Turbo",
    year: 2022,
    km: 28100,
    fuel: "Petrol",
    transmission: "Automatic",
    conditionGrade: 5,
    conditionLabel: "Excellent",
    hue: 210,
    photos: 8,
    has360: true,
    hasAudio: true,
    minBid: 11.2 * L,
    reserve: 11.2 * L,
    fairValue: 12.4 * L,
    estResale: 13.6 * L,
    currentHighest: 11.45 * L,
    increment: 10000,
    demand: "High",
    defects: [{ id: 1, x: 50, y: 70, severity: "minor", area: "Rear bumper", note: "Hairline scratch" }],
    comps: [
      { variant: "SX(O)", km: "31k", city: "Delhi", price: 12.2 * L, date: "10 Jun" },
      { variant: "SX Turbo", km: "26k", city: "Gurugram", price: 12.6 * L, date: "5 Jun" },
      { variant: "SX(O) Turbo", km: "33k", city: "Faridabad", price: 12.1 * L, date: "1 Jun" },
    ],
    obd2: { status: "Pass", codes: [] },
    paintMeter: "All panels original",
    tyreTread: "Front 7mm · Rear 7mm",
    history: {
      challan: "None",
      loan: "No active lien",
      accident: "No accident",
      service: "Authorised, full history",
      vaahan: "Verified ✓",
    },
    netLandedCost: 11.0 * L,
  },
  {
    id: "nexon-2020",
    type: "ocb",
    make: "Tata",
    model: "Nexon",
    imaginMake: "tata",
    imaginModel: "nexon",
    variant: "XZ+ (O)",
    year: 2020,
    km: 46800,
    fuel: "Diesel",
    transmission: "Manual",
    conditionGrade: 3,
    conditionLabel: "Fair",
    hue: 18,
    photos: 5,
    has360: false,
    hasAudio: false,
    minBid: 6.8 * L,
    reserve: 7.2 * L,
    fairValue: 7.1 * L,
    estResale: 7.9 * L,
    currentHighest: 6.95 * L,
    increment: 5000,
    demand: "Medium",
    sellerQuote: 7.6 * L,
    defects: [
      { id: 1, x: 30, y: 40, severity: "major", area: "Bonnet", note: "Repainted after stone chips" },
      { id: 2, x: 68, y: 42, severity: "minor", area: "Right fender", note: "Minor scratch" },
      { id: 3, x: 50, y: 78, severity: "minor", area: "Rear bumper", note: "Scuff marks" },
    ],
    comps: [
      { variant: "XZ+", km: "44k", city: "Delhi", price: 7.0 * L, date: "11 Jun" },
      { variant: "XZ+ (O)", km: "50k", city: "Ghaziabad", price: 6.85 * L, date: "6 Jun" },
      { variant: "XZ", km: "39k", city: "Noida", price: 7.25 * L, date: "3 Jun" },
    ],
    obd2: { status: "Pass", codes: [] },
    paintMeter: "Bonnet repainted (210µm)",
    tyreTread: "Front 4mm · Rear 5mm",
    history: {
      challan: "₹1,000 (cleared)",
      loan: "No active lien",
      accident: "Minor — front, repaired",
      service: "Partial history",
      vaahan: "Verified ✓",
    },
    netLandedCost: 6.8 * L,
  },
  {
    id: "city-2021",
    type: "owned",
    make: "Honda",
    model: "City",
    imaginMake: "honda",
    imaginModel: "city",
    variant: "ZX CVT",
    year: 2021,
    km: 38600,
    fuel: "Petrol",
    transmission: "Automatic",
    conditionGrade: 4,
    conditionLabel: "Good",
    hue: 162,
    photos: 7,
    has360: true,
    hasAudio: true,
    minBid: 9.4 * L,
    reserve: 9.4 * L,
    fairValue: 10.3 * L,
    estResale: 11.2 * L,
    currentHighest: 9.4 * L,
    increment: 10000,
    demand: "Medium",
    defects: [
      { id: 1, x: 26, y: 64, severity: "minor", area: "Left running board", note: "Wear marks" },
      { id: 2, x: 80, y: 36, severity: "minor", area: "Right ORVM", note: "Paint peel" },
    ],
    comps: [
      { variant: "ZX CVT", km: "35k", city: "Delhi", price: 10.2 * L, date: "9 Jun" },
      { variant: "VX CVT", km: "42k", city: "Gurugram", price: 9.8 * L, date: "4 Jun" },
      { variant: "ZX", km: "40k", city: "Noida", price: 10.4 * L, date: "30 May" },
    ],
    obd2: { status: "Pass", codes: [] },
    paintMeter: "All panels original",
    tyreTread: "Front 5mm · Rear 6mm",
    history: {
      challan: "None",
      loan: "No active lien",
      accident: "No accident",
      service: "Full history",
      vaahan: "Verified ✓",
    },
    netLandedCost: 9.2 * L,
  },
  {
    id: "i20-2019",
    type: "ocb",
    make: "Hyundai",
    model: "i20",
    imaginMake: "hyundai",
    imaginModel: "i20",
    variant: "Asta 1.2",
    year: 2019,
    km: 54200,
    fuel: "Petrol",
    transmission: "Manual",
    conditionGrade: 3,
    conditionLabel: "Fair",
    hue: 280,
    photos: 5,
    has360: false,
    hasAudio: false,
    minBid: 5.3 * L,
    reserve: 5.6 * L,
    fairValue: 5.5 * L,
    estResale: 6.15 * L,
    currentHighest: 5.4 * L,
    increment: 5000,
    demand: "Low",
    sellerQuote: 5.9 * L,
    defects: [
      { id: 1, x: 40, y: 36, severity: "minor", area: "Windscreen", note: "Small chip" },
      { id: 2, x: 60, y: 66, severity: "minor", area: "Rear door", note: "Dent, paint ok" },
    ],
    comps: [
      { variant: "Asta", km: "51k", city: "Delhi", price: 5.45 * L, date: "10 Jun" },
      { variant: "Sportz", km: "58k", city: "Noida", price: 5.2 * L, date: "7 Jun" },
      { variant: "Asta 1.2", km: "49k", city: "Gurugram", price: 5.6 * L, date: "1 Jun" },
    ],
    obd2: { status: "Pass", codes: [] },
    paintMeter: "Boot repainted (190µm)",
    tyreTread: "Front 4mm · Rear 4mm",
    history: {
      challan: "None",
      loan: "No active lien",
      accident: "No major accident",
      service: "Partial history",
      vaahan: "Verified ✓",
    },
    netLandedCost: 5.3 * L,
  },
];

/* ---- Factory for the larger auction inventory (10+ lots per auction) ---- */
interface CarSeed {
  id: string;
  make: string;
  model: string;
  imaginMake: string;
  imaginModel: string;
  variant: string;
  year: number;
  km: number;
  fuel: Fuel;
  transmission: Transmission;
  grade: number;
  hue: number;
  minBidL: number; // in lakhs
  demand?: Car["demand"];
}

function makeCar(s: CarSeed): Car {
  const minBid = s.minBidL * L;
  const label = s.grade >= 5 ? "Excellent" : s.grade >= 4 ? "Good" : "Fair";
  const lakh = (n: number) => `${(n).toFixed(2).replace(/0$/, "").replace(/\.$/, "")}`;
  return {
    id: s.id,
    type: "owned",
    make: s.make,
    model: s.model,
    imaginMake: s.imaginMake,
    imaginModel: s.imaginModel,
    variant: s.variant,
    year: s.year,
    km: s.km,
    fuel: s.fuel,
    transmission: s.transmission,
    conditionGrade: s.grade,
    conditionLabel: label,
    hue: s.hue,
    photos: 6,
    has360: true,
    hasAudio: true,
    minBid,
    reserve: minBid,
    fairValue: Math.round(minBid * 1.1),
    estResale: Math.round(minBid * 1.22),
    currentHighest: minBid,
    increment: minBid > 12 * L ? 25000 : 10000,
    demand: s.demand ?? "Medium",
    defects: [
      { id: 1, x: 26, y: 40, severity: "minor", area: "Front bumper", note: "Light scuff, paint intact" },
      { id: 2, x: 72, y: 62, severity: "minor", area: "Rear-right door", note: "Small dent, ~2cm" },
    ],
    comps: [
      { variant: s.variant, km: `${Math.round(s.km / 1000) - 3}k`, city: "Delhi", price: Math.round(minBid * 1.08), date: "11 Jun" },
      { variant: s.variant, km: `${Math.round(s.km / 1000) + 4}k`, city: "Gurugram", price: Math.round(minBid * 1.02), date: "6 Jun" },
      { variant: s.variant, km: `${Math.round(s.km / 1000)}k`, city: "Noida", price: Math.round(minBid * 1.12), date: "2 Jun" },
    ],
    obd2: { status: "Pass", codes: [] },
    paintMeter: "All panels original",
    tyreTread: "Front 6mm · Rear 6mm",
    history: {
      challan: "None",
      loan: "No active lien",
      accident: "No major accident",
      service: "Full history",
      vaahan: "Verified ✓",
    },
    netLandedCost: Math.round(minBid * 0.97),
  };
}

const AUCTION_SEEDS: CarSeed[] = [
  { id: "fortuner-2021", make: "Toyota", model: "Fortuner", imaginMake: "toyota", imaginModel: "fortuner", variant: "4x2 AT", year: 2021, km: 41200, fuel: "Diesel", transmission: "Automatic", grade: 4, hue: 28, minBidL: 32.5, demand: "High" },
  { id: "xuv700-2022", make: "Mahindra", model: "XUV700", imaginMake: "mahindra", imaginModel: "xuv700", variant: "AX7 L", year: 2022, km: 33800, fuel: "Diesel", transmission: "Automatic", grade: 5, hue: 200, minBidL: 19.8, demand: "High" },
  { id: "bmw3-2020", make: "BMW", model: "3 Series", imaginMake: "bmw", imaginModel: "3-series", variant: "330i M Sport", year: 2020, km: 38100, fuel: "Petrol", transmission: "Automatic", grade: 4, hue: 220, minBidL: 34 },
  { id: "harrier-2021", make: "Tata", model: "Harrier", imaginMake: "tata", imaginModel: "harrier", variant: "XZA+", year: 2021, km: 44500, fuel: "Diesel", transmission: "Automatic", grade: 4, hue: 8, minBidL: 16.5 },
  { id: "seltos-2021", make: "Kia", model: "Seltos", imaginMake: "kia", imaginModel: "seltos", variant: "GTX+ DCT", year: 2021, km: 36900, fuel: "Petrol", transmission: "Automatic", grade: 4, hue: 150, minBidL: 13.2, demand: "High" },
  { id: "verna-2022", make: "Hyundai", model: "Verna", imaginMake: "hyundai", imaginModel: "verna", variant: "SX(O) Turbo", year: 2022, km: 29800, fuel: "Petrol", transmission: "Automatic", grade: 5, hue: 250, minBidL: 12.4 },
  { id: "skoda-slavia-2022", make: "Skoda", model: "Slavia", imaginMake: "skoda", imaginModel: "slavia", variant: "1.5 TSI Style", year: 2022, km: 27600, fuel: "Petrol", transmission: "Automatic", grade: 5, hue: 190, minBidL: 14.1 },
  { id: "innova-2020", make: "Toyota", model: "Innova Crysta", imaginMake: "toyota", imaginModel: "innova", variant: "ZX AT", year: 2020, km: 58400, fuel: "Diesel", transmission: "Automatic", grade: 4, hue: 40, minBidL: 21.5, demand: "High" },
  { id: "baleno-2021", make: "Maruti Suzuki", model: "Baleno", imaginMake: "suzuki", imaginModel: "baleno", variant: "Alpha", year: 2021, km: 34200, fuel: "Petrol", transmission: "Manual", grade: 4, hue: 210, minBidL: 6.9 },
  { id: "venue-2021", make: "Hyundai", model: "Venue", imaginMake: "hyundai", imaginModel: "venue", variant: "SX Turbo", year: 2021, km: 39100, fuel: "Petrol", transmission: "Manual", grade: 4, hue: 0, minBidL: 8.6 },
  { id: "kushaq-2022", make: "Skoda", model: "Kushaq", imaginMake: "skoda", imaginModel: "kushaq", variant: "1.0 TSI Ambition", year: 2022, km: 31500, fuel: "Petrol", transmission: "Manual", grade: 4, hue: 170, minBidL: 11.3 },
  { id: "altroz-2021", make: "Tata", model: "Altroz", imaginMake: "tata", imaginModel: "altroz", variant: "XZ+", year: 2021, km: 42700, fuel: "Petrol", transmission: "Manual", grade: 3, hue: 320, minBidL: 6.4 },
  { id: "swift-vxi-2022", make: "Maruti Suzuki", model: "Swift", imaginMake: "suzuki", imaginModel: "swift", variant: "VXi", year: 2022, km: 24800, fuel: "Petrol", transmission: "Manual", grade: 5, hue: 230, minBidL: 5.6 },
  { id: "wagonr-2021", make: "Maruti Suzuki", model: "WagonR", imaginMake: "suzuki", imaginModel: "wagon r", variant: "ZXi", year: 2021, km: 37300, fuel: "Petrol", transmission: "Manual", grade: 4, hue: 290, minBidL: 5.1 },
];

CARS.push(...AUCTION_SEEDS.map(makeCar));

/**
 * Real, model-aware car renders from the imagin.studio CDN (no API key for the
 * public soft-launch `img` customer). Different `angle` values give different
 * views, which we use as the swipeable "photos".
 */
export const CAR_ANGLES = ["23", "01", "09", "21", "05", "29", "13", "17"];

export function carImg(make: string, model: string, angle: string, width = 760): string {
  return `https://cdn.imagin.studio/getImage?customer=img&make=${make}&modelFamily=${model}&angle=${angle}&width=${width}&fileType=png`;
}

export function carImgFor(
  c: { imaginMake: string; imaginModel: string },
  frame = 0,
  width = 760
): string {
  return carImg(c.imaginMake, c.imaginModel, CAR_ANGLES[frame % CAR_ANGLES.length], width);
}

export const ownedCars = () => CARS.filter((c) => c.type === "owned");
export const ocbCars = () => CARS.filter((c) => c.type === "ocb");
export const carById = (id: string) => CARS.find((c) => c.id === id);

/** Curated online feed: the bespoke lots + a few elite re-routed from auctions. */
export const FEED_CARS: Car[] = [
  ...CARS.slice(0, 5),
  ...["seltos-2021", "verna-2022", "baleno-2021", "venue-2021"]
    .map((id) => CARS.find((c) => c.id === id))
    .filter((c): c is Car => Boolean(c)),
];

/** Format rupees as a compact lakh string, e.g. 410000 -> "₹4.1L" */
export function fmtL(amount: number): string {
  const l = amount / 100000;
  const s = l % 1 === 0 ? l.toFixed(0) : l.toFixed(2).replace(/0$/, "");
  return `₹${s}L`;
}

/** Full rupee with grouping, e.g. ₹4,10,000 */
export function fmtRs(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}
