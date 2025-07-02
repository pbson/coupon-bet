import React from 'react';
import type { Game, Score, Player } from '../../types';
import type { BetSelection } from '../../App';
import coinIcon from '../../assets/coin.png';

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

interface BetSlipSummaryProps {
  selectedGames: Game[];
  betSelections: BetSelection;
  selectedGoals: number;
  selectedCards: number;
  selectedGoalscorer?: Player;
  selectedCardedPlayer?: Player;
  stake: number;
  liveScores: { [key: string]: Score };
  fulfilledBets: {
    goals: boolean;
    cards: boolean;
    goalscorer: boolean;
    cardedPlayer: boolean;
    wins: { [key: string]: boolean };
  };
  goalEvents?: Array<{ player: string; minute: number; team: string }>;
  cardEvents?: Array<{ player: string; minute: number; team: string }>;
}

export const BetSlipSummary: React.FC<BetSlipSummaryProps> = ({
  selectedGames,
  betSelections,
  selectedGoals,
  selectedCards,
  selectedGoalscorer,
  selectedCardedPlayer,
  stake,
  liveScores,
  fulfilledBets,
  goalEvents = [],
  cardEvents = []
}) => {
  const currentGoals = Object.values(liveScores).reduce((sum, score) => sum + score.home + score.away, 0);
  const currentCards = cardEvents.length;
  
  // Count current actual outcomes for results
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;
  
  selectedGames.forEach(game => {
    const score = liveScores[game.id] || { home: 0, away: 0 };
    if (score.home > score.away) homeWins++;
    else if (score.home === score.away) draws++;
    else awayWins++;
  });

  // Check if boost section is fulfilled (ALL selected boosts must be fulfilled)
  const isBoostFulfilled = (selectedGoalscorer || selectedCardedPlayer) && 
    (!selectedGoalscorer || fulfilledBets.goalscorer) && 
    (!selectedCardedPlayer || fulfilledBets.cardedPlayer);
  
  // Check if results section is fulfilled (ALL selected results must be fulfilled)
  const isResultsFulfilled = Object.keys(betSelections).length > 0 && Object.keys(betSelections).every(key => fulfilledBets.wins[key]);

  return (
    <>
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #0340a1; border-radius: 10px; }
        .win-highlight { 
          background: linear-gradient(135deg, #065f46, #047857) !important; 
          border: 2px solid #10b981 !important;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3) !important;
        }
      `}</style>
      
      <div className="bet-card rounded-xl p-2 sm:p-4 border-2 mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white">Your Bet Slip</h3>
          <div className="text-yellow-400 font-bold text-xs sm:text-sm">Total Stake: €{stake.toFixed(2)}</div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          
          {/* Goals Box */}
          <div className={`rounded-lg p-2 sm:p-3 ${fulfilledBets.goals ? 'win-highlight' : 'bg-slate-900/50'}`}>
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <h4 className="text-sm sm:text-md font-semibold text-white">Goals</h4>
              {fulfilledBets.goals ? <CheckIcon /> : <span className="w-4 h-4 sm:w-5 sm:h-5"></span>}
            </div>
            <div className="text-xs sm:text-sm text-white mb-1 sm:mb-2">
              <span className="font-bold">{currentGoals}</span> / <span className="text-slate-300">{selectedGoals} needed</span>
            </div>
            <div className="border-t border-slate-700 pt-1 sm:pt-2">
              <h5 className="text-xs font-semibold text-slate-300 mb-1">Goal Scorers</h5>
              <div className="max-h-12 sm:max-h-16 overflow-y-auto scrollbar-thin">
                {goalEvents.length > 0 ? (
                  goalEvents.map((goal, index) => (
                    <div key={index} className="text-xs text-white p-1 rounded  mb-1">
                      <span className="font-semibold">{goal.player}</span> <span className="text-slate-300">({goal.minute}')</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400">No goals yet</div>
                )}
              </div>
            </div>
            {selectedGoalscorer && (
              <div className="border-t border-slate-700 pt-1 sm:pt-2 mt-1 sm:mt-2">
                <h5 className="text-xs font-semibold text-slate-300 mb-1">Your Pick</h5>
                <div className="flex justify-between items-center text-white p-1 rounded ">
                  <span className="text-xs font-semibold">{selectedGoalscorer.name} to score</span>
                  {fulfilledBets.goalscorer ? <CheckIcon /> : <span className="w-3 h-3 sm:w-4 sm:h-4"></span>}
                </div>
              </div>
            )}
          </div>

          {/* Cards Box */}
          <div className={`rounded-lg p-2 sm:p-3 ${fulfilledBets.cards ? 'win-highlight' : 'bg-slate-900/50'}`}>
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <h4 className="text-sm sm:text-md font-semibold text-white">Cards</h4>
              {fulfilledBets.cards ? <CheckIcon /> : <span className="w-4 h-4 sm:w-5 sm:h-5"></span>}
            </div>
            <div className="text-xs sm:text-sm text-white mb-1 sm:mb-2">
              <span className="font-bold">{currentCards}</span> / <span className="text-slate-300">{selectedCards} needed</span>
            </div>
            <div className="border-t border-slate-700 pt-1 sm:pt-2">
              <h5 className="text-xs font-semibold text-slate-300 mb-1">Cards Shown</h5>
              <div className="max-h-12 sm:max-h-16 overflow-y-auto scrollbar-thin">
                {cardEvents.length > 0 ? (
                  cardEvents.map((card, index) => (
                    <div key={index} className="text-xs text-white p-1 rounded  mb-1">
                      <span className="font-semibold">{card.player}</span> <span className="text-yellow-400">🟨</span> <span className="text-slate-300">({card.minute}')</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400">No cards yet</div>
                )}
              </div>
            </div>
            {selectedCardedPlayer && (
              <div className="border-t border-slate-700 pt-1 sm:pt-2 mt-1 sm:mt-2">
                <h5 className="text-xs font-semibold text-slate-300 mb-1">Your Pick</h5>
                <div className="flex justify-between items-center text-white p-1 rounded ">
                  <span className="text-xs font-semibold">{selectedCardedPlayer.name} to be carded</span>
                  {fulfilledBets.cardedPlayer ? <CheckIcon /> : <span className="w-3 h-3 sm:w-4 sm:h-4"></span>}
                </div>
              </div>
            )}
          </div>

          {/* Boost Box */}
          <div className={`rounded-lg p-2 sm:p-3 ${isBoostFulfilled ? 'win-highlight' : 'bg-slate-900/50'}`}>
            <div className="flex items-center mb-1 sm:mb-2">
              <img src={coinIcon} alt="coin" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <h4 className="text-sm sm:text-md font-semibold text-white">Boost</h4>
            </div>
            <div className="space-y-1 max-h-16 sm:max-h-20 overflow-y-auto scrollbar-thin">
              {selectedGoalscorer && (
                <div className="flex justify-between items-center text-white p-1 rounded ">
                  <span className="text-xs font-semibold">{selectedGoalscorer.name} to Score</span>
                  {fulfilledBets.goalscorer ? <CheckIcon /> : <span className="w-3 h-3 sm:w-4 sm:h-4"></span>}
                </div>
              )}
              {selectedCardedPlayer && (
                <div className="flex justify-between items-center text-white p-1 rounded ">
                  <span className="text-xs font-semibold">{selectedCardedPlayer.name} to be Carded</span>
                  {fulfilledBets.cardedPlayer ? <CheckIcon /> : <span className="w-3 h-3 sm:w-4 sm:h-4"></span>}
                </div>
              )}
              {!selectedGoalscorer && !selectedCardedPlayer && (
                <div className="text-xs text-slate-400">No boosts selected</div>
              )}
            </div>
          </div>

          {/* Result Box */}
          <div className={`rounded-lg p-2 sm:p-3 ${isResultsFulfilled ? 'win-highlight' : 'bg-slate-900/50'}`}>
            <h4 className="text-sm sm:text-md font-semibold text-white mb-1 sm:mb-2">Results</h4>
            <div className="space-y-1 max-h-16 sm:max-h-20 overflow-y-auto scrollbar-thin">
              {Object.keys(betSelections).length > 0 ? (
                Object.entries(betSelections).map(([key]) => {
                  const [, row, col] = key.split('-');
                  const outcomes = ['Home Wins', 'Draws', 'Away Wins'];
                  const levels = ['1 or more', '2 or more', '3 or more'];
                  const isFulfilled = fulfilledBets.wins[key] || false;
                  const currentCounts = [homeWins, draws, awayWins];
                  const outcomeType = parseInt(col);
                  const currentCount = currentCounts[outcomeType];
                  
                  return (
                    <div key={key} className="flex justify-between items-center text-white p-1 rounded ">
                      <div>
                        <span className="text-xs font-semibold">
                          {levels[parseInt(row)]} {outcomes[parseInt(col)]}
                        </span>
                        <div className="text-xs text-slate-300">
                          {currentCount}/{parseInt(row) + 1}
                        </div>
                      </div>
                      {isFulfilled ? <CheckIcon /> : <span className="w-3 h-3 sm:w-4 sm:h-4"></span>}
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-400">No results selected</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}; 