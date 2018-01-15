export class LecturePage {
  constructor (driver) {
    this.driver = driver
  }

  get lectureVideo () {
    return this.driver.getElement('#video .youTube-player')
  }

  get skipLectureButton () {
    return this.driver.getElement("#video .skipLecture")
  }

  assertIsVisible () {
    return this.lectureVideo.assertIsVisible()
  }

  async skipLecture() {
    await this.skipLectureButton.click()
  }

}
