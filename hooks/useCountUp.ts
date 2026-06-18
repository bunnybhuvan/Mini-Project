import { useState, useEffect } from 'react';

/**
 * A custom React hook to animate a number from 0 to a target value.
 * @param end The final number to count up to.
 * @param duration The duration of the animation in milliseconds.
 * @returns The current value of the count during the animation.
 */
export const useCountUp = (end: number, duration: number = 1500): number => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const currentCount = Math.floor(end * percentage);
            
            setCount(currentCount);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [end, duration]);

    return count;
};
