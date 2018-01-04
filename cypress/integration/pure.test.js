it('it renders with the list of courses',async () => {
  // const existingCourses = await context.Courses.getCourses()
  // console.log("context ", existingCourses);
  // const driver = await startApp("/", context)
  // const mainPage =  new MainPage(driver)
  const mainPage =  new MainPage()


  // await mainPage.skipTutorial()

  // const html = await driver.wrapper.render().html()

  // console.log("html", html);
  // console.log("html", driver.html)
  // await mainPage.assertIsActive()
})


class MainPage {
  abc = () => {
    console.log("Gandecki this", this);
  }
  constructor (driver) {
    // this.root = '';
    this.driver = driver;
  }

  get skipTutorialButton() {
    return this.driver.getElement('.skip-tutorial-button')
  }

  async skipTutorial() {
    await this.skipTutorialButton.click()
  }
}