var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

var questions = [{"question":"What is 1 + 1?","answer":"2"},{"question":"What is the square root of 64?","answer":"8"}]

var question, answer, totalquestions, questionNum = 0;

function respond() {
   var request = JSON.parse(this.req.chunks[0]),
        botRegex = /^\/startgame\s/;

   if(request.text && botRegex.test(request.text)) {
     this.res.writeHead(200);
     var numberOfQuestions = request.text.replace(botRegex, '')
     startGame(numberOfQuestions)
     this.res.end();
   } else if (request.text && request.text == answer) {
      correct(request.name)
   } else {
     console.log("don't care");
     this.res.writeHead(200);
     this.res.end();
   }
}

function startGame(num) {
  questionNum++
  console.log('starting game. requested ' + num + 'questions')
  totalquestions = Number(num)
  var questionIndex = Math.floor((Math.random() * 10) + 1) % questions.length;
  question = questions[questionIndex].question;
  answer = questions[questionIndex].answer;
  console.log(question, answer)
  sendMessage('-- Starting Math Game --\nThe first to answer correctly gets that question correct.\n\nQuestion 1/' + totalquestions + ': ' + question);
}

function correct(name) {
   questionNum++
   if (questionNum <= totalquestions) {
      var questionIndex = Math.floor((Math.random() * 10) + 1) % questions.length;
      question = questions[questionIndex].question;
      answer = questions[questionIndex].answer;
      console.log(question, answer)
      sendMessage(name + ' your answer is correct.\n\nQuestion ' + questionNum + '/' + totalquestions + ': ' + question)
   } else {
      sendMessage(name + ' your answer is correct.\n\nGood game everyone.')
      answer = ''
      question = ''
      totalquestions = 0
      questionNum = 0
   }
}

function sendMessage(message) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : message
  };

  console.log('sending ' + message + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
