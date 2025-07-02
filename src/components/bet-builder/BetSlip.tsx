import React from 'react';
import type { Game, Player } from '../../types';
import type { BetSelection } from '../../App';

const TrashIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );

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

interface BetSlipProps {
    selectedGames: Game[];
    stake: number;
    onStakeInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onQuickStakeChange: (amount: number) => void;
    onClearSlip: () => void;
    onStartGame: () => void;
    betSelections: BetSelection;
    winOdds: string[][];
    selectedGoals: number;
    goalsOdds: string[];
    selectedCards: number;
    cardsOdds: string[];
    selectedGoalscorer?: Player;
    selectedCardedPlayer?: Player;
    isSlipOpen: boolean;
    setIsSlipOpen: (isOpen: boolean) => void;
    potentialReturn: number;
}

export const BetSlip = ({
    selectedGames,
    stake,
    onStakeInputChange,
    onQuickStakeChange,
    onClearSlip,
    onStartGame,
    betSelections,
    selectedGoals,
    goalsOdds,
    selectedCards,
    cardsOdds,
    selectedGoalscorer,
    selectedCardedPlayer,
    isSlipOpen,
    setIsSlipOpen,
    potentialReturn
}: BetSlipProps) => {
    const quickStakeAmounts = [5, 10, 25, 50];
    const isReady = selectedGames.length === 3;
    const GOALSCORER_BOOST = 1.2;
    const CARDED_PLAYER_BOOST = 1.2;
    
    const renderSummaryItem = (label: string, value: string | undefined, odd?: string) => {
        if (!value) return null;
        return (
            <div className="flex justify-between items-center text-sm py-1">
                <span className="text-gray-300">{label}</span>
                <span className="font-semibold text-white">{value} {odd && `(${odd})`}</span>
            </div>
        )
    }

    return (
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out ${
          selectedGames.length > 0 ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSlipOpen ? "backdrop-blur-sm" : ""
          }`}
        >
          <div
            className={`shadow-2xl rounded-t-2xl max-w-4xl mx-auto border-t-2 border-x-2 bet-card`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setIsSlipOpen(!isSlipOpen)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg bet-button-primary">
                    {selectedGames.length}
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {isSlipOpen ? "Your games" : "View Your games"}
                  </h2>
                </div>
                <ChevronUpIcon
                  className={`w-auto h-6 text-white transition-transform ${
                    isSlipOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {isSlipOpen && (
              <div className="p-4 border-t-2 animate-fade-in border-blue-800">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-white">
                    Your 3 Games
                  </h2>
                  {selectedGames.length > 0 && (
                    <button
                      onClick={onClearSlip}
                      className="text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <TrashIcon className="w-4 h-4" /> Clear Slip
                    </button>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  {[0, 1, 2].map((index) => {
                    const game = selectedGames[index];
                    return game ? (
                      <div
                        key={game.id}
                        className="border text-white p-2 rounded-lg flex items-center gap-2 text-sm animate-fade-in-up bet-card"
                      >
                        <img
                          src={game.home.logo}
                          alt={game.home.name}
                          className="w-auto h-6"
                        />
                        <span className="font-semibold">
                          {game.home.name} v {game.away.name}
                        </span>
                        <img
                          src={game.away.logo}
                          alt={game.away.name}
                          className="w-auto h-6"
                        />
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="h-10 p-2 rounded-lg text-center text-white text-xs flex items-center justify-center bet-empty-slot"
                      >
                        Empty Slot
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-blue-800 my-4"></div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-2">Bet Summary</h3>
                    
                    {/* Win Selections Detail */}
                    {Object.keys(betSelections).length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Win Outcomes</h4>
                        <div className="space-y-1">
                          {Object.entries(betSelections).map(([key, selection]) => {
                            const [, row, col] = key.split('-');
                            const outcomes = ['Home Wins', 'Draws', 'Away Wins'];
                            const levels = ['1+', '2+', '3+'];
                            
                            return (
                              <div key={key} className="flex justify-between items-center text-sm py-1">
                                <span className="text-gray-300">
                                  {levels[parseInt(row)]} {outcomes[parseInt(col)]}
                                </span>
                                <span className="font-semibold text-white">
                                  {selection.odd}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {renderSummaryItem("Total Goals", `${selectedGoals}+ goals`, goalsOdds[selectedGoals - 1])}
                    {renderSummaryItem("Total Cards", `${selectedCards}+ cards`, cardsOdds[selectedCards - 1])}
                    {renderSummaryItem("Goalscorer Boost", selectedGoalscorer?.name, `x${GOALSCORER_BOOST}`)}
                    {renderSummaryItem("Carded Player Boost", selectedCardedPlayer?.name, `x${CARDED_PLAYER_BOOST}`)}
                </div>

                <div className="border-t border-blue-800 my-4"></div>

                <div>
                  <h2 className="text-lg font-bold text-white mb-3">
                    Set Your Stake
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        value={stake}
                        onChange={onStakeInputChange}
                        className="w-full border-2 rounded-lg p-3 pl-7 text-lg font-bold text-white focus:ring-2 bet-empty-slot border-blue-800"
                      />
                    </div>
                    <div className="flex gap-2">
                      {quickStakeAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => onQuickStakeChange(amount)}
                          className="font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer bet-stake-button"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                    <div className="text-lg text-white mb-2">
                        Potential Return: <span className="font-bold text-green-400">${potentialReturn.toFixed(2)}</span>
                    </div>
                  <button
                    onClick={onStartGame}
                    disabled={!isReady}
                    className={`w-full text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all duration-300 ${
                      isReady
                        ? "bg-green-600 hover:bg-green-500 animate-pulse-green cursor-pointer"
                        : "cursor-not-allowed bet-disabled-button"
                    }`}
                  >
                    {isReady
                      ? `Place Bet: $${stake.toFixed(2)}`
                      : "Select 3 Games"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
} 