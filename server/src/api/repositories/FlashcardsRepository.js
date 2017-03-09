import Flashcards from '../collections/Flashcards';

export default class ChannelRepository {
    getFlashcards() {
        return await Flashcards.find().fetch();
    }

    getFlashcard(_id) {
        console.log("getChannel by ", _id);
        return Flashcards.findOne({_id});
    }
}
