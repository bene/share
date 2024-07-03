import { useEffect, useState } from "hono/jsx";

export function Dots() {
  const [currentLength, setCurrentLength] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLength((currentLength + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [currentLength]);

  return ".".repeat(currentLength);
}
