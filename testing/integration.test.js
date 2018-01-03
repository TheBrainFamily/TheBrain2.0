import React from 'react'
import Contact from '../client/src/components/Contact.js'
import { history } from '../client/src/store'
import {startAppEnzyme} from './testHelpers/startAppEnzyme'
import { mockNetworkInterfaceWithSchema, makeExecutableSchema, addMockFunctionsToSchema } from 'apollo-test-utils-with-context';
import { typeDefs } from '../server/src/api/schema'
import resolvers from '../server/src/api/resolvers'
import { CoursesRepository } from '../server/src/api/repositories/CoursesRepository'


let coursesRepository = new CoursesRepository()
coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'testCourseName'})
coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'testCourseName2'})
const context = {Courses: coursesRepository, user: userBefore, req: {logIn: (user) => {
  userBefore = user
  console.log("MY OWN LOGIN KURWAAAAA")
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

const schema = makeExecutableSchema({typeDefs, resolvers});
// addMockFunctionsToSchema({schema,  preserveResolvers: true});
let userBefore
const mockedNetworkInterface = mockNetworkInterfaceWithSchema({schema, context });

test('it renders with the list of courses',async () => {
    // const existingCourses = await context.Courses.getCourses()
    // console.log("context ", existingCourses);
    const driver = await startAppEnzyme("/", mockedNetworkInterface)
    const mainPage =  new MainPage(driver)

  await mainPage.skipTutorial()

  const html = await driver.wrapper.render().html()

  console.log("html", html);
    console.log("html", driver.html)
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