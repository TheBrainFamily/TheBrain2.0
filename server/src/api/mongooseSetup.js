import mongoose from 'mongoose';
import moment from 'moment';

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
    lastRepetition: Number,
    nextRepetition: Number,
    previousDaysChange: Number,
    timesRepeated: Number,
});

export const Items = mongoose.model('Items', ItemSchema);

export class ItemsRepository {

    async getItems(lessonPosition) {

    }

    async update(id, item) {
        return await Items.update({_id: id}, {$set: item});
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
            lastRepetition: 0,
            nextRepetition: 0,
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
        const currentItems = await Items.find({
            $or: [
                {actualTimesRepeated: 0},
                {extraRepeatToday: true},
                {nextRepetition: {$lte: moment().unix()}}
            ]
        });
        const flashcards = await Flashcards.find({_id: {$in: currentItems.map(item => item.flashcardId)}});
        const sortedResults = currentItems.map(item => {
            return {
                item,
                flashcard: flashcards.find(flashcard => flashcard._id == item.flashcardId)
            }
        }).sort((a, b) => {
            return a.item.lastRepetition - b.item.lastRepetition;
        });

        return sortedResults;
    }

}


const UserDetailsSchema = new mongoose.Schema({
    userId: String,
    nextLessonPosition: Number,
});

export const UserDetails = mongoose.model('userDetails', UserDetailsSchema);

export class UserDetailsRepository {

    async getNextLessonPosition(userId) {
        const userDetails = await UserDetails.findOne({userId});
        return userDetails.nextLessonPosition;
    }
    async updateNextLessonPosition(userId) {
        await UserDetails.update({userId}, {$inc: {nextLessonPosition: 1}});
    }
}