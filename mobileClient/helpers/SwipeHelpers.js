// @flow

const DIRECTION_MAP = {
  '1': 'left',
  '2': 'top',
  '3': 'right',
  '4': 'bottom'
}

export const DIRECTION_VAL = {
  'left': 1,
  'top': 2,
  'right': 3,
  'bottom': 4
}

export const DIRECTION_PROTO = {
  'left': 'left',
  'top': 'top',
  'right': 'right',
  'bottom': 'bottom'
}

export type DIRECTION = $Keys<typeof DIRECTION_PROTO>

export function calculateSwipeDirection(x: number, y: number) {
  const angleDeg = Math.atan2(y - 0, x - 0) * 180 / Math.PI;
  const directionValue = (Math.round(angleDeg / 90) + 2) % 4 + 1;
  return DIRECTION_MAP[directionValue];
}

export function calculateDragLength (x: number, y: number) {
  return Math.sqrt((Math.pow(y, 2) + Math.pow(x, 2)));
}
