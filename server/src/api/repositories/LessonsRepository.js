import Flashcards from '../collections/Flashcards';

export default class ChannelRepository {
    async getFlashcards() {
        return await Flashcards.find();
    }

    getFlashcard(name) {
        console.log("getChannel by ", name);
        return Flashcards.findOne({name});
    }
}
