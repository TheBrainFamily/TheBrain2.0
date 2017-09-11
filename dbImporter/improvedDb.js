var chemistry = db.courses.insertOne({ name: 'Chemistry', color: '#662d91' });
var biology = db.courses.insertOne({ name: 'Biology', color: '#62c46c' });
var computerScience = db.courses.insertOne({ name: 'Computer Science', color: '#000000', isDisabled: true });
var history = db.courses.insertOne({ name: 'History', color: '#000000', isDisabled: true });

db.lessons.update({}, {$set: {courseId: chemistry.insertedId.valueOf()}}, {multi: true});

var biologyFlashcard1 = db.flashcards.insertOne({
    "question" : "What is the name of this course?", 
    "answer" : "Biology"
});
var biologyFlashcard2 = db.flashcards.insertOne({
    "question" : "How many letters are in the word 'Biology'?", 
    "answer" : "7"
});

db.lessons.insertOne({ 
    "courseId": biology.insertedId.valueOf(),
    "position" : NumberInt(1), 
    "description" : "The best lesson", 
    "flashcardIds" : [
        biologyFlashcard1.insertedId.valueOf(),
        biologyFlashcard2.insertedId.valueOf()
    ], 
    "youtubeId" : "QnQe0xW_JY4"
});

var progress = [
	{ courseId: chemistry.insertedId.valueOf(), lesson: NumberInt(1) },
	{ courseId: biology.insertedId.valueOf(), lesson: NumberInt(1) },
]
db.userdetails.update({}, {$set: {progress: progress}}, {multi: true});
