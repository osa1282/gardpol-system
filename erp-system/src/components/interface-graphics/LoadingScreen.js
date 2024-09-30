import React, { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';

const LoadingIcon = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          onComplete();
          return 100;
        }
        return prevProgress + 2;
      });
    }, 30); // 30ms * 50 steps = 1.5 seconds

    const dotsInterval = setInterval(() => {
      setDots((prevDots) => (prevDots.length >= 3 ? '' : prevDots + '.'));
    }, 500); // Change dots every 500ms

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative w-32 h-32">
        <Circle
          size={128}
          className="text-gray-200"
        />
        <Circle
          size={128}
          className="text-blue-500 absolute top-0 left-0"
          strokeWidth={4}
          strokeDasharray={400}
          strokeDashoffset={400 - (progress / 100) * 400}
        />
      </div>
      <div className="mt-4 text-xl font-semibold text-blue-500">
        Loading{dots}
      </div>
    </div>
  );
};

export default LoadingIcon;