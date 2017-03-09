import Flashcards from '../collections/Flashcards';

export default class ChannelRepository {
    async getFlashcards() {
        console.log("flashcards repository");
        const dupa = await Flashcards.find().exec();
        console.log("dupa ", dupa);
        return dupa;
    }

    getFlashcard(_id) {
        console.log("getChannel by ", _id);
        return Flashcards.findOne({_id});
    }
}
