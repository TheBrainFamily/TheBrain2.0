"use strict";
const fs = require('fs');
const ObjectID = require('mongodb').ObjectID;
const Db = require('mongodb').Db;
const Server = require('mongodb').Server;

const youtubeLinks = JSON.parse("[\"FSyAehMdpyI\",\"hQpQ0hxVNTg\",\"QiiyvzZBKT8\",\"0RRVV4Diomg\",\"rcKilE9CdaA\",\"UL1jmJaUkaQ\",\"AN4KifV12DA\",\"ANi709MYnWg\",\"IIu16dy3ThI\",\"lQ6FBA1HM3s\",\"mlRhLicNo8Q\",\"BxUS1K7xu30\",\"8SRAkXMu3d0\",\"GIPrsWuSkQc\",\"JbqtqCunYzA\",\"TLRZAFU_9Kg\",\"GqtUWyDR1fg\",\"SV7U4yAXL5I\",\"JuWtBR-rDQk\",\"ZsY4WcQOrfk\",\"VRWRmIEHr3A\",\"QXT4OVM4vXI\",\"PVL24HAesnc\",\"a8LF7JEb0IA\",\"cPDptc0wUYI\",\"BqQJPCdmIp8\",\"9h2f1Bjr0p4\",\"g5wNg_dKsYY\",\"DP-vWN1yXrY\",\"LS67vS10O5Y\",\"8Fdt5WnYn1k\",\"7qOFtL3VEBc\",\"bzr-byiSXlA\",\"OnfJ0pUgPws\",\"b_SXwfHQ774\",\"kdy3RsZk7As\",\"IV4IUsholjg\",\"thnDxFdkzZs\",\"KWAsz59F8gA\",\"FU6y1XIADdg\",\"UloIw7dhnlQ\",\"CEH3O6l1pbw\",\"kXFEex-dABU\",\"hlXc_eEtBHA\",\"U7wavimfNFE\",\"rHxxLYzJ8Sw\",\"aLuSi_6Ol8M\"]");


const getLines = (str) => {
  return str.split(/\r?\n/);
}

const getLessonHeaderLine = (lineStr) => {
  const elements = lineStr.split(";");
  const containsHeader = elements[0] && elements[0].includes('nr');

  if (containsHeader) {
    return {
      _id: new ObjectID(),
      position: parseInt(elements[0].replace(/\D/g, '')),
      description: elements[1]
    };
  }
  return null;
}

const getFlashCard = (lineStr) => {
  const elements = lineStr.split(";");
  return {
    _id: new ObjectID(),
    question: elements[1],
    answer: elements[2],
  };
}

const getClasses = (strLines) => {
  const lessons = [];
  const allFlashCards = [];
  let currentlyProcessedLesson = null;
  let currentLessonFlashcards = null;

  let youtubeLinkIndex = 0;

  const submitNextLesson = () => {
    if (currentLessonFlashcards) {
      currentlyProcessedLesson.flashcardIds = currentLessonFlashcards.map((question) => question._id);
    }

    console.log("JMOZGAWA: ");
    currentlyProcessedLesson.youtubeId = youtubeLinks[youtubeLinkIndex];
    youtubeLinkIndex += 1;

    lessons.push(currentlyProcessedLesson);
  }


  strLines.forEach((line) => {

    const classObj = getLessonHeaderLine(line);
    if (classObj) {
      if (currentlyProcessedLesson) {
        submitNextLesson();
      }
      currentlyProcessedLesson = classObj;
      currentLessonFlashcards = [];
    } else {
      const flashcard = getFlashCard(line);
      currentLessonFlashcards.push(flashcard);
      allFlashCards.push(flashcard);
    }
  });

  submitNextLesson();

  return {
    lessons: lessons,
    flashcards: allFlashCards,
  }
}

const onCSVLoaded = (csvRaw) => {

  const lines = getLines(csvRaw);
  const parsedCsv = getClasses(lines);
  saveResultsToMongo(parsedCsv);

}

const saveResultsToMongo = (data) => {
  const db = new Db('thebrain', new Server('localhost', 27017));
  db.open(function (err, db) {
    const Lessons = db.collection("lessons");
    const Flashcards = db.collection("flashcards");

    Lessons.insertMany(data.lessons);
    Flashcards.insertMany(data.flashcards);

    db.close();
  });

}


fs.readFile('/Users/jmozgawa/Projects/TheBrain2.0/assets/CrashCourseChemistry_Final.csv', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  onCSVLoaded(data);
});