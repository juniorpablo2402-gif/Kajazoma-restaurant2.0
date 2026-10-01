import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ReservationStatus, TableZone } from '../types';
import { 
  Calendar, 
  Search, 
  Plus, 
  MapPin, 
  Users, 
  Phone, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  Download,
  Trash2
} from 'lucide-react';

interface ReservationsViewProps {
  onOpenNewReservation: () => void;
  onSelectTableForDetail: (tableId: string) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  onOpenNewReservation,
  onSelectTableForDetail,
}) => {
  const { 
    tables, 
    reservations, 
    currentService, 
    setCurrentService,
    selectedDate, 
    setSelectedDate,
    updateReservationStatus,
    deleteReservation
  } = useRestaurant();

  const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering reservations
  const filteredReservations = reservations.filter(res => {
    const matchDate = res.date === selectedDate;
    const matchService = res.mealPeriod === currentService;
    const matchStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchZone = zoneFilter === 'all' || res.tableZone === zoneFilter;
    const matchSearch = 
      res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.customerPhone.includes(searchQuery) ||
      (res.specialRequests && res.specialRequests.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchDate && matchService && matchStatus && matchZone && matchSearch;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Service', 'Client', 'Téléphone', 'Couverts', 'Table', 'Zone', 'Statut', 'Arrhes FCFA', 'Notes'];
    const rows = filteredReservations.map(r => {
      const t = tables.find(tbl => tbl.id === r.tableId);
      return [
        r.id,
        r.date,
        r.mealPeriod,
        `"${r.customerName.replace(/"/g, '""')}"`,
        r.customerPhone,
        r.guestsCount,
        t ? `Table ${t.number}` : 'N/A',
        r.tableZone,
        r.status,
        r.depositFCFA,
        `"${(r.specialRequests || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kajazoma_reservations_${selectedDate}_${currentService}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar & Controls */}
      <div className="p-4 sm:p-5 rounded-2xl border border-neutral-800 bg-[#12161f] space-y-4 shadow-sm">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Gestion des Réservations & Plan de Salle
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Restaurant Kajazoma · 15 tables · 120 couverts répartis en 4 espaces exclusifs
            </p>
          </div>

          {/* View Mode Toggle & New Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-neutral-900 rounded-lg border border-neutral-800">
              <button
                onClick={() => setViewMode('floor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'floor'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Plan de Salle 2D</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Registre Liste</span>
              </button>
            </div>

            <button
              onClick={onOpenNewReservation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Réservation</span>
            </button>
          </div>
        </div>

        {/* Date, Service & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-neutral-800/80">
          
          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Date du Service
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700/80 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Service toggle */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Créneau / Service
            </label>
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-neutral-900 rounded-lg border border-neutral-700/80">
              <button
                onClick={() => setCurrentService('dejeuner')}
                className={`py-1 text-xs font-medium rounded-md transition-colors ${
                  currentService === 'dejeuner'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ☀️ Déjeuner
              </button>
              <button
                onClick={() => setCurrentService('diner')}
                className={`py-1 text-xs font-medium rounded-md transition-colors ${
                  currentService === 'diner'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🌙 Dîner
              </button>
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700/80 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmee">Confirmées</option>
              <option value="installee">Installées</option>
              <option value="en_attente">En attente</option>
              <option value="terminee">Terminées</option>
              <option value="annulee">Annulées</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Rechercher Client / Contact
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Nom, téléphone +225..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700/80 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Main View Display */}
      {viewMode === 'floor' ? (
        /* 2D Interactive Floor Plan */
        <div className="p-5 sm:p-6 rounded-2xl border border-neutral-800 bg-[#12161f] space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Plan de Salle Interactif</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Cliquez sur une table pour afficher ses détails, assigner des couverts ou gérer l'addition.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Libre</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Occupée</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Réservée</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Addition</span>
              </span>
            </div>
          </div>

          {/* Interactive Plan Board with 4 atmospheric zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Zone 1: Jardin Tropical */}
            <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌴</span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">Jardin Tropical & Véranda</h4>
                    <p className="text-[11px] text-neutral-400">Terrasse arborée, fontaine & tables en ébène</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400/80">40 places</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.filter(t => t.zone === 'jardin').map(table => {
                  const linkedRes = table.currentReservationId 
                    ? reservations.find(r => r.id === table.currentReservationId)
                    : reservations.find(r => r.tableId === table.id && r.status === 'installee');

                  let statusColor = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400';
                  if (table.status === 'occupee') statusColor = 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:border-amber-400';
                  if (table.status === 'reservee') statusColor = 'border-sky-500/40 bg-sky-950/30 text-sky-300 hover:border-sky-400';
                  if (table.status === 'addition') statusColor = 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300 hover:border-indigo-400';

                  return (
                    <button
                      key={table.id}
                      onClick={() => onSelectTableForDetail(table.id)}
                      className={`p-3 rounded-xl border ${statusColor} text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-28 cursor-pointer shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm">T{table.number}</span>
                        <span className="text-[11px] font-mono text-neutral-400">{table.capacity} pl.</span>
                      </div>
                      <div className="my-auto">
                        <div className="text-xs font-semibold text-white truncate">{table.label}</div>
                        {linkedRes ? (
                          <div className="text-[11px] text-amber-400 truncate mt-0.5">
                            {linkedRes.customerName.split(' ')[0]} {linkedRes.customerName.split(' ')[1] || ''}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500 mt-0.5 capitalize">{table.status}</div>
                        )}
                      </div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                        {table.status}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone 2: Galerie d'Art Contemporain */}
            <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/10 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎨</span>
                  <div>
                    <h4 className="text-sm font-bold text-amber-400">Galerie d'Art Contemporain</h4>
                    <p className="text-[11px] text-neutral-400">Exposition permanente de peintres & sculpteurs</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400/80">30 places</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {tables.filter(t => t.zone === 'galerie').map(table => {
                  const linkedRes = table.currentReservationId 
                    ? reservations.find(r => r.id === table.currentReservationId)
                    : reservations.find(r => r.tableId === table.id && r.status === 'installee');

                  let statusColor = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400';
                  if (table.status === 'occupee') statusColor = 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:border-amber-400';
                  if (table.status === 'reservee') statusColor = 'border-sky-500/40 bg-sky-950/30 text-sky-300 hover:border-sky-400';
                  if (table.status === 'addition') statusColor = 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300 hover:border-indigo-400';

                  return (
                    <button
                      key={table.id}
                      onClick={() => onSelectTableForDetail(table.id)}
                      className={`p-3 rounded-xl border ${statusColor} text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-28 cursor-pointer shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm">T{table.number}</span>
                        <span className="text-[11px] font-mono text-neutral-400">{table.capacity} pl.</span>
                      </div>
                      <div className="my-auto">
                        <div className="text-xs font-semibold text-white truncate">{table.label}</div>
                        {linkedRes ? (
                          <div className="text-[11px] text-amber-400 truncate mt-0.5">
                            {linkedRes.customerName.split(' ')[0]} {linkedRes.customerName.split(' ')[1] || ''}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500 mt-0.5 capitalize">{table.status}</div>
                        )}
                      </div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                        {table.status}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone 3: Salon VIP & Privé */}
            <div className="p-4 rounded-xl border border-purple-900/30 bg-purple-950/10 space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <div>
                    <h4 className="text-sm font-bold text-purple-400">Salon VIP & Privé Kajazoma</h4>
                    <p className="text-[11px] text-neutral-400">Dîners diplomatiques, affaires & célébrations</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-purple-400/80">20 places</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tables.filter(t => t.zone === 'vip').map(table => {
                  const linkedRes = table.currentReservationId 
                    ? reservations.find(r => r.id === table.currentReservationId)
                    : reservations.find(r => r.tableId === table.id && r.status === 'installee');

                  let statusColor = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400';
                  if (table.status === 'occupee') statusColor = 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:border-amber-400';
                  if (table.status === 'reservee') statusColor = 'border-sky-500/40 bg-sky-950/30 text-sky-300 hover:border-sky-400';
                  if (table.status === 'addition') statusColor = 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300 hover:border-indigo-400';

                  return (
                    <button
                      key={table.id}
                      onClick={() => onSelectTableForDetail(table.id)}
                      className={`p-3 rounded-xl border ${statusColor} text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-28 cursor-pointer shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm">T{table.number}</span>
                        <span className="text-[11px] font-mono text-neutral-400">{table.capacity} pl.</span>
                      </div>
                      <div className="my-auto">
                        <div className="text-xs font-semibold text-white truncate">{table.label}</div>
                        {linkedRes ? (
                          <div className="text-[11px] text-purple-300 truncate mt-0.5">
                            {linkedRes.customerName}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500 mt-0.5 capitalize">{table.status}</div>
                        )}
                      </div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                        {table.status}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone 4: Lounge Bar & Mixologie */}
            <div className="p-4 rounded-xl border border-sky-900/30 bg-sky-950/10 space-y-4">
              <div className="flex items-center justify-between border-b border-sky-900/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🍸</span>
                  <div>
                    <h4 className="text-sm font-bold text-sky-400">Lounge Bar & Mixologie</h4>
                    <p className="text-[11px] text-neutral-400">Comptoir signatures & salon dégustation</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-sky-400/80">30 places</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {tables.filter(t => t.zone === 'lounge').map(table => {
                  const linkedRes = table.currentReservationId 
                    ? reservations.find(r => r.id === table.currentReservationId)
                    : reservations.find(r => r.tableId === table.id && r.status === 'installee');

                  let statusColor = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400';
                  if (table.status === 'occupee') statusColor = 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:border-amber-400';
                  if (table.status === 'reservee') statusColor = 'border-sky-500/40 bg-sky-950/30 text-sky-300 hover:border-sky-400';
                  if (table.status === 'addition') statusColor = 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300 hover:border-indigo-400';

                  return (
                    <button
                      key={table.id}
                      onClick={() => onSelectTableForDetail(table.id)}
                      className={`p-3 rounded-xl border ${statusColor} text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-28 cursor-pointer shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm">T{table.number}</span>
                        <span className="text-[11px] font-mono text-neutral-400">{table.capacity} pl.</span>
                      </div>
                      <div className="my-auto">
                        <div className="text-xs font-semibold text-white truncate">{table.label}</div>
                        {linkedRes ? (
                          <div className="text-[11px] text-sky-300 truncate mt-0.5">
                            {linkedRes.customerName.split(' ')[0]}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500 mt-0.5 capitalize">{table.status}</div>
                        )}
                      </div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                        {table.status}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Detailed List Table */
        <div className="p-5 sm:p-6 rounded-2xl border border-neutral-800 bg-[#12161f] space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Registre des Réservations</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {filteredReservations.length} réservation(s) correspondante(s)
              </p>
            </div>
            
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 text-neutral-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-3">Heure</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Téléphone</th>
                  <th className="py-3 px-3 text-center">Couverts</th>
                  <th className="py-3 px-3">Table Attribuée</th>
                  <th className="py-3 px-3">Demandes / Notes</th>
                  <th className="py-3 px-3 text-right">Arrhes</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-400">
                      Aucune réservation trouvée pour ces critères de recherche.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map(res => {
                    const table = tables.find(t => t.id === res.tableId);

                    return (
                      <tr key={res.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-amber-400">
                          {res.time}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{res.customerName}</div>
                          {res.tags && res.tags.length > 0 && (
                            <div className="text-[10px] text-amber-400/80 font-mono">
                              {res.tags.join(' · ')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-neutral-300">
                          {res.customerPhone}
                        </td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold text-white">
                          {res.guestsCount}
                        </td>
                        <td className="py-3 px-3">
                          {table ? (
                            <button
                              onClick={() => onSelectTableForDetail(table.id)}
                              className="text-amber-400 hover:underline font-medium"
                            >
                              T{table.number} ({table.label})
                            </button>
                          ) : (
                            <span className="text-neutral-500 italic">Non assignée</span>
                          )}
                        </td>
                        <td className="py-3 px-3 max-w-xs text-neutral-300 truncate" title={res.specialRequests}>
                          {res.specialRequests || '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-200">
                          {res.depositFCFA > 0 ? `${res.depositFCFA.toLocaleString('fr-FR')} F` : '—'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                            res.status === 'installee' 
                              ? 'text-emerald-400 bg-emerald-500/10' 
                              : res.status === 'confirmee'
                              ? 'text-sky-400 bg-sky-500/10'
                              : res.status === 'terminee'
                              ? 'text-neutral-400 bg-neutral-800'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}>
                            {res.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.status === 'confirmee' && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'installee')}
                                className="px-2 py-1 text-[11px] font-semibold rounded bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                              >
                                Installer
                              </button>
                            )}
                            {res.status === 'installee' && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'terminee')}
                                className="px-2 py-1 text-[11px] font-semibold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                              >
                                Clôturer
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm(`Supprimer la réservation de ${res.customerName} ?`)) {
                                  deleteReservation(res.id);
                                }
                              }}
                              className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                              title="Supprimer"
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

    </div>
  );
};
