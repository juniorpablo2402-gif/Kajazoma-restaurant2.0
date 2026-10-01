import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { AttendanceToday, ShiftType, StaffDepartment } from '../types';
import { NewStaffModal } from './NewStaffModal';
import { 
  Users, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Coins, 
  Sparkles, 
  Phone, 
  Trash2, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export const StaffManagementView: React.FC = () => {
  const { 
    staff, 
    briefing, 
    updateStaffStatus, 
    updateStaffShift, 
    deleteStaffMember, 
    updateBriefing 
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'attendance' | 'schedule' | 'tips' | 'briefing'>('attendance');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isNewStaffOpen, setIsNewStaffOpen] = useState(false);

  // Tips pool local calculations
  const [tipsPoolInput, setTipsPoolInput] = useState<number>(briefing.tipsPoolFCFA);
  const [kitchenSharePercent, setKitchenSharePercent] = useState<number>(40); // 40% cuisine, 60% salle

  // Briefing editable state
  const [editingChefSpecial, setEditingChefSpecial] = useState(briefing.chefSpecial);
  const [editingManagerNotes, setEditingManagerNotes] = useState(briefing.managerNotes);
  const [editingWineRec, setEditingWineRec] = useState(briefing.wineRecommendation);

  const departmentLabels: Record<StaffDepartment, { label: string; icon: string }> = {
    cuisine: { label: 'Cuisine & Pâtisserie', icon: '🍳' },
    salle: { label: 'Salle & Service', icon: '🍽️' },
    bar_sommellerie: { label: 'Bar & Mixologie', icon: '🍸' },
    accueil_securite: { label: 'Accueil & Sécurité', icon: '🛡️' },
    economat_direction: { label: 'Économat & Direction', icon: '💼' },
  };

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Metrics
  const presentCount = staff.filter(s => s.statusToday === 'present').length;
  const lateCount = staff.filter(s => s.statusToday === 'retard').length;
  const leaveCount = staff.filter(s => s.statusToday === 'conge' || s.statusToday === 'repos').length;
  const totalPayrollFCFA = staff.reduce((acc, s) => acc + s.monthlySalaryFCFA, 0);

  // Filtered staff
  const filteredStaff = staff.filter(s => {
    return departmentFilter === 'all' || s.department === departmentFilter;
  });

  // Tips pool breakdown
  const presentFloorStaff = staff.filter(s => s.statusToday === 'present' && (s.department === 'salle' || s.department === 'bar_sommellerie' || s.department === 'accueil_securite'));
  const presentKitchenStaff = staff.filter(s => s.statusToday === 'present' && s.department === 'cuisine');

  const floorTotalTips = Math.round(tipsPoolInput * ((100 - kitchenSharePercent) / 100));
  const kitchenTotalTips = Math.round(tipsPoolInput * (kitchenSharePercent / 100));

  const perFloorEmployeeTips = presentFloorStaff.length > 0 ? Math.round(floorTotalTips / presentFloorStaff.length) : 0;
  const perKitchenEmployeeTips = presentKitchenStaff.length > 0 ? Math.round(kitchenTotalTips / presentKitchenStaff.length) : 0;

  const handleSaveBriefing = () => {
    updateBriefing({
      chefSpecial: editingChefSpecial,
      managerNotes: editingManagerNotes,
      wineRecommendation: editingWineRec,
      tipsPoolFCFA: tipsPoolInput,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Effectif Total</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {staff.length} <span className="text-xs font-normal text-neutral-400">collaborateurs</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Cuisine, salle, bar & économat</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Présence Service Actuel</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {presentCount} <span className="text-xs font-normal text-neutral-400">/ {staff.length} présents</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {lateCount > 0 ? `${lateCount} retardataire(s) signalé(s)` : 'Aucun retard noté'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cagnotte Pourboires (Jour)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {tipsPoolInput.toLocaleString('fr-FR')} <span className="text-xs font-normal text-neutral-400">FCFA</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Partage équitable salle & cuisine</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-800 bg-[#12161f] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Masse Salariale Mensuelle</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums truncate">
              {(totalPayrollFCFA / 1000000).toFixed(2)}M <span className="text-xs font-normal text-neutral-400">FCFA</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">{staff.filter(s => s.contractType === 'CDI').length} CDI enregistrés</p>
          </div>
        </div>

      </div>

      {/* Main Container */}
      <div className="p-5 sm:p-6 rounded-2xl border border-neutral-800 bg-[#12161f] space-y-5">
        
        {/* Header & Sub-Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Gestion du Personnel & Planning</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Brigade de cuisine, service en salle, mixologie, pointages en temps réel et pourboires
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-neutral-900 rounded-lg border border-neutral-800">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'attendance'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pointage Aujourd'hui
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'schedule'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Planning Shifts
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'tips'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pourboires (Tips)
              </button>
              <button
                onClick={() => setActiveTab('briefing')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'briefing'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Briefing Chef
              </button>
            </div>

            <button
              onClick={() => setIsNewStaffOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Recruter</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Pointage & Présence Aujourd'hui */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            
            {/* Department filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setDepartmentFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  departmentFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                Toute l'équipe ({staff.length})
              </button>
              {Object.entries(departmentLabels).map(([depKey, depInfo]) => {
                const count = staff.filter(s => s.department === depKey).length;
                return (
                  <button
                    key={depKey}
                    onClick={() => setDepartmentFilter(depKey)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      departmentFilter === depKey
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <span>{depInfo.icon}</span>
                    <span>{depInfo.label}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Attendance Roster Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Matricule</th>
                    <th className="py-3 px-3">Collaborateur</th>
                    <th className="py-3 px-3">Poste & Département</th>
                    <th className="py-3 px-3">Contact (+225)</th>
                    <th className="py-3 px-3">Shift Aujourd'hui</th>
                    <th className="py-3 px-3">Statut Présence</th>
                    <th className="py-3 px-3 text-center">Pointage Rapide (1-Clic)</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredStaff.map(member => {
                    let statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-500/10">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Présent
                      </span>
                    );
                    if (member.statusToday === 'retard') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono text-amber-400 bg-amber-500/10">
                          <AlertTriangle className="w-3.5 h-3.5" /> En retard
                        </span>
                      );
                    } else if (member.statusToday === 'conge' || member.statusToday === 'repos') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono text-neutral-400 bg-neutral-800">
                          Repos / Congé
                        </span>
                      );
                    } else if (member.statusToday === 'absent') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono text-rose-400 bg-rose-500/10">
                          Absent
                        </span>
                      );
                    }

                    return (
                      <tr key={member.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-neutral-400 text-[11px]">
                          {member.registrationNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{member.fullName}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            {member.contractType} · Embauche {member.hireDate}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-neutral-200 font-medium">{member.role}</div>
                          <div className="text-[11px] text-neutral-400">
                            {departmentLabels[member.department]?.label}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-neutral-300">
                          <a href={`tel:${member.phone}`} className="hover:text-amber-400 transition-colors">
                            {member.phone}
                          </a>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-xs text-amber-400 capitalize">
                            {member.todayShift === 'matin' ? '☀️ Matin (09h30-15h30)' : member.todayShift === 'soir' ? '🌙 Soir (17h30-00h)' : member.todayShift === 'coupure' ? '⚡ Coupure' : 'Repos'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {statusBadge}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {/* 1-Click Quick Pointage */}
                          <div className="inline-flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                            <button
                              onClick={() => updateStaffStatus(member.id, 'present')}
                              title="Marquer Présent"
                              className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                                member.statusToday === 'present' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              Présent
                            </button>
                            <button
                              onClick={() => updateStaffStatus(member.id, 'retard')}
                              title="Marquer en Retard"
                              className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                                member.statusToday === 'retard' ? 'bg-amber-600 text-white' : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              Retard
                            </button>
                            <button
                              onClick={() => updateStaffStatus(member.id, 'repos')}
                              title="Marquer en Repos"
                              className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                                member.statusToday === 'repos' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              Repos
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer ${member.fullName} de l'équipe Kajazoma ?`)) {
                                deleteStaffMember(member.id);
                              }
                            }}
                            className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 2: Planning Hebdomadaire des Shifts */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Grille Hebdomadaire des Shifts</h3>
                <p className="text-xs text-neutral-400">Rotation des équipes pour assurer les services midi et soir en continu</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-3 min-w-[180px]">Collaborateur</th>
                    {daysOfWeek.map((day, idx) => (
                      <th key={idx} className="py-3 px-2 text-center min-w-[95px]">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono text-xs">
                  {staff.map((member, staffIdx) => {
                    return (
                      <tr key={member.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white font-sans">{member.fullName}</div>
                          <div className="text-[10px] text-neutral-400 font-sans">{member.role}</div>
                        </td>
                        {daysOfWeek.map((_, dayIdx) => {
                          // Realistic schedule pattern based on staff role
                          const isRestDay = (staffIdx + dayIdx) % 7 === 6;
                          const isNight = (staffIdx + dayIdx) % 2 === 1;

                          let shiftLabel = 'Matin';
                          let badgeStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                          if (isRestDay) {
                            shiftLabel = 'Repos';
                            badgeStyle = 'bg-neutral-800/50 text-neutral-500 border-neutral-800';
                          } else if (isNight) {
                            shiftLabel = 'Soir';
                            badgeStyle = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
                          }

                          return (
                            <td key={dayIdx} className="py-3 px-2 text-center">
                              <span className={`inline-block px-2 py-1 rounded text-[11px] border font-medium ${badgeStyle}`}>
                                {shiftLabel}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Tips Pool / Cagnotte Pourboires */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Calculateur & Partage du Tips Pool (Pourboires)</h3>
                <p className="text-xs text-neutral-400">Distribution transparente de la cagnotte journalière entre la salle et la cuisine</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Inputs */}
              <div className="md:col-span-5 space-y-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/40">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Cagnotte Totale du Jour (FCFA)
                  </label>
                  <div className="relative">
                    <Coins className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      value={tipsPoolInput}
                      onChange={(e) => setTipsPoolInput(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-lg font-mono font-bold bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500 tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-neutral-300 uppercase tracking-wider">
                      Clé de Répartition
                    </span>
                    <span className="font-mono text-amber-400">
                      Salle {100 - kitchenSharePercent}% / Cuisine {kitchenSharePercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="5"
                    value={kitchenSharePercent}
                    onChange={(e) => setKitchenSharePercent(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                    <span>Priorité Salle (80/20)</span>
                    <span>Équilibré (60/40)</span>
                    <span>Parité (50/50)</span>
                  </div>
                </div>

                <button
                  onClick={handleSaveBriefing}
                  className="w-full py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm"
                >
                  Enregistrer dans le Bilan Journalier
                </button>
              </div>

              {/* Breakdown Cards */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Salle */}
                  <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Part Équipe Salle ({100 - kitchenSharePercent}%)
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {presentFloorStaff.length} présents
                      </span>
                    </div>
                    <div className="text-xl font-mono font-bold text-white tabular-nums">
                      {floorTotalTips.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="pt-2 border-t border-amber-900/40 text-xs text-neutral-300 flex items-center justify-between">
                      <span>Par serveur / barman :</span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">
                        {perFloorEmployeeTips.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Cuisine */}
                  <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Part Brigade Cuisine ({kitchenSharePercent}%)
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {presentKitchenStaff.length} présents
                      </span>
                    </div>
                    <div className="text-xl font-mono font-bold text-white tabular-nums">
                      {kitchenTotalTips.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="pt-2 border-t border-emerald-900/40 text-xs text-neutral-300 flex items-center justify-between">
                      <span>Par cuisinier / commis :</span>
                      <span className="font-mono font-bold text-emerald-400 tabular-nums">
                        {perKitchenEmployeeTips.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 text-xs text-neutral-300 space-y-2">
                  <div className="font-semibold text-white">Règlement des Pourboires Kajazoma :</div>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-400 text-[11px] leading-relaxed">
                    <li>Les pourboires collectés (carte, Wave, espèces) sont centralisés par le Maître d'Hôtel à chaque fin de service.</li>
                    <li>La redistribution est versée le soir même aux employés actifs sur le shift.</li>
                    <li>Les stagiaires et extras bénéficient d'une part pleine après leur 2e semaine d'activité.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Briefing du Chef & Consignes */}
        {activeTab === 'briefing' && (
          <div className="space-y-4 max-w-3xl">
            <div>
              <h3 className="text-sm font-semibold text-white">Édition des Consignes & Briefing de Service</h3>
              <p className="text-xs text-neutral-400">Ces consignes s'affichent directement sur le tableau de bord de la brigade</p>
            </div>

            <div className="space-y-4 bg-neutral-900/40 p-5 rounded-xl border border-neutral-800">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Plat Signature du Chef (Suggestion du jour)
                </label>
                <textarea
                  rows={2}
                  value={editingChefSpecial}
                  onChange={(e) => setEditingChefSpecial(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Recommandation Caviste & Sommelière
                </label>
                <input
                  type="text"
                  value={editingWineRec}
                  onChange={(e) => setEditingWineRec(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Notes de Service, Clients VIP & Protocole
                </label>
                <textarea
                  rows={3}
                  value={editingManagerNotes}
                  onChange={(e) => setEditingManagerNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveBriefing}
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enregistrer le Briefing pour l'Équipe</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* New Staff Modal */}
      <NewStaffModal
        isOpen={isNewStaffOpen}
        onClose={() => setIsNewStaffOpen(false)}
      />

    </div>
  );
};
