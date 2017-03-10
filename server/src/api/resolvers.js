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
            const userId = "1";
            const nextLessonPosition = await context.UserDetails.getNextLessonPosition(userId);
            return await context.Lessons.getLessonByPosition(nextLessonPosition);
        },
        Lessons(root, args, context) {
            return context.Lessons.getLessons();
        },
        Item(root, args, context) {
            return context.Items.getItemById(args._id);
        },
        ItemsWithFlashcard(root, args, context) {
            return context.ItemsWithFlashcard.getItemsWithFlashcard();
        }
    },
    Mutation: {
        async createItemsAndMarkLessonAsWatched(root, args, context) {
            const userId = "1";
            const currentLessonPosition = await context.UserDetails.getNextLessonPosition(userId);
            console.log("JMOZGAWA: currentLessonPosition",currentLessonPosition);
            const lesson = await context.Lessons.getLessonByPosition(currentLessonPosition);
            console.log("JMOZGAWA: lesson",lesson);
            const flashcardIds = lesson.flashcardIds;
            const items = [];
            flashcardIds.splice(2);
            flashcardIds.forEach((flashcardId) => {
                items.push(context.Items.create(flashcardId));
            });
            await context.UserDetails.updateNextLessonPosition(userId);
            const nextLessonPosition = await context.UserDetails.getNextLessonPosition(userId);
            return await context.Lessons.getLessonByPosition(nextLessonPosition);

        },
        async processEvaluation(root, args, context) {
            const item = await context.Items.getItemById(args.itemId);
            const newItem = returnItemAfterEvaluation(args.evaluation, item);
            //TODO move this to repository
            await context.Items.update(args.itemId, newItem);

            return await context.ItemsWithFlashcard.getItemsWithFlashcard();
        }
    }
};

export default resolvers;