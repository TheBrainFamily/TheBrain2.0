import mongoose from 'mongoose';


mongoose.connect('mongodb://localhost/thebrain');

const FlashcardSchema = new mongoose.Schema({
    question: String,
    answer: String,
});

export const Flashcards = mongoose.model('Flashcards', FlashcardSchema);

export class FlashcardsRepository {
    async getFlashcards() {
        console.log("flashcards repository");
        const dupa = await Flashcards.find().exec();
        console.log("dupa ", dupa);
        return dupa;
    }

    async getFlashcard(_id) {
        console.log("getChannel by ", _id);
        return await Flashcards.findOne({_id});
    }
}


const LessonSchema = new mongoose.Schema({
    position: Number,
    description: String,
    flashcardIds: Array,
    youtubeId: String,
});

export const Lessons = mongoose.model('Lessons', LessonSchema);

export class LessonsRepository {
    async getLessons() {
        return await Lessons.find();
    }

    async getLessonByPosition(position) {
        console.log("getChannel by ", position);
        return await Lessons.findOne({position});
    }

    async getLessonById(_id) {
        // console.log("_id ", _id);
        return await Lessons.findOne({_id}).exec();
    }
}


const ItemSchema = new mongoose.Schema({
    actualTimesRepeated: Number,
    easinessFactor: Number,
    extraRepeatToday: Boolean,
    flashcardId: String,
    lastRepetition: String,
    nextRepetition: String,
    previousDaysChange: Number,
    timesRepeated: Number,
});

export const Items = mongoose.model('Items', ItemSchema);

export class ItemsRepository {

    async getItems(lessonPosition) {

    }

    async getItemById(_id) {
        return await Items.findOne({_id});
    }

    async create(flashcardId) {
        const newItem = {
            flashcardId,
            actualTimesRepeated: 0,
            easinessFactor: 2.5,
            extraRepeatToday: false,
            lastRepetition: '',
            nextRepetition: '',
            previousDaysChange: 0,
            timesRepeated: 0,
        };
        const item = new Items(newItem);
        const insertedItem = await item.save();
        console.log("insertedItem", insertedItem);
        return newItem;
    }
}

export class ItemsWithFlashcardRepository {

    async getItemsWithFlashcard() {
        const currentItems = await Items.find({$or: [{actualTimesRepeated: 0}, {extraRepeatToday: true}]});
        const flashcards = await Flashcards.find({_id: {$in: currentItems.map(item => item.flashcardId)}});
        return currentItems.map(item => {
            return {
                item,
                flashcard: flashcards.find(flashcard => flashcard._id == item.flashcardId)
            }
        });

    }

}
