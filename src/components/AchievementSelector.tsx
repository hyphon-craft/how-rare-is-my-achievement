import { useState, useMemo } from 'react';
import { Achievement, Category } from '../types';
import AchievementCard from './AchievementCard';
import AchievementDetails from './AchievementDetails';
import { Search, Filter, X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

interface AchievementSelectorProps {
  achievements: Achievement[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const categories: Category[] = [
  'Running & Fitness',
  'Outdoors & Adventure',
  'Travel & Exploration',
  'Skills & Learning',
  'Life Experiences'
];

export default function AchievementSelector({ 
  achievements, 
  selectedIds, 
  onToggle,
  onClear
}: AchievementSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [detailAchievement, setDetailAchievement] = useState<Achievement | null>(null);

  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      const matchesSearch = achievement.name.toLowerCase().includes(search.toLowerCase()) ||
                            achievement.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || achievement.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [achievements, search, selectedCategory]);

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {detailAchievement && (
          <AchievementDetails
            achievement={detailAchievement}
            allAchievements={achievements}
            isSelected={selectedIds.includes(detailAchievement.id)}
            onToggle={onToggle}
            onClose={() => setDetailAchievement(null)}
          />
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-10 bg-neutral-50/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-0 sm:px-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${selectedCategory === 'All' 
                  ? 'bg-neutral-900 text-white shadow-lg' 
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'}`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCategory === category 
                    ? 'bg-neutral-900 text-white shadow-lg' 
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="text-sm font-medium">{selectedIds.length} achievements selected</span>
            <button 
              onClick={onClear}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isSelected={selectedIds.includes(achievement.id)}
            onToggle={onToggle}
            onInfo={setDetailAchievement}
          />
        ))}
        {filteredAchievements.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-neutral-500">No achievements found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
