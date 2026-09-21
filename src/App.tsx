import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement, ResultsProfile } from './types';
import { achievementRepo } from './lib/repository';
import { calculateResults } from './lib/scoring';
import AchievementSelector from './components/AchievementSelector';
import ResultsView from './components/ResultsView';
import { Trophy, ChevronRight, Sparkles, Map, BookOpen } from 'lucide-react';

type Page = 'home' | 'selection' | 'results';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [results, setResults] = useState<ResultsProfile | null>(null);

  useEffect(() => {
    achievementRepo.getAchievements().then(setAchievements);
  }, []);

  const toggleAchievement = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const handleCalculate = () => {
    const selected = achievements.filter(a => selectedIds.includes(a.id));
    if (selected.length === 0) return;
    const res = calculateResults(selected, achievements);
    setResults(res);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSelectedIds([]);
    setResults(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center text-center py-20 space-y-12"
            >
              <div className="space-y-6 max-w-2xl">
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-3xl shadow-xl shadow-blue-100 border border-blue-50">
                    <Trophy className="w-12 h-12 text-blue-500" />
                  </div>
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-neutral-900">
                  How Rare Is Your <span className="text-blue-600">Achievement?</span>
                </h1>
                <p className="text-xl text-neutral-500 leading-relaxed">
                  Discover the rarity and prestige of your real-life accomplishments. 
                  Select your milestones and see how you rank among the global population.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
                <FeatureCard 
                  icon={Sparkles} 
                  title="Dynamic Scoring" 
                  description="Complex algorithms calculate prestige based on real-world rarity." 
                />
                <FeatureCard 
                  icon={Map} 
                  title="Discovery" 
                  description="Find new challenges and adventures to expand your profile." 
                />
                <FeatureCard 
                  icon={BookOpen} 
                  title="Your Story" 
                  description="Build a visual profile of your most impressive life experiences." 
                />
              </div>

              <button
                onClick={() => setCurrentPage('selection')}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-neutral-900 text-white rounded-3xl font-bold text-lg hover:bg-neutral-800 transition-all shadow-2xl shadow-neutral-200"
              >
                Start Your Profile
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {currentPage === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Select Your Achievements</h2>
                  <p className="text-neutral-500">Only select those you have truly completed in real life.</p>
                </div>
                <button
                  onClick={handleCalculate}
                  disabled={selectedIds.length === 0}
                  className={`
                    px-8 py-4 rounded-2xl font-bold transition-all
                    ${selectedIds.length > 0 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700' 
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}
                  `}
                >
                  Calculate Rarity
                </button>
              </header>

              <AchievementSelector
                achievements={achievements}
                selectedIds={selectedIds}
                onToggle={toggleAchievement}
                onClear={clearSelection}
              />

              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 sm:hidden w-full px-4">
                <button
                  onClick={handleCalculate}
                  disabled={selectedIds.length === 0}
                  className={`
                    w-full py-4 rounded-2xl font-bold transition-all shadow-2xl
                    ${selectedIds.length > 0 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}
                  `}
                >
                  View Results ({selectedIds.length})
                </button>
              </div>
            </motion.div>
          )}

          {currentPage === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ResultsView 
                results={results} 
                onReset={handleReset} 
                onEdit={() => setCurrentPage('selection')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-neutral-400 font-medium tracking-wide uppercase">
            Built with respect for human achievement
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-neutral-100 text-left space-y-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="inline-flex p-3 bg-neutral-50 rounded-2xl text-neutral-600">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
