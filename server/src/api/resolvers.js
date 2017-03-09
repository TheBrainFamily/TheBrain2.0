// import Flashcards from './repositories/FlashcardsRepository';
import Lessons from './repositories/LessonsRepository';

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
    }
};

export default resolvers;