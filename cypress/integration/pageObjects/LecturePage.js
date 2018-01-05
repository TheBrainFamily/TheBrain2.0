export class LecturePage {
  constructor (driver) {
    this.driver = driver
  }

  get lectureVideo () {
    return this.driver.getElement('#video .youTube-player')
  }

  assertIsVisible () {
    return this.lectureVideo.assertIsVisible()
  }
}
