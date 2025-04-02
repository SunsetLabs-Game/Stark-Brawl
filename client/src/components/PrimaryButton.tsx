import React from 'react';

interface PrimaryButtonProps {
    label: string;
    onClick: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onClick }) => {
    return (
        <button onClick={onClick} className="primary-button">
            {label}
        </button>
    );
};

export default PrimaryButton;
