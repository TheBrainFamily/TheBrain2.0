import { HardcoreWarningView } from './HardcoreWarningView'
import { FlashcardView } from './FlashcardView'
import { VotingInstruction } from './VotingInstruction'

export class QuestionsView {
  constructor (driver) {
    this.driver = driver
  }

  get flashcard () {
    return new FlashcardView(this.driver)
  }

  get hardcoreWarning () {
    return new HardcoreWarningView(this.driver)
  }

  get votingInstruction () {
    return new VotingInstruction(this.driver)
  }

  assertIsVisible () {
    // TODO this should check whether the video is visible actually
    return this.skipLectureButton.assertIsVisible()
  }
}
