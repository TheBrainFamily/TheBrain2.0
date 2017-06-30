// @flow

import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'

const gql = schema => schema

export const typeDefs = gql`
    type Course {
        _id: String,
        name: String,
        color: String
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
    type Flashcard {
        _id: String,
        question: String!,
        answer: String!
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
        timesRepeated: Int
    }
    
    type ItemWithFlashcard {
        item: Item!,
        flashcard: Flashcard!
    }

    type UserDetails {
        hasDisabledTutorial: Boolean,
        selectedCourse: String
    }
    
    type User {
        _id: String!,
        password: String!,
        username: String!,
        activated: Boolean!
    }
    
    type SessionCount {
        newDone: Int,
        newTotal: Int,
        dueDone: Int,
        dueTotal: Int,
        reviewDone: Int,
        reviewTotal: Int
    }

    type Query {
        Courses: [Course]!,
        Lessons: [Lesson]!,
        Lesson(courseId: String!): Lesson,
        Flashcards: [Flashcard],        
        Flashcard(_id: String!): Flashcard
        Item: Item,
        ItemsWithFlashcard: [ItemWithFlashcard]!
        SessionCount: SessionCount
        LessonCount: LessonCount
        CurrentUser: User,
        UserDetails: UserDetails
    }
    
    type Status {
        success: Boolean!
    }
    
    type Mutation {
        selectCourse(courseId: String!): Status,
        closeCourse: Status,
        createItemsAndMarkLessonAsWatched(courseId: String!): Lesson,
        processEvaluation(itemId: String!, evaluation: Int!): [ItemWithFlashcard]!,
        addUser: User!
        setUsernameAndPasswordForGuest(username: String!, password: String!): User
        logIn(username: String!, password: String!): User
        logInWithFacebook(accessToken: String!): User
        logOut: User
        hideTutorial: UserDetails
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
