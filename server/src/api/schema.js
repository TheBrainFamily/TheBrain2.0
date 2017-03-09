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

    type Query {
        Lessons: [Lesson]!,
        Lesson(_id:String!): Lesson,
        Flashcards: [Flashcard],
        Flashcard(_id: String!): Flashcard
    }
    #    type Mutation {
    #        addMessage(channelName: String!, message: String!, handle: String!): Message!
    #        addChannel(channelName: String!): Channel!
    #    }
    #    type Subscription {
    #        messageAdded(channelName: String!): Message
    #    }
    schema {
        query: Query
        #        mutation: Mutation
        #        subscription: Subscription
    }
`;


const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;