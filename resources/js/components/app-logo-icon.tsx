import React from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props} 
            src="/images/logo.png" 
            alt="App Logo"
        />
    );
}
