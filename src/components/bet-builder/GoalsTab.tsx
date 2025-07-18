import React, { useRef, useEffect } from 'react';

interface GoalsTabProps {
    selectedGoals: number;
    onGoalsChange: (goals: number) => void;
    goalsOdds: string[];
}

const GOALS_RANGE = Array.from({ length: 25 }, (_, i) => i + 1);

export const GoalsTab = ({ selectedGoals, onGoalsChange, goalsOdds }: GoalsTabProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    // Effect to scroll the selected item into view, especially on initial load
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const selectedElement = slider.querySelector<HTMLDivElement>(`[data-goal="${selectedGoals}"]`);
            if (selectedElement) {
                const sliderRect = slider.getBoundingClientRect();
                const elementRect = selectedElement.getBoundingClientRect();
                const scrollLeft = selectedElement.offsetLeft - sliderRect.left - (sliderRect.width / 2) + (elementRect.width / 2);
                slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [selectedGoals]);

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
                How many goals across all games
            </h3>
            <div ref={sliderRef} className="flex overflow-x-auto space-x-2 sm:space-x-4 p-4 items-center snap-x snap-mandatory goals-slider cursor-grab">
                {GOALS_RANGE.map((goal, index) => (
                    <div
                        key={goal}
                        data-goal={goal}
                        onClick={() => onGoalsChange(goal)}
                        className={`snap-center shrink-0 flex flex-col items-center justify-center rounded-lg transition-all duration-300
                            ${selectedGoals === goal
                                ? 'w-24 h-24 bg-yellow-500 text-black shadow-lg scale-110'
                                : 'w-16 h-16 bg-blue-800 text-white opacity-70 hover:opacity-100'
                            }
                        `}
                    >
                        <span className={`font-bold ${selectedGoals === goal ? 'text-4xl' : 'text-xl'}`}>{goal}+</span>
                        {selectedGoals === goal && (
                            <span className="text-sm font-semibold">{goalsOdds[index]}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}; 