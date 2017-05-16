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
    this.animations[attrName].final = value;
  }

  resetAnimations() {
    this.firstPhase = true;
    _.forEach(this.animations, (animatedStyle) => {
      animatedStyle.animatedValue.setValue(animatedStyle.initial);
    });
  }

  getStyle() {
    const style = {}
    _.forEach(this.animations, (animatedStyle, attrName) => {
      style[attrName] = animatedStyle.animatedValue;
    });
    return style;
  }

  startAnimations(twoPhase = false) {
    let animationContainer = [];

    _.forEach(this.animations, (animatedStyle, attrName) => {
      let initialValue = this.firstPhase? animatedStyle.initial : animatedStyle.final;
      let finalValue = this.firstPhase? animatedStyle.final : animatedStyle.initial;

      console.log(attrName, initialValue, finalValue);
      animatedStyle.animatedValue.setValue(initialValue);
      let animation = Animated.spring(
        animatedStyle.animatedValue,
        {
          toValue: finalValue
        }
      );
      animationContainer.push(animation);
    });

    Animated.parallel(animationContainer).start();

    if(twoPhase) this.firstPhase = !this.firstPhase;
  }
}
