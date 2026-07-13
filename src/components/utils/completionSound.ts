export const playCompletionSound = () => {
  const ctx = new AudioContext();

  [0, 0.1].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.value = 1200;

    const start = ctx.currentTime + offset;
    gain.gain.setValueAtTime(0.05, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.04);

    osc.start(start);
    osc.stop(start + 0.04);
  });
};
