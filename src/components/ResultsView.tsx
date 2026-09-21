import { ResultsProfile, Tier, Category } from '../types';
import { Trophy, Shield, Zap, Compass, ArrowRight, Share2, RotateCcw, Target, Flame, Star, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsViewProps {
  results: ResultsProfile;
  onReset: () => void;
  onEdit: () => void;
}

const tierMeta: Record<Tier, { 
  bg: string, 
  text: string, 
  border: string, 
  icon: any, 
  accent: string,
  gradient: string
}> = {
  'Emerging': { 
    bg: 'bg-slate-50', 
    text: 'text-slate-700', 
    border: 'border-slate-200', 
    icon: Star,
    accent: 'bg-slate-400',
    gradient: 'from-slate-400 to-slate-500'
  },
  'Notable': { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200', 
    icon: Target,
    accent: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-emerald-600'
  },
  'Uncommon': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    border: 'border-blue-200', 
    icon: Shield,
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
  'Remarkable': { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    border: 'border-purple-200', 
    icon: Crown,
    accent: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600'
  },
  'Exceptional': { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    border: 'border-orange-200', 
    icon: Flame,
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
};

export default function ResultsView({ results, onReset, onEdit }: ResultsViewProps) {
  const tier = tierMeta[results.tier];
  const Icon = tier.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* Hero Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-neutral-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500 blur-[120px]" />
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold tracking-widest uppercase text-blue-200"
          >
            <Trophy className="w-4 h-4" />
            Global Achievement Profile
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-8xl md:text-9xl font-black tracking-tighter leading-none"
            >
              {Math.round(results.overallScore)}
            </motion.h1>
            <p className="text-xl text-neutral-400 font-medium tracking-wide uppercase">Prestige Score</p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            <div className={`
              inline-flex items-center gap-4 px-10 py-5 rounded-3xl border-2 shadow-2xl transition-all duration-700
              bg-white/5 border-white/10 text-white
            `}>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${tier.gradient} shadow-lg shadow-black/20`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Achievement Rank</p>
                <p className="text-3xl font-black tracking-tight uppercase leading-none mt-1">
                  {results.tier}
                </p>
              </div>
            </div>

            <p className="max-w-lg text-lg text-neutral-300 leading-relaxed font-medium italic">
              "{results.summary}"
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Profile Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Attributes */}
        <section className="bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 space-y-8">
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <Zap className="w-6 h-6 text-orange-500" />
            Character Attributes
          </h2>
          <div className="space-y-8">
            <AttributeBar label="Difficulty" value={results.averages.difficulty} color="bg-rose-500" />
            <AttributeBar label="Commitment" value={results.averages.commitment} color="bg-blue-500" />
            <AttributeBar label="Adventure" value={results.averages.adventure} color="bg-emerald-500" />
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 space-y-8">
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <Compass className="w-6 h-6 text-blue-500" />
            Specialization
          </h2>
          <div className="space-y-4">
            {Object.entries(results.categoryDistribution)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-neutral-600">
                    <span>{category}</span>
                    <span>{Math.round((count / results.totalSelected) * 100)}%</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / results.totalSelected) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-neutral-900 rounded-full"
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Key Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <KeyMilestone 
          title="Rarest Achievement" 
          name={results.rarestAchievement.name} 
          category={results.rarestAchievement.category}
          rarity={`${(results.rarestAchievement.completionRate * 100).toFixed(4)}%`}
          icon={Flame}
          color="text-orange-500 bg-orange-50"
        />
        <KeyMilestone 
          title="Most Difficult" 
          name={results.hardestAchievement.name} 
          category={results.hardestAchievement.category}
          rarity={`Level ${results.hardestAchievement.difficulty}/10`}
          icon={Crown}
          color="text-purple-500 bg-purple-50"
        />
      </div>

      {/* Hall of Fame */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight text-center md:text-left">Strongest Feats</h2>
        <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 overflow-hidden">
          {results.topAchievements.map((achievement, index) => (
            <motion.div 
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex items-center gap-6 p-6 md:p-8 ${index !== results.topAchievements.length - 1 ? 'border-b border-neutral-50' : ''} hover:bg-neutral-50/50 transition-colors cursor-default group`}
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-xl font-black text-white shrink-0 group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-neutral-900 leading-tight">{achievement.name}</h4>
                <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest mt-1">{achievement.category}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-neutral-900 leading-none">+{Math.round(achievement.score)}</div>
                <div className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">Prestige</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Suggested Path */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight text-center">Your Next Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.recommendedNext.map((achievement, index) => (
            <motion.div 
              key={achievement.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 group hover:border-blue-200 transition-all flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 leading-tight mb-3">{achievement.name}</h4>
              <p className="text-neutral-500 mb-4 leading-relaxed line-clamp-3">{achievement.description}</p>
              <div className="bg-blue-50/50 p-4 rounded-xl mb-6 border border-blue-100/50">
                <p className="text-xs text-blue-700 font-bold leading-relaxed">
                  <span className="uppercase tracking-widest block mb-1 opacity-60">Why this?</span>
                  {achievement.reason}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest mt-auto">
                <span>Potential +{Math.round(achievement.difficulty * 15)} prestige</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
        <button 
          onClick={() => window.print()}
          className="group flex items-center justify-center gap-3 px-12 py-6 bg-neutral-900 text-white rounded-[2rem] font-black text-lg hover:bg-neutral-800 transition-all shadow-2xl shadow-neutral-300 w-full sm:w-auto active:scale-95"
        >
          <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          Share Your Story
        </button>
        <button 
          onClick={onEdit}
          className="group flex items-center justify-center gap-3 px-12 py-6 bg-white text-blue-600 border-2 border-blue-100 rounded-[2rem] font-black text-lg hover:bg-blue-50 transition-all w-full sm:w-auto active:scale-95"
        >
          <Compass className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          Edit Selection
        </button>
        <button 
          onClick={onReset}
          className="group flex items-center justify-center gap-3 px-12 py-6 bg-white text-neutral-900 border-2 border-neutral-100 rounded-[2rem] font-black text-lg hover:bg-neutral-50 transition-all w-full sm:w-auto active:scale-95"
        >
          <RotateCcw className="w-6 h-6 group-hover:-rotate-45 transition-transform" />
          Reset Profile
        </button>
      </div>
    </div>
  );
}

function AttributeBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-sm font-black text-neutral-400 uppercase tracking-widest">{label}</span>
        <span className="text-2xl font-black text-neutral-900 leading-none">{Math.round(value * 10)}%</span>
      </div>
      <div className="h-5 w-full bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`h-full ${color} rounded-2xl shadow-lg`}
        />
      </div>
    </div>
  );
}

function KeyMilestone({ title, name, category, rarity, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 flex gap-6 items-start">
      <div className={`p-4 rounded-2xl ${color} shrink-0`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-neutral-900 leading-tight">{name}</h3>
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{category}</p>
        <div className="pt-2">
          <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest">
            {rarity}
          </span>
        </div>
      </div>
    </div>
  );
}
