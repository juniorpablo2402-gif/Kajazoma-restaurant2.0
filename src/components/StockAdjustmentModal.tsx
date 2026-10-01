import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StockItem, StockMovementType } from '../types';
import { X, ArrowDownRight, ArrowUpRight, AlertTriangle, RefreshCw, Check } from 'lucide-react';

interface StockAdjustmentModalProps {
  item: StockItem | null;
  onClose: () => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  item,
  onClose,
}) => {
  const { adjustStockQuantity } = useRestaurant();

  const [type, setType] = useState<StockMovementType>('sortie');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState('Service & mise en place');
  const [performedBy, setPerformedBy] = useState('Économe Soro');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    let delta = quantity;
    if (type === 'sortie' || type === 'perte') {
      delta = -quantity;
    }

    adjustStockQuantity(item.id, delta, type, reason, performedBy);
    onClose();
  };

  const resultingStock = type === 'entree' 
    ? item.currentQuantity + quantity
    : Math.max(0, item.currentQuantity - quantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-[#12161f] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div>
            <h2 className="text-base font-bold text-white">Mouvement de Stock</h2>
            <p className="text-xs text-neutral-400 mt-0.5">{item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Current Stock Banner */}
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400">Stock Actuel en Réserve</span>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                {item.currentQuantity} {item.unit}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400">Seuil Minimal</span>
              <div className="text-xs font-mono text-amber-400 tabular-nums">
                {item.minThreshold} {item.unit}
              </div>
            </div>
          </div>

          {/* Movement Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Type d'Opération
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('sortie');
                  setReason('Prélèvement service du jour');
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  type === 'sortie'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                    : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-4 h-4 text-amber-400" />
                <span>Sortie Service</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('entree');
                  setReason('Livraison fournisseur conforme');
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  type === 'entree'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>Entrée Livraison</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('perte');
                  setReason('Casse / Dépassement date');
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  type === 'perte'
                    ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                    : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Perte / Casse</span>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Quantité à mouvementer ({item.unit}) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 text-base font-mono font-bold bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500 tabular-nums"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Motif du mouvement
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Performed by */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Responsable de l'opération
            </label>
            <select
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Chef Exécutif Koffi">Chef Exécutif Koffi</option>
              <option value="Sous-Chef Awa">Sous-Chef Awa</option>
              <option value="Économe Soro">Économe Soro</option>
              <option value="Chef Barman Yao">Chef Barman Yao</option>
              <option value="Sommelière Bintou">Sommelière Bintou</option>
            </select>
          </div>

          {/* Result preview */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between">
            <span className="text-neutral-400">Nouveau stock projeté :</span>
            <span className={`font-mono font-bold tabular-nums ${
              resultingStock <= item.minThreshold ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {resultingStock.toFixed(1)} {item.unit}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Valider le Mouvement</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
