import React, { useState } from 'react';
import type { Game, Player } from '../../types';

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

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);

const Chip = ({ text, boost, selected, locked, onClick }: { 
    text: string, 
    boost: string, 
    selected: boolean, 
    locked?: boolean,
    onClick?: () => void 
}) => (
    <div className="flex flex-col items-center gap-3 group">
        <button 
            onClick={locked ? undefined : onClick}
            disabled={locked}
            className={`
                w-28 h-28 rounded-full relative flex items-center justify-center
                font-black text-5xl transition-all duration-300 transform-gpu
                ${!locked && 'group-hover:scale-105 cursor-pointer'}
                ${selected && !locked ? 'scale-110' : ''}
                ${locked ? 'cursor-not-allowed opacity-50' : ''}
            `}
            style={{
                background: locked
                    ? 'radial-gradient(circle at 50% 50%, #6b7280, #374151)'
                    : selected 
                        ? 'radial-gradient(circle at 50% 50%, #fef08a, #facc15)' 
                        : 'radial-gradient(circle at 50% 50%, #475569, #1e293b)',
                boxShadow: `
                    inset 0 0 3px rgba(0,0,0,0.5),
                    inset 0 2px 2px rgba(255,255,255,0.2),
                    inset 0 -2px 2px rgba(0,0,0,0.3),
                    0 5px 10px rgba(0,0,0,0.5)
                `,
            }}
        >
            <div 
                className="absolute inset-0 rounded-full"
                style={{
                    background: locked
                        ? `repeating-conic-gradient(#6b7280 0% 5%, #4b5563 5% 10%)`
                        : `repeating-conic-gradient(${selected ? '#fde047' : '#334155'} 0% 5%, ${selected ? '#facc15' : '#475569'} 5% 10%)`
                }}
            ></div>
            <div 
                className="absolute inset-[12px] rounded-full flex items-center justify-center"
                style={{
                    background: locked
                        ? 'radial-gradient(circle at 50% 50%, #6b7280, #374151)'
                        : selected 
                            ? 'radial-gradient(circle at 50% 50%, #fef08a, #facc15)' 
                            : 'radial-gradient(circle at 50% 50%, #475569, #1e293b)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)'
                }}
            >
                {locked ? (
                    <LockIcon />
                ) : (
                    <span 
                        className={`
                            transition-colors duration-300 group-hover:text-white
                            ${selected ? 'text-slate-800' : 'text-slate-400'}
                        `}
                        style={{
                            textShadow: selected ? '0 1px 1px rgba(255,255,255,0.5)' : '0 1px 1px rgba(0,0,0,0.8)'
                        }}
                    >{boost}</span>
                )}
            </div>
        </button>
        <span className={`text-sm font-semibold text-center transition-colors ${
            locked ? 'text-gray-500' : selected ? 'text-amber-300' : 'text-slate-400'
        } ${!locked && 'group-hover:text-white'}`}>
            {text}
        </span>
    </div>
)

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
    const [scorerChipSelected, setScorerChipSelected] = useState(false);
    const [cardChipSelected, setCardChipSelected] = useState(false);

    const allPlayers = selectedGames.flatMap(game => [
        ...game.home.players.map(p => ({ ...p, teamLogo: game.home.logo })),
        ...game.away.players.map(p => ({ ...p, teamLogo: game.away.logo }))
    ]);

    const filteredScorerPlayers = allPlayers.filter(p => p.name.toLowerCase().includes(scorerSearch.toLowerCase()));
    const filteredCardPlayers = allPlayers.filter(p => p.name.toLowerCase().includes(cardSearch.toLowerCase()));

    const handleScorerChipClick = () => {
        const newSelected = !scorerChipSelected;
        setScorerChipSelected(newSelected);
        if (newSelected && filteredScorerPlayers.length > 0) {
            onSelectGoalscorer(filteredScorerPlayers[0]);
        } else if (!newSelected) {
            onSelectGoalscorer(undefined as any);
        }
    };

    const handleCardChipClick = () => {
        const newSelected = !cardChipSelected;
        setCardChipSelected(newSelected);
        if (newSelected && filteredCardPlayers.length > 0) {
            onSelectCardedPlayer(filteredCardPlayers[0]);
        } else if (!newSelected) {
            onSelectCardedPlayer(undefined as any);
        }
    };

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
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-lg">{statType === 'score' ? player.goalscorerOdd : player.cardedOdd}</span>
                        {selectedPlayer?.id === player.id && <span className="text-2xl mt-1">✓</span>}
                    </div>
                </button>
            ))}
        </div>
    );

    return (
        <div className="rounded-xl shadow-2xl border-2 p-4 mt-4 bet-card">
            <div className="flex justify-between items-center cursor-pointer" onClick={onToggleCollapse}>
                <h2 className="text-xl font-bold text-white">3. Add a boost chip</h2>
                <ChevronUpIcon className={`w-6 h-6 text-white transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </div>

            <div className={`collapsible-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 justify-items-center">
                        <Chip 
                            text="Player to Score" 
                            boost="x1.2" 
                            selected={scorerChipSelected} 
                            onClick={handleScorerChipClick}
                        />
                        <Chip 
                            text="Player to be Carded" 
                            boost="x1.2" 
                            selected={cardChipSelected} 
                            onClick={handleCardChipClick}
                        />
                        <Chip 
                            text="Player to be Sent Off" 
                            boost="x2.5" 
                            selected={false} 
                            locked={true}
                        />
                        <Chip 
                            text="Player to Assist" 
                            boost="x1.8" 
                            selected={false} 
                            locked={true}
                        />
                    </div>

                    {(scorerChipSelected || cardChipSelected) && (
                        <div className={`grid gap-6 ${scorerChipSelected && cardChipSelected ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                            {/* Section 1: Player to Score */}
                            {scorerChipSelected && (
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
                            )}

                            {/* Section 2: Player to get a Yellow Card */}
                            {cardChipSelected && (
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
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 