export class LectureView {
  constructor (driver) {
    this.driver = driver
  }

  get skipLectureButton () {
    return this.driver.getElement('skip_lecture_button')
  }

  async skipLecture () {
    await this.skipLectureButton.click()
  }

  assertIsVisible () {
    // TODO this should check whether the video is visible actually
    return this.skipLectureButton.assertIsVisible()
  }
}
