import { useCallback, useEffect, useRef, useState } from "react";

const useForceUpdate = () => {
  const isUnmount = useRef(false);
  const [key, setCount] = useState(0);

  useEffect(() => {
    isUnmount.current = false;
    return () => {
      isUnmount.current = true;
    };
  }, []);

  const forceUpdate = useCallback(() => {
    if (isUnmount.current) return;
    setCount((count) => count + 1);
  }, []);

  return { key, forceUpdate };
};

export default useForceUpdate;
