import React from 'react';

interface LandingPageProps {
  theme: 'dark' | 'light';
}

const LandingPage = ({ theme }: LandingPageProps) => {
  const isLightTheme = theme === 'light';
  const textColor = isLightTheme ? 'text-black' : 'text-white';
  const bgColor = isLightTheme ? 'bg-white/30' : 'bg-transparent';

  return (
    <div className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center font-sans p-4 sm:p-8 ${textColor} ${bgColor}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-7xl font-bold mb-8">Hi, i am Yash</h1>
        <div className="text-lg sm:text-xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About</h2>
          <p className="mb-2">tldr; learnt by hacking around on the internet.</p>
          <p className="mb-2">i like technology and deep science. they make a dent in the universe.</p>
          <p className="mb-8">i deeply study art, history, football and great books.</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Projects</h2>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 