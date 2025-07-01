import React, { useState } from "react";
import { Header } from "./components/Header";
import { GameSetup } from "./components/GameSetup";
import { BetBuilder } from "./components/BetBuilder";
import { BetBoost } from "./components/BetBoost";
import { LiveFeed } from "./components/LiveFeed";
import type { Game, Player } from "./types";

export interface BetSelection {
  [key: string]: {
    odd: string;
  };
}

const generateRandomOdd = () => `${Math.floor(Math.random() * 19) + 2}/1`;

type AppView = "bet-builder" | "live-feed";

// --- MAIN APP ---
export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("bet-builder");
  const [isGameSetupCollapsed, setIsGameSetupCollapsed] = useState(false);
  const [isBetBuilderCollapsed, setIsBetBuilderCollapsed] = useState(true);
  const [isBetBoostCollapsed, setIsBetBoostCollapsed] = useState(true);
  
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [betSelections, setBetSelections] = useState<BetSelection>({});
  const [winOdds] = useState(() =>
    Array(3).fill(null).map(() =>
        Array(3).fill(null).map(() => generateRandomOdd())
    )
  );
  const [selectedGoals, setSelectedGoals] = useState(8);
  const [selectedCards, setSelectedCards] = useState(5);
  const [goalsOdds] = useState(() => Array.from({ length: 25 }, () => generateRandomOdd()));
  const [cardsOdds] = useState(() => Array.from({ length: 25 }, () => generateRandomOdd()));
  const [selectedGoalscorer, setSelectedGoalscorer] = useState<Player>();
  const [selectedCardedPlayer, setSelectedCardedPlayer] = useState<Player>();
  const [currentStake, setCurrentStake] = useState(10);

  const handleStartGame = (games: Game[], gameStake: number) => {
    setCurrentStake(gameStake);
    setCurrentView("live-feed");
  };

  const handleThreeGamesSelected = () => {
    setIsGameSetupCollapsed(true);
    setIsBetBuilderCollapsed(false);
    setIsBetBoostCollapsed(false);
  };

  const handleBetSelectionChange = (selectionKey: string) => {
    const [, rStr, cStr] = selectionKey.split('-');
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);

    setBetSelections(prev => {
      const newSelections = { ...prev };
      const isCurrentlySelected = newSelections[selectionKey];

      // Deselect all in column first to handle toggling lower values
      for (let i = 0; i < 3; i++) {
        delete newSelections[`wins-${i}-${c}`];
      }

      if (!isCurrentlySelected) {
        // Select this and all above it
        for (let i = 0; i <= r; i++) {
          newSelections[`wins-${i}-${c}`] = { odd: winOdds[i][c] };
        }
      }
      
      return newSelections;
    });
  };

  const handleGoalsChange = (goals: number) => {
    setSelectedGoals(goals);
  }

  const handleCardsChange = (cards: number) => {
    setSelectedCards(cards);
  }

  const handleGamesChange = (games: Game[]) => {
    setSelectedGames(games);
  }

  const handleSelectGoalscorer = (player: Player) => {
    setSelectedGoalscorer(player.id === selectedGoalscorer?.id ? undefined : player);
  }

  const handleSelectCardedPlayer = (player: Player) => {
    setSelectedCardedPlayer(player.id === selectedCardedPlayer?.id ? undefined : player);
  }

  const handleBackToHomepage = () => {
    setCurrentView("bet-builder");
  };

  if (currentView === "live-feed") {
  return (
      <div className="min-h-screen font-sans bg-white">
        <Header onMenuClick={handleBackToHomepage} />
        <LiveFeed
          selectedGames={selectedGames}
          betSelections={betSelections}
          selectedGoals={selectedGoals}
          selectedCards={selectedCards}
          selectedGoalscorer={selectedGoalscorer}
          selectedCardedPlayer={selectedCardedPlayer}
          stake={currentStake}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-white">
      <Header onMenuClick={handleBackToHomepage} />
      <main className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-blue-800">
            Bet Builder
          </h1>
        </div>
        <GameSetup
          onStartGame={handleStartGame}
          onThreeGamesSelected={handleThreeGamesSelected}
          isCollapsed={isGameSetupCollapsed}
          onToggleCollapse={() => setIsGameSetupCollapsed(prev => !prev)}
          onGamesChange={handleGamesChange}
          betSelections={betSelections}
          winOdds={winOdds}
          selectedGoals={selectedGoals}
          goalsOdds={goalsOdds}
          selectedCards={selectedCards}
          cardsOdds={cardsOdds}
          selectedGoalscorer={selectedGoalscorer}
          selectedCardedPlayer={selectedCardedPlayer}
        />
        <BetBuilder
          isCollapsed={isBetBuilderCollapsed}
          onToggleCollapse={() => setIsBetBuilderCollapsed(prev => !prev)}
          selections={betSelections}
          onSelectionChange={handleBetSelectionChange}
          winOdds={winOdds}
          selectedGoals={selectedGoals}
          onGoalsChange={handleGoalsChange}
          selectedCards={selectedCards}
          onCardsChange={handleCardsChange}
        />
        <BetBoost
            isCollapsed={isBetBoostCollapsed}
            onToggleCollapse={() => setIsBetBoostCollapsed(prev => !prev)}
            selectedGames={selectedGames}
            onSelectGoalscorer={handleSelectGoalscorer}
            onSelectCardedPlayer={handleSelectCardedPlayer}
            selectedGoalscorer={selectedGoalscorer}
            selectedCardedPlayer={selectedCardedPlayer}
        />
      </main>
    </div>
  );
}
