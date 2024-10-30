import {FC}  from 'react';

// Define the types for Card props
interface CardProps {
    color: string;
    text: string;
    onDelete: () => void;
    isSelected: boolean;
    onSelect: (value: string) => void;
}

// Card Component
const Card: FC<CardProps> = ({ color, text, onDelete, isSelected, onSelect }) => {
    return (
        <div
            className={`relative flex items-center justify-center w-40 h-48 rounded-lg ${color} text-center text-white cursor-pointer`}
        >
            <input
                className="bg-transparent text-center w-full focus:outline-none text-lg font-medium"
                placeholder="Type answer option here"
                defaultValue={text}
                onChange={(e) =>{
                    console.log(e.target.value)
                    onSelect(e.target.value)
                }}
            />

            {/* Delete Icon */}
            <button
                className="absolute top-2 left-2 bg-gray-200 text-gray-700 p-1 rounded-full"
                onClick={onDelete}
                type='button'
            >
                🗑️
            </button>

            {/* Correct Answer Selector */}
            <button
                className={`absolute top-2 right-2 border-2 rounded-full w-6 h-6 ${isSelected ? 'border-white' : 'border-gray-300'}`}
                onClick={() => onSelect(text)}
                type='button'
            >
                {isSelected && <div className="w-full h-full bg-white rounded-full" />}
            </button>
        </div>
    );
};

export default Card;