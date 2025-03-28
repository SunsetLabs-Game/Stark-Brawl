interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: 'gems' | 'coins' | 'eth';
    image?: string;
    type: 'brawler' | 'skin' | 'gem-pack' | 'coin-pack';
    isNew?: boolean;
}

const mockItems: ShopItem[] = [
    {
        id: '1',
        name: 'Cyber Warrior',
        description: 'A legendary cyber warrior with devastating plasma and a cursed steel sword.',
        price: 349,
        currency: 'gems',
        type: 'brawler',
        isNew: true
    },
    {
        id: '2',
        name: 'Golden Knight',
        description: 'A powerful knight with golden armor and devastating melee attacks.',
        price: 0.015,
        currency: 'eth',
        type: 'brawler'
    },
    {
        id: '3',
        name: 'Desert Warrior',
        description: 'Elite Desert Warrior with unique desert storm abilities.',
        price: 90,
        currency: 'gems',
        type: 'brawler'
    },
    {
        id: '4',
        name: 'Gem Pack S',
        description: 'A small pack of gems to boost your collection.',
        price: 4.99,
        currency: 'eth',
        type: 'gem-pack'
    }
];

const ShopItems = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {mockItems.map((item) => (
                <div key={item.id} className="bg-[#6A1B9A] rounded-lg p-4 relative">
                    {item.isNew && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            NEW
                        </div>
                    )}
                    <div className="h-40 bg-purple-800 rounded-lg mb-4 flex items-center justify-center">
                        {/* Placeholder for item image */}
                        <span className="text-4xl">🎮</span>
                    </div>
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                    <button className="w-full bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        Add • {item.currency === 'gems' ? '💎' : item.currency === 'coins' ? '🪙' : 'Ξ'} {item.price}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ShopItems; 