const displayTime = (minutes: number, seconds: number) =>
  [minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");

const incrementTime = (
  minutes: number,
  seconds: number,
): { nextMinutes: number; nextSeconds: number } => {
  if (seconds === 59) {
    return { nextMinutes: minutes + 1, nextSeconds: 0 };
  }
  return { nextMinutes: minutes, nextSeconds: seconds + 1 };
};

const decrementTime = (
  minutes: number,
  seconds: number,
): { nextMinutes: number; nextSeconds: number } => {
  if (seconds === 0) {
    return { nextMinutes: minutes - 1, nextSeconds: 59 };
  }
  return { nextMinutes: minutes, nextSeconds: seconds - 1 };
};

export { displayTime, incrementTime, decrementTime };
