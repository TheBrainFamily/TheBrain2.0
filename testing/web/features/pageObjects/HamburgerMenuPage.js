export class HamburgerMenuPage {
  constructor (driver) {
    this.driver = driver
  }

  get menuButton () {
    return this.driver.getElement('.menu-icon')
  }

  get calendarButton () {
    return this.driver.getElement('#menu\\.btn\\.calendar')
  }

  async toggleMenuButton () {
    return this.menuButton.click()
  }

  async openCalendar () {
    return this.calendarButton.click()
  }
}
