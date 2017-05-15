// @flow

export const DIRECTIONS = {
  'left': 'left',
  'top': 'top',
  'right': 'right',
  'bottom': 'bottom'
}

export type Direction = $Keys<typeof DIRECTIONS>

const directionMap = {
  '1': 'left',
  '2': 'top',
  '3': 'right',
  '4': 'bottom'
}

const directionEvaluationMap = {
  'left': 2.5,
  'top': 6,
  'right': 4.5,
  'bottom': 1
}

export function getSwipeDirection (x: number, y: number): Direction {
  const angleInRadians = Math.atan2(y, x)
  const angle = angleInRadians * 180 / Math.PI // angle between -180 (exclusive) to 180 (inclusive)
  const shiftedAngle = angle + 180 // shifted angle to operate on positive values (from 0 (exclusive) to 360 (inclusive))

  const directionValue = Math.round(shiftedAngle / 90) % 4 + 1 // map angle to values 1, 2, 3, 4

  return directionMap[directionValue]
}

export function getDragLength (x: number, y: number) {
  return Math.sqrt((Math.pow(y, 2) + Math.pow(x, 2)))
}

export function getDirectionEvaluationValue (direction: Direction): number {
  return directionEvaluationMap[direction]
}
