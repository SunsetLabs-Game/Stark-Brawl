import React from 'react';
import { WalletModal } from '../components/wallet/WalletModal';
import { GameBackground } from '../components/ui/GameBackground';

const HomePage: React.FC = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <GameBackground />

            {/* Wallet connection modal - always visible */}
            <WalletModal 
                isOpen={true}
                onClose={() => {}}
            />
        </div>
    );
};

export default HomePage;
