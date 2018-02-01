'use strict'
const fs = require('fs')
const ObjectID = require('mongodb').ObjectID
const Db = require('mongodb').Db
const Server = require('mongodb').Server

const chemistryYoutubeLinks = JSON.parse('["FSyAehMdpyI","hQpQ0hxVNTg","QiiyvzZBKT8","0RRVV4Diomg","rcKilE9CdaA","UL1jmJaUkaQ","AN4KifV12DA","ANi709MYnWg","IIu16dy3ThI","lQ6FBA1HM3s","mlRhLicNo8Q","BxUS1K7xu30","8SRAkXMu3d0","GIPrsWuSkQc","JbqtqCunYzA","TLRZAFU_9Kg","GqtUWyDR1fg","SV7U4yAXL5I","JuWtBR-rDQk","ZsY4WcQOrfk","VRWRmIEHr3A","QXT4OVM4vXI","PVL24HAesnc","a8LF7JEb0IA","cPDptc0wUYI","BqQJPCdmIp8","9h2f1Bjr0p4","g5wNg_dKsYY","DP-vWN1yXrY","LS67vS10O5Y","8Fdt5WnYn1k","7qOFtL3VEBc","bzr-byiSXlA","OnfJ0pUgPws","b_SXwfHQ774","kdy3RsZk7As","IV4IUsholjg","thnDxFdkzZs","KWAsz59F8gA","FU6y1XIADdg","UloIw7dhnlQ","CEH3O6l1pbw","kXFEex-dABU","hlXc_eEtBHA","U7wavimfNFE","rHxxLYzJ8Sw","aLuSi_6Ol8M"]')

const getLines = (str) => {
  return str.split(/\r?\n/)
}

const getRawData = (lineStr) => {
  const elements = lineStr.split(';')
  return {
    movieId: parseInt(elements[0]),
    questionLocalId: parseInt(elements[1]),
    isHardcoreQuestion: parseInt(elements[2]) > 0,
    questionContent: elements[3],
    answer: elements[4],
    youtubeId: elements[5]
  }
}

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir)

  return files
}

const getFlashcardImages = (imagesDirPath, courseName, staticPrefix = 'https://thebrain.pro/img/') => {
  const imageFiles = walkSync(imagesDirPath)
  const images = imageFiles.map(imagePath => {
      const imageRawData = imagePath.split('.')

      return {
        url: `${staticPrefix}${courseName}/${imagePath}`,
        movieId: parseInt(imageRawData[0]),
        questionLocalId: parseInt(imageRawData[1]),
        questionOrAnswer: imageRawData[2]
      }
    }
  )
  return images
}

const tryAddImageToFlashcard = (movieId, questionLocalId, flashcard, images) => {
  const image = images.find(imageItem => imageItem.movieId === movieId && imageItem.questionLocalId === questionLocalId)
  if (image) {
    if (image.questionOrAnswer === 'q') {
      flashcard.image = {
        url: image.url,
        hasAlpha: false // hardcoded for now, not sure if it always is false
      }
      return true
    } else if ('a') {
      flashcard.answerImage = {
        url: image.url,
        hasAlpha: false
      }

      return true
    }
  }
  return false
}

const getFlashCard = (rawData) => {
  return {
    _id: new ObjectID(),
    question: rawData.questionContent,
    answer: rawData.answer,
    isCasual: !rawData.isHardcoreQuestion
  }
}

const lessons = []
const getLessonFor = (rawData) => {
  const { movieId, questionContent, youtubeId, courseId } = rawData
  let lesson = lessons.find(lessonItem => lessonItem.position === movieId)

  if (!lesson) {
    lesson = {
      _id: new ObjectID(),
      position: movieId,
      description: questionContent,
      youtubeId,
      courseId,
      flashcardIds: []
    }
    lessons.push(lesson)
  }

  return lesson
}

const getClasses = (strLines, youtubeLinksArray, courseId, images) => {
  const lessons = []
  const allFlashCards = []

  strLines.forEach((line) => {

    const rawData = getRawData(line)
    if (youtubeLinksArray) {
      rawData.youtubeId = youtubeLinksArray[rawData.movieId - 1]
    }
    rawData.courseId = courseId

    const lesson = getLessonFor(rawData)

    if (rawData.questionLocalId === 0) {
      lessons.push(lesson)
    } else {
      const flashcard = getFlashCard(rawData)
      if (tryAddImageToFlashcard(rawData.movieId, rawData.questionLocalId, flashcard, images)) {
        if (flashcard.answerImage) {
          // skip flashcards with images as an answer
          return
        }
        // console.log('JMOZGAWA: flashcard', flashcard)
      }
      allFlashCards.push(flashcard)
      lesson.flashcardIds.push(flashcard._id)
    }
  })

  return {
    lessons: lessons,
    flashcards: allFlashCards,
  }
}

const saveResultsToMongo = (data) => {
  const db = new Db('thebrain', new Server('localhost', 27017))
  db.open(async (err, db) => {
    const Lessons = db.collection('lessons')
    const Flashcards = db.collection('flashcards')

    await Lessons.insertMany(data.lessons)
    await Flashcards.insertMany(data.flashcards)

    db.close()
  })
}

const onCSVLoaded = (csvRaw, imagesPath, courseName, courseId, youtubeLinks = null) => {
  const lines = getLines(csvRaw)
  const images = getFlashcardImages(imagesPath, courseName)
  const parsedCsv = getClasses(lines, youtubeLinks, courseId, images)

  // saveResultsToMongo(parsedCsv)
}

const importChemistry = () => {
  fs.readFile('/Users/jmozgawa/Projects/TheBrain2.0/assets/crashcourse chemistry poprawione.csv', 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    onCSVLoaded(data, '/Users/jmozgawa/Projects/TheBrain2.0/web/public/img/chemistry', 'chemistry', '59c006d7e7fcb5110c2dc5a7', chemistryYoutubeLinks)
  })
}

const importBiology = () => {
  fs.readFile('/Users/jmozgawa/Projects/TheBrain2.0/assets/crashcourse biology complete poprawione.csv', 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    onCSVLoaded(data, '/Users/jmozgawa/Projects/TheBrain2.0/web/public/img/biology', 'biology', '59b6aecade3d69efc0253b6c')
  })
}

importBiology()

