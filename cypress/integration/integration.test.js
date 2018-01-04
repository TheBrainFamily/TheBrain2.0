import React from 'react'
import { CoursesRepository } from '../../server/src/api/repositories/CoursesRepository'
import startApp from '../../testing/testHelpers/startApp'


let userBefore;
let coursesRepository = new CoursesRepository()
coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'testCourseName'})
coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'testCourseName2'})
const context = {Courses: coursesRepository, user: userBefore, req: {logIn: (user) => {
  userBefore = user
  console.log("Gandecki userBefore", userBefore);
}
}}
//
//
// var biologyFlashcard1 = db.flashcards.insert({
//   "question" : "What is the name of this course?",
//   "answer" : "Biology"
// });
// var biologyFlashcard2 = db.flashcards.insert({
//   "question" : "How many letters are in the word 'Biology'?",
//   "answer" : "7"
// });
//
// db.lessons.insertOne({
//   "courseId": biology.insertedId.valueOf(),
//   "position" : NumberInt(1),
//   "description" : "The best lesson",
//   "flashcardIds" : [
//     biologyFlashcard1.insertedId.valueOf(),
//     biologyFlashcard2.insertedId.valueOf()
//   ],
//   "youtubeId" : "QnQe0xW_JY4"
// });
//

if (global.cy) {
  window.test = it
}

test('it renders with the list of courses',async () => {
    // const existingCourses = await context.Courses.getCourses()
    // console.log("context ", existingCourses);
    const driver = await startApp("/", context)
    const mainPage =  new MainPage(driver)

  await mainPage.skipTutorial()

  // const html = await driver.wrapper.render().html()
  //
  // console.log("html", html);
  //   console.log("html", driver.html)
    // await mainPage.assertIsActive()
})


class MainPage {
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