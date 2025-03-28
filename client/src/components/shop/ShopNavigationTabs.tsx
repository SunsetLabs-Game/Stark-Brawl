import { useState } from 'react';

type Category = 'featured' | 'brawlers' | 'skins' | 'gems' | 'coins' | 'bundles' | 'nfts';

const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'featured', label: 'Featured', icon: '🌟' },
    { id: 'brawlers', label: 'Brawlers', icon: '👥' },
    { id: 'skins', label: 'Skins', icon: '🎭' },
    { id: 'gems', label: 'Gems', icon: '💎' },
    { id: 'coins', label: 'Coins', icon: '🪙' },
    { id: 'bundles', label: 'Bundles', icon: '📦' },
    { id: 'nfts', label: 'NFTs', icon: '🎮' },
];

const ShopNavigationTabs = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('featured');

    return (
        <div className="w-full px-4">
            <nav className="flex space-x-1 overflow-x-auto" aria-label="Shop categories">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`
                            flex items-center px-4 py-2 rounded-lg font-medium text-sm
                            transition-all duration-200 whitespace-nowrap
                            ${activeCategory === category.id
                                ? 'bg-[#FF5722] text-white'
                                : 'text-gray-300 hover:text-white hover:bg-purple-700'
                            }
                        `}
                    >
                        <span className="mr-2">{category.icon}</span>
                        {category.label}
                    </button>
                ))}
            </nav>
            <div className="mt-4">
                {/* Placeholder content for each category */}
                <div className="text-white">
                    {activeCategory === 'featured' && <div>Featured items coming soon...</div>}
                    {activeCategory === 'brawlers' && <div>Brawlers collection coming soon...</div>}
                    {activeCategory === 'skins' && <div>Character skins coming soon...</div>}
                    {activeCategory === 'gems' && <div>Gem packages coming soon...</div>}
                    {activeCategory === 'coins' && <div>Coin packages coming soon...</div>}
                    {activeCategory === 'bundles' && <div>Special bundles coming soon...</div>}
                    {activeCategory === 'nfts' && <div>NFT collection coming soon...</div>}
                </div>
            </div>
        </div>
    );
};

export default ShopNavigationTabs; 