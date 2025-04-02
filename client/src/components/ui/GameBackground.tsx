import React from 'react';

export const GameBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            {/* The game background using the provided image */}
            <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: 'url("/homeBackground.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            
            {/* Overlay to give it a darker tone and improve readability */}
            <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
    );
};
