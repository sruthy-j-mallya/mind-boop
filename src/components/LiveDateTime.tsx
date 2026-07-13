import dayjs from "@/lib/dayjs";
import { useState, useEffect, useMemo } from "react";

const LiveDateTime = () => {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const formattedDate = useMemo(
    () => now.format("DD MMMM, YYYY, hh:mm:A").toUpperCase(),
    [now],
  );

  return (
    <h2 className="text-muted-foreground text-center text-sm font-medium tracking-wide">
      {formattedDate}
    </h2>
  );
};

export default LiveDateTime;
