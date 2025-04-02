import React from 'react';
import { WalletOption } from './WalletOption';
import { FeatureCard } from './FeatureCard';

type WalletModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Supported wallets data
    const wallets = [
        { id: 'argent', name: 'Argent X', icon: '/wallets/argent.svg' },
        { id: 'braavos', name: 'Braavos', icon: '/wallets/braavos.png' },
        { id: 'okx', name: 'OKX Wallet', icon: '/wallets/okx.svg' },
        { id: 'metamask', name: 'MetaMask Starknet', icon: '/wallets/metamask.svg' },
    ];

    // Onchain features 
    const features = [
        { id: 'nft', name: 'Brawlers NFT', icon: '/features/nft.png' },
        { id: 'token', name: 'Token BRAWLS', icon: '/features/token.png' },
        { id: 'marketplace', name: 'Marketplace', icon: '/features/marketplace.png' },
        { id: 'p2e', name: 'Play-to-Earn', icon: '/features/p2e.png' },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop with darker blur effect */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-20"
                onClick={onClose}
            />
            
            {/* Modal container */}
            <div 
                className="relative bg-black bg-opacity-50 rounded-xl shadow-2xl 
                                    max-w-sm w-full overflow-hidden border border-gray-700"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '380px' }}
            >
                {/* Logo and title */}
                <div className="flex items-center p-3 border-b border-gray-800">
                    <div className="flex items-center">
                        <img 
                            src="/1.png" 
                            alt="Stark Brawl" 
                            className="w-7 h-7 mr-2"
                        />
                        <div className="text-white font-bold text-sm">STARKNET EDITION</div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="ml-auto text-gray-400 hover:text-white"
                    >
                        <span className="sr-only">Sound</span>
                        <img src="/sound.svg" />
                    </button>
                </div>
                
                {/* Modal content */}
                <div className="p-4">
                    <h2 className="text-xl font-bold text-white mb-1 text-center">Connect Your Wallet</h2>
                    <p className="text-gray-300 mb-4 text-sm text-center">
                        Connect your Starknet wallet to play and manage your onchain assets
                    </p>
                    
                    {/* Wallet list  */}
                    <div className="space-y-2 mb-6">
                        {wallets.map(wallet => (
                            <WalletOption 
                                key={wallet.id} 
                                name={wallet.name} 
                                icon={wallet.icon} 
                                onClick={() => console.log(`Connecting to ${wallet.name}...`)} 
                            />
                        ))}
                    </div>
                    
                    {/* Simplified separator */}
                    <div className="relative mb-4">
                        <div className="border-t border-gray-700"></div>
                        <div className="flex justify-center -mt-2.5">
                            <span className="bg-black px-3 text-xs text-gray-400">
                                Onchain Features
                            </span>
                        </div>
                    </div>
                    
                    {/* Feature cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {features.map(feature => (
                            <FeatureCard 
                                key={feature.id}
                                name={feature.name}
                                icon={feature.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
