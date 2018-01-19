export class QuestionsPage {
  constructor (driver) {
    this.driver = driver
  }

  get flashcardQuestion () {
    return this.driver.getElement('.flashcard-content-text')
  }

  assertFlashcardShown (text) {
    return this.flashcardQuestion.assertContentMatches(text)
  }
}
