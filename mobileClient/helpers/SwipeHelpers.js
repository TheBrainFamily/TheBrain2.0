// @flow
import _ from 'lodash'

export const DIRECTIONS = {
    'left': 'left',
    'top': 'top',
    'right': 'right',
    'bottom': 'bottom'
}

export type Direction = $Keys<typeof DIRECTIONS>

const directionKeys = {
  '1': 'left',
  '2': 'top',
  '3': 'right',
  '4': 'bottom'
}

const directionEvaluationValues = _.invert(directionKeys);

export function calculateSwipeDirection (x: number, y: number): Direction {
  const angleDeg = Math.atan2(y - 0, x - 0) * 180 / Math.PI;
  const directionValue = (Math.round(angleDeg / 90) + 2) % 4 + 1;
  return directionKeys[directionValue];
}

export function calculateDragLength (x: number, y: number) {
  return Math.sqrt((Math.pow(y, 2) + Math.pow(x, 2)));
}

export function directionEvaluationValue (direction: Direction): number {
  return directionEvaluationValues[direction];
}
