import React, { useState } from 'react';
import { WinsTab } from './WinsTab';
import { GoalsTab } from './GoalsTab';
import { CardsTab } from './CardsTab';

const ChevronUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

type Tab = 'Wins' | 'Goals' | 'Cards';

export const BetBuilder = ({ 
    isCollapsed, 
    onToggleCollapse,
    selections,
    onSelectionChange,
    winOdds,
    selectedGoals,
    onGoalsChange,
    selectedCards,
    onCardsChange
}: { 
    isCollapsed: boolean, 
    onToggleCollapse: () => void,
    selections: { [key: string]: { odd: string } };
    onSelectionChange: (selectionKey: string) => void;
    winOdds: string[][];
    selectedGoals: number;
    onGoalsChange: (goals: number) => void;
    selectedCards: number;
    onCardsChange: (cards: number) => void;
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('Wins');

    return (
        <div className="rounded-xl shadow-2xl border-2 p-4 mt-4 bet-card">
            <div className="flex justify-between items-center cursor-pointer" onClick={onToggleCollapse}>
                <h2 className="text-xl font-bold text-white">
                    2. Select wins, goals, cards across the games
                </h2>
                <ChevronUpIcon className={`w-6 h-6 text-white transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </div>

            <div className={`collapsible-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                <div className="mt-4">
                    <div className="flex border-b border-slate-700">
                        <button onClick={() => setActiveTab('Wins')} className={`py-2 px-4 font-semibold ${activeTab === 'Wins' ? 'text-white border-b-2 border-white' : 'text-slate-400'}`}>Wins</button>
                        <button onClick={() => setActiveTab('Goals')} className={`py-2 px-4 font-semibold ${activeTab === 'Goals' ? 'text-white border-b-2 border-white' : 'text-slate-400'}`}>Goals</button>
                        <button onClick={() => setActiveTab('Cards')} className={`py-2 px-4 font-semibold ${activeTab === 'Cards' ? 'text-white border-b-2 border-white' : 'text-slate-400'}`}>Cards</button>
                    </div>
                    <div className="p-4">
                        {activeTab === 'Wins' && <WinsTab selections={selections} onSelectionChange={onSelectionChange} odds={winOdds} />}
                        {activeTab === 'Goals' && <GoalsTab selectedGoals={selectedGoals} onGoalsChange={onGoalsChange} />}
                        {activeTab === 'Cards' && <CardsTab selectedCards={selectedCards} onCardsChange={onCardsChange} />}
                    </div>
                </div>
            </div>
        </div>
    );
} 