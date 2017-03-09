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
        actualTimesRepeated: Int,
        easinessFactor: Float,
        extraRepeatToday: Boolean,
        flashcardId: String,
        lastRepetition: String,
        nextRepetition: String,
        previousDaysChange: Int,
        timesRepeated: Int
    }

    type Query {
        Lessons: [Lesson]!,
        Lesson(position:Int!): Lesson,
        Flashcards: [Flashcard],
        Flashcard(_id: String!): Flashcard
        Item: Item
    }
    type Mutation {
        createItemsForLesson(_id: String!): [Item],
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