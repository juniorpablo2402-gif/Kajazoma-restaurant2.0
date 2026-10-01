import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ReservationsView } from './components/ReservationsView';
import { StockManagementView } from './components/StockManagementView';
import { StaffManagementView } from './components/StaffManagementView';
import { BillingPOSView } from './components/BillingPOSView';
import { NewReservationModal } from './components/NewReservationModal';
import { NewStockItemModal } from './components/NewStockItemModal';
import { TableDetailDrawer } from './components/TableDetailDrawer';
import { ToastNotification } from './components/ToastNotification';
import { MapPin, Phone, Clock, RotateCcw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { resetToDefaultData } = useRestaurant();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [preselectedTableId, setPreselectedTableId] = useState<string | null>(null);
  const [isNewStockOpen, setIsNewStockOpen] = useState(false);
  const [selectedTableForDetail, setSelectedTableForDetail] = useState<string | null>(null);

  const handleOpenReservationForTable = (tableId: string) => {
    setPreselectedTableId(tableId);
    setIsNewReservationOpen(true);
  };

  const handleOpenPOSForTable = (tableId: string) => {
    setSelectedTableForDetail(null);
    setActiveTab('billing');
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-neutral-100 flex flex-col font-sans">
      {/* Universal Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewReservation={() => {
          setPreselectedTableId(null);
          setIsNewReservationOpen(true);
        }}
        onOpenNewStockItem={() => setIsNewStockOpen(true)}
      />

      {/* Main Viewport Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            setActiveTab={setActiveTab}
            onOpenNewReservation={() => {
              setPreselectedTableId(null);
              setIsNewReservationOpen(true);
            }}
            onSelectTableForDetail={(tableId) => setSelectedTableForDetail(tableId)}
          />
        )}

        {activeTab === 'reservations' && (
          <ReservationsView
            onOpenNewReservation={() => {
              setPreselectedTableId(null);
              setIsNewReservationOpen(true);
            }}
            onSelectTableForDetail={(tableId) => setSelectedTableForDetail(tableId)}
          />
        )}

        {activeTab === 'stock' && (
          <StockManagementView
            onOpenNewStockItem={() => setIsNewStockOpen(true)}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagementView />
        )}

        {activeTab === 'billing' && (
          <BillingPOSView
            initialSelectedTableId={selectedTableForDetail}
          />
        )}
      </main>

      {/* Table Detail Drawer Modal */}
      {selectedTableForDetail && (
        <TableDetailDrawer
          tableId={selectedTableForDetail}
          onClose={() => setSelectedTableForDetail(null)}
          onOpenNewReservationForTable={handleOpenReservationForTable}
          onOpenPOSForTable={handleOpenPOSForTable}
        />
      )}

      {/* New Reservation Modal */}
      <NewReservationModal
        isOpen={isNewReservationOpen}
        onClose={() => {
          setIsNewReservationOpen(false);
          setPreselectedTableId(null);
        }}
        preselectedTableId={preselectedTableId}
      />

      {/* New Stock Item Modal */}
      <NewStockItemModal
        isOpen={isNewStockOpen}
        onClose={() => setIsNewStockOpen(false)}
      />

      {/* Floating Feedback Toasts */}
      <ToastNotification />

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-neutral-800/80 bg-[#0e1117] py-6 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-neutral-400">
            <span className="font-semibold text-white font-display">KAJAZOMA CONCEPT</span>
            <span aria-hidden="true">·</span>
            <span>Deux-Plateaux Vallons, Cocody, Abidjan</span>
            <span aria-hidden="true">·</span>
            <span>Cuisine Afro-Contemporaine & Galerie d'Art</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => {
                if (window.confirm('Voulez-vous réinitialiser le registre aux valeurs initiales de Kajazoma ?')) {
                  resetToDefaultData();
                }
              }}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les données de démo</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-neutral-400">Abidjan, CI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainAppContent />
    </RestaurantProvider>
  );
}
