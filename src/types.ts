export type TableZone = 'jardin' | 'galerie' | 'vip' | 'lounge';

export type TableStatus = 'libre' | 'occupee' | 'reservee' | 'addition' | 'bloquee';

export interface RestaurantTable {
  id: string;
  number: number;
  label: string;
  zone: TableZone;
  capacity: number;
  status: TableStatus;
  currentReservationId?: string;
  posSessionId?: string;
  posX: number; // For interactive visual 2D floor map (percentage 0-100)
  posY: number;
}

export type MealPeriod = 'dejeuner' | 'diner';

export type ReservationStatus = 
  | 'confirmee'
  | 'en_attente'
  | 'installee'
  | 'terminee'
  | 'annulee';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestsCount: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "12:30", "20:00"
  mealPeriod: MealPeriod;
  tableId: string;
  tableZone: TableZone;
  status: ReservationStatus;
  specialRequests?: string;
  depositFCFA: number;
  tags?: string[]; // e.g. ["VIP", "Anniversaire", "Table art", "Végétarien"]
  createdAt: string;
}

export type StockCategory = 
  | 'maree_poissons'
  | 'boucherie_viandes'
  | 'primeurs_fruits'
  | 'epicerie_seche'
  | 'cave_boissons'
  | 'hygiene_emballage';

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: StockCategory;
  currentQuantity: number;
  unit: 'kg' | 'g' | 'L' | 'bouteille' | 'carton' | 'botte' | 'sac' | 'portion' | 'regime';
  minThreshold: number;
  optimalQuantity: number;
  unitCostFCFA: number;
  storageLocation: string;
  supplierId: string;
  supplierName: string;
  lastRestockDate: string;
  expiryDate?: string;
}

export type StockMovementType = 'entree' | 'sortie' | 'perte' | 'ajustement';

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  costFCFA: number;
  reason: string;
  timestamp: string;
  performedBy: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  address: string;
  deliveryDays: string;
  rating: number;
}

export type StaffDepartment = 
  | 'cuisine'
  | 'salle'
  | 'bar_sommellerie'
  | 'accueil_securite'
  | 'economat_direction';

export type ShiftType = 'matin' | 'soir' | 'coupure' | 'repos';

export type AttendanceToday = 'present' | 'retard' | 'conge' | 'repos' | 'absent';

export interface StaffMember {
  id: string;
  registrationNumber: string;
  fullName: string;
  role: string;
  department: StaffDepartment;
  phone: string;
  email: string;
  contractType: 'CDI' | 'CDD' | 'Extra' | 'Stage';
  monthlySalaryFCFA: number;
  hireDate: string;
  statusToday: AttendanceToday;
  todayShift: ShiftType;
  avatarUrl?: string;
}

export interface ShiftSchedule {
  id: string;
  staffId: string;
  dayIndex: number; // 0 to 6 (Lundi à Dimanche)
  shift: ShiftType;
}

export interface ServiceBriefing {
  date: string;
  service: MealPeriod;
  chefSpecial: string;
  managerNotes: string;
  wineRecommendation: string;
  vipGuestsNotes: string;
  tipsPoolFCFA: number;
}

export interface OrderItem {
  id: string;
  name: string;
  priceFCFA: number;
  quantity: number;
  category: string;
}

export interface ActiveBill {
  id: string;
  tableId: string;
  tableNumber: number;
  customerName: string;
  guestsCount: number;
  openedAt: string;
  items: OrderItem[];
  status: 'en_cours' | 'addition_demandee' | 'payee';
  paymentMethod?: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Carte Bancaire' | 'Espèces';
  totalFCFA: number;
}
