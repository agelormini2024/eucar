import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Funcionalidad para cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        backdropFilter: 'blur(2px)' 
      }}
      onClick={onClose} // Cerrar al hacer clic en el fondo
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 min-w-[350px] max-w-lg w-full relative mx-4"
        onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic en el contenido
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
