import React from 'react';

interface WalletInfoCardProps {
    label: string;
    value: string | number;
}

const WalletInfoCard: React.FC<WalletInfoCardProps> = ({ label, value }) => {
    return (
        <div className="wallet-info-card">
            <strong>{label}:</strong> {value}
        </div>
    );
};

export default WalletInfoCard;
