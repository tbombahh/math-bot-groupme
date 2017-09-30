var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

var questions = [{"question":"If F(a,b,c,d) = a^b + c * d, what is the valid of b such that F(6,b,4,3) = 48","answer":"2"},{"question":"The lengths of the sides of a triangle are 6 cm, 7 cm and 9 cm. In a similar triangle whose perimeter is 110 cm, what is the length of the longest side, in centimeters?","answer":"45"},{"question":"The length of a rectangle is three times its width. A new rectangle is created by decreasing the length of the original rectangle by half. By what factor must the original width be multiplied, if the area remains unchanged?","answer":"2"},{"question":"What is 1 + 1?","answer":"2"},{"question":"What is the square root of 64?","answer":"8"},{"question":"When its digits are reversed, a particular positive two-digit integer is increased by 20%. What is the original number?","answer":"45"}]

var question, answer, totalquestions, questionNum = 0;

function respond() {
   var request = JSON.parse(this.req.chunks[0]),
        botRegex = /^\/startgame\s/,
        badRegex = /^\/startgame$/

   if(request.text && botRegex.test(request.text)) {
     this.res.writeHead(200);
     var numberOfQuestions = request.text.replace(botRegex, '')
     startGame(numberOfQuestions)
     this.res.end();
   } else if (request.text && request.text == answer) {
      correct(request.name)
   } else if (request.text && badRegex.test(request.text)) {
     sendMessage('You must specify how many questions you want in the competition. Like so:\n\n/startgame 5')
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
