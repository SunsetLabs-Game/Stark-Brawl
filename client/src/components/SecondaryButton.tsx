import React from 'react';

interface SecondaryButtonProps {
    label: string;
    onClick: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, onClick }) => {
    return (
        <button onClick={onClick} className="secondary-button">
            {label}
        </button>
    );
};

export default SecondaryButton;
