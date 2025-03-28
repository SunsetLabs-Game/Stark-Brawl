import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { label: 'SHOP', count: 5, color: 'bg-pink-500', image: '/shopping-cart.png' },
    { label: 'SOCIAL', count: 17, color: 'bg-blue-500', image: '/user.png' },
    { label: 'BRAWLERS', count: 20, color: 'bg-orange-500', image: '/console.png' },
    { label: 'EVENTS', count: 3, color: 'bg-green-500', image: '/newspaper.png' },
  ];

  return (
    <div className="w-18 h-20 p-4">
      {menuItems.map((item, index) => (
        <div key={index} className={`relative flex items-center justify-center p-1 rounded-[5px] ${item.color} mb-3`}>
          <div className="flex flex-col items-center">
            <img src={item.image} alt={item.label} className="w-4 h-4 filter brightness-0 invert mb-1" />
            <span className="text-white" style={{ fontSize: '7px' }}>{item.label}</span>
          </div>
          <div className="absolute -top-2 right-0 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs text-[7px]">
            {item.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
