import React from 'react';
import type { Game, Score } from '../../types';

interface LiveScoreBoardProps {
  games: Game[];
  scores: { [key: string]: Score };
  gameTimes: { [key: string]: number };
}

export const LiveScoreBoard: React.FC<LiveScoreBoardProps> = ({ 
  games, 
  scores, 
  gameTimes 
}) => (
  <div className="mb-6">
    <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight mb-3">Live Games</h2>
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {games.map((game) => {
        const score = scores[game.id] || { home: 0, away: 0 };
        const minute = gameTimes[game.id] || 0;
        const isLive = minute > 0 && minute < 90;
        
        return (
          <div key={game.id} className="bet-card rounded-lg p-2 sm:p-3 border-2 flex flex-col">
            <div className="flex justify-between items-center text-xs text-slate-300 uppercase font-semibold mb-1 sm:mb-2">
              <span className="truncate text-xs sm:text-xs">{game.competition}</span>
              {isLive && (
                <div className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  <span className="text-red-400 font-bold text-xs">{minute}'</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-1 flex-1">
                <img src={game.home.logo} alt={game.home.name} className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-white font-semibold text-xs text-center truncate w-full">{game.home.name}</span>
              </div>
              
              <div className="mx-1 sm:mx-2 text-center">
                <span className="text-sm sm:text-xl font-bold text-white tracking-tighter">{score.home}-{score.away}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 flex-1">
                <img src={game.away.logo} alt={game.away.name} className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-white font-semibold text-xs text-center truncate w-full">{game.away.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
); 