export class CourseSelectorPage {
  constructor (driver) {
    this.driver = driver
  }

  get courseSelectorButton () {
    return this.driver.getElement('.course-selector .course-icon')
  }

  assertIsVisible () {
    return this.courseSelectorButton.assertIsVisible()
  }

  selectFirstCourse () {
    return this.courseSelectorButton.click()
  }
}
