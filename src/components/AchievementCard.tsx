import { Achievement } from '../types';
import { Check, Flame, Trophy, MapPin, Brain, Star, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface AchievementCardProps {
  achievement: Achievement;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onInfo: (achievement: Achievement) => void;
}

const categoryIcons: Record<string, any> = {
  'Running & Fitness': Flame,
  'Outdoors & Adventure': MapPin,
  'Travel & Exploration': Trophy,
  'Skills & Learning': Brain,
  'Life Experiences': Star,
};

export default function AchievementCard({ achievement, isSelected, onToggle, onInfo }: AchievementCardProps) {
  const Icon = categoryIcons[achievement.category] || Trophy;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative p-5 rounded-2xl cursor-pointer border transition-all duration-300
        ${isSelected 
          ? 'bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-200' 
          : 'bg-white border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-md'}
      `}
    >
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onToggle(achievement.id)} 
      />

      <div className="relative z-10 flex items-start gap-4 pointer-events-none">
        <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-neutral-50 text-neutral-500'}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-neutral-900 leading-tight truncate pr-8">
              {achievement.name}
            </h3>
            {isSelected && (
              <div className="bg-blue-500 rounded-full p-1 shadow-lg shadow-blue-200 shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
            {achievement.description}
          </p>
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-medium text-neutral-600 uppercase tracking-wider">
              {achievement.category}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span className="text-[10px] text-neutral-500 font-bold">Lvl {achievement.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onInfo(achievement);
        }}
        className="absolute bottom-4 right-4 z-20 p-2 rounded-xl bg-neutral-50 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
      >
        <Info className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
