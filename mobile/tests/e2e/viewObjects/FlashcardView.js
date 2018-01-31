export class FlashcardView {
  constructor (driver) {
    this.driver = driver
  }

  get flashcardCurrentSide () {
    return this.driver.getElement('flashcard_side')
  }

  async flipFlashcard () {
    await this.flashcardCurrentSide.click()
  }

  assertFlashcardShown (text) {
    return this.flashcardCurrentSide.assertContentMatches(text)
  }
  assertQuestionShown (text) {
    return this.assertFlashcardShown(`${text}`)
  }
  assertAnswerShown (text) {
    return this.assertFlashcardShown(`${text}`)
  }
}
