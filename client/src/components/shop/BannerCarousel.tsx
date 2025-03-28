import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GemIcon } from 'lucide-react';
const bannerItems = [
    {
        id: "1",
        title: "NEW BRAWLER: CYBER WARRIOR",
        description: "Exclusive legendary NFT brawler",
        price: 349,
        priceType: "gems",
        image: "/nft1.png",
        isNew: true
    },
    {
        id: "2",
        title: "MYSTIC ARCHER",
        description: "A stealthy brawler",
        price: 750,
        priceType: "gems",
        image: "/nft4.png",
        isNew: false,
        discount: "-10%"
    },
    {
        id: "3",
        title: "CYBER WARRIOR",
        description: "A fire-powered brawler",
        price: 340,
        priceType: "gems",
        image: "/nft2.png",
        isNew: false
    }
];

const BannerCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
    };

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-black/30 rounded-full p-2"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            <div className="overflow-hidden relative">
                <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {bannerItems.map((item) => (
                        <div
                            key={item.id}
                            className="w-full flex-shrink-0"
                        >
                            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-700 p-8 flex justify-between items-center rounded-xl">
                                <div className="flex-1">
                                    {item.isNew && (
                                        <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full inline-block mb-2 uppercase font-bold">
                                            NEW
                                        </div>
                                    )}
                                    <h2 className="text-white text-3xl font-bold mb-2">{item.title}</h2>
                                    <p className="text-white/80 text-lg mb-4">{item.description}</p>
                                    <div className="flex items-center gap-2">
                                        <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-1.5 transition-colors border border-white/50 rounded-[10px]">
                                            View Details
                                        </button>
                                        <div className="text-white font-bold text-[12px] flex items-center gap-1 bg-pink-800 rounded-[10px] p-2">
                                        <GemIcon className="w-4 h-4 text-pink-500" />
                                            <span>{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-8">
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="w-40 h-40 object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {bannerItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentSlide ? 'bg-white' : 'bg-white/30'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={nextSlide}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-black/30 rounded-full p-2"
                aria-label="Next slide"
            >
                <ChevronRight className="w-4 h-4 text-white" />
            </button>
        </div>
    );
};

export default BannerCarousel; 