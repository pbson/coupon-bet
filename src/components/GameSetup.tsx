import React, { useState, useEffect } from "react";
import type { Game, Player } from "../types";
import { MOCK_GAMES, MOCK_COMPETITIONS } from "../data";
import { BetSlip } from "./BetSlip";
import type { BetSelection } from "../App";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
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

export const GameSetup = ({
  onStartGame,
  onThreeGamesSelected,
  isCollapsed,
  onToggleCollapse,
  onGamesChange,
  betSelections,
  winOdds,
  selectedGoals,
  goalsOdds,
  selectedCards,
  cardsOdds,
  selectedGoalscorer,
  selectedCardedPlayer,
}: {
  onStartGame: (games: Game[], stake: number) => void;
  onThreeGamesSelected: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onGamesChange: (games: Game[]) => void;
  betSelections: BetSelection;
  winOdds: string[][];
  selectedGoals: number;
  goalsOdds: string[];
  selectedCards: number;
  cardsOdds: string[];
  selectedGoalscorer?: Player;
  selectedCardedPlayer?: Player;
}) => {
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [stake, setStake] = useState(10);
  const [competitionSearch, setCompetitionSearch] = useState("");
  const [matchSearches, setMatchSearches] = useState<{ [key: string]: string }>(
    {}
  );
  const [expandedCompetitions, setExpandedCompetitions] = useState<string[]>([
    "prem",
  ]);
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    onGamesChange(selectedGames);
    if (selectedGames.length === 3 && !hasNotified) {
      onThreeGamesSelected();
      setHasNotified(true);
    }
  }, [selectedGames, onThreeGamesSelected, hasNotified, onGamesChange]);

  const handleSelectGame = (game: Game) => {
    setSelectedGames((prev) => {
      if (prev.some((g) => g.id === game.id)) {
        return prev.filter((g) => g.id !== game.id);
      }
      return prev.length < 3 ? [...prev, game] : prev;
    });
  };

  const clearSlip = () => {
    setSelectedGames([]);
    setStake(10);
  };

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setStake(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleMatchSearchChange = (competitionKey: string, value: string) => {
    setMatchSearches((prev) => ({ ...prev, [competitionKey]: value }));
  };

  const toggleCompetition = (competitionKey: string) => {
    setExpandedCompetitions((prev) =>
      prev.includes(competitionKey)
        ? prev.filter((k) => k !== competitionKey)
        : [...prev, competitionKey]
    );
  };

  const filteredCompetitions = Object.entries(MOCK_COMPETITIONS).filter(
    ([, name]) => name.toLowerCase().includes(competitionSearch.toLowerCase())
  );

  return (
    <>
      <div className="rounded-xl shadow-2xl border-2 p-4 bet-card">
        <div className="flex justify-between items-center cursor-pointer" onClick={onToggleCollapse}>
          <h2 className="text-xl font-bold text-white">
            1. Choose your games
          </h2>
          <ChevronUpIcon className={`w-6 h-6 text-white transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </div>

        <div className={`collapsible-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          <div className="mt-4">
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search competitions..."
                value={competitionSearch}
                onChange={(e) => setCompetitionSearch(e.target.value)}
                className="w-full rounded-lg p-3 pl-10 text-base text-white border-2 focus:ring-2 bet-input"
              />
            </div>
            <div className="space-y-2 max-h-96 lg:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              {filteredCompetitions.map(([key, name]) => {
                const isExpanded = expandedCompetitions.includes(key);
                const competitionGames = MOCK_GAMES.filter(
                  (g) => g.competition === key
                );
                const filteredMatches = competitionGames.filter((g) =>
                  `${g.home.name} vs ${g.away.name}`
                    .toLowerCase()
                    .includes((matchSearches[key] || "").toLowerCase())
                );

                return (
                  <div
                    key={key}
                    className="rounded-lg overflow-hidden bet-competition"
                  >
                    <button
                      onClick={() => toggleCompetition(key)}
                      className="w-full flex justify-between items-center p-3 text-left font-bold text-white cursor-pointer bet-hover-transparent"
                    >
                      <span>{name}</span>
                      <span
                        className={`transform transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="p-2 animate-fade-in bet-competition-expanded">
                        <div className="relative my-2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                            <SearchIcon />
                          </span>
                          <input
                            type="text"
                            placeholder={`Search matches in ${name}...`}
                            value={matchSearches[key] || ""}
                            onChange={(e) =>
                              handleMatchSearchChange(key, e.target.value)
                            }
                            className="w-full border-2 rounded-lg p-2 pl-10 text-sm text-white focus:ring-2 bet-card"
                          />
                        </div>
                        <div className="space-y-1 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                          {filteredMatches.map((game) => {
                            const isSelected = selectedGames.some(
                              (g) => g.id === game.id
                            );
                            return (
                              <button
                                key={game.id}
                                onClick={() => handleSelectGame(game)}
                                disabled={!isSelected && selectedGames.length >= 3}
                                className={`w-full flex items-center p-2 rounded-lg text-left transition-all duration-200 ${
                                  isSelected
                                    ? "bg-green-500 text-white cursor-pointer"
                                    : "text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bet-game-button"
                                }`}
                              >
                                <img
                                  src={game.home.logo}
                                  alt={game.home.name}
                                  className="w-auto h-5 mr-2"
                                />
                                <span className="font-semibold flex-1 text-sm">
                                  {game.home.name} vs {game.away.name}
                                </span>
                                <img
                                  src={game.away.logo}
                                  alt={game.away.name}
                                  className="w-auto h-5 ml-2"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <BetSlip
        selectedGames={selectedGames}
        stake={stake}
        onStakeInputChange={handleStakeChange}
        onQuickStakeChange={setStake}
        onClearSlip={clearSlip}
        onStartGame={() => onStartGame(selectedGames, stake)}
        betSelections={betSelections}
        winOdds={winOdds}
        selectedGoals={selectedGoals}
        goalsOdds={goalsOdds}
        selectedCards={selectedCards}
        cardsOdds={cardsOdds}
        selectedGoalscorer={selectedGoalscorer}
        selectedCardedPlayer={selectedCardedPlayer}
      />
    </>
  );
}; 