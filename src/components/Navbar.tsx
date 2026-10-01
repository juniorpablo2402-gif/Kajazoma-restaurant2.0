import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  CalendarDays, 
  Boxes, 
  Users, 
  Receipt, 
  LayoutDashboard, 
  Plus, 
  Sun, 
  Moon, 
  RotateCcw
} from 'lucide-react';

export type NavTab = 'dashboard' | 'reservations' | 'stock' | 'staff' | 'billing';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewReservation: () => void;
  onOpenNewStockItem: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewReservation,
  onOpenNewStockItem,
}) => {
  const { currentService, setCurrentService, resetToDefaultData } = useRestaurant();

  const navLinks: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'reservations', label: 'Réservations & Plan', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'stock', label: 'Stocks & Économat', icon: <Boxes className="w-4 h-4" /> },
    { id: 'staff', label: 'Personnel & Shifts', icon: <Users className="w-4 h-4" /> },
    { id: 'billing', label: 'Service & Additions', icon: <Receipt className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-[#0e1117]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-amber-500 group-hover:text-amber-400 transition-colors uppercase">
              KAJAZOMA
            </span>
          </button>
          <span className="hidden sm:inline text-xs text-neutral-500 font-mono">
            Cocody Vallons · Abidjan
          </span>
        </div>

        {/* Zone 2: 4–5 clean navigation links (single line, subtle active states) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Service toggle & Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Service toggle button */}
          <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setCurrentService('dejeuner')}
              title="Passer au service Déjeuner (12h-15h)"
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentService === 'dejeuner'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Midi</span>
            </button>
            <button
              onClick={() => setCurrentService('diner')}
              title="Passer au service Dîner (19h-23h30)"
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentService === 'diner'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Soir</span>
            </button>
          </div>

          {/* Quick primary action button */}
          {activeTab === 'stock' ? (
            <button
              onClick={onOpenNewStockItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-600/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">+ Produit Économat</span>
              <span className="sm:hidden">+ Produit</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewReservation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-600/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle Réservation</span>
              <span className="sm:hidden">+ Réservation</span>
            </button>
          )}

          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration du restaurant Kajazoma ?')) {
                resetToDefaultData();
              }
            }}
            title="Réinitialiser les données de démo"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-800/80 px-2 py-2 bg-[#0e1117] overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {link.icon}
              <span>{link.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
