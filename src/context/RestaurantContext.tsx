import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RestaurantTable, 
  Reservation, 
  ReservationStatus,
  StockItem, 
  StockMovement, 
  StockMovementType,
  Supplier, 
  StaffMember, 
  AttendanceToday,
  ShiftType,
  ServiceBriefing, 
  ActiveBill,
  MealPeriod,
  TableStatus
} from '../types';
import { 
  INITIAL_TABLES, 
  INITIAL_RESERVATIONS, 
  INITIAL_STOCK, 
  INITIAL_MOVEMENTS, 
  INITIAL_SUPPLIERS, 
  INITIAL_STAFF, 
  INITIAL_BRIEFING, 
  INITIAL_BILLS 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface RestaurantContextType {
  tables: RestaurantTable[];
  reservations: Reservation[];
  stock: StockItem[];
  stockMovements: StockMovement[];
  suppliers: Supplier[];
  staff: StaffMember[];
  briefing: ServiceBriefing;
  bills: ActiveBill[];
  currentService: MealPeriod;
  selectedDate: string;
  toasts: ToastMessage[];

  // Navigation & View Helpers
  setCurrentService: (service: MealPeriod) => void;
  setSelectedDate: (date: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Reservation actions
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  deleteReservation: (id: string) => void;
  assignTableToReservation: (resId: string, tableId: string) => void;

  // Table actions
  updateTableStatus: (tableId: string, status: TableStatus) => void;

  // Stock actions
  adjustStockQuantity: (itemId: string, delta: number, type: StockMovementType, reason: string, performedBy?: string) => void;
  addStockItem: (item: Omit<StockItem, 'id' | 'code'>) => void;
  updateStockItem: (id: string, updates: Partial<StockItem>) => void;
  deleteStockItem: (id: string) => void;

  // Staff actions
  addStaffMember: (member: Omit<StaffMember, 'id' | 'registrationNumber'>) => void;
  updateStaffStatus: (staffId: string, status: AttendanceToday) => void;
  updateStaffShift: (staffId: string, shift: ShiftType) => void;
  deleteStaffMember: (staffId: string) => void;
  updateBriefing: (updates: Partial<ServiceBriefing>) => void;

  // Billing & Tables
  addToBill: (tableId: string, item: { name: string; priceFCFA: number; quantity: number; category: string }) => void;
  settleBill: (billId: string, paymentMethod: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Carte Bancaire' | 'Espèces') => void;

  // Reset
  resetToDefaultData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TABLES: 'kajazoma_tables_v1',
  RESERVATIONS: 'kajazoma_reservations_v1',
  STOCK: 'kajazoma_stock_v1',
  MOVEMENTS: 'kajazoma_movements_v1',
  STAFF: 'kajazoma_staff_v1',
  BRIEFING: 'kajazoma_briefing_v1',
  BILLS: 'kajazoma_bills_v1',
  SERVICE: 'kajazoma_service_v1',
  DATE: 'kajazoma_date_v1',
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [stock, setStock] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STOCK);
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [briefing, setBriefing] = useState<ServiceBriefing>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRIEFING);
    return saved ? JSON.parse(saved) : INITIAL_BRIEFING;
  });

  const [bills, setBills] = useState<ActiveBill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [currentService, setCurrentService] = useState<MealPeriod>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICE) as MealPeriod;
    return saved || 'dejeuner';
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DATE);
    return saved || '2026-09-30';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
  }, [stock]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BRIEFING, JSON.stringify(briefing));
  }, [briefing]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICE, currentService);
  }, [currentService]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATE, selectedDate);
  }, [selectedDate]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Reservation actions
  const addReservation = (resData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newId = `RES-${String(reservations.length + 1).padStart(3, '0')}`;
    const newRes: Reservation = {
      ...resData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setReservations(prev => [newRes, ...prev]);

    // If table selected, update table status
    if (resData.tableId) {
      setTables(prev => prev.map(t => {
        if (t.id === resData.tableId) {
          return {
            ...t,
            status: resData.status === 'installee' ? 'occupee' : 'reservee',
            currentReservationId: newId,
          };
        }
        return t;
      }));
    }

    showToast('Réservation enregistrée', `Réservation pour ${resData.customerName} (${resData.guestsCount} couverts) confirmée.`, 'success');
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    const target = reservations.find(r => r.id === id);
    if (!target) return;

    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));

    // Update associated table
    if (target.tableId) {
      setTables(prev => prev.map(t => {
        if (t.id === target.tableId) {
          if (status === 'installee') {
            return { ...t, status: 'occupee', currentReservationId: id };
          } else if (status === 'terminee' || status === 'annulee') {
            return { ...t, status: 'libre', currentReservationId: undefined };
          } else if (status === 'confirmee') {
            return { ...t, status: 'reservee', currentReservationId: id };
          }
        }
        return t;
      }));
    }

    showToast('Statut mis à jour', `Réservation de ${target.customerName} passée à "${status}".`, 'info');
  };

  const deleteReservation = (id: string) => {
    const target = reservations.find(r => r.id === id);
    if (!target) return;

    setReservations(prev => prev.filter(r => r.id !== id));
    if (target.tableId) {
      setTables(prev => prev.map(t => {
        if (t.id === target.tableId && t.currentReservationId === id) {
          return { ...t, status: 'libre', currentReservationId: undefined };
        }
        return t;
      }));
    }
    showToast('Réservation supprimée', 'La réservation a été retirée du registre.', 'warning');
  };

  const assignTableToReservation = (resId: string, tableId: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === resId) {
        const table = tables.find(t => t.id === tableId);
        return { ...r, tableId, tableZone: table ? table.zone : r.tableZone };
      }
      return r;
    }));

    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { ...t, status: 'reservee', currentReservationId: resId };
      }
      if (t.currentReservationId === resId && t.id !== tableId) {
        return { ...t, status: 'libre', currentReservationId: undefined };
      }
      return t;
    }));

    showToast('Table assignée', `Table attribuée avec succès.`, 'success');
  };

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
    showToast('Table modifiée', `Table passée au statut "${status}".`, 'info');
  };

  // Stock actions
  const adjustStockQuantity = (
    itemId: string, 
    delta: number, 
    type: StockMovementType, 
    reason: string, 
    performedBy: string = 'Chef Économe'
  ) => {
    const target = stock.find(s => s.id === itemId);
    if (!target) return;

    const newQuantity = Math.max(0, Math.round((target.currentQuantity + delta) * 100) / 100);
    const costFCFA = Math.round(Math.abs(delta) * target.unitCostFCFA);

    setStock(prev => prev.map(s => s.id === itemId ? { ...s, currentQuantity: newQuantity } : s));

    const newMovement: StockMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      itemId,
      itemName: target.name,
      type,
      quantity: Math.abs(delta),
      unit: target.unit,
      costFCFA,
      reason,
      timestamp: new Date().toISOString(),
      performedBy,
    };

    setStockMovements(prev => [newMovement, ...prev]);

    if (newQuantity <= target.minThreshold) {
      showToast('Alerte Stock Bas', `${target.name} atteint le seuil critique (${newQuantity} ${target.unit}).`, 'warning');
    } else {
      showToast('Mouvement enregistré', `${type.toUpperCase()} de ${Math.abs(delta)} ${target.unit} pour ${target.name}.`, 'success');
    }
  };

  const addStockItem = (itemData: Omit<StockItem, 'id' | 'code'>) => {
    const count = stock.length + 1;
    const catPrefix = itemData.category.substring(0, 3).toUpperCase();
    const newCode = `${catPrefix}-${String(count).padStart(2, '0')}`;
    const newId = `STK-${String(count).padStart(3, '0')}`;

    const newItem: StockItem = {
      ...itemData,
      id: newId,
      code: newCode,
    };

    setStock(prev => [newItem, ...prev]);
    showToast('Produit ajouté', `${itemData.name} enregistré dans l'économat.`, 'success');
  };

  const updateStockItem = (id: string, updates: Partial<StockItem>) => {
    setStock(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Fiche stock actualisée', 'Informations produit enregistrées.', 'info');
  };

  const deleteStockItem = (id: string) => {
    setStock(prev => prev.filter(s => s.id !== id));
    showToast('Produit retiré', 'L\'article a été supprimé de l\'économat.', 'warning');
  };

  // Staff actions
  const addStaffMember = (memberData: Omit<StaffMember, 'id' | 'registrationNumber'>) => {
    const newId = `STF-${String(staff.length + 1).padStart(3, '0')}`;
    const regNum = `KJ-${String(staff.length + 1).padStart(3, '0')}`;

    const newMember: StaffMember = {
      ...memberData,
      id: newId,
      registrationNumber: regNum,
    };

    setStaff(prev => [...prev, newMember]);
    showToast('Collaborateur recruté', `${memberData.fullName} ajouté à l'équipe Kajazoma.`, 'success');
  };

  const updateStaffStatus = (staffId: string, status: AttendanceToday) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, statusToday: status } : s));
    const target = staff.find(s => s.id === staffId);
    showToast('Pointage actualisé', `${target?.fullName || 'Collaborateur'}: statut "${status}".`, 'info');
  };

  const updateStaffShift = (staffId: string, shift: ShiftType) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, todayShift: shift } : s));
    const target = staff.find(s => s.id === staffId);
    showToast('Shift planifié', `${target?.fullName}: shift "${shift}".`, 'info');
  };

  const deleteStaffMember = (staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    showToast('Collaborateur retiré', 'Membre du personnel supprimé.', 'warning');
  };

  const updateBriefing = (updates: Partial<ServiceBriefing>) => {
    setBriefing(prev => ({ ...prev, ...updates }));
    showToast('Briefing mis à jour', 'Consignes de service actualisées pour l\'équipe.', 'success');
  };

  // Billing actions
  const addToBill = (tableId: string, item: { name: string; priceFCFA: number; quantity: number; category: string }) => {
    const existingBillIndex = bills.findIndex(b => b.tableId === tableId && b.status !== 'payee');
    const table = tables.find(t => t.id === tableId);

    if (existingBillIndex >= 0) {
      const existing = bills[existingBillIndex];
      const existingItemIndex = existing.items.findIndex(i => i.name === item.name);
      let updatedItems = [...existing.items];

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
      } else {
        updatedItems.push({
          id: `ITM-${Date.now().toString().slice(-4)}`,
          name: item.name,
          priceFCFA: item.priceFCFA,
          quantity: item.quantity,
          category: item.category,
        });
      }

      const total = updatedItems.reduce((acc, curr) => acc + curr.priceFCFA * curr.quantity, 0);

      setBills(prev => prev.map((b, idx) => idx === existingBillIndex ? { ...b, items: updatedItems, totalFCFA: total } : b));
    } else {
      const newBill: ActiveBill = {
        id: `BILL-${Date.now().toString().slice(-4)}`,
        tableId,
        tableNumber: table ? table.number : 1,
        customerName: table?.currentReservationId 
          ? reservations.find(r => r.id === table.currentReservationId)?.customerName || 'Client Table ' + (table?.number || '')
          : 'Client Table ' + (table?.number || ''),
        guestsCount: table?.capacity || 2,
        openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [{
          id: `ITM-${Date.now().toString().slice(-4)}`,
          name: item.name,
          priceFCFA: item.priceFCFA,
          quantity: item.quantity,
          category: item.category,
        }],
        totalFCFA: item.priceFCFA * item.quantity,
        status: 'en_cours',
      };

      setBills(prev => [newBill, ...prev]);
    }

    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'occupee' } : t));
    showToast('Commande envoyée', `${item.quantity}x ${item.name} ajouté à la Table ${table?.number}.`, 'success');
  };

  const settleBill = (billId: string, paymentMethod: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Carte Bancaire' | 'Espèces') => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'payee', paymentMethod } : b));
    
    // Free the table
    setTables(prev => prev.map(t => t.id === bill.tableId ? { ...t, status: 'libre', currentReservationId: undefined } : t));

    // Update reservation if linked
    const linkedRes = reservations.find(r => r.tableId === bill.tableId && r.status === 'installee');
    if (linkedRes) {
      setReservations(prev => prev.map(r => r.id === linkedRes.id ? { ...r, status: 'terminee' } : r));
    }

    showToast('Paiement encaissé', `Table ${bill.tableNumber} réglée via ${paymentMethod} (${bill.totalFCFA.toLocaleString('fr-FR')} FCFA).`, 'success');
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setTables(INITIAL_TABLES);
    setReservations(INITIAL_RESERVATIONS);
    setStock(INITIAL_STOCK);
    setStockMovements(INITIAL_MOVEMENTS);
    setStaff(INITIAL_STAFF);
    setBriefing(INITIAL_BRIEFING);
    setBills(INITIAL_BILLS);
    setCurrentService('dejeuner');
    setSelectedDate('2026-09-30');
    showToast('Données réinitialisées', 'Registre initial Kajazoma restauré.', 'info');
  };

  return (
    <RestaurantContext.Provider value={{
      tables,
      reservations,
      stock,
      stockMovements,
      suppliers,
      staff,
      briefing,
      bills,
      currentService,
      selectedDate,
      toasts,
      setCurrentService,
      setSelectedDate,
      showToast,
      removeToast,
      addReservation,
      updateReservationStatus,
      deleteReservation,
      assignTableToReservation,
      updateTableStatus,
      adjustStockQuantity,
      addStockItem,
      updateStockItem,
      deleteStockItem,
      addStaffMember,
      updateStaffStatus,
      updateStaffShift,
      deleteStaffMember,
      updateBriefing,
      addToBill,
      settleBill,
      resetToDefaultData,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
