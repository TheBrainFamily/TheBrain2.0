export default function getItemsWithFlashcardsByCount (flashcards) {
  const itemsWithFlashcardsByCount = {
    newDone: 0,
    newTotal: 0,
    dueDone: 0,
    dueTotal: 0,
    reviewDone: 0,
    reviewTotal: 0
  }

  flashcards.forEach(({ item }) => {
    if (item.actualTimesRepeated === 1) {
      itemsWithFlashcardsByCount['newDone']++
    }
    if (item.extraRepeatToday) {
      itemsWithFlashcardsByCount['reviewTotal']++
    } else if (item.timesRepeated === 1) {
      itemsWithFlashcardsByCount['newDone']++
      if (item.actualTimesRepeated > 1) {
        itemsWithFlashcardsByCount['reviewDone']++
      }
    }
    if (item.nextRepetition) {
      if (item.actualTimesRepeated > 1) {
        itemsWithFlashcardsByCount['dueDone']++
      }
      itemsWithFlashcardsByCount['dueTotal']++
    } else {
      itemsWithFlashcardsByCount['newTotal']++
    }
  })

  return itemsWithFlashcardsByCount
}
