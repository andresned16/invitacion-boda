// components/ui/Decoracion.tsx
import React, { ReactNode } from 'react';

type DecoracionProps = {
  children: ReactNode;
  fondo?: string;      // clase CSS para el fondo, opcional
  claseTexto?: string; // clase CSS para los textos, opcional
};

const Decoracion: React.FC<DecoracionProps> = ({ children, fondo, claseTexto }) => {
  return (
    <div
      className={`relative w-full min-h-screen flex justify-center items-start p-8`}
      style={{
        fontFamily: "'Playfair Display', serif",
        backgroundColor: fondo ? undefined : "#F7F3EE", // fondo curuba suave por defecto
      }}
    >
      <div
        className={`${claseTexto ? claseTexto : "text-black text-center text-xl"} 
          max-w-5xl w-full`}
      >
        {children}
      </div>
    </div>
  );
};

export default Decoracion;
