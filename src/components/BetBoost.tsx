import React, { useState } from 'react';
import type { Game, Player } from '../types';

const ChevronUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

interface BetBoostProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    selectedGames: Game[];
    onSelectGoalscorer: (player: Player) => void;
    onSelectCardedPlayer: (player: Player) => void;
    selectedGoalscorer?: Player;
    selectedCardedPlayer?: Player;
}

export const BetBoost = ({
    isCollapsed,
    onToggleCollapse,
    selectedGames,
    onSelectGoalscorer,
    onSelectCardedPlayer,
    selectedGoalscorer,
    selectedCardedPlayer,
}: BetBoostProps) => {

    const [scorerSearch, setScorerSearch] = useState('');
    const [cardSearch, setCardSearch] = useState('');

    const allPlayers = selectedGames.flatMap(game => [
        ...game.home.players.map(p => ({ ...p, teamLogo: game.home.logo })),
        ...game.away.players.map(p => ({ ...p, teamLogo: game.away.logo }))
    ]);

    const filteredScorerPlayers = allPlayers.filter(p => p.name.toLowerCase().includes(scorerSearch.toLowerCase()));
    const filteredCardPlayers = allPlayers.filter(p => p.name.toLowerCase().includes(cardSearch.toLowerCase()));

    const renderPlayerList = (
        players: (Player & { teamLogo: string })[],
        onSelect: (player: Player) => void,
        selectedPlayer: Player | undefined,
        statType: 'score' | 'card'
    ) => (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
            {players.map(player => (
                <button
                    key={player.id}
                    onClick={() => onSelect(player)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center ${
                        selectedPlayer?.id === player.id
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                >
                    <div className="flex items-center">
                        <img src={player.teamLogo} alt="team logo" className="w-6 h-6 mr-3 rounded-full" />
                        <div>
                            <p className="font-bold">{player.name}</p>
                            <p className="text-xs opacity-80">
                                {statType === 'score' ? player.scoreStats : player.cardStats}
                            </p>
                        </div>
                    </div>
                    {selectedPlayer?.id === player.id && <span className="text-2xl">✓</span>}
                </button>
            ))}
        </div>
    );

    return (
        <div className="rounded-xl shadow-2xl border-2 p-4 mt-4 bet-card">
            <div className="flex justify-between items-center cursor-pointer" onClick={onToggleCollapse}>
                <h2 className="text-xl font-bold text-white">3. Add a Bet Boost</h2>
                <ChevronUpIcon className={`w-6 h-6 text-white transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </div>

            <div className={`collapsible-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                <div className="mt-4 grid md:grid-cols-2 gap-6">
                    {/* Section 1: Player to Score */}
                    <div className="p-4 rounded-lg bg-blue-900/50">
                        <h3 className="text-lg font-semibold text-white mb-3">Player to Score</h3>
                        <div className="relative mb-3">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white"><SearchIcon /></span>
                            <input
                                type="text"
                                placeholder="Search player to score..."
                                value={scorerSearch}
                                onChange={(e) => setScorerSearch(e.target.value)}
                                className="w-full rounded-lg p-3 pl-10 text-base text-white border-2 focus:ring-2 bet-input"
                            />
                        </div>
                        {renderPlayerList(filteredScorerPlayers, onSelectGoalscorer, selectedGoalscorer, 'score')}
                    </div>

                    {/* Section 2: Player to get a Yellow Card */}
                    <div className="p-4 rounded-lg bg-blue-900/50">
                        <h3 className="text-lg font-semibold text-white mb-3">Player to be Carded</h3>
                         <div className="relative mb-3">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white"><SearchIcon /></span>
                            <input
                                type="text"
                                placeholder="Search player to be carded..."
                                value={cardSearch}
                                onChange={(e) => setCardSearch(e.target.value)}
                                className="w-full rounded-lg p-3 pl-10 text-base text-white border-2 focus:ring-2 bet-input"
                            />
                        </div>
                        {renderPlayerList(filteredCardPlayers, onSelectCardedPlayer, selectedCardedPlayer, 'card')}
                    </div>
                </div>
            </div>
        </div>
    );
}; 