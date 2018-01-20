export class CalendarPage {
  constructor (driver) {
    this.driver = driver
  }

  get calendarContainer () {
    return this.driver.getElement('.calendar-container')
  }

  get repetitionNotifications () {
    return this.driver.getElement('.review-text')
  }

  assertIsVisible () {
    return this.calendarContainer.assertIsVisible()
  }

  async assertRepetitionAreVisible (repetitionCount) {
    return this.repetitionNotifications.assertContentMatches(`${repetitionCount} r.`)
  }
}
