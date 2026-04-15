/**
 * Bowling score calculator — supports full 10-frame scoring
 * including strikes, spares, and 10th frame fill balls.
 *
 * Frame input: array of up to 10 frames, each frame is [ball1, ball2, ball3?]
 * Values: 0-10 (numeric), or use 10 for strike in ball1 (ball2 omitted)
 */
export type Frame = [number, number?, number?];

export function calculateBowlingScore(frames: Frame[]): number {
  let total = 0;
  const rolls: number[] = [];

  // Flatten frames into a rolls array
  for (const frame of frames) {
    for (const ball of frame) {
      if (ball !== undefined) rolls.push(ball);
    }
  }

  let rollIndex = 0;
  for (let frame = 0; frame < 10; frame++) {
    if (rollIndex >= rolls.length) break;

    if (rolls[rollIndex] === 10) {
      // Strike
      total += 10 + (rolls[rollIndex + 1] ?? 0) + (rolls[rollIndex + 2] ?? 0);
      rollIndex++;
    } else if ((rolls[rollIndex] ?? 0) + (rolls[rollIndex + 1] ?? 0) === 10) {
      // Spare
      total += 10 + (rolls[rollIndex + 2] ?? 0);
      rollIndex += 2;
    } else {
      // Open frame
      total += (rolls[rollIndex] ?? 0) + (rolls[rollIndex + 1] ?? 0);
      rollIndex += 2;
    }
  }

  return total;
}

/** Returns the running total after each frame for display */
export function getRunningTotals(frames: Frame[]): number[] {
  const totals: number[] = [];
  const rolls: number[] = [];

  for (const frame of frames) {
    for (const ball of frame) {
      if (ball !== undefined) rolls.push(ball);
    }
  }

  let rollIndex = 0;
  let running = 0;

  for (let frame = 0; frame < 10; frame++) {
    if (rollIndex >= rolls.length) break;
    if (rolls[rollIndex] === 10) {
      running += 10 + (rolls[rollIndex + 1] ?? 0) + (rolls[rollIndex + 2] ?? 0);
      rollIndex++;
    } else if ((rolls[rollIndex] ?? 0) + (rolls[rollIndex + 1] ?? 0) === 10) {
      running += 10 + (rolls[rollIndex + 2] ?? 0);
      rollIndex += 2;
    } else {
      running += (rolls[rollIndex] ?? 0) + (rolls[rollIndex + 1] ?? 0);
      rollIndex += 2;
    }
    totals.push(running);
  }

  return totals;
}

/** Display helper: converts numeric ball value to a display string (X, /, 0-9) */
export function ballDisplay(ball1: number | undefined, ball2: number | undefined, frameIndex: number): { b1: string; b2: string } {
  if (ball1 === undefined) return { b1: '', b2: '' };
  const b1 = ball1 === 10 ? 'X' : String(ball1);
  if (ball1 === 10) return { b1, b2: '' }; // strike uses only one cell in frames 1-9
  if (ball2 === undefined) return { b1, b2: '' };
  const b2 = ball1 + ball2 === 10 ? '/' : String(ball2);
  return { b1, b2 };
}
