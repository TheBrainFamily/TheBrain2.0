import Separator from '../components/Separator'

require('./helpers/setup')
const React = require('react')

// jest.mock('react-native', () => require('react-native-mock-render'), {virtual: true})
// const renderer = require('react-native-mock-render/mock');
const Enzyme = require('enzyme');

it('renders without crashing', () => {
  const Seperator = require('../components/Separator.js')
  const wrapper = Enzyme.mount(<Separator/>)

  expect(wrapper.html()).toMatchSnapshot()
  // const rendered = renderer.create(<App />).toJSON();
  // expect(rendered).toBeTruthy();
});
