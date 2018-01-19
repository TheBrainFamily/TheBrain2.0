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

var progress = [
	{ courseId: chemistry.insertedId, lesson: NumberInt(1) },
	{ courseId: biology.insertedId, lesson: NumberInt(1) },
]
db.userdetails.update({}, {$set: {progress: progress}}, {multi: true});
