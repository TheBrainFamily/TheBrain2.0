// import Flashcards from './repositories/FlashcardsRepository';
import Lessons from './repositories/LessonsRepository';
import returnItemAfterEvaluation from './tools/returnItemAfterEvaluation';
const resolvers = {
    Query: {
        Flashcards(root, args, context) {
            console.log("flashcards resolver", context);
            return context.Flashcards.getFlashcards();
        },
        Flashcard(root, args, context) {
            return context.Flashcards.getFlashcard(args._id);
        },
        async Lesson(root, args, context) {
            console.log("Gozdecki: context",context);
            console.log("Gozdecki: args",args);
            let nextLessonPosition;
            if (context.user) {
                nextLessonPosition = await context.UserDetails.getNextLessonPosition(context.user._id);
            } else {
                nextLessonPosition = 1;
            }
            return await context.Lessons.getLessonByPosition(nextLessonPosition);
        },
        Lessons(root, args, context) {
            return context.Lessons.getLessons();
        },
        Item(root, args, context) {
            return context.Items.getItemById(args._id, context.user._id);
        },
        ItemsWithFlashcard(root, args, context) {
            if (context.user) {
                console.log("Gozdecki: context.user in ItemsWithFlashcard", context.user);
                return context.ItemsWithFlashcard.getItemsWithFlashcard(context.user._id);
            } else {
                return [];
            }
        }
    },
    Mutation: {
        async createItemsAndMarkLessonAsWatched(root, args, context) {
            let userId = context.user && context.user._id;
            if (!userId) {
                const guestUser = await context.Users.createGuest();
                console.log("Gozdecki: guestUser",guestUser);
                userId = guestUser._id;
                context.req.logIn(guestUser, function(err) {
                    console.log("inside logIn");
                    if (err) { console.log("err", err); return next(err); }
                });
            }
            const currentLessonPosition = await context.UserDetails.getNextLessonPosition(userId);
            console.log("JMOZGAWA: currentLessonPosition",currentLessonPosition);
            const lesson = await context.Lessons.getLessonByPosition(currentLessonPosition);
            console.log("JMOZGAWA: lesson",lesson);
            const flashcardIds = lesson.flashcardIds;
            //TODO THIS SPLICE HAS TO GO
            flashcardIds.splice(2);
            flashcardIds.forEach((flashcardId) => {
                context.Items.create(flashcardId, userId);
            });
            await context.UserDetails.updateNextLessonPosition(userId);
            const nextLessonPosition = await context.UserDetails.getNextLessonPosition(userId);
            return await context.Lessons.getLessonByPosition(nextLessonPosition);

        },
        async setUsernameAndPasswordForGuest(root, args, context) {
            return await context.Users.updateUser(context.user._id, args.username, args.password);
        },
        async processEvaluation(root, args, context) {
            const item = await context.Items.getItemById(args.itemId, context.user._id);
            const newItem = returnItemAfterEvaluation(args.evaluation, item);
            //TODO move this to repository
            await context.Items.update(args.itemId, newItem, context.user._id);

            return await context.ItemsWithFlashcard.getItemsWithFlashcard(context.user._id);
        }
    }
};

export default resolvers;