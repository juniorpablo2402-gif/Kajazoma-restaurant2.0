import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MENU_CATALOG } from '../data/mockData';
import { 
  Receipt, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Plus, 
  CheckCircle2, 
  Printer, 
  Utensils, 
  Clock, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface BillingPOSViewProps {
  initialSelectedTableId?: string | null;
}

export const BillingPOSView: React.FC<BillingPOSViewProps> = ({
  initialSelectedTableId,
}) => {
  const { tables, bills, addToBill, settleBill } = useRestaurant();

  const [selectedTableId, setSelectedTableId] = useState<string>(
    initialSelectedTableId || tables.find(t => t.status === 'occupee' || t.status === 'addition')?.id || tables[0]?.id || ''
  );

  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Wave' | 'Orange Money' | 'MTN MoMo' | 'Carte Bancaire' | 'Espèces'>('Wave');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const selectedTable = tables.find(t => t.id === selectedTableId);
  const activeBill = bills.find(b => b.tableId === selectedTableId && b.status !== 'payee');

  const menuCategories = ['all', 'Entrée', 'Plat', 'Accompagnement', 'Dessert', 'Bar', 'Cave'];

  const filteredMenuItems = MENU_CATALOG.filter(item => {
    return selectedMenuCategory === 'all' || item.category === selectedMenuCategory;
  });

  const handleAddItemToTable = (item: typeof MENU_CATALOG[0]) => {
    if (!selectedTableId) return;
    addToBill(selectedTableId, {
      name: item.name,
      priceFCFA: item.priceFCFA,
      quantity: 1,
      category: item.category,
    });
  };

  const handleSettle = () => {
    if (!activeBill) return;
    settleBill(activeBill.id, selectedPaymentMethod);
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-neutral-800 bg-[#12161f]">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Service en Salle & Caisse / Additions</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Commandes par table, facturation instantanée et encaissement multi-moyens (Wave, Orange Money, CB, Espèces)
          </p>
        </div>

        {/* Table Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Sélection Table :
          </span>
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-amber-500"
          >
            {tables.map(t => (
              <option key={t.id} value={t.id}>
                Table {t.number} - {t.label} ({t.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* POS Grid: Left is Menu Catalog, Right is Current Table Bill */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Menu Catalog for Ordering (7 cols) */}
        <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl border border-neutral-800 bg-[#12161f]">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Carte Gastronomique & Bar Kajazoma</h3>
            </div>
            <span className="text-xs text-neutral-400">
              Cliquer pour ajouter à la Table {selectedTable?.number}
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {menuCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedMenuCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedMenuCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat === 'all' ? 'Toute la carte' : cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleAddItemToTable(item)}
                className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900 hover:border-amber-500/40 transition-all text-left flex flex-col justify-between h-24 group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {item.name}
                  </div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/50">
                  <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                    {item.priceFCFA.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className="text-xs font-medium text-neutral-400 group-hover:text-white flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Current Table Bill & Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-5 p-5 rounded-2xl border border-neutral-800 bg-[#12161f]">
          
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">
                Table {selectedTable?.number} · {selectedTable?.label}
              </h3>
              <p className="text-xs text-neutral-400">
                {selectedTable?.zone.toUpperCase()} · Statut: {selectedTable?.status}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>

          {/* Items on current bill */}
          {activeBill && activeBill.items.length > 0 ? (
            <div className="space-y-4">
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-800/60">
                {activeBill.items.map((item, idx) => (
                  <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {item.quantity} x {item.priceFCFA.toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                    <span className="font-mono font-bold text-neutral-200 tabular-nums">
                      {(item.priceFCFA * item.quantity).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Sous-total HT :</span>
                  <span className="font-mono tabular-nums">
                    {Math.round(activeBill.totalFCFA * 0.82).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>TVA & Service (18%) :</span>
                  <span className="font-mono tabular-nums">
                    {Math.round(activeBill.totalFCFA * 0.18).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Total TTC :</span>
                  <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                    {activeBill.totalFCFA.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Mode de Paiement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('Wave')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                      selectedPaymentMethod === 'Wave'
                        ? 'border-sky-500 bg-sky-500/15 text-sky-300'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>Wave CI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('Orange Money')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                      selectedPaymentMethod === 'Orange Money'
                        ? 'border-orange-500 bg-orange-500/15 text-orange-300'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-orange-400" />
                    <span>Orange Mo.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('MTN MoMo')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                      selectedPaymentMethod === 'MTN MoMo'
                        ? 'border-yellow-500 bg-yellow-500/15 text-yellow-300'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-yellow-400" />
                    <span>MTN MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('Carte Bancaire')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                      selectedPaymentMethod === 'Carte Bancaire'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Carte Visa/MC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('Espèces')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                      selectedPaymentMethod === 'Espèces'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-400" />
                    <span>Espèces (Cash)</span>
                  </button>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSettle}
                  className="flex-1 py-3 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Encaisser {activeBill.totalFCFA.toLocaleString('fr-FR')} FCFA</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400 space-y-3">
              <Utensils className="w-8 h-8 text-neutral-600 mx-auto" />
              <div>
                <p className="text-sm font-medium text-white">Aucune addition en cours pour cette table</p>
                <p className="text-xs text-neutral-500 mt-1">Sélectionnez des articles à gauche pour démarrer la note.</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Simulated Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#12161f] shadow-2xl p-6 space-y-4">
            <div className="text-center space-y-1 border-b border-neutral-800 pb-3">
              <div className="font-display text-lg font-bold text-amber-400 tracking-wider">
                KAJAZOMA CONCEPT
              </div>
              <div className="text-[11px] text-neutral-400">
                Restaurant & Galerie d'Art · Deux-Plateaux Vallons
              </div>
              <div className="text-[10px] text-neutral-500 font-mono">
                Abidjan · Tél: +225 27 22 41 78 90
              </div>
            </div>

            <div className="text-center py-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <h4 className="text-sm font-bold text-white">Addition Réglée avec Succès</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Mode: {selectedPaymentMethod}</p>
            </div>

            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-xs space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Date & Heure :</span>
                <span className="font-mono text-white">{new Date().toLocaleDateString('fr-FR')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Table libérée :</span>
                <span className="font-mono text-white">Table {selectedTable?.number}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Statut :</span>
                <span className="font-mono text-emerald-400">Payé & Clôturé</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer Reçu</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
              >
                Terminé
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
