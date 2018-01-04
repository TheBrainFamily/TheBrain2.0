import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context';
// import { typeDefs } from '../../../server/src/api/typeDef'
// import resolvers from '../../../server/src/api/resolvers'

const gql = a => a;

const typeDefs = gql`
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

// TODO this should be either fetched from the server automatically (current dev for example) or being saved in a cloud on a merge to develop so we can fetch

window.__APOLLO_TEST_TOOLS = {
  mockNetworkInterfaceWithSchema,
  addMockFunctionsToSchema,
  makeExecutableSchema,
  stringify: function (obj) {

    return JSON.stringify(obj, function (key, value) {
      var fnBody;
      if (value instanceof Function || typeof value == 'function') {


        fnBody = value.toString();

        if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
          return '_NuFrRa_' + fnBody;
        }
        return fnBody;
      }
      if (value instanceof RegExp) {
        return '_PxEgEr_' + value;
      }
      return value;
    });
  },
  parse: function (str, date2obj) {

    var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;

    return JSON.parse(str, function (key, value) {
      var prefix;

      if (typeof value != 'string') {
        return value;
      }
      if (value.length < 8) {
        return value;
      }

      prefix = value.substring(0, 8);

      if (iso8061 && value.match(iso8061)) {
        return new Date(value);
      }
      if (prefix === 'function') {
        return eval('(' + value + ')');
      }
      if (prefix === '_PxEgEr_') {
        return eval(value.slice(8));
      }
      if (prefix === '_NuFrRa_') {
        return eval(`(function ${value.slice(8)})`);
      }

      return value;
    });
  }
}

const resolvers = {
  Query: {
    CurrentUser () {
        return null
    },
    Courses() {
      return [
        {_id: "_id", name: "name", color: "color", isDisabled: false}
      ]
    }
  }
}

const schema = makeExecutableSchema({typeDefs, resolvers});
export { schema };

// addMockFunctionsToSchema({schema, preserveResolvers: true});

const networkInterface =  mockNetworkInterfaceWithSchema({schema});
export { networkInterface }
