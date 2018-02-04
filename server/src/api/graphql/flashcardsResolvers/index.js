// @flow

import { withRepositories } from '../withRepositories'

export const flashcardsResolvers = {
  Query: {
    Flashcards: withRepositories((root: ?string, args: ?Object, context: Object) =>
      context.Flashcards.getFlashcards()),
    Flashcard: withRepositories((root: ?string, args: { _id: string }, context: Object) =>
       context.Flashcards.getFlashcard(args._id))
  }
}
