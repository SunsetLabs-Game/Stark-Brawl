import { useState } from 'react';
import ShopTabs from './shop-tabs';
import BannerCarousel from './BannerCarousel';
import { ShoppingCartIcon } from 'lucide-react';
import TopBar from './TopBar';

const ShopLayout = () => {
    const [activeTab, setActiveTab] = useState("featured");

    // Mock data - In a real app, this would come from your state management or API
    const userData = {
        avatar: "/nft4.png",
        username: "u/Warmix7",
        level: 42,
        trophies: 15644,
        address: "0x1214...5678",
        gems: 5546,
        tickets: 8,
        crowns: 489,
        eth: 0.05
    };

    return (
        <div className="min-h-screen bg-[#4A148C] overflow-x-hidden">
            {/* Top Bar */}
            <TopBar 
                {...userData}
            />

            {/* Header */}
            <header className="bg-[#4A148C] p-2 flex justify-between items-center">
                <div className="flex justify-center items-center space-x-2 w-full">
                    <ShoppingCartIcon className="text-white font-bold text-2xl" />
                    <span className="text-white font-bold text-2xl">SHOP</span>
                </div>
            </header>

            {/* Banner Carousel */}
            <div className="mx-auto mb-4">
                <BannerCarousel />
            </div>

            {/* Navigation */}
            <ShopTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
{/*             <main className="container mx-auto px-4">
                {children}
            </main> */}
        </div>
    );
};

export default ShopLayout; 