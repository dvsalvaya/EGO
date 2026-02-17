import Header from './components/Header';

import HabitTracker from './components/HabitTracker';
// // import FullBodyAvatar from './components/FullBodyAvatar';
import QuestBoard from './components/QuestBoard';
// // import RewardShop from './components/RewardShop';
import StatsGraph from './components/StatsGraph';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Header />

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Habits + Avatar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <HabitTracker />
          </div>

          {/* Right Column: Quests, Stats, Shop (8 cols) */}
          <div className="lg:col-span-8 space-y-6 flex flex-col">
            <QuestBoard />
            <StatsGraph />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
