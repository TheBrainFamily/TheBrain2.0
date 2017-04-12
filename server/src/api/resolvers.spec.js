import resolvers from './resolvers'
import {validate} from 'graphql/validation';
import schema from './schema';
import {FlashcardsRepository} from './mongooseSetup';

jest.mock('node-fetch', () => {
    // track(‘data-mock’)
    return async() => ({
        json: async() => ( {
            data: {
                is_valid: true,
            }
        })
    });
});

// test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
// });

// test('flashcards query returns all flashcard items', ()=> {
//     const { Flashcards } = resolvers.Query;
//     const context = {
//         Flashcards: {
//             getFlashcards: ()=> {
//                 return '';
//             }
//         }
//     }
//
//     expect(validate(schema, schema.getQueryType('Flashcards'), Flashcards({}, {}, context)));
// });

describe('query.flashcards', () => {
    it('returns a flashcard', () => {
        resolvers.Query.Flashcards(undefined, undefined, {Flashcards: new FlashcardsRepository()});
    })
});

describe('login with facebook', async() => {
    it('returns user if it already exists', async() => {
        const {logInWithFacebook} = resolvers.Mutation;
        const args = {
            accessToken: 'TOKEN',
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
