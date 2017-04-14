import mongoose from 'mongoose';
import casual from 'casual';
import _ from 'lodash'

import resolvers from './resolvers'
import {validate} from 'graphql/validation';
import schema from './schema';
import {FlashcardsRepository, UserDetailsRepository, LessonsRepository, Flashcards} from './mongooseSetup';
import {extendExpect, deepFreeze} from 'testHelpers/testHelpers';

extendExpect();
jest.mock('node-fetch', () => {
    return async() => ({
        json: async() => ( {
            data: {
                is_valid: true,
            }
        })
    });
});



beforeAll((done) => {
    mongoose.connection.on("open", done);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

async function createFlashcard(props) {
    const newFlashcard = new Flashcards(props);
    await newFlashcard.save();
}

async function createFlashcards(flashcardsData) {
    await Promise.all(flashcardsData.map(createFlashcard));
}

casual.define('flashcard', function () {
    return {
        // _id: mongoose.Types.ObjectId(),
        question: casual.sentence,
        answer: casual.sentence
    };
});


async function makeFlashcards({number = 3, flashcardsToExtend = []} = {}) {
    const addedFlashcards = [];
    _.times(number, (index) => {

            let newFlashcard = casual.flashcard;
            if (flashcardsToExtend[index]) {
                newFlashcard = {
                    ...newFlashcard,
                    ...flashcardsToExtend[index]
                }
            }
            addedFlashcards.push(newFlashcard);
            // await mongoose.connection.db.collection('flashcards').insert(newFlashcard)

        }
    )
    await mongoose.connection.db.collection('flashcards').insert(addedFlashcards)

    return addedFlashcards;
}

describe('query.flashcards', () => {
    afterEach(async(done) => {
        await mongoose.connection.db.dropDatabase();
        done();
    });
    it('returns flashcards from the db 1', async() => {
        const flashcardsData = await deepFreeze(makeFlashcards());

        const dbFlashcards = await resolvers.Query.Flashcards(undefined, undefined,
            {Flashcards: new FlashcardsRepository()}
        );

        expect(dbFlashcards.length).toBe(3)
        expect(dbFlashcards).toContainDocuments(flashcardsData);
    })
});

describe('query.flashcard', () => {
    afterEach(async(done) => {
        await mongoose.connection.db.dropDatabase();
        done();
    });
    it('returns a flashcard by id', async() => {

        const flashcardsToExtend = [
            {_id: mongoose.Types.ObjectId()}, {_id: mongoose.Types.ObjectId()}
        ];

        const flashcardsData = await makeFlashcards({flashcardsToExtend});

        const dbFlashcards = await resolvers.Query.Flashcard(undefined, {_id: flashcardsToExtend[1]._id},
            {Flashcards: new FlashcardsRepository()}
        );

        expect(dbFlashcards._id).toEqual(flashcardsToExtend[1]._id);
    })
});

describe("query.Lesson", () => {
    beforeAll(async () => {
        // we have those in different order to make sure the query doesn't return the first inserted lesson.
        await mongoose.connection.db.collection('lessons').insert({position: 2});
        await mongoose.connection.db.collection('lessons').insert({position: 1});
        await mongoose.connection.db.collection('lessons').insert({position: 3});
    })
    afterAll(async(done) => {
        await mongoose.connection.db.dropDatabase();
        done();
    })
    it("returns first lesson for a new user", async () => {
        const lesson = await resolvers.Query.Lesson(undefined, undefined, {Lessons: new LessonsRepository()});

        expect(lesson).toEqual(expect.objectContaining({position: 1}))
    })
    it("returns third lesson for a logged in user that already watched two lessons", async () => {
        const userId = mongoose.Types.ObjectId();
        await mongoose.connection.db.collection('userdetails').insert({userId, nextLessonPosition: 3});

        const context = {Lessons: new LessonsRepository(), user: {_id: userId}, UserDetails: new UserDetailsRepository()}
        const lesson = await resolvers.Query.Lesson(undefined, undefined, context);

        expect(lesson).toEqual(expect.objectContaining({position: 3}))
    })
})

describe('query.CurrentUser', () => {
    it("returns unchanged user from a context", () => {
        const context = deepFreeze({
            user: {_id: "testId", email: "test@email.com"}
        });

        const currentUser = resolvers.Query.CurrentUser(undefined, undefined, context);
        expect(currentUser).toEqual(context.user)
    })
})

describe('login with facebook', async() => {
    it('returns user if it already exists', async() => {
        const {logInWithFacebook} = resolvers.Mutation;
        const args = {
            accessToken: 'TOKEN',
        };

        const user = deepFreeze({username: "test"});

        const context = {
            Users: {
                findByFacebookId: async() => (user),
            },
            req: {
                logIn: jest.fn()
            }
        };

        await logInWithFacebook(undefined, args, context);
        expect(context.req.logIn.mock.calls[0]).toContain(user);
    });
});
