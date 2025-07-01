import React, { useRef, useEffect } from 'react';

interface CardsTabProps {
    selectedCards: number;
    onCardsChange: (cards: number) => void;
}

const CARDS_RANGE = Array.from({ length: 25 }, (_, i) => i + 1);

export const CardsTab = ({ selectedCards, onCardsChange }: CardsTabProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    // Effect to scroll the selected item into view, especially on initial load
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const selectedElement = slider.querySelector<HTMLDivElement>(`[data-card="${selectedCards}"]`);
            if (selectedElement) {
                const sliderRect = slider.getBoundingClientRect();
                const elementRect = selectedElement.getBoundingClientRect();
                const scrollLeft = selectedElement.offsetLeft - sliderRect.left - (sliderRect.width / 2) + (elementRect.width / 2);
                slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [selectedCards]);

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
                How many Yellow cards across games
            </h3>
            <div ref={sliderRef} className="flex overflow-x-auto space-x-2 sm:space-x-4 p-4 items-center snap-x snap-mandatory goals-slider cursor-grab">
                {CARDS_RANGE.map(card => (
                    <div
                        key={card}
                        data-card={card}
                        onClick={() => onCardsChange(card)}
                        className={`snap-center shrink-0 flex items-center justify-center rounded-lg transition-all duration-300
                            ${selectedCards === card
                                ? 'w-24 h-24 bg-yellow-500 text-black text-4xl font-bold shadow-lg scale-110'
                                : 'w-16 h-16 bg-blue-800 text-white text-xl opacity-70 hover:opacity-100'
                            }
                        `}
                    >
                        {card}
                    </div>
                ))}
            </div>
        </div>
    );
}; 