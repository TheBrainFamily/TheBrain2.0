/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import LectureVideo from './LectureVideo'

describe('LectureVideo component', () => {
  it('should mark a lesson as watched', () => {
    const fakeDispatch = jest.fn()
    const fakeLessonWatchedMutation = jest.fn()

    const lectureVideo = mount(
      <LectureVideo
        lesson={{youtubeId: 'fakeId'}}
        dispatch={fakeDispatch}
        lessonWatchedMutation={fakeLessonWatchedMutation}
      />
    )

    lectureVideo.find('YouTube').props().onEnd()

    expect(fakeLessonWatchedMutation).toHaveBeenCalled()
    expect(fakeDispatch).toHaveBeenCalled()
  })
})
