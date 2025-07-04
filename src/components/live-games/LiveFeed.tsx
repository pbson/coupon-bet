import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Game, LiveEvent, Score, EventType, CelebrationState, Player } from "../../types";
import type { BetSelection } from "../../App";
import { LiveScoreBoard } from "./LiveScoreBoard";
import { BetSlipSummary } from "./BetSlipSummary";

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
  </svg>
);

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M5.75 4.5a.75.75 0 00-.75.75v10.5a.75.75 0 001.5 0V5.25a.75.75 0 00-.75-.75zM14.25 4.5a.75.75 0 00-.75.75v10.5a.75.75 0 001.5 0V5.25a.75.75 0 00-.75-.75z"></path>
  </svg>
);

const EventTickerIcon = ({ type }: { type: EventType }) => {
  const icons: Record<EventType, { icon: string; color: string }> = {
    GOAL: { icon: "⚽", color: "bg-green-100 text-green-600" },
    CHANCE: { icon: "🎯", color: "bg-blue-100 text-blue-600" },
    SAVE: { icon: "🧤", color: "bg-yellow-100 text-yellow-600" },
  };
  const { icon, color } = icons[type] || { icon: "⚡", color: "bg-gray-100" };
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${color} text-lg shrink-0`}
    >
      {icon}
    </div>
  );
};

const CelebrationOverlay = ({
  type,
  text,
  amount,
  onAnimationEnd,
}: {
  type: string;
  text?: string;
  amount?: number;
  onAnimationEnd: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onAnimationEnd, 2500);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const isWin = type === "BET_WIN";
  const isGoal = type === "GOAL";
  const title = isWin ? "WINNER!" : isGoal ? "GOAL!" : "SUCCESS!";
  const mainColor = isWin ? "#f59e0b" : isGoal ? "#009933" : "#0340a1";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-black/60"></div>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 1.5}s`,
            backgroundColor: ["#ffc700", "#009933", "#ffffff"][i % 3],
          }}
        ></div>
      ))}
      <div className="text-center z-10 animate-celebration-zoom">
        <h1
          className="font-black text-7xl text-white"
          style={{ WebkitTextStroke: `4px ${mainColor}` }}
        >
          {title}
        </h1>
        <p className="font-bold text-white mt-2 text-2xl">
          {text}
        </p>
        {amount && (
          <p className="font-bold text-yellow-400 mt-2 text-4xl">
            +€{amount.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

const LiveEventTicker = ({ events }: { events: LiveEvent[] }) => (
  <div className="bet-card rounded-xl shadow-2xl border-2 p-2 sm:p-4 mb-4 sm:mb-6">
    <div className="flex justify-between items-center mb-2 sm:mb-3">
      <h2 className="text-base sm:text-lg font-bold text-white">Live Event Ticker</h2>
      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-red-400">
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
        </span>
        <span>LIVE</span>
      </div>
    </div>
    <div className="space-y-2 sm:space-y-3 h-32 sm:h-48 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
      {events.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-400 text-xs sm:text-sm">Waiting for match events...</p>
        </div>
      ) : (
        events
          .slice()
          .reverse()
          .map((event) => (
            <div
              key={event.id}
              className="flex items-center animate-fade-in-up"
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
                event.type === 'GOAL' ? 'bg-green-100 text-green-600' :
                event.type === 'CHANCE' ? 'bg-blue-100 text-blue-600' :
                'bg-yellow-100 text-yellow-600'
              } text-sm sm:text-lg shrink-0`}>
                {event.type === 'GOAL' ? '⚽' : event.type === 'CHANCE' ? '🎯' : '🧤'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs sm:text-sm text-white">
                  {event.text}
                </p>
                <p className="text-xs text-slate-300">{event.game}</p>
              </div>
              <span className="text-xs font-bold text-white">
                {event.minute}'
              </span>
            </div>
          ))
      )}
    </div>
  </div>
);

interface LiveFeedProps {
  selectedGames: Game[];
  betSelections: BetSelection;
  selectedGoals: number;
  selectedCards: number;
  selectedGoalscorer?: Player;
  selectedCardedPlayer?: Player;
  stake: number;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({
  selectedGames,
  betSelections,
  selectedGoals,
  selectedCards,
  selectedGoalscorer,
  selectedCardedPlayer,
  stake
}) => {
  const [liveScores, setLiveScores] = useState<{ [key: string]: Score }>({});
  const [gameTimes, setGameTimes] = useState<{ [key: string]: number }>({});
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [winnings, setWinnings] = useState(0);
  const [fulfilledBets, setFulfilledBets] = useState<{
    goals: boolean;
    cards: boolean;
    goalscorer: boolean;
    cardedPlayer: boolean;
    wins: { [key: string]: boolean };
  }>({
    goals: false,
    cards: false,
    goalscorer: false,
    cardedPlayer: false,
    wins: {}
  });
  const [gamesEnded, setGamesEnded] = useState(false);
  const [goalEvents, setGoalEvents] = useState<Array<{ player: string; minute: number; team: string }>>([]);
  const [cardEvents, setCardEvents] = useState<Array<{ player: string; minute: number; team: string }>>([]);

  const goalAudioRef = useRef<HTMLAudioElement | null>(null);
  const winnerAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const initialScores: { [key: string]: Score } = {};
    const initialTimes: { [key: string]: number } = {};
    selectedGames.forEach((g) => {
      initialScores[g.id] = { home: 0, away: 0 };
      initialTimes[g.id] = 0;
    });
    setLiveScores(initialScores);
    setGameTimes(initialTimes);
    
    goalAudioRef.current = new Audio("/bet-365-goal-sound.mp3");
    goalAudioRef.current.load();
    winnerAudioRef.current = new Audio("/winner.mp3");
    winnerAudioRef.current.load();
  }, [selectedGames]);

  const checkBetWins = useCallback((newScores: { [key: string]: Score }, gameId: string, eventType?: EventType) => {
    // Check total goals across all games
    const totalGoalsAcrossGames = Object.values(newScores).reduce((sum, score) => sum + score.home + score.away, 0);
    if (totalGoalsAcrossGames >= selectedGoals && !fulfilledBets.goals) {
      setFulfilledBets(prev => ({ ...prev, goals: true }));
      const winAmount = stake * 2.5;
      setWinnings(prev => prev + winAmount);
      
      if (winnerAudioRef.current) {
        winnerAudioRef.current.play().catch(console.error);
      }
      
      setCelebration({
        type: "BET_WIN",
        text: `${selectedGoals}+ Goals Bet Won!`,
        amount: winAmount,
      });
    }

    // Check total cards based on actual card events
    if (cardEvents.length >= selectedCards && !fulfilledBets.cards) {
      setFulfilledBets(prev => ({ ...prev, cards: true }));
      const winAmount = stake * 1.8;
      setWinnings(prev => prev + winAmount);
      
      if (winnerAudioRef.current) {
        winnerAudioRef.current.play().catch(console.error);
      }
      
      setCelebration({
        type: "BET_WIN",
        text: `${selectedCards}+ Cards Bet Won!`,
        amount: winAmount,
      });
    }
  }, [selectedGoals, selectedCards, stake, fulfilledBets, cardEvents]);

  const runSimulation = useCallback(() => {
    if (celebration) return;
    
    const activeGames = selectedGames.filter(game => (gameTimes[game.id] || 0) < 90);
    if (activeGames.length === 0) return;
    
    const gameIndex = Math.floor(Math.random() * activeGames.length);
    const game = activeGames[gameIndex];
    if (!game) return;

    const currentMinute = gameTimes[game.id] || 0;
    const newMinute = Math.min(90, currentMinute + Math.floor(Math.random() * 5) + 1);
    
    setGameTimes((prev) => ({ ...prev, [game.id]: newMinute }));

    const teamToAct = Math.random() < 0.5 ? game.home : game.away;
    const player = teamToAct.players[Math.floor(Math.random() * teamToAct.players.length)];
    const eventRoll = Math.random();
    let eventData: Omit<LiveEvent, "id">;

    if (eventRoll > 0.7) {
      eventData = {
        type: "GOAL",
        text: `${player.name} scores for ${teamToAct.name}!`,
        game: `${game.home.name} vs ${game.away.name}`,
        minute: newMinute,
      };
      
      if (goalAudioRef.current) {
        goalAudioRef.current.play().catch(console.error);
      }
      
      // Check if this player was selected as goalscorer
      if (selectedGoalscorer && player.id === selectedGoalscorer.id && !fulfilledBets.goalscorer) {
        setFulfilledBets(prev => ({ ...prev, goalscorer: true }));
        const winAmount = stake * 3.0;
        setWinnings(prev => prev + winAmount);
        
        setCelebration({
          type: "BET_WIN",
          text: `${player.name} to Score Boost Won!`,
          amount: winAmount,
        });
      } else {
        setCelebration({ type: "GOAL", text: eventData.text });
      }
      
      setGoalEvents((prev) => [...prev, { 
        player: player.name, 
        minute: newMinute, 
        team: teamToAct.name 
      }]);
      
      setLiveScores((prev) => {
        const newScores = { ...prev };
        newScores[game.id] = { ...newScores[game.id] };
        newScores[game.id][teamToAct.id === game.home.id ? "home" : "away"] += 1;
        
        checkBetWins(newScores, game.id, "GOAL");
        return newScores;
      });
      
    } else if (eventRoll > 0.4) {
      eventData = {
        type: "CHANCE",
        text: `${player.name} has a shot, but it's just wide!`,
        game: `${game.home.name} vs ${game.away.name}`,
        minute: newMinute,
      };
    } else {
      eventData = {
        type: "SAVE",
        text: `Great save! ${player.name}'s shot is denied.`,
        game: `${game.home.name} vs ${game.away.name}`,
        minute: newMinute,
      };
      
      // Check for cards when there's a save (simulating fouls)
      if (Math.random() > 0.85) {
        setCardEvents((prev) => [...prev, { 
          player: player.name, 
          minute: newMinute, 
          team: teamToAct.name 
        }]);
        
        if (selectedCardedPlayer && player.id === selectedCardedPlayer.id && !fulfilledBets.cardedPlayer) {
          setFulfilledBets(prev => ({ ...prev, cardedPlayer: true }));
          const winAmount = stake * 2.2;
          setWinnings(prev => prev + winAmount);
          
          setCelebration({
            type: "BET_WIN",
            text: `${selectedCardedPlayer.name} to be Carded Boost Won!`,
            amount: winAmount,
          });
        }
      }
      
      setLiveScores((prev) => {
        checkBetWins(prev, game.id, "SAVE");
        return prev;
      });
    }
    
    setEvents((prev) => [...prev, { ...eventData, id: Date.now() }]);
  }, [selectedGames, celebration, gameTimes, checkBetWins, selectedGoalscorer, selectedCardedPlayer, fulfilledBets, stake]);

  // Check if all games have ended and evaluate match outcomes
  useEffect(() => {
    const allGamesEnded = selectedGames.every(game => (gameTimes[game.id] || 0) >= 90);
    
    if (allGamesEnded && !gamesEnded) {
      setGamesEnded(true);
      
      // Count actual outcomes across all games
      let homeWins = 0;
      let draws = 0;
      let awayWins = 0;
      
      selectedGames.forEach(game => {
        const score = liveScores[game.id] || { home: 0, away: 0 };
        if (score.home > score.away) homeWins++;
        else if (score.home === score.away) draws++;
        else awayWins++;
      });
      
      const actualCounts = [homeWins, draws, awayWins];
      
      // Check win predictions
      const newWinFulfillments: { [key: string]: boolean } = {};
      let totalWinnings = 0;
      
      Object.keys(betSelections).forEach(selectionKey => {
        const [, row, col] = selectionKey.split('-');
        const requiredCount = parseInt(row) + 1; // row 0 = 1+, row 1 = 2+, row 2 = 3+
        const outcomeType = parseInt(col); // 0=Home, 1=Draw, 2=Away
        
        if (actualCounts[outcomeType] >= requiredCount) {
          newWinFulfillments[selectionKey] = true;
          const winAmount = stake * 1.5;
          totalWinnings += winAmount;
        }
      });
      
      setFulfilledBets(prev => ({ ...prev, wins: newWinFulfillments }));
      
      if (totalWinnings > 0) {
        setWinnings(prev => prev + totalWinnings);
        
        if (winnerAudioRef.current) {
          winnerAudioRef.current.play().catch(console.error);
        }
        
        setCelebration({
          type: "BET_WIN",
          text: `${Object.keys(newWinFulfillments).length} Win Outcome${Object.keys(newWinFulfillments).length > 1 ? 's' : ''} Correct!`,
          amount: totalWinnings,
        });
      }
    }
  }, [gameTimes, selectedGames, gamesEnded, betSelections, liveScores, stake]);

  useEffect(() => {
    if (!isSimulating) return;

    const simInterval = setInterval(runSimulation, 2000 / simSpeed);
    return () => clearInterval(simInterval);
  }, [isSimulating, runSimulation, simSpeed]);

  const handleAnimationEnd = useCallback(() => {
    setCelebration(null);
  }, []);

  return (
    <div>
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes celebration-zoom { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .confetti { position: absolute; top: -20px; width: 10px; height: 10px; animation: fall 3s linear infinite; }
        @keyframes fall { to { transform: translateY(100vh) rotate(360deg); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        .animate-celebration-zoom { animation: celebration-zoom 0.5s ease-out forwards; }
        .scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #0340a1; border-radius: 10px; }
      `}</style>

      {celebration && (
        <CelebrationOverlay
          type={celebration.type}
          text={celebration.text}
          amount={celebration.amount}
          onAnimationEnd={handleAnimationEnd}
        />
      )}

      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center mb-6 bg-gradient-to-br from-blue-900 to-blue-950 p-4 sm:p-6 rounded-2xl border-2 border-blue-800 shadow-lg">
          <h2 className="text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-widest">Total Winnings</h2>
          <p className="text-3xl sm:text-5xl font-black text-yellow-400 my-1 tracking-tighter">
            €{winnings.toFixed(2)}
          </p>
        </div>

        <LiveScoreBoard games={selectedGames} scores={liveScores} gameTimes={gameTimes} />
        
        <BetSlipSummary
          selectedGames={selectedGames}
          betSelections={betSelections}
          selectedGoals={selectedGoals}
          selectedCards={selectedCards}
          selectedGoalscorer={selectedGoalscorer}
          selectedCardedPlayer={selectedCardedPlayer}
          stake={stake}
          liveScores={liveScores}
          fulfilledBets={fulfilledBets}
          goalEvents={goalEvents}
          cardEvents={cardEvents}
        />
        
        <LiveEventTicker events={events} />

        <div className="fixed bottom-4 right-4 z-30 flex items-center justify-center gap-2 rounded-full bg-white/80 p-2 border border-gray-200 backdrop-blur-sm shadow-lg">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="bet-button-primary text-white font-semibold w-12 h-12 rounded-full shadow-lg transition-colors flex items-center justify-center hover:bg-white hover:text-blue-800"
          >
            {isSimulating ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            onClick={() => setSimSpeed((s) => (s === 4 ? 1 : s * 2))}
            disabled={!isSimulating}
            className={`bet-button-primary text-white font-semibold w-12 h-12 rounded-full shadow-lg transition-colors flex items-center justify-center ${
              !isSimulating ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-blue-800"
            }`}
          >
            <span className="text-lg font-bold">{simSpeed}x</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 