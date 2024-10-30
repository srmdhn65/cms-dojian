import React from 'react';
import CustomIconButton from '../Button/CustomIconButton';
import { IoClose } from 'react-icons/io5';

interface ModalCustomProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const ModalCustom: React.FC<ModalCustomProps> = ({
  id,
  title,
  children,
  isOpen,
  onClose,
}) => {
  return (
    <div
      id={id}
      tabIndex={-1}
      aria-hidden={!isOpen}
      className={`${
        isOpen ? 'fixed inset-0 flex items-center justify-center' : 'hidden'
      } bg-black bg-opacity-50 z-50`}
    >
      <div className="relative p-4 w-full max-w-md bg-white dark:bg-boxdark rounded-lg shadow-lg">
        <div className="flex flex-col items-center p-4 md:p-5 border-b border-gray-300">
          <div className="w-full flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 text-center flex-grow">
              {title}
            </h3>
            <CustomIconButton
              onClick={onClose}
              icon={<IoClose />}
              color="red-500"
              bg="red-800"
            />
          </div>
          <div className="w-full flex flex-col items-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCustom;
