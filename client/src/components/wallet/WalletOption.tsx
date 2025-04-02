import React from 'react';

type WalletOptionProps = {
  name: string;
  icon: string;
  onClick: () => void;
};

export const WalletOption: React.FC<WalletOptionProps> = ({ name, icon, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-2.5 rounded-lg 
                 bg-gray-800 bg-opacity-60 hover:bg-gray-700 transition-colors duration-200
                 text-white border border-gray-700"
    >
      <div className="flex items-center">
        <div className="w-7 h-7 flex items-center justify-center rounded-full overflow-hidden bg-white">
          <img src={icon} alt={name} className="w-7 h-7 object-contain" />
        </div>
        <span className="ml-2.5 font-medium text-sm">{name}</span>
      </div>
      
      {/* Icon */}
      <div className="text-gray-400">
        <img
          src="/wallets/wallet.svg"
          className="w-5 h-5"
          alt="Connect"
        />
      </div>
    </button>
  );
};
