import Flashcards from '../collections/Flashcards';

export default class ChannelRepository {
    getFlashcards() {
        return await Flashcards.find().fetch();
    }

    getFlashcard(name) {
        console.log("getChannel by ", name);
        return Flashcards.findOne({name});
    }
}
