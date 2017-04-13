import resolvers from './resolvers'
import mongoose from 'mongoose';
import {validate} from 'graphql/validation';
import schema from './schema';
import {FlashcardsRepository, Flashcards} from './mongooseSetup';
import {extendExpect, deepFreeze} from 'testHelpers/testHelpers';

extendExpect();
console.log("Gozdecki: process.env.NODE_PATH",process.env.NODE_PATH);
jest.mock('node-fetch', () => {
    return async() => ({
        json: async() => ( {
            data: {
                is_valid: true,
            }
        })
    });
});


const flashcardsHelpers = {
    insertRandom(number) {

    }
}




describe('query.flashcards 1', () => {
    afterEach(async() => {
        await mongoose.connection.db.dropDatabase();
    });
    it('returns flashcards from the db 1', async() => {
        const flashcardsData = deepFreeze([{
            question: "questionOne",
            answer: "answerOne"
        },
            {
                question: "questionTwo",
                answer: "answerTwoAE"
            },
        ]);
        await Promise.all(flashcardsData.map(async(fd) => {
            const newFlashcard = new Flashcards(fd);
            await newFlashcard.save();
        }));
        const dbFlashcards = await resolvers.Query.Flashcards(undefined, undefined,
            {Flashcards: new FlashcardsRepository()}
        );

        expect(dbFlashcards).toContainDocuments(flashcardsData);
    })
});

const houseForSale = {
    bath: true,
    bedrooms: 4,
    kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        area: 20,
        wallColor: 'white',
    },
};
const desiredHouse = {
    bath: true,
    kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        wallColor: 'white',
    },
};

test('the house has my desired features', () => {
    expect(houseForSale).toMatchObject(desiredHouse);
});

describe('login with facebook', async() => {
    it('returns user if it already exists', async() => {
        const {logInWithFacebook} = resolvers.Mutation;
        const args = {
            accessToken: 'TOKENsA',
        };

        const user = Object.freeze({username: "test"});

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
// test('user successfully login with facebook', ()=> {
//
// });
