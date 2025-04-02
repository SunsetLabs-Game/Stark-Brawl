import React from 'react';

interface PreloadingScreenProps {
    loadingText?: string;
    onLoaded: () => void;
}

const PreloadingScreen: React.FC<PreloadingScreenProps> = ({ loadingText, onLoaded }) => {
    React.useEffect(() => {
        // Simulate loading process
        const timer = setTimeout(() => {
            onLoaded();
        }, 3000); // Simulate a 3-second loading time

        return () => clearTimeout(timer);
    }, [onLoaded]);

    return (
        <div className="preloading-screen">
            <img src="/path/to/logo.png" alt="Game Logo" />
            <div className="loading-indicator">
                {loadingText || 'Loading...'}
            </div>
        </div>
    );
};

export default PreloadingScreen;
