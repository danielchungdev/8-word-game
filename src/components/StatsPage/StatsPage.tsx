import { FC, useState, useEffect } from "react"
import { Footer } from "@/components/Footer"

interface StatsPageProps {
    todayTries: number,
    totalTries: number,
    totalCompleted: number,
}

export const StatsPage: FC<StatsPageProps> = ({ todayTries, totalTries, totalCompleted }) => {

    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setUTCHours(24, 0, 0, 0); // Set to 12:00 AM UTC

            let timeRemaining = midnight.getTime() - now.getTime();

            const hoursLeft = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
            const minutesLeft = Math.floor((timeRemaining / 1000 / 60) % 60);
            const secondsLeft = Math.floor((timeRemaining / 1000) % 60);

            return { hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft };
        };

        const updateCountdown = () => {
            setTimeLeft(calculateTimeLeft());

            // Update every second
            setTimeout(updateCountdown, 1000);
        };

        updateCountdown();
    }, []);

    const calculateAverage = () => {
        return totalTries / totalCompleted
    }

    return (
        <>
            <p className="text-xl font-bold">Congratulations!</p>
            <div className="text-sm ">
                <p className="mt-4">You've completed today's challenge, you made a total of <b>{todayTries}</b> wrong guesses.</p>
                <p className="mt-4">You've completed a total of <b>{totalCompleted}</b> word associations with an average of <b>{calculateAverage() || 0}</b> wrong guesses per attempt.</p>
            </div>
            <hr className="h-px my-4 w-48 mx-auto bg-gray-200 border-0" />
            <p className="text-sm">New Challenge in: {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds</p>
            <Footer />
        </>
    )
}