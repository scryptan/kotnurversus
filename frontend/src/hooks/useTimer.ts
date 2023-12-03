import { useInterval } from "@chakra-ui/react";
import { isEqual } from "date-fns";
import { useEffect, useState } from "react";

const DEFAULT_DELAY = 1000;

type UseTimerParams = {
  autoStart?: boolean;
  autoStop?: boolean;
  expiryTimestamp: Date;
};

const useTimer = ({
  autoStart = true,
  autoStop = true,
  expiryTimestamp: expiry,
}: UseTimerParams) => {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry);
  const [seconds, setSeconds] = useState(() =>
    getSecondsFromExpiry(expiryTimestamp)
  );
  const [isRunning, setIsRunning] = useState(autoStart);
  const [delay, setDelay] = useState<number | null>(() =>
    getDelayFromExpiryTimestamp(expiryTimestamp)
  );

  useEffect(() => {
    if (isEqual(expiryTimestamp, expiry)) return;
    setExpiryTimestamp(expiry);
  }, [expiry]);

  const handleExpire = () => {
    setIsRunning(false);
    setDelay(null);
  };

  const pause = () => setIsRunning(false);

  const restart = (newExpiryTimestamp: Date, newAutoStart = true) => {
    setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
    setIsRunning(newAutoStart);
    setExpiryTimestamp(newExpiryTimestamp);
    setSeconds(getSecondsFromExpiry(newExpiryTimestamp));
  };

  const resume = () => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + seconds * 1000);
    restart(time);
  };

  useInterval(
    () => {
      if (delay !== DEFAULT_DELAY) {
        setDelay(DEFAULT_DELAY);
      }
      const secondsValue = getSecondsFromExpiry(expiryTimestamp);
      setSeconds(secondsValue);
      if (autoStop && secondsValue <= 0) {
        handleExpire();
      }
    },
    isRunning ? delay : null
  );

  return {
    totalSeconds: Math.ceil(seconds),
    pause,
    resume,
    restart,
    isRunning,
  };
};

const getSecondsFromExpiry = (expiry: Date) => {
  const now = new Date();
  const milliSecondsDistance = expiry.getTime() - now.getTime();
  return milliSecondsDistance / 1000;
};

const getDelayFromExpiryTimestamp = (expiryTimestamp: Date) => {
  const seconds = getSecondsFromExpiry(expiryTimestamp);
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY;
};

export default useTimer;
