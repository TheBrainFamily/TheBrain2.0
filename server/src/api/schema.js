// @flow

import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'

const gql = schema => schema

export const typeDefs = gql`
    type Achievement {
        _id: String,
        name: String,
        description: String,
        sortOrder: Int,
        targetValue: Float,
        value: Float,
        isCollected: Boolean
    }
    type Course {
        _id: String,
        name: String,
        color: String,
        isDisabled: Boolean
    }
    type Lesson {
        _id: String,
        position: Int,
        description: String,
        flashcardIds: [String]!,
        youtubeId: String,
    }
    type LessonCount {
        count: Int
    }
    type Image {
      url: String,
      hasAlpha: Boolean,
    }
    type Flashcard {
        _id: String,
        question: String!,
        answer: String!,
        image: Image,
        answerImage: Image,
        isCasual: Boolean,
    }
    type Item {
        _id: String,
        actualTimesRepeated: Int,
        easinessFactor: Float,
        extraRepeatToday: Boolean,
        flashcardId: String,
        lastRepetition: Int,
        nextRepetition: Int,
        previousDaysChange: Int,
        timesRepeated: Int,
        isCasual: Boolean,
        flashcard: Flashcard!
    }
    
    type ItemWithFlashcard {
        item: Item!,
        flashcard: Flashcard!
    }

    type UserDetails {
        hasDisabledTutorial: Boolean,
        selectedCourse: String,
        experience: Experience,
        isCasual: Boolean
    }
    
    type Experience {
      value: Int, 
      level: Int,
      showLevelUp: Boolean
    }
    
    type User {
        _id: String!,
        password: String!,
        username: String!,
        email: String,
        activated: Boolean!,
        facebookId: String,
        currentAccessToken: String,
    }
    
    type SessionCount {
        newDone: Int,
        newTotal: Int,
        dueDone: Int,
        dueTotal: Int,
        reviewDone: Int,
        reviewTotal: Int
    }
    
    type ReviewsPerDay {
      count: Int,
      ts: Int,
    }

    type Query {
        Achievements: [Achievement]!,
        Reviews: [ReviewsPerDay],
        Courses: [Course]!,
        Course(_id: String!): Course,
        Lessons(courseId: String!): [Lesson]!,
        Lesson(courseId: String!): Lesson,
        Flashcards: [Flashcard],        
        Flashcard(_id: String!): Flashcard
        Item: Item,
        Items: [Item],
        SessionCount: SessionCount
        LessonCount: LessonCount
        CurrentUser: User,
        UserDetails: UserDetails
    }
    
    type Status {
        success: Boolean!
    }
    
    type Mutation {
        clearToken(userId: String!, token: String!): Boolean
        changePassword(oldPassword: String!, newPassword: String!): Status,
        selectCourse(courseId: String!): UserDetails,
        selectCourseSaveToken(courseId: String!, deviceId: String): UserDetails,
        closeCourse: UserDetails,
        createItemsAndMarkLessonAsWatched(courseId: String!): Lesson,
        processEvaluation(itemId: String!, evaluation: Float!): [Item]!,
        addUser: User!
        setUsernameAndPasswordForGuest(username: String!, password: String!, deviceId: String!, saveToken: Boolean): User
        logIn(username: String!, password: String!, deviceId: String!, saveToken: Boolean): User
        logInWithFacebook(accessTokenFb: String!, userIdFb: String!): User
        logInWithFacebookAccessToken(accessTokenFb: String): User
        logInWithToken(accessToken: String!, userId: String!, deviceId: String!): User
        isTokenExpired(userId: String, token: String, deviceId: String): Boolean
        switchUserIsCasual: UserDetails
        setUserIsCasual(isCasual: Boolean!): UserDetails
        clearNotCasualItems: Boolean
        logOut: User
        hideTutorial: UserDetails
        confirmLevelUp: UserDetails
        resetPassword(username: String!): Status
    }
    
    schema {
        query: Query
        mutation: Mutation
        #        subscription: Subscription
    }
`

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
