import React from 'react';

interface CustomTextButtonProps {
  title: string;
  onClick: () => void;
  icon?: JSX.Element; // JSX element for the icon
}

const CustomTextButton: React.FC<CustomTextButtonProps> = ({
  title,
  onClick,
  icon,
}) => {
  return (
    <button
      type="button"
      className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
      onClick={onClick}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

export default CustomTextButton;
