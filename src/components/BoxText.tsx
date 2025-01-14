import React from 'react';

interface BoxedTextProps {
    text: string;
}

const BoxedText: React.FC<BoxedTextProps> = ({ text }) => {
    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center">
            {text.split('').map((char, index) => (
                <div
                    key={index}
                    className="d-flex justify-content-center align-items-center bg-dark text-white m-1"
                    style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                    }}
                >
                    {char !== ' ' ? char : <span>&nbsp;</span>}
                </div>
            ))}
        </div>
    );
};

export default BoxedText;
