import React from 'react';

interface BetSummaryOverlayProps {
    totalOdds: number;
    stake: number;
    potentialReturn: number;
    onPlaceBet: () => void;
    isReady: boolean;
}

export const BetSummaryOverlay = ({ 
    totalOdds, 
    stake, 
    potentialReturn,
    onPlaceBet,
    isReady
}: BetSummaryOverlayProps) => {
    return (
        <div className="fixed top-4 right-4 z-40">
            <div className="bg-slate-900 rounded-lg shadow-2xl p-3 w-56 text-white animate-fade-in-down">
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Total Odds:</span>
                        <span className="font-bold">{totalOdds.toFixed(2)}/1</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Stake:</span>
                        <span className="font-bold">${stake.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Return:</span>
                        <span className="font-bold text-green-400">${potentialReturn.toFixed(2)}</span>
                    </div>
                </div>
                <button
                    onClick={onPlaceBet}
                    disabled={!isReady}
                    className={`w-full mt-3 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-300 text-xs ${
                        isReady
                            ? "bg-green-600 hover:bg-green-500"
                            : "cursor-not-allowed bet-disabled-button"
                    }`}
                >
                    {isReady ? "Place Bet" : "Select 3 Games"}
                </button>
            </div>
        </div>
    )
} 