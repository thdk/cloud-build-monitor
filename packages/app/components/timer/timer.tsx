import { useEffect, useState } from "react";

function getTimePassed(startTime: Date | null, finishTime: Date | null) {
    if (!startTime) {
        return undefined;
    }
    const durationTotal = ((finishTime || new Date()).getTime() - startTime.getTime()) / 1000;
    const minutes = Math.floor(durationTotal / 60);
    const seconds = Math.floor(durationTotal - minutes * 60);

    return {
        minutes,
        seconds,
    }
}

export function Timer({
    startTime,
    finishTime,
}: {
    startTime: Date | null,
    finishTime: Date | null,
}) {
    const [time, setTime] = useState(getTimePassed(startTime, finishTime));

    useEffect(() => {
        if (finishTime) {
            return;
        }

        const intervalId = setInterval(
            () => setTime(getTimePassed(startTime, new Date())),
            1000
        );

        return () => clearInterval(intervalId);
    }, [
        finishTime,
        startTime,
    ]);


    return time
        ? <>
            {`${time.minutes} min ${time.seconds} sec`}
        </>
        : null;
}