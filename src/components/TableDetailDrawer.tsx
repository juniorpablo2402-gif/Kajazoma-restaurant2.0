import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { TableStatus } from '../types';
import { 
  X, 
  Users, 
  Phone, 
  Receipt, 
  Plus,
  Clock,
  Sparkles
} from 'lucide-react';

interface TableDetailDrawerProps {
  tableId: string | null;
  onClose: () => void;
  onOpenNewReservationForTable: (tableId: string) => void;
  onOpenPOSForTable: (tableId: string) => void;
}

export const TableDetailDrawer: React.FC<TableDetailDrawerProps> = ({
  tableId,
  onClose,
  onOpenNewReservationForTable,
  onOpenPOSForTable,
}) => {
  const { 
    tables, 
    reservations, 
    bills, 
    updateTableStatus, 
    updateReservationStatus 
  } = useRestaurant();

  if (!tableId) return null;

  const table = tables.find(t => t.id === tableId);
  if (!table) return null;

  const linkedReservation = table.currentReservationId 
    ? reservations.find(r => r.id === table.currentReservationId)
    : reservations.find(r => r.tableId === table.id && (r.status === 'confirmee' || r.status === 'installee'));

  const activeBill = bills.find(b => b.tableId === table.id && b.status !== 'payee');

  const zoneNames: Record<string, string> = {
    jardin: 'Jardin Tropical & Véranda',
    galerie: 'Galerie d\'Art Contemporain',
    vip: 'Salon VIP & Privé Kajazoma',
    lounge: 'Lounge Bar & Mixologie',
  };

  const statusConfigs: Record<TableStatus, { label: string; color: string; border: string; bg: string }> = {
    libre: { label: 'Libre & Prête', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    occupee: { label: 'Occupée / En service', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    reservee: { label: 'Réservée pour le service', color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10' },
    addition: { label: 'Addition demandée', color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
    bloquee: { label: 'Bloquée / Maintenance', color: 'text-neutral-400', border: 'border-neutral-500/30', bg: 'bg-neutral-500/10' },
  };

  const statusList: { key: TableStatus; label: string }[] = [
    { key: 'libre', label: 'Libre' },
    { key: 'occupee', label: 'Occupée' },
    { key: 'reservee', label: 'Réservée' },
    { key: 'addition', label: 'Addition' },
    { key: 'bloquee', label: 'Bloquée' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#12161f] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono text-base">
              T{table.number}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{table.label}</h2>
              <p className="text-xs text-neutral-400">{zoneNames[table.zone]} · {table.capacity} places</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Status Switcher */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Statut Actuel de la Table
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
              {statusList.map(st => (
                <button
                  key={st.key}
                  onClick={() => updateTableStatus(table.id, st.key)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    table.status === st.key
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Linked Reservation or Empty state */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Réservation Associée
              </span>
              {linkedReservation && (
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono ${
                  linkedReservation.status === 'installee' 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-amber-400 bg-amber-500/10'
                }`}>
                  {linkedReservation.status.toUpperCase()}
                </span>
              )}
            </div>

            {linkedReservation ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{linkedReservation.customerName}</h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        {linkedReservation.guestsCount} convives
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {linkedReservation.time}
                      </span>
                    </div>
                  </div>
                  <a 
                    href={`tel:${linkedReservation.customerPhone}`}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors"
                    title="Appeler le client"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-xs text-neutral-300 font-mono bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
                  Contact: {linkedReservation.customerPhone}
                </div>

                {linkedReservation.specialRequests && (
                  <div className="text-xs text-neutral-300 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-lg">
                    <span className="font-semibold text-amber-400">Demande particulière :</span> {linkedReservation.specialRequests}
                  </div>
                )}

                {linkedReservation.depositFCFA > 0 && (
                  <div className="text-xs text-neutral-400 flex items-center justify-between">
                    <span>Arrhes encaissées :</span>
                    <span className="font-mono text-emerald-400 font-medium">
                      {linkedReservation.depositFCFA.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2">
                  {linkedReservation.status === 'confirmee' && (
                    <button
                      onClick={() => updateReservationStatus(linkedReservation.id, 'installee')}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      Installer les clients
                    </button>
                  )}
                  {linkedReservation.status === 'installee' && (
                    <button
                      onClick={() => updateReservationStatus(linkedReservation.id, 'terminee')}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    >
                      Marquer service terminé
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-neutral-400">Aucune réservation actuellement assignée à cette table.</p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNewReservationForTable(table.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-600 rounded-lg transition-colors border border-amber-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Réserver cette table</span>
                </button>
              </div>
            )}
          </div>

          {/* Active Bill / Addition preview */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>Addition & Consommations</span>
              </span>
              {activeBill && (
                <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                  {activeBill.totalFCFA.toLocaleString('fr-FR')} FCFA
                </span>
              )}
            </div>

            {activeBill && activeBill.items.length > 0 ? (
              <div className="space-y-2">
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {activeBill.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/40">
                      <span className="text-neutral-200">{item.quantity}x {item.name}</span>
                      <span className="font-mono text-neutral-400 tabular-nums">
                        {(item.priceFCFA * item.quantity).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPOSForTable(table.id);
                    }}
                    className="w-full py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Gérer l'addition & Encaisser</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-neutral-400">Aucune commande ouverte sur cette table.</p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPOSForTable(table.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ouvrir une commande</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
