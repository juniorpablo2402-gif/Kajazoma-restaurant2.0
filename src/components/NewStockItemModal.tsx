import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StockCategory } from '../types';
import { X, Check } from 'lucide-react';

interface NewStockItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewStockItemModal: React.FC<NewStockItemModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { suppliers, addStockItem } = useRestaurant();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<StockCategory>('maree_poissons');
  const [currentQuantity, setCurrentQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<'kg' | 'g' | 'L' | 'bouteille' | 'carton' | 'botte' | 'sac' | 'portion' | 'regime'>('kg');
  const [minThreshold, setMinThreshold] = useState<number>(5);
  const [optimalQuantity, setOptimalQuantity] = useState<number>(20);
  const [unitCostFCFA, setUnitCostFCFA] = useState<number>(5000);
  const [storageLocation, setStorageLocation] = useState('Chambre froide positive 1');
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || 'SUP-01');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const supplier = suppliers.find(s => s.id === supplierId);

    addStockItem({
      name: name.trim(),
      category,
      currentQuantity: Number(currentQuantity),
      unit,
      minThreshold: Number(minThreshold),
      optimalQuantity: Number(optimalQuantity),
      unitCostFCFA: Number(unitCostFCFA),
      storageLocation,
      supplierId,
      supplierName: supplier ? supplier.name : 'Fournisseur local',
      lastRestockDate: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#12161f] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div>
            <h2 className="text-base font-bold text-white font-display">Nouveau Produit Économat</h2>
            <p className="text-xs text-neutral-400">Ajouter un ingrédient ou une référence en réserve</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Désignation du Produit *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Filet de Mérou, Poivre de Penja, Piment Végétarien..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StockCategory)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="maree_poissons">🐟 Marée & Poissons</option>
                <option value="boucherie_viandes">🥩 Boucherie & Volailles</option>
                <option value="primeurs_fruits">🍌 Primeurs & Maraîchers</option>
                <option value="epicerie_seche">🌾 Épicerie & Condiments</option>
                <option value="cave_boissons">🍾 Cave, Vins & Bar</option>
                <option value="hygiene_emballage">🧼 Hygiène & Linge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Unité de Mesure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="kg">Kilogramme (kg)</option>
                <option value="g">Gramme (g)</option>
                <option value="L">Litre (L)</option>
                <option value="bouteille">Bouteille</option>
                <option value="carton">Carton</option>
                <option value="portion">Portion / Pièce</option>
                <option value="botte">Botte</option>
                <option value="sac">Sac</option>
              </select>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Stock Initial
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Seuil Alerte
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono text-rose-400 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Stock Optimal
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={optimalQuantity}
                onChange={(e) => setOptimalQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono text-emerald-400 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Unit Cost & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Coût Unitaire (FCFA)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                required
                value={unitCostFCFA}
                onChange={(e) => setUnitCostFCFA(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Emplacement de Stockage
              </label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Chambre froide positive 1">Chambre froide positive 1 (Poissons)</option>
                <option value="Chambre froide positive 2">Chambre froide positive 2 (Viandes)</option>
                <option value="Chambre froide négative (-18°C)">Chambre froide négative (-18°C)</option>
                <option value="Réserve fruits & légumes ventilée">Réserve primeurs ventilée</option>
                <option value="Économat sec">Économat sec (Épices, riz, huiles)</option>
                <option value="Cave climatisée 14°C">Cave à vin climatisée 14°C</option>
                <option value="Comptoir Bar">Comptoir Bar</option>
              </select>
            </div>
          </div>

          {/* Supplier */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Fournisseur Local Référencé
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
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
              <span>Enregistrer le Produit</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
