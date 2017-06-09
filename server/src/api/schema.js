// @flow

import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'

const gql = schema => schema

export const typeDefs = gql`
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
        watchedLessonsIds: [String!]!
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
        Lessons: [Lesson]!,
        Lesson: Lesson,
        Flashcards: [Flashcard],        
        Flashcard(_id: String!): Flashcard
        Item: Item,
        ItemsWithFlashcard: [ItemWithFlashcard]!
        SessionCount: SessionCount
        LessonCount: LessonCount
        CurrentUser: User
    }
    
    type Status {
        success: Boolean!
    }
    
    type Mutation {
        createItemsAndMarkLessonAsWatched: Lesson!,
        processEvaluation(itemId: String!, evaluation: Int!): [ItemWithFlashcard]!,
        addUser: User!
        setUsernameAndPasswordForGuest(username: String!, password: String!): User
        logIn(username: String!, password: String!): User
        logInWithFacebook(accessToken: String!): User
        logOut: User
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
