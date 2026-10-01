import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { NavTab } from './Navbar';
import { RevenueAnalytics } from './RevenueAnalytics';
import { 
  Users, 
  Boxes, 
  CalendarDays, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  UtensilsCrossed,
  Wine
} from 'lucide-react';

interface DashboardOverviewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenNewReservation: () => void;
  onSelectTableForDetail: (tableId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab,
  onOpenNewReservation,
  onSelectTableForDetail,
}) => {
  const { 
    tables, 
    reservations, 
    stock, 
    staff, 
    briefing, 
    bills,
    currentService, 
    selectedDate,
    updateReservationStatus
  } = useRestaurant();

  // Metrics calculation
  const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
  const occupiedTables = tables.filter(t => t.status === 'occupee' || t.status === 'addition');
  const reservedTables = tables.filter(t => t.status === 'reservee');

  const todayReservations = reservations.filter(
    r => r.date === selectedDate && r.mealPeriod === currentService && r.status !== 'annulee'
  );

  const totalGuestsReserved = todayReservations.reduce((acc, r) => acc + r.guestsCount, 0);
  const occupancyPercentage = Math.round((totalGuestsReserved / totalCapacity) * 100);

  // Critical stock calculation
  const criticalStockItems = stock.filter(item => item.currentQuantity <= item.minThreshold);
  const totalStockValueFCFA = stock.reduce((acc, item) => acc + (item.currentQuantity * item.unitCostFCFA), 0);

  // Staff metrics
  const staffPresentCount = staff.filter(s => s.statusToday === 'present').length;
  const staffLateCount = staff.filter(s => s.statusToday === 'retard').length;

  // Active revenue
  const pendingRevenueFCFA = bills
    .filter(b => b.status !== 'payee')
    .reduce((acc, b) => acc + b.totalFCFA, 0);

  // Zone statistics
  const zones: { id: 'jardin' | 'galerie' | 'vip' | 'lounge'; name: string; icon: string; description: string }[] = [
    { id: 'jardin', name: 'Jardin Tropical & Véranda', icon: '🌿', description: 'Ambiance arborée, fontaine & brise lagunaire' },
    { id: 'galerie', name: 'Galerie d\'Art Contemporain', icon: '🎨', description: 'Tableaux et bronzes d\'artistes ivoiriens' },
    { id: 'vip', name: 'Salon VIP & Privé Kajazoma', icon: '✨', description: 'Intimité diplomatique & banquets d\'exception' },
    { id: 'lounge', name: 'Lounge Bar & Mixologie', icon: '🍸', description: 'Cocktails signature, infusions & accords' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Editorial Restaurant Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/60 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[220px]">
          {/* Text zone */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10 bg-gradient-to-r from-[#0e1117] via-[#0e1117]/95 to-transparent">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-500 font-medium tracking-wide">
                <span>RESTAURANT D'ART & GASTRONOMIE</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{currentService === 'dejeuner' ? 'Service Déjeuner' : 'Service Dîner'}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Kajazoma Concept Abidjan
              </h1>
              <p className="mt-2 text-sm text-neutral-300 max-w-xl leading-relaxed">
                Pilotage centralisé du service, du registre de réservations, des stocks d'économat frais et de la brigade en poste à Cocody Vallons.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNewReservation}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <span>Prendre une réservation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-lg border border-neutral-700/60 transition-colors whitespace-nowrap"
              >
                Ouvrir le plan de salle 2D
              </button>
            </div>
          </div>

          {/* Visual image showcase */}
          <div className="lg:col-span-5 relative h-48 lg:h-auto overflow-hidden">
            <img 
              src="/src/assets/images/kajazoma_terrace_garden_1790794353836.jpg" 
              alt="Jardin et terrasse du restaurant Kajazoma Abidjan" 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1117] via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] text-neutral-300 border border-neutral-700/50">
              Jardin & Galerie Ouverts
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Metric 1: Couverts */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Couverts Service</span>
            <CalendarDays className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {totalGuestsReserved} <span className="text-xs font-normal text-neutral-400">/ {totalCapacity}</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              <span className="text-amber-400 font-mono font-medium">{occupancyPercentage}%</span> occupation
            </div>
          </div>
        </div>

        {/* Metric 2: Tables en cours */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Tables Occupées</span>
            <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {occupiedTables.length} <span className="text-xs font-normal text-neutral-400">/ {tables.length}</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {reservedTables.length} tables réservées
            </div>
          </div>
        </div>

        {/* Metric 3: Économat Stock Value */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Valeur Économat</span>
            <Boxes className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white truncate" title={`${totalStockValueFCFA.toLocaleString('fr-FR')} FCFA`}>
              {Math.round(totalStockValueFCFA / 1000).toLocaleString('fr-FR')}k <span className="text-xs font-normal text-neutral-400">FCFA</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {stock.length} références actives
            </div>
          </div>
        </div>

        {/* Metric 4: Alertes Stock */}
        <div 
          onClick={() => setActiveTab('stock')}
          className="p-4 rounded-xl border border-neutral-800 bg-[#12161f] hover:border-amber-500/40 cursor-pointer transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Alertes Stock</span>
            <AlertTriangle className={`w-4 h-4 ${criticalStockItems.length > 0 ? 'text-rose-400' : 'text-neutral-500'}`} />
          </div>
          <div className="mt-3">
            <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${criticalStockItems.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {criticalStockItems.length}
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {criticalStockItems.length > 0 ? 'Sous seuil critique' : 'Stocks équilibrés'}
            </div>
          </div>
        </div>

        {/* Metric 5: Équipe en poste */}
        <div 
          onClick={() => setActiveTab('staff')}
          className="p-4 rounded-xl border border-neutral-800 bg-[#12161f] hover:border-amber-500/40 cursor-pointer transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Brigade en Poste</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {staffPresentCount} <span className="text-xs font-normal text-neutral-400">/ {staff.length}</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {staffLateCount > 0 ? `${staffLateCount} en retard` : 'Effectif au complet'}
            </div>
          </div>
        </div>

        {/* Metric 6: Additions en cours */}
        <div 
          onClick={() => setActiveTab('billing')}
          className="p-4 rounded-xl border border-neutral-800 bg-[#12161f] hover:border-amber-500/40 cursor-pointer transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Additions Ouvertes</span>
            <Wine className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white truncate">
              {Math.round(pendingRevenueFCFA / 1000).toLocaleString('fr-FR')}k <span className="text-xs font-normal text-neutral-400">FCFA</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {bills.filter(b => b.status !== 'payee').length} tables en cours
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Revenue & Analytics Section using Recharts */}
      <RevenueAnalytics />

      {/* Main Grid: Zones Status & Prochaines Arrivées & Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Zones de Répartition (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Occupation par Espace */}
          <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Occupation par Espace</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Répartition en temps réel des 15 tables de Kajazoma</p>
              </div>
              <button
                onClick={() => setActiveTab('reservations')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Voir le plan 2D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {zones.map((zone) => {
                const zoneTables = tables.filter(t => t.zone === zone.id);
                const zoneOccupied = zoneTables.filter(t => t.status === 'occupee' || t.status === 'addition').length;
                const zoneReserved = zoneTables.filter(t => t.status === 'reservee').length;
                const zoneCapacity = zoneTables.reduce((a, t) => a + t.capacity, 0);

                return (
                  <div
                    key={zone.id}
                    className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <span>{zone.icon}</span>
                          <span>{zone.name.split(' ')[0]} {zone.name.split(' ')[1]}</span>
                        </span>
                        <span className="text-xs font-mono tabular-nums text-neutral-400">
                          {zoneCapacity} places
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">{zone.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {zoneTables.filter(t => t.status === 'libre').length} libres
                        </span>
                        {zoneOccupied > 0 && (
                          <span className="inline-flex items-center gap-1 text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {zoneOccupied} occupées
                          </span>
                        )}
                        {zoneReserved > 0 && (
                          <span className="inline-flex items-center gap-1 text-sky-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            {zoneReserved} rés.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Prochaines Arrivées / Réservations du service */}
          <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Arrivées & Service Actuel</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {todayReservations.length} réservations programmées pour ce service
                </p>
              </div>
              <button
                onClick={() => setActiveTab('reservations')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Registre complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayReservations.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <p className="text-sm">Aucune réservation pour ce créneau.</p>
                <button
                  onClick={onOpenNewReservation}
                  className="mt-2 text-xs text-amber-400 hover:underline"
                >
                  Ajouter la première réservation
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayReservations.slice(0, 4).map((res) => {
                  const table = tables.find(t => t.id === res.tableId);
                  
                  return (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-semibold shrink-0">
                          {res.time}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{res.customerName}</span>
                            <span className="text-xs text-neutral-400">({res.guestsCount} pers.)</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                            <span>{table ? `Table ${table.number} · ${table.label}` : 'Table non assignée'}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{res.customerPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {res.status === 'installee' ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Installé
                          </span>
                        ) : res.status === 'confirmee' ? (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'installee')}
                            className="text-xs px-3 py-1 font-medium rounded-md bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                          >
                            Installer
                          </button>
                        ) : (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'confirmee')}
                            className="text-xs px-2.5 py-1 font-medium rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                          >
                            Confirmer
                          </button>
                        )}

                        {table && (
                          <button
                            onClick={() => onSelectTableForDetail(table.id)}
                            className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded-md hover:bg-neutral-800 transition-colors"
                          >
                            Détails
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Briefing du Chef & Alertes Économat (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Briefing de Service du Chef */}
          <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-semibold text-white">Briefing Service & Chef</h3>
              </div>
              <button
                onClick={() => setActiveTab('staff')}
                className="text-xs text-amber-400 hover:underline"
              >
                Modifier
              </button>
            </div>

            {/* Plat Signature */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Plat du Jour Recommandé
              </span>
              <p className="text-xs text-neutral-200 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 leading-relaxed">
                {briefing.chefSpecial}
              </p>
            </div>

            {/* Accord Vins */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-indigo-400 flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5" />
                Suggestion Caviste & Sommelière
              </span>
              <p className="text-xs text-neutral-300 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 leading-relaxed">
                {briefing.wineRecommendation}
              </p>
            </div>

            {/* Consignes VIP */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-rose-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Notes de Service & Protocole
              </span>
              <p className="text-xs text-neutral-300 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 leading-relaxed">
                {briefing.managerNotes}
              </p>
            </div>
          </div>

          {/* Alertes Économat & Produits frais */}
          <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f]">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-semibold text-white">Alertes Économat</h3>
              </div>
              <button
                onClick={() => setActiveTab('stock')}
                className="text-xs text-amber-400 hover:underline"
              >
                Gérer les stocks
              </button>
            </div>

            {criticalStockItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                Tous les niveaux de stock respectent les seuils de sécurité.
              </div>
            ) : (
              <div className="space-y-2.5">
                {criticalStockItems.slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{item.name}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {item.storageLocation} · Fournisseur: {item.supplierName}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono text-rose-400 tabular-nums">
                        {item.currentQuantity} {item.unit}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Seuil: {item.minThreshold} {item.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
