import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StaffDepartment, ShiftType } from '../types';
import { X, Check, User, Phone, Briefcase } from 'lucide-react';

interface NewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewStaffModal: React.FC<NewStaffModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addStaffMember } = useRestaurant();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Chef de Rang');
  const [department, setDepartment] = useState<StaffDepartment>('salle');
  const [phone, setPhone] = useState('+225 ');
  const [email, setEmail] = useState('');
  const [contractType, setContractType] = useState<'CDI' | 'CDD' | 'Extra' | 'Stage'>('CDI');
  const [monthlySalaryFCFA, setMonthlySalaryFCFA] = useState<number>(350000);
  const [todayShift, setTodayShift] = useState<ShiftType>('matin');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    addStaffMember({
      fullName: fullName.trim(),
      role: role.trim(),
      department,
      phone: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@kajazoma-abidjan.ci`,
      contractType,
      monthlySalaryFCFA: Number(monthlySalaryFCFA),
      hireDate: new Date().toISOString().split('T')[0],
      statusToday: 'present',
      todayShift,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#12161f] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div>
            <h2 className="text-base font-bold text-white font-display">Recruter un Collaborateur</h2>
            <p className="text-xs text-neutral-400">Intégrer un membre au sein de la brigade Kajazoma</p>
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
              Nom & Prénoms *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Désiré Kouamé, Mariam Konan..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Poste / Titre *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Chef de Rang, Barman..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Département
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as StaffDepartment)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="cuisine">🍳 Cuisine & Pâtisserie</option>
                <option value="salle">🍽️ Salle & Service</option>
                <option value="bar_sommellerie">🍸 Bar & Sommellerie</option>
                <option value="accueil_securite">🛡️ Accueil & Sécurité</option>
                <option value="economat_direction">💼 Économat & Direction</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Email Professionnel
              </label>
              <input
                type="email"
                placeholder="prenom.nom@kajazoma-abidjan.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Contrat
              </label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="CDI">CDI (Plein temps)</option>
                <option value="CDD">CDD</option>
                <option value="Extra">Extra / Week-end</option>
                <option value="Stage">Stage Professionnel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Salaire Mensuel (FCFA)
              </label>
              <input
                type="number"
                step="10000"
                min="100000"
                required
                value={monthlySalaryFCFA}
                onChange={(e) => setMonthlySalaryFCFA(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Shift Principal
              </label>
              <select
                value={todayShift}
                onChange={(e) => setTodayShift(e.target.value as ShiftType)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="matin">Matin (09h30 - 15h30)</option>
                <option value="soir">Soir (17h30 - 00h00)</option>
                <option value="coupure">Coupure (11h-15h & 19h-23h30)</option>
                <option value="repos">Repos</option>
              </select>
            </div>
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
              <span>Valider l'Embauche</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
