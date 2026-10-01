import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StockCategory, StockItem } from '../types';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Truck, 
  CheckCircle2, 
  Download,
  Trash2,
  Clock,
  Phone,
  SlidersHorizontal
} from 'lucide-react';

interface StockManagementViewProps {
  onOpenNewStockItem: () => void;
}

export const StockManagementView: React.FC<StockManagementViewProps> = ({
  onOpenNewStockItem,
}) => {
  const { 
    stock, 
    stockMovements, 
    suppliers, 
    deleteStockItem,
    adjustStockQuantity 
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'inventory' | 'movements' | 'suppliers'>('inventory');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAlerts, setOnlyAlerts] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adjustingItem, setAdjustingItem] = useState<StockItem | null>(null);

  // Category labels mapping
  const categoryLabels: Record<StockCategory, { label: string; icon: string }> = {
    maree_poissons: { label: 'Marée & Poissons', icon: '🐟' },
    boucherie_viandes: { label: 'Boucherie & Volailles', icon: '🥩' },
    primeurs_fruits: { label: 'Primeurs & Maraîchers', icon: '🍌' },
    epicerie_seche: { label: 'Épicerie & Condiments', icon: '🌾' },
    cave_boissons: { label: 'Cave, Vins & Bar', icon: '🍾' },
    hygiene_emballage: { label: 'Hygiène & Linge', icon: '🧼' },
  };

  // Filtered stock
  const filteredStock = stock.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchAlerts = !onlyAlerts || item.currentQuantity <= item.minThreshold;
    const matchSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storageLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchAlerts && matchSearch;
  });

  // Totals
  const totalStockValueFCFA = stock.reduce((acc, curr) => acc + (curr.currentQuantity * curr.unitCostFCFA), 0);
  const criticalItems = stock.filter(s => s.currentQuantity <= s.minThreshold);

  const handleExportStockCSV = () => {
    const headers = ['Code', 'Désignation', 'Catégorie', 'Quantité', 'Unité', 'Seuil Min', 'Stock Optimal', 'Coût Unitaire FCFA', 'Valeur Totale FCFA', 'Emplacement', 'Fournisseur'];
    const rows = filteredStock.map(s => [
      s.code,
      `"${s.name.replace(/"/g, '""')}"`,
      s.category,
      s.currentQuantity,
      s.unit,
      s.minThreshold,
      s.optimalQuantity,
      s.unitCostFCFA,
      Math.round(s.currentQuantity * s.unitCostFCFA),
      `"${s.storageLocation.replace(/"/g, '""')}"`,
      `"${s.supplierName.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventaire_kajazoma_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Valeur Totale Stock</span>
            <Boxes className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalStockValueFCFA.toLocaleString('fr-FR')} <span className="text-xs font-normal text-neutral-400">FCFA</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Valorisation de l'économat Kajazoma</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Références Actives</span>
            <span className="text-xs font-mono text-sky-400 font-bold">{stock.length} articles</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {stock.length}
            </div>
            <p className="text-xs text-neutral-400 mt-1">Réparties dans 6 familles de produits</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Alertes Réappro</span>
            <AlertTriangle className={`w-4 h-4 ${criticalItems.length > 0 ? 'text-rose-400' : 'text-neutral-500'}`} />
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold font-mono tabular-nums ${criticalItems.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {criticalItems.length}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {criticalItems.length > 0 ? 'Articles sous le seuil minimal' : 'Stocks en équilibre'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Fournisseurs Abidjan</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {suppliers.length}
            </div>
            <p className="text-xs text-neutral-400 mt-1">Port, coopératives & marchés locaux</p>
          </div>
        </div>

      </div>

      {/* Main Container */}
      <div className="p-5 sm:p-6 rounded-2xl border border-neutral-800 bg-[#12161f] space-y-5">
        
        {/* Top Header & Sub-Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Gestion des Stocks & Économat</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Suivi des produits frais, denrées du marché d'Adjamé, poissons du Port de Vridi et cave
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-neutral-900 rounded-lg border border-neutral-800">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'inventory'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Inventaire
              </button>
              <button
                onClick={() => setActiveTab('movements')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'movements'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Mouvements ({stockMovements.length})
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'suppliers'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Fournisseurs ({suppliers.length})
              </button>
            </div>

            {activeTab === 'inventory' && (
              <>
                <button
                  onClick={handleExportStockCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exporter</span>
                </button>
                <button
                  onClick={onOpenNewStockItem}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nouveau Produit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Filter toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  Tous ({stock.length})
                </button>
                {Object.entries(categoryLabels).map(([catKey, catInfo]) => {
                  const count = stock.filter(s => s.category === catKey).length;
                  return (
                    <button
                      key={catKey}
                      onClick={() => setSelectedCategory(catKey)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        selectedCategory === catKey
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.label.split('&')[0]}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Only Alerts Toggle */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 select-none whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={onlyAlerts}
                    onChange={(e) => setOnlyAlerts(e.target.checked)}
                    className="rounded border-neutral-700 text-rose-600 focus:ring-rose-500 w-4 h-4 bg-neutral-900"
                  />
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Alertes seuil bas ({criticalItems.length})</span>
                  </span>
                </label>

                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrer un ingrédient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700/80 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Inventory Data Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Code</th>
                    <th className="py-3 px-3">Désignation</th>
                    <th className="py-3 px-3">Catégorie</th>
                    <th className="py-3 px-3">Emplacement</th>
                    <th className="py-3 px-3 text-right">Stock Actuel</th>
                    <th className="py-3 px-3 text-center">Niveau / Seuil</th>
                    <th className="py-3 px-3 text-right">Coût Unitaire</th>
                    <th className="py-3 px-3 text-right">Valeur Stock</th>
                    <th className="py-3 px-3">Fournisseur</th>
                    <th className="py-3 px-3 text-center">Actions Rapides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredStock.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-neutral-400">
                        Aucun article correspondant dans l'économat.
                      </td>
                    </tr>
                  ) : (
                    filteredStock.map(item => {
                      const isAlert = item.currentQuantity <= item.minThreshold;
                      const percentage = Math.min(100, Math.round((item.currentQuantity / item.optimalQuantity) * 100));
                      const itemTotalValue = Math.round(item.currentQuantity * item.unitCostFCFA);

                      return (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-neutral-900/40 transition-colors ${
                            isAlert ? 'bg-rose-500/5' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-semibold text-neutral-400 text-[11px]">
                            {item.code}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white">{item.name}</div>
                            {item.expiryDate && (
                              <div className="text-[10px] text-neutral-500 font-mono">
                                DLC: {item.expiryDate}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-neutral-300">
                            <span className="text-[11px]">
                              {categoryLabels[item.category]?.icon} {categoryLabels[item.category]?.label.split('&')[0]}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-neutral-400 text-[11px]">
                            {item.storageLocation}
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">
                            <span className={`font-bold text-sm ${isAlert ? 'text-rose-400' : 'text-white'}`}>
                              {item.currentQuantity}
                            </span>
                            <span className="text-neutral-400 text-xs ml-1">{item.unit}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="w-24 mx-auto space-y-1">
                              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isAlert ? 'bg-rose-500' : percentage < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.max(8, percentage)}%` }}
                                />
                              </div>
                              <div className="text-[10px] text-neutral-400 font-mono">
                                Min: {item.minThreshold} {item.unit}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-300">
                            {item.unitCostFCFA.toLocaleString('fr-FR')} F
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-white">
                            {itemTotalValue.toLocaleString('fr-FR')} F
                          </td>
                          <td className="py-3 px-3 text-neutral-400 text-[11px] truncate max-w-[140px]" title={item.supplierName}>
                            {item.supplierName}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Quick sortie button */}
                              <button
                                onClick={() => adjustStockQuantity(item.id, -1, 'sortie', 'Sortie cuisine rapide')}
                                title="Sortie 1 unité"
                                className="w-6 h-6 rounded bg-neutral-800 hover:bg-amber-600 hover:text-white text-neutral-300 flex items-center justify-center text-xs font-mono font-bold transition-colors"
                              >
                                -
                              </button>
                              {/* Quick entree button */}
                              <button
                                onClick={() => adjustStockQuantity(item.id, 1, 'entree', 'Réapprovisionnement rapide')}
                                title="Entrée 1 unité"
                                className="w-6 h-6 rounded bg-neutral-800 hover:bg-emerald-600 hover:text-white text-neutral-300 flex items-center justify-center text-xs font-mono font-bold transition-colors"
                              >
                                +
                              </button>
                              {/* Full movement dialog */}
                              <button
                                onClick={() => setAdjustingItem(item)}
                                className="px-2 py-1 text-[11px] font-medium rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                              >
                                Mouvement
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Supprimer ${item.name} de l'inventaire ?`)) {
                                    deleteStockItem(item.id);
                                  }
                                }}
                                className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                                title="Supprimer de l'économat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 2: Stock Movements History */}
        {activeTab === 'movements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Journal des Mouvements d'Économat</h3>
                <p className="text-xs text-neutral-400">Traçabilité complète des entrées fournisseurs, sorties cuisine et pertes</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Date & Heure</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Article</th>
                    <th className="py-3 px-3 text-right">Quantité</th>
                    <th className="py-3 px-3 text-right">Valeur Estimée</th>
                    <th className="py-3 px-3">Motif & Justificatif</th>
                    <th className="py-3 px-3">Opérateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {stockMovements.map(mov => {
                    let typeBadge = (
                      <span className="flex items-center gap-1 font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] w-fit">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Entrée
                      </span>
                    );
                    if (mov.type === 'sortie') {
                      typeBadge = (
                        <span className="flex items-center gap-1 font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[11px] w-fit">
                          <ArrowDownRight className="w-3.5 h-3.5" /> Sortie
                        </span>
                      );
                    } else if (mov.type === 'perte') {
                      typeBadge = (
                        <span className="flex items-center gap-1 font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[11px] w-fit">
                          <AlertTriangle className="w-3.5 h-3.5" /> Perte
                        </span>
                      );
                    }

                    return (
                      <tr key={mov.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">
                          {new Date(mov.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} · {new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">{typeBadge}</td>
                        <td className="py-3 px-3 font-semibold text-white">{mov.itemName}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-white">
                          {mov.quantity} {mov.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-300">
                          {mov.costFCFA.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3 px-3 text-neutral-300 max-w-sm">{mov.reason}</td>
                        <td className="py-3 px-3 text-neutral-400 text-[11px] font-medium">{mov.performedBy}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Local Suppliers Directory */}
        {activeTab === 'suppliers' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Annuaire des Fournisseurs d'Abidjan</h3>
              <p className="text-xs text-neutral-400">Circuits courts, pêcheries lagunaires, coopératives maraîchères et cavistes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map(sup => (
                <div key={sup.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-white">{sup.name}</h4>
                      <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        ★ {sup.rating}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400/80 font-medium mt-0.5">{sup.category}</p>
                    <p className="text-[11px] text-neutral-400 mt-2">{sup.address}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Contact :</span>
                      <span>{sup.contactPerson}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Téléphone :</span>
                      <a href={`tel:${sup.phone}`} className="font-mono text-amber-400 hover:underline">
                        {sup.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Livraisons :</span>
                      <span className="font-mono text-neutral-300 text-[11px]">{sup.deliveryDays}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <StockAdjustmentModal
          item={adjustingItem}
          onClose={() => setAdjustingItem(null)}
        />
      )}

    </div>
  );
};
