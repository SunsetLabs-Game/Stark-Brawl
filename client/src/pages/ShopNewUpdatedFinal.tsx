// import ShopLayout from '../components/shop/ShopLayoutNew';
import PreloadingScreen from '../components/PreloadingScreenNewUpdated';
import WalletConnectionStatusModal from '../components/WalletConnectionStatusModal';
import ShopLayout2 from '../components/shop/ShopLayoutNew';
import { useState } from 'react';

const Shop = () => {
    const [loading, setLoading] = useState(true);
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletDetails, setWalletDetails] = useState({
        address: '',
        balance: 0,
        tokens: 0,
        nfts: 0,
        network: 'Starknet',
    });

    const handleLoaded = () => {
        setLoading(false);
        // Additional logic can be added here if needed
    };

    const handleConnectWallet = (details: { address: string; balance: number; tokens: number; nfts: number; network: string; }) => {
        setWalletDetails(details);
        setWalletConnected(true);
    };

    const handleDisconnectWallet = () => {
        setWalletConnected(false);
        setWalletDetails({
            address: '',
            balance: 0,
            tokens: 0,
            nfts: 0,
            network: 'Starknet',
        });
    };

    return (
        <ShopLayout2>
            {loading ? (
                <PreloadingScreen loadingText="Loading Shop..." onLoaded={handleLoaded} />
            ) : (
                <div className="text-white">
                    {/* Content will be rendered by ShopNavigationTabs */}
                    {walletConnected ? (
                        <WalletConnectionStatusModal
                            walletAddress={walletDetails.address}
                            balance={walletDetails.balance}
                            tokens={walletDetails.tokens}
                            nfts={walletDetails.nfts}
                            network={walletDetails.network}
                            onDisconnect={handleDisconnectWallet}
                            onEnterGame={() => console.log('Entering game...')}
                        />
                    ) : (
                        <button onClick={() => handleConnectWallet({ address: '0x123', balance: 1, tokens: 100, nfts: 5, network: 'Starknet' })}>
                            Connect Wallet
                        </button>
                    )}
                </div>
            )}
        </ShopLayout2>
    );
};

export default Shop;
