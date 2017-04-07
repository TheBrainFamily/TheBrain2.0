import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';


const gql = schema => schema;

export const typeDefs = gql`
    type Lesson {
        _id: String,
        position: Int,
        description: String,
        flashcardIds: [String]!,
        youtubeId: String,
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

    type Query {
        Lessons: [Lesson]!,
        Lesson: Lesson,
        Flashcards: [Flashcard],        
        Flashcard(_id: String!): Flashcard
        Item: Item,
        ItemsWithFlashcard: [ItemWithFlashcard]!
        CurrentUser: User
    }
    
    type Mutation {
        createItemsAndMarkLessonAsWatched: Lesson!,
        processEvaluation(itemId: String!, evaluation: Int!): [ItemWithFlashcard]!,
        addUser: User!
        setUsernameAndPasswordForGuest(username: String!, password: String!): User
        logIn(username: String!, password: String!): User
        logOut: User
    }
    
    schema {
        query: Query
        mutation: Mutation
        #        subscription: Subscription
    }
`;


const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;