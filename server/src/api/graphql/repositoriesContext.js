import { usersRepository } from '../repositories/UsersRepository'
import { coursesRepository } from '../repositories/CoursesRepository'
import { userDetailsRepository } from '../repositories/UserDetailsRepository'
import { flashcardRepository } from '../repositories/FlashcardsRepository'
import { itemsRepository } from '../repositories/ItemsRepository'
import { lessonsRepository } from '../repositories/LessonsRepository'

export default {
  Users: usersRepository,
  Courses: coursesRepository,
  UserDetails: userDetailsRepository,
  Flashcards: flashcardRepository,
  Items: itemsRepository,
  Lessons: lessonsRepository
}
