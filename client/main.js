import { Template } from 'meteor/templating';  // eslint-disable-line
import { ReactiveVar } from 'meteor/reactive-var'; // eslint-disable-line

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});
