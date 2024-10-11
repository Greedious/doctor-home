export function roundToNearest(number: number): number {
  const fractionalPart = number - Math.floor(number);
  if (fractionalPart >= 0.25 && fractionalPart <= 0.75) {
    return Math.floor(number) + 0.5;
  }
  return Math.round(number);
}
