/* eslint-env jest */
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import List from './List'

Enzyme.configure({adapter: new Adapter()})

const onClick = jest.fn()
export const ListWithThreeElements = <List items={['abc', 'bar', 'biz']} onClick={onClick} />

describe('List element with 3 items', () => {
  describe('another level', () => {
    it('should contain 3 items', () => {
      const wrapper = shallow(ListWithThreeElements)
      expect(wrapper.find('li').length).toEqual(3)
    })
    it('should contain bar item', () => {
      const wrapper = shallow(ListWithThreeElements)
      expect(wrapper.exists('li.bar')).toBeTruthy()
    })
    it('when clicked on, should call the passed onClick function', () => {
      const wrapper = shallow(ListWithThreeElements)
      wrapper.find('ul').simulate('click')
      expect(onClick).toHaveBeenCalled()
    })
  })
})

describe('List element with 3 items another', () => {
  describe('another level once again', () => {
    it('should contain 3 items 2', () => {
      const wrapper = shallow(ListWithThreeElements)
      expect(wrapper.find('li').length).toEqual(3)
    })
    it('should contain bar item 2', () => {
      const wrapper = shallow(ListWithThreeElements)
      expect(wrapper.exists('li.bar')).toBeTruthy()
    })
    it('when clicked on, should call the passed onClick function 2', () => {
      const wrapper = shallow(ListWithThreeElements)
      wrapper.find('ul').simulate('click')
      expect(onClick).toHaveBeenCalled()
    })
  })
})
