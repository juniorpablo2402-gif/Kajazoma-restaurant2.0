import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { TableZone, MealPeriod } from '../types';
import { X, Calendar, Clock, Users, Phone, User, Check, Sparkles } from 'lucide-react';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTableId?: string | null;
}

export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  isOpen,
  onClose,
  preselectedTableId,
}) => {
  const { tables, addReservation, currentService, selectedDate } = useRestaurant();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+225 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('13:00');
  const [mealPeriod, setMealPeriod] = useState<MealPeriod>(currentService);
  const [tableId, setTableId] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [depositFCFA, setDepositFCFA] = useState(0);
  const [isVIP, setIsVIP] = useState(false);

  useEffect(() => {
    if (preselectedTableId) {
      setTableId(preselectedTableId);
    } else if (tables.length > 0 && !tableId) {
      const freeTable = tables.find(t => t.status === 'libre');
      if (freeTable) setTableId(freeTable.id);
    }
  }, [preselectedTableId, tables]);

  useEffect(() => {
    if (mealPeriod === 'dejeuner') {
      setTime('13:00');
    } else {
      setTime('20:30');
    }
  }, [mealPeriod]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    const selectedTable = tables.find(t => t.id === tableId);
    const tableZone: TableZone = selectedTable ? selectedTable.zone : 'jardin';

    const tags: string[] = [];
    if (isVIP) tags.push('VIP');
    if (tableZone === 'galerie') tags.push('Galerie Art');
    if (tableZone === 'jardin') tags.push('Jardin');

    addReservation({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      guestsCount: Number(guestsCount),
      date,
      time,
      mealPeriod,
      tableId,
      tableZone,
      status: 'confirmee',
      specialRequests: specialRequests.trim() || undefined,
      depositFCFA: Number(depositFCFA) || 0,
      tags,
    });

    onClose();
  };

  const selectedTable = tables.find(t => t.id === tableId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#12161f] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div>
            <h2 className="text-base font-bold text-white font-display">Nouvelle Réservation</h2>
            <p className="text-xs text-neutral-400">Enregistrer une table pour le restaurant Kajazoma Abidjan</p>
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
          
          {/* Customer info */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Nom du Client ou Organisation *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ex: M. Jean-Marc N'Goran, Délégation..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Téléphone (+225) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+225 07 00 00 00 00"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  placeholder="client@domaine.ci"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Date & Service & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Service
              </label>
              <select
                value={mealPeriod}
                onChange={(e) => setMealPeriod(e.target.value as MealPeriod)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="dejeuner">☀️ Déjeuner (Midi)</option>
                <option value="diner">🌙 Dîner (Soir)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Heure d'arrivée
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Guests count & Table assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Nombre de Couverts
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Table Attribuée
              </label>
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Sélectionner une table</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>
                    Table {t.number} - {t.label} ({t.capacity} pl. · {t.zone.toUpperCase()}) {t.status === 'libre' ? '✓ Libre' : `(${t.status})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table info preview banner if selected */}
          {selectedTable && (
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Table {selectedTable.number}</span> · {selectedTable.label}
                <span className="text-neutral-500 ml-2">Capacité: {selectedTable.capacity} convives</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                selectedTable.status === 'libre' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
                {selectedTable.status.toUpperCase()}
              </span>
            </div>
          )}

          {/* Special notes & VIP Tag */}
          <div className="pt-2 border-t border-neutral-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Demandes Particulières & Régimes
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Table ombragée dans le jardin, vue sur les sculptures, allergies, anniversaire..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Arrhes Encaissées (FCFA)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={depositFCFA}
                  onChange={(e) => setDepositFCFA(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 select-none">
                  <input
                    type="checkbox"
                    checked={isVIP}
                    onChange={(e) => setIsVIP(e.target.checked)}
                    className="rounded border-neutral-700 text-amber-600 focus:ring-amber-500 w-4 h-4 bg-neutral-900"
                  />
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Clientèle VIP / Protocole</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
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
              <span>Valider la Réservation</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
