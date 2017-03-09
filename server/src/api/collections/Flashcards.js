import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema({
    question: String,
    answer: String,
});

export default mongoose.model('Flashcards', FlashcardSchema);