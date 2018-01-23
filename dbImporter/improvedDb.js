var biology = db.courses.insertOne({_id: (new ObjectId()).valueOf(), name: 'Biology', color: '#62c46c' });
var chemistry = db.courses.insertOne({_id: (new ObjectId()).valueOf(), name: 'Chemistry', color: '#662d91' });
var computerScience = db.courses.insertOne({_id: (new ObjectId()).valueOf(), name: 'Computer Science', color: '#000000', isDisabled: true });
var history = db.courses.insertOne({_id: (new ObjectId()).valueOf(), name: 'History', color: '#000000', isDisabled: true });

db.lessons.update({}, {$set: {courseId: chemistry.insertedId}}, {multi: true});

var biologyFlashcard1 = db.flashcards.insertOne({
  _id: (new ObjectId()).valueOf(),
  'question': 'What is the name of this course?',
  'answer': "Biology"
});
var biologyFlashcard2 = db.flashcards.insertOne({
    _id: (new ObjectId()).valueOf(),
    "question" : "How many letters are in the word 'Biology'?", 
    "answer" : "7"
});
var biologyFlashcard3 = db.flashcards.insertOne({
  _id: (new ObjectId()).valueOf(),
  "question" : "Why do we have two holes in our nose?",
  "answer" : "To smell things better"
});
var biologyFlashcard4 = db.flashcards.insertOne({
  _id: (new ObjectId()).valueOf(),
  "question" : "Why do we have two eyes",
  "answer" : "To see things better, duh..."
});

db.lessons.insertOne({
    _id: (new ObjectId()).valueOf(),
    "courseId": biology.insertedId,
    "position" : NumberInt(1), 
    "description" : "The best lesson", 
    "flashcardIds" : [
        biologyFlashcard1.insertedId,
        biologyFlashcard2.insertedId
    ], 
    "youtubeId" : "QnQe0xW_JY4"
});
db.lessons.insertOne({
  _id: (new ObjectId()).valueOf(),
  "courseId": biology.insertedId,
  "position" : NumberInt(2),
  "description" : "Second The best lesson",
  "flashcardIds" : [
    biologyFlashcard3.insertedId,
    biologyFlashcard4.insertedId
  ],
  "youtubeId" : "HVT3Y3_gHGg"
});

var progress = [
	{ courseId: chemistry.insertedId, lesson: NumberInt(1) },
	{ courseId: biology.insertedId, lesson: NumberInt(1) },
]
db.userdetails.update({}, {$set: {progress: progress}}, {multi: true});
