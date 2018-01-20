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

  get flashcardButton () {
    return this.driver.getElement('.flashcard-content-text')
  }

  get noClueAnswerButton () {
    return this.driver.getElement('[alt="No clue"]')
  }

  get easyAnswerButton () {
    return this.driver.getElement('[alt="Easy"]')
  }

  async showAnswer () {
    await this.flashcardButton.click()
  }

  async selectNoClue () {
    await this.noClueAnswerButton.click()
  }

  async selectEasy () {
    await this.easyAnswerButton.click()
  }
}
