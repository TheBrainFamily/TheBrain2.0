// @flow

export function calculateSwipeDirection(x: number, y: number) {
  const angleDeg = Math.atan2(y - 0, x - 0) * 180 / Math.PI;
  return (Math.round(angleDeg / 90) + 2) % 4 + 1;
}

export function calculateDragLength (x: number, y: number) {
  return Math.sqrt((Math.pow(y, 2) + Math.pow(x, 2)));
}
