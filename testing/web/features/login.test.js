// /* eslint-env jest */
//
// import { ItemsRepository } from '../../../server/src/api/repositories/ItemsRepository'
// import { UsersRepository } from '../../../server/src/api/repositories/UsersRepository'
// import { UserDetailsRepository } from '../../../server/src/api/repositories/UserDetailsRepository'
// import {
//   getCoursesRepoWithDefaults, getFlashcardsRepoWithDefaults,
//   getLessonsRepoWithDefaults
// } from '../../common/serverStateHelpers/helpers/reposWithDefaults'
// import startApp from '../../testHelpers/startApp'
// import { HamburgerMenuPage } from './pageObjects/HamburgerMenuPage'
// import { LoginPage } from './pageObjects/LoginPage'
//
// const returnContext = async () => {
//   const loggedInUser = {
//     _id: '5a5cb174af92590d2571f849',
//     username: 'lgandecki',
//     password: '$2a$10$KRhNThKG12HxkQFFfZWaGefDRSBiXhnnT7E2eQS277GipNu2TrpYW', // lgandecki
//     activated: true,
//     createdAt: 1516024180
//   }
//   const usersRepository = new UsersRepository()
//   await usersRepository.userCollection.insert(loggedInUser)
//   const loggedInUserDetails = {
//     '_id': '5a5cb1ba8cce748fdd7fbc33',
//     'userId': '5a5cb174af92590d2571f849',
//     'hasDisabledTutorial': true,
//     'selectedCourse': 'testCourseId',
//     'progress': [{'lesson': 1}, {'courseId': 'testCourseId', 'lesson': 1}],
//     'collectedAchievements': [],
//     'achievementStats': {'watchedMovies': 0, 'answeredQuestions': 0},
//     'experience': {'value': 0, 'level': 0}
//   }
//   const userDetailsRepository = new UserDetailsRepository()
//   await userDetailsRepository.userDetailsCollection.insert(loggedInUserDetails)
//   const itemsRepository = new ItemsRepository()
//   itemsRepository.itemsCollection.insert([{
//     '_id': '5a630a5d6e0d7d7f71570e6b',
//     'flashcardId': 'fOneId',
//     'userId': '5a5cb174af92590d2571f849',
//     'courseId': 'testCourseId',
//     'actualTimesRepeated': 0,
//     'easinessFactor': 2.5,
//     'extraRepeatToday': false,
//     'lastRepetition': 0,
//     'nextRepetition': 0,
//     'previousDaysChange': 0,
//     'timesRepeated': 0,
//     'isCasual': false
//   }, {
//     '_id': '5a630a5d657b47ba7fa3a29d',
//     'flashcardId': 'fTwoId',
//     'userId': '5a5cb174af92590d2571f849',
//     'courseId': 'testCourseId',
//     'actualTimesRepeated': 0,
//     'easinessFactor': 2.5,
//     'extraRepeatToday': false,
//     'lastRepetition': 0,
//     'nextRepetition': 0,
//     'previousDaysChange': 0,
//     'timesRepeated': 0,
//     'isCasual': false
//   }])
//
//   const context = {
//     Courses: await getCoursesRepoWithDefaults(),
//     Lessons: await getLessonsRepoWithDefaults(),
//     Flashcards: await getFlashcardsRepoWithDefaults(),
//     Users: usersRepository,
//     UserDetails: userDetailsRepository,
//     Items: itemsRepository,
//     req: {
//       logIn: (user) => {
//         context.user = user
//       }
//     }
//   }
// }
//
// describe('Login', async () => {
//   test('login and and seeing due flashcards', async () => {
//     const context = await returnContext()
//     const driver = await startApp('/', context)
//     const hamburgerMenu = new HamburgerMenuPage(driver)
//     await hamburgerMenu.toggleMenuButton()
//     await hamburgerMenu.openLogin()
//     await hamburgerMenu.openLogin()
//     await driver.saveHtml()
//
//     const loginPage = new LoginPage(driver)
//     await loginPage.fillUsernameFieldWith('lgandecki')
//     await loginPage.fillPasswordFieldWith('lgandecki')
//     await loginPage.login()
//
//   })
// })

test('', () => {})
