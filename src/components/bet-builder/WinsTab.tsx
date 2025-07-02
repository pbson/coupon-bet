import React, { useMemo } from 'react';

const ROW_LABELS = ["1+", "2+", "3+"];
const COL_LABELS = ["Home", "Draw", "Away"];

interface WinsTabProps {
    selections: { [key: string]: { odd: string } };
    onSelectionChange: (selectionKey: string) => void;
    odds: string[][];
}

export const WinsTab = ({ selections, onSelectionChange, odds }: WinsTabProps) => {
    // Memoize the calculation of disabled states to avoid re-calculating on every render
    const disabledMap = useMemo(() => {
        const newDisabledMap: { [key: string]: boolean } = {};
        
        // Get currently selected requirements for each column
        const selectedCounts = { home: 0, draw: 0, away: 0 };
        const maxSelectedRows: { [key: number]: number } = { 0: -1, 1: -1, 2: -1 };
        
        Object.keys(selections).forEach(key => {
            if (key.startsWith('wins-')) {
                const [, rStr, cStr] = key.split('-');
                const r = parseInt(rStr, 10);
                const c = parseInt(cStr, 10);
                const required = r + 1; // row 0 = 1+, row 1 = 2+, row 2 = 3+
                
                // Track max selected row for each column
                maxSelectedRows[c] = Math.max(maxSelectedRows[c], r);
                
                if (c === 0) selectedCounts.home = Math.max(selectedCounts.home, required);
                else if (c === 1) selectedCounts.draw = Math.max(selectedCounts.draw, required);
                else selectedCounts.away = Math.max(selectedCounts.away, required);
            }
        });

        // Check each cell to see if it should be disabled
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const selectionKey = `wins-${r}-${c}`;
                const required = r + 1; // Convert row index to required count
                
                // Condition 1: Total games would exceed 3
                let totalRequired = selectedCounts.home + selectedCounts.draw + selectedCounts.away;
                
                // Adjust for this potential selection
                if (c === 0) {
                    totalRequired = totalRequired - selectedCounts.home + Math.max(selectedCounts.home, required);
                } else if (c === 1) {
                    totalRequired = totalRequired - selectedCounts.draw + Math.max(selectedCounts.draw, required);
                } else {
                    totalRequired = totalRequired - selectedCounts.away + Math.max(selectedCounts.away, required);
                }
                
                if (totalRequired > 3) {
                    newDisabledMap[selectionKey] = true;
                }

                // Condition 2: A higher number in the same column is selected
                if (maxSelectedRows[c] > r) {
                    newDisabledMap[selectionKey] = true;
                }
            }
        }
        return newDisabledMap;
    }, [selections]);

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">How many wins across all games</h3>
            <table className="w-full text-center text-white border-separate border-spacing-2">
                <thead>
                    <tr>
                        <th className="p-2"></th>
                        {COL_LABELS.map(label => (
                            <th key={label} className="p-2 font-bold">{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ROW_LABELS.map((rowLabel, rowIndex) => (
                        <tr key={rowLabel}>
                            <td className="p-2 font-bold">{rowLabel}</td>
                            {COL_LABELS.map((_, colIndex) => {
                                const odd = odds[rowIndex][colIndex];
                                const selectionKey = `wins-${rowIndex}-${colIndex}`;
                                const isSelected = !!selections[selectionKey];
                                const isDisabled = disabledMap[selectionKey];

                                return (
                                    <td key={colIndex}>
                                        <button
                                            onClick={() => onSelectionChange(selectionKey)}
                                            disabled={isDisabled}
                                            className={`w-full h-16 rounded-lg font-bold text-lg transition-all
                                                ${isSelected ? 'bg-yellow-500 text-black shadow-lg scale-105' : 'bg-blue-800 hover:bg-blue-700'}
                                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {odd}
                                        </button>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; 