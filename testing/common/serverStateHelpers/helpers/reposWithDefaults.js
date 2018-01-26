import { CoursesRepository } from '../../../../server/src/api/repositories/CoursesRepository'
import { LessonsRepository } from '../../../../server/src/api/repositories/LessonsRepository'
import { FlashcardsRepository } from '../../../../server/src/api/repositories/FlashcardsRepository'

let getCoursesRepoWithDefaults = async function () {
  const coursesRepository = new CoursesRepository()
  await coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'Biology', color: '#62c46c'})
  await coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'Chemistry', color: '#662d91'})
  return coursesRepository
}

let getFlashcardsRepoWithDefaults = async function () {
  const flashcardsRepository = new FlashcardsRepository()
  await flashcardsRepository.flashcardsCollection.insert({
    _id: 'fOneId',
    'question': 'What is the name of this course',
    'answer': 'Biology'
  })
  await flashcardsRepository.flashcardsCollection.insert({
    _id: 'fTwoId',
    'question': 'How many letters are in the word \'Biology\'?',
    'answer': '7'
  })
  await flashcardsRepository.flashcardsCollection.insert({
    _id: 'fSecondLessonOneId',
    'question': 'Why do we have two holes in our nose?',
    'answer': 'To smell things better'
  })
  await flashcardsRepository.flashcardsCollection.insert({
    _id: 'fSecondLessonTwoId',
    'question': 'Why do we have two eyes',
    'answer': 'To see things better, duh...'
  })
  return flashcardsRepository
}
let getLessonsRepoWithDefaults = async function () {
  const lessonsRepository = new LessonsRepository()
  await lessonsRepository.lessonsCollection.insert(
    {
      _id: 'lessonId',
      position: 1,
      description: 'first lesson',
      flashcardIds: ['fOneId', 'fTwoId'],
      youtubeId: 'QnQe0xW_JY4',
      courseId: 'testCourseId'
    })

  await lessonsRepository.lessonsCollection.insert({
    _id: 'lessonId2',
    position: 2,
    description: 'second lesson',
    flashcardIds: ['fSecondLessonOneId', 'fSecondLessonTwoId', 'fSecondLessonThreeId'],
    youtubeId: 'QnQe0xW_JY4',
    courseId: 'testCourseId'
  })

  return lessonsRepository
}

export { getCoursesRepoWithDefaults, getLessonsRepoWithDefaults, getFlashcardsRepoWithDefaults }
