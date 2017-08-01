import _ from 'lodash';
import {
  Animated,
} from 'react-native';

export default class Animator {
  constructor(animations) {
    this.animations = animations;
    this.firstPhase = true;
    _.forEach(this.animations, (animatedStyle) => {
      animatedStyle.animatedValue = new Animated.Value(animatedStyle.initial);
    });
  }

  updateFinalDimension(attrName, value) {
    if (this.animations && this.animations[attrName]) {
      this.animations[attrName].final = value
    }
  }

  resetAnimations() {
    this.firstPhase = true
    _.forEach(this.animations, (animatedStyle) => {
      animatedStyle.animatedValue.setValue(animatedStyle.initial)
    });
  }

  getStyle() {
    const style = {}
    _.forEach(this.animations, (animatedStyle, attrName) => {
      style[attrName] = animatedStyle.animatedValue
    });
    return style
  }

  startAnimations(twoPhase = true) {
    const animationsContainer = []

    _.forEach(this.animations, (animatedStyle) => {
      const initialValue = this.firstPhase ? animatedStyle.initial : animatedStyle.final
      const finalValue = this.firstPhase ? animatedStyle.final : animatedStyle.initial

      animatedStyle.animatedValue.setValue(initialValue)
      const animation = Animated.spring(
        animatedStyle.animatedValue,
        {
          toValue: finalValue,
          friction: animatedStyle.friction,
        }
      )
      animationsContainer.push(animation)
    })

    Animated.parallel(animationsContainer).start()

    if (twoPhase) this.firstPhase = !this.firstPhase
  }
}
