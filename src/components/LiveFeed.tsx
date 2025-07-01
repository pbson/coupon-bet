import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Game, LiveEvent, Score, EventType, CelebrationState, Player } from "../types";

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
            +${amount.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

const ScoreBoard = ({ 
  games, 
  scores, 
  gameTimes 
}: { 
  games: Game[]; 
  scores: { [key: string]: Score }; 
  gameTimes: { [key: string]: number };
}) => (
  <div className="space-y-4 mb-6">
    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Live Games</h2>
    {games.map((game) => {
      const score = scores[game.id] || { home: 0, away: 0 };
      const minute = gameTimes[game.id] || 0;
      const isLive = minute > 0 && minute < 90;
      
      return (
        <div key={game.id} className="bet-card rounded-xl p-4 border-2 flex flex-col">
          <div className="flex justify-between items-center text-xs text-slate-300 uppercase font-semibold mb-3">
            <span>{game.competition}</span>
            {isLive && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-red-400 font-bold">{minute}'</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
              <img src={game.home.logo} alt={game.home.name} className="w-10 h-10" />
              <span className="text-white font-semibold text-sm">{game.home.name}</span>
            </div>
            
            <div className="mx-4 text-center">
              <span className="text-4xl font-bold text-white tracking-tighter">{score.home} - {score.away}</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
              <img src={game.away.logo} alt={game.away.name} className="w-10 h-10" />
              <span className="text-white font-semibold text-sm">{game.away.name}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const LiveEventTicker = ({ events }: { events: LiveEvent[] }) => (
  <div className="bet-card rounded-xl shadow-2xl border-2 p-4 mb-6">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-bold text-white">Live Event Ticker</h2>
      <div className="flex items-center gap-2 text-sm font-semibold text-red-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span>LIVE</span>
      </div>
    </div>
    <div className="space-y-3 h-48 overflow-y-auto pr-2 scrollbar-thin">
      {events.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-400">Waiting for match events...</p>
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
              <EventTickerIcon type={event.type} />
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">
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

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 text-green-500"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

interface LiveFeedProps {
  selectedGames: Game[];
  betSelections: any;
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

    // Check total cards (simulated - randomly trigger on certain events)
    if (eventType === "SAVE" && Math.random() > 0.7 && !fulfilledBets.cards) {
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
  }, [selectedGoals, selectedCards, stake, fulfilledBets]);

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
      if (selectedCardedPlayer && Math.random() > 0.8 && !fulfilledBets.cardedPlayer) {
        setFulfilledBets(prev => ({ ...prev, cardedPlayer: true }));
        const winAmount = stake * 2.2;
        setWinnings(prev => prev + winAmount);
        
        setCelebration({
          type: "BET_WIN",
          text: `${selectedCardedPlayer.name} to be Carded Boost Won!`,
          amount: winAmount,
        });
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
        <div className="text-center mb-6 bg-gradient-to-br from-blue-900 to-blue-950 p-6 rounded-2xl border-2 border-blue-800 shadow-lg">
          <h2 className="text-sm font-bold text-blue-200 uppercase tracking-widest">Total Winnings</h2>
          <p className="text-5xl font-black text-yellow-400 my-1 tracking-tighter">
            ${winnings.toFixed(2)}
          </p>
        </div>

        <ScoreBoard games={selectedGames} scores={liveScores} gameTimes={gameTimes} />
        <LiveEventTicker events={events} />

        <div className="bet-card rounded-xl p-4 border-2 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Your Bet Slip</h3>
            <div className="text-yellow-400 font-bold text-sm">Total Stake: ${stake.toFixed(2)}</div>
          </div>
          <div className="space-y-3">
            
            {/* Win Selections */}
            {Object.keys(betSelections).length > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-3">
                <h4 className="text-md font-semibold text-white mb-2">Win Outcomes</h4>
                <div className="space-y-2">
                  {Object.entries(betSelections).map(([key, selection]) => {
                    const [, row, col] = key.split('-');
                    const outcomes = ['Home Wins', 'Draws', 'Away Wins'];
                    const levels = ['1+', '2+', '3+'];
                    const isFulfilled = fulfilledBets.wins[key] || false;
                    
                    // Count current actual outcomes
                    let homeWins = 0;
                    let draws = 0;
                    let awayWins = 0;
                    
                    selectedGames.forEach(game => {
                      const score = liveScores[game.id] || { home: 0, away: 0 };
                      if (score.home > score.away) homeWins++;
                      else if (score.home === score.away) draws++;
                      else awayWins++;
                    });
                    
                    const currentCounts = [homeWins, draws, awayWins];
                    const outcomeType = parseInt(col);
                    const currentCount = currentCounts[outcomeType];
                    
                    return (
                      <div key={key} className="flex justify-between items-center text-white p-2 rounded-md bg-slate-800/50">
                        <div>
                          <span className="text-sm font-semibold">
                            {levels[parseInt(row)]} {outcomes[parseInt(col)]}
                          </span>
                          <div className="text-xs text-slate-300">
                            Current: {currentCount} | Odds: {selection.odd}
                          </div>
                        </div>
                        {isFulfilled ? <CheckIcon /> : <span className="w-5 h-5"></span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Goals & Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <h4 className="text-md font-semibold text-white mb-2">Goals</h4>
                <div className="flex justify-between items-center text-white p-2 rounded-md bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-sm">{selectedGoals}+ Total Goals</span>
                    <div className="text-xs text-slate-300">
                      Current: {Object.values(liveScores).reduce((sum, score) => sum + score.home + score.away, 0)}
                    </div>
                  </div>
                  {fulfilledBets.goals ? <CheckIcon /> : <span className="w-5 h-5"></span>}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <h4 className="text-md font-semibold text-white mb-2">Cards</h4>
                <div className="flex justify-between items-center text-white p-2 rounded-md bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-sm">{selectedCards}+ Yellow Cards</span>
                    <div className="text-xs text-slate-300">Tracking incidents</div>
                  </div>
                  {fulfilledBets.cards ? <CheckIcon /> : <span className="w-5 h-5"></span>}
                </div>
              </div>
            </div>

            {/* Player Boosts */}
            {(selectedGoalscorer || selectedCardedPlayer) && (
              <div className="bg-slate-900/50 rounded-lg p-3">
                <h4 className="text-md font-semibold text-white mb-2">Player Boosts</h4>
                <div className="space-y-2">
                {selectedGoalscorer && (
                  <div className="flex justify-between items-center text-white p-2 rounded-md bg-slate-800/50">
                    <div>
                      <span className="font-semibold text-sm">{selectedGoalscorer.name} to Score</span>
                      <div className="text-xs text-slate-300">{selectedGoalscorer.scoreStats}</div>
                    </div>
                    {fulfilledBets.goalscorer ? <CheckIcon /> : <span className="w-5 h-5"></span>}
                  </div>
                )}

                {selectedCardedPlayer && (
                  <div className="flex justify-between items-center text-white p-2 rounded-md bg-slate-800/50">
                    <div>
                      <span className="font-semibold text-sm">{selectedCardedPlayer.name} to be Carded</span>
                      <div className="text-xs text-slate-300">{selectedCardedPlayer.cardStats}</div>
                    </div>
                    {fulfilledBets.cardedPlayer ? <CheckIcon /> : <span className="w-5 h-5"></span>}
                  </div>
                )}
                </div>
              </div>
            )}
          </div>
        </div>

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