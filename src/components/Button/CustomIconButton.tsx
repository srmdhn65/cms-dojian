import React from 'react';

interface CustomIconButtonProps {
  onClick?: () => void;
  type?: 'button' | 'reset' | 'submit'; // Specify the type prop
  color?: string; // Custom color for the button
  bg?: string; // Custom background color for the button
  icon?: JSX.Element; // JSX element for the icon
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  onClick,
  type = 'button',
  color = 'blue-700',
  bg = 'blue-700',
  icon,
}) => {
  return (
    
    <button
      type={type}
      onClick={onClick}
      className={`hover:text-primary {className} ${bg} ${color}`}
    >
      {icon}
      <span className="sr-only">Icon description</span>
    </button>
  );
};

export default CustomIconButton;
