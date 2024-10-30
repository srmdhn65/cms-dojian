import React from 'react';

interface BoxedTextProps {
  text: string;
}

const BoxedText: React.FC<BoxedTextProps> = ({ text }) => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      {text.split('').map((char, index) => (
        <div
          key={index}
          className="w-10 h-10 m-1 flex justify-center items-center bg-black text-white text-xl font-bold"
        >
          {char !== ' ' ? char : <span>&nbsp;</span>}
        </div>
      ))}
    </div>
  );
};

export default BoxedText;
