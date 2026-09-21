import { Achievement } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Zap, Compass, Star, ChevronRight, Trophy } from 'lucide-react';

interface AchievementDetailsProps {
  achievement: Achievement;
  onClose: () => void;
  allAchievements: Achievement[];
  onToggle: (id: string) => void;
  isSelected: boolean;
}

export default function AchievementDetails({ 
  achievement, 
  onClose, 
  allAchievements,
  onToggle,
  isSelected
}: AchievementDetailsProps) {
  // Find related achievements (same category, different difficulty)
  const related = allAchievements
    .filter(a => a.category === achievement.category && a.id !== achievement.id)
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 3);

  // Find next in path
  const nextInPath = achievement.pathId 
    ? allAchievements.find(a => a.pathId === achievement.pathId && a.pathOrder === (achievement.pathOrder || 0) + 1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="relative h-48 bg-neutral-900 flex items-center justify-center text-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-blue-300 mb-2">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight px-4">
              {achievement.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
          <section className="space-y-4">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Entry Description</h3>
            <p className="text-lg text-neutral-600 leading-relaxed font-medium">
              {achievement.description}
            </p>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Difficulty" value={achievement.difficulty} icon={Shield} color="text-rose-500" />
            <StatBox label="Commitment" value={achievement.commitment} icon={Zap} color="text-blue-500" />
            <StatBox label="Adventure" value={achievement.adventure} icon={Compass} color="text-emerald-500" />
            <StatBox label="Est. Rarity" value={`${(achievement.completionRate * 100).toFixed(2)}%`} icon={Star} color="text-orange-500" isPerc />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Related */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Related Achievements</h3>
              <div className="space-y-3">
                {related.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                    <span className="text-sm font-bold text-neutral-700 truncate pr-4">{a.name}</span>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-neutral-100">
                      Lvl {a.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Path */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Progression Path</h3>
              {nextInPath ? (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 group">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Next Evolution</p>
                  <h4 className="font-bold text-blue-900 mb-1">{nextInPath.name}</h4>
                  <p className="text-xs text-blue-600 line-clamp-2 mb-4">{nextInPath.description}</p>
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-widest">
                    <span>Potential Rank Up</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-neutral-50 border border-dashed border-neutral-200 text-center">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest italic">Peak Achievement Reached</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-neutral-400 border-neutral-200'}`}>
              {isSelected ? 'Completed' : 'Locked'}
            </span>
          </div>
          <button
            onClick={() => onToggle(achievement.id)}
            className={`
              px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all
              ${isSelected 
                ? 'bg-white text-rose-600 border border-rose-100 hover:bg-rose-50' 
                : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-neutral-200'}
            `}
          >
            {isSelected ? 'Unmark Completed' : 'Mark as Completed'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatBox({ label, value, icon: Icon, color, isPerc }: any) {
  return (
    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-1">
      <div className={`flex items-center gap-2 ${color}`}>
        <Icon className="w-3 h-3" />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-black text-neutral-900 tabular-nums leading-none">
        {isPerc ? value : `${value}/10`}
      </p>
    </div>
  );
}
