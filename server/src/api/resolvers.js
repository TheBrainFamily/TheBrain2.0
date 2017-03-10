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
        Lesson(root, args, context) {
            return context.Lessons.getLessonByPosition(args.position);
        },
        Lessons(root, args, context) {
            return context.Lessons.getLessons();
        },
        Item(root, args, context) {
            return context.Items.getItemById(args._id);
        },
        ItemsWithFlashcard(root, args, context) {
            return context.ItemsWithFlashcard.getItemsWithFlashcard()
        }
    },
    Mutation: {
       async createItemsForLesson(root, args, context) {
            const lesson = await context.Lessons.getLessonById(args._id);
            const flashcardIds = lesson.flashcardIds;
            const items = [];
            const shorterFlashcardIds = flashcardIds.splice(2);
           shorterFlashcardIds.forEach((flashcardId) => {
                items.push(context.Items.create(flashcardId));
            });
            return items;
        },
        async processEvaluation(root, args, context) {
            const item = await context.Items.getItemById(args.itemId);
            const newItem = returnItemAfterEvaluation(args.evaluation, item);
            await context.Items.update(args.itemId, newItem);

            return newItem;
        }
    }
};

export default resolvers;