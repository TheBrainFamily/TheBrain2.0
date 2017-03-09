const resolvers = {
    Query: {
        Flashcards(root, args, context) {
            return context.Flashcards.getFlashcards();
        },
        Flashcard(root, args, context) {
            return context.Flashcards.getFlashcard(args._id);
        },
        Lesson(root, args, context) {
            return context.Lessons.getLesson(args._id);
        },
        Lessons(root, args, context) {
            return context.Lessons.getFlashcards();
        },

    },
};

export default resolvers;