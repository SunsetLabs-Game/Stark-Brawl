import React from 'react';
import WalletInfoCard from './WalletInfoCard';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface WalletConnectionStatusModalProps {
    walletAddress: string;
    balance: number;
    tokens: number;
    nfts: number;
    network: string;
    onDisconnect: () => void;
    onEnterGame: () => void;
}

const WalletConnectionStatusModal: React.FC<WalletConnectionStatusModalProps> = ({
    walletAddress,
    balance,
    tokens,
    nfts,
    network,
    onDisconnect,
    onEnterGame,
}) => {
    return (
        <div className="wallet-connection-modal">
            <h2>Connected Wallet</h2>
            <WalletInfoCard label="Wallet Address" value={walletAddress} />
            <WalletInfoCard label="Balance" value={`${balance} ETH`} />
            <WalletInfoCard label="Tokens" value={tokens} />
            <WalletInfoCard label="NFTs" value={nfts} />
            <WalletInfoCard label="Network" value={network} />
            <PrimaryButton label="Enter the Game" onClick={onEnterGame} />
            <SecondaryButton label="Disconnect Wallet" onClick={onDisconnect} />
        </div>
    );
};

export default WalletConnectionStatusModal;
