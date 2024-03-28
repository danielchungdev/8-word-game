import { FC, useState, useEffect, useMemo } from "react";
import { Footer } from "@/components/Footer";
import { Stats } from "@/components/Stats";
import { useWindowSize } from '@uidotdev/usehooks';

interface CongratulationsProps {
    todayTries: number;
    totalCompleted: number;
}

interface History {
    date: string;
    tries: number;
}

export const Congratulations: FC<CongratulationsProps> = ({ todayTries, totalCompleted }) => {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const size = useWindowSize();
    const [history, setHistory] = useState<History[]>([{ date: "01/01/1999", tries: 0 }]);

    useEffect(() => {
        const stats = localStorage.getItem('word-association-stats');
        if (stats) {
            const jsonStats = JSON.parse(stats);
            const jsonHistory = jsonStats.history;
            setHistory(jsonHistory);
        }
    }, []);


    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setUTCHours(24, 0, 0, 0);

            let timeRemaining = midnight.getTime() - now.getTime();

            const hoursLeft = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
            const minutesLeft = Math.floor((timeRemaining / 1000 / 60) % 60);
            const secondsLeft = Math.floor((timeRemaining / 1000) % 60);

            return { hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft };
        };
        const updateCountdown = () => {
            setTimeLeft(calculateTimeLeft());
            setTimeout(updateCountdown, 1000);
        };
        updateCountdown();
    }, []);

    const formattedSize = useMemo(() => ({
        width: size.width || 400,
        height: size.height || 1000,
    }), [size]);

    const formatNumber = (number: number) => {
        let stringNumber = number.toString();
        return stringNumber.length > 1 ? stringNumber : `0${stringNumber}`;
    };

    const calculateStreak = (data: History[]): number => {
        let consecutiveDays = 1;

        for (let i = 0; i < data.length - 1; i++) {
            const currentDate = new Date(data[i].date);
            const nextDate = new Date(data[i + 1].date);

            const diffTime = Math.abs(nextDate.getTime() - currentDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                consecutiveDays++;
            } else {
                break;
            }
        }

        return consecutiveDays;
    };

    return (
        <>
            <p className="text-xl font-bold text-green-500 text-center">Congratulations!</p>
            <div className="text-sm ">
                <p className="mt-4">You&apos;ve completed today&apos;s challenge, you made a total of <b>{todayTries}</b> wrong guesses.</p>
                <p className="mt-2">You have <b>{calculateStreak(history)}</b> {calculateStreak(history) > 1 ? "days" : "day"} in a row and a total of <b>{totalCompleted}</b> word associations completed!</p>
                <p className="mt-2">These are your statistics by amount of tries:</p>
                <div className="mt-2">
                    {formattedSize.width && <Stats data={history} screenHeight={formattedSize.height} screenWidth={formattedSize.width} />}
                </div>
            </div>
            <hr className="h-px my-4 w-48 mx-auto bg-gray-200 border-0" />
            <p className="text-sm">Next Challenge in: {timeLeft.hours}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}</p>
            <Footer />
        </>
    );
};
