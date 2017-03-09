import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    position: Number,
    description: String,
    flashcardIds: Array,
    youtubeId: String,
});

export default mongoose.model('Lessons', LessonSchema);