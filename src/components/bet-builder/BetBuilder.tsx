import React, { useState } from 'react';
import { CardsTab } from './CardsTab';
import { GoalsTab } from './GoalsTab';
import { WinsTab } from './WinsTab';

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

export const BetBuilder = ({ 
    isCollapsed, 
    onToggleCollapse,
    selections,
    onSelectionChange,
    winOdds,
    selectedGoals,
    onGoalsChange,
    selectedCards,
    onCardsChange,
    goalsOdds,
    cardsOdds
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
    goalsOdds: string[];
    cardsOdds: string[];
}) => {
    const [isWinsCollapsed, setIsWinsCollapsed] = useState(false);
    const [isGoalsCollapsed, setIsGoalsCollapsed] = useState(true);
    const [isCardsCollapsed, setIsCardsCollapsed] = useState(true);

    return (
        <div className="rounded-xl shadow-2xl border-2 p-4 mt-4 bet-card">
            <div className="flex justify-between items-center cursor-pointer" onClick={onToggleCollapse}>
                <h2 className="text-xl font-bold text-white">
                    2. Select wins, goals, cards across the games
                </h2>
                <ChevronUpIcon className={`w-6 h-6 text-white transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </div>

            <div className={`collapsible-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                <div className="mt-4 space-y-4">
                    
                    {/* Step 1: Select Wins */}
                    <div className="rounded-lg border border-slate-600 overflow-hidden">
                        <div 
                            className="flex justify-between items-center p-4 bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors"
                            onClick={() => setIsWinsCollapsed(!isWinsCollapsed)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center">1</span>
                                <h3 className="text-lg font-semibold text-white">Select Wins</h3>
                                <span className="text-sm text-slate-300">
                                    ({Object.keys(selections).length} selected)
                                </span>
                            </div>
                            <ChevronUpIcon className={`w-5 h-5 text-white transform transition-transform ${isWinsCollapsed ? 'rotate-180' : ''}`} />
                        </div>
                        <div className={`collapsible-content ${isWinsCollapsed ? 'collapsed' : 'expanded'}`}>
                            <div className="p-4 bg-slate-900/30">
                                <WinsTab selections={selections} onSelectionChange={onSelectionChange} odds={winOdds} />
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Select Goals */}
                    <div className="rounded-lg border border-slate-600 overflow-hidden">
                        <div 
                            className="flex justify-between items-center p-4 bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors"
                            onClick={() => setIsGoalsCollapsed(!isGoalsCollapsed)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-green-600 text-white text-sm font-bold rounded-full flex items-center justify-center">2</span>
                                <h3 className="text-lg font-semibold text-white">Select Goals</h3>
                                <span className="text-sm text-slate-300">
                                    ({selectedGoals}+ goals)
                                </span>
                            </div>
                            <ChevronUpIcon className={`w-5 h-5 text-white transform transition-transform ${isGoalsCollapsed ? 'rotate-180' : ''}`} />
                        </div>
                        <div className={`collapsible-content ${isGoalsCollapsed ? 'collapsed' : 'expanded'}`}>
                            <div className="p-4 bg-slate-900/30">
                                <GoalsTab selectedGoals={selectedGoals} onGoalsChange={onGoalsChange} goalsOdds={goalsOdds} />
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Select Cards */}
                    <div className="rounded-lg border border-slate-600 overflow-hidden">
                        <div 
                            className="flex justify-between items-center p-4 bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors"
                            onClick={() => setIsCardsCollapsed(!isCardsCollapsed)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-yellow-600 text-white text-sm font-bold rounded-full flex items-center justify-center">3</span>
                                <h3 className="text-lg font-semibold text-white">Select Cards</h3>
                                <span className="text-sm text-slate-300">
                                    ({selectedCards}+ cards)
                                </span>
                            </div>
                            <ChevronUpIcon className={`w-5 h-5 text-white transform transition-transform ${isCardsCollapsed ? 'rotate-180' : ''}`} />
                        </div>
                        <div className={`collapsible-content ${isCardsCollapsed ? 'collapsed' : 'expanded'}`}>
                            <div className="p-4 bg-slate-900/30">
                                <CardsTab selectedCards={selectedCards} onCardsChange={onCardsChange} cardsOdds={cardsOdds} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}; 