var rp = require('request-promise');
var querystring = require('querystring');
const FALL_BACK_MESSAGES_LIST = [
    "Sorry, ich verstehe Dir nicht :( Bitte nochmals probieren",
    "Es tut mir leid, das verstehe ich nicht so ganz :( Bitte antwortest Du nur mit den genannten Schlüsselworter",
]

async function predict(){
    var endpointKey = "c071c67f69ab46d1932b1469ca809303";
    var endpoint = "https://internettechnology-psta.cognitiveservices.azure.com";
    var appId = "5fccac12-5e0b-4cd5-b716-371b00ba108c";
    var utterance = "walao eh";
    var queryParams = {
        "show-all-intents": true,
        "verbose":  true,
        "query": utterance,
        "subscription-key": endpointKey
    }
    var URI = `${endpoint}/luis/prediction/v3.0/apps/${appId}/slots/staging/predict?${querystring.stringify(queryParams)}`
    const luisReply = await rp(URI);
    return JSON.parse(luisReply)
  }

function ansGenerator(reply) {
  var ans = "Fml"
  switch (reply.prediction.topIntent) {
    case "None":
      ans = fallBackMessage();
      break;
    case "restaurant-nachfragen":
      ans = "Hier ist ein paar Restaurants zu empfehlen"
      break;
    case "restaurant-wählen":
      ans = "Hier ist die Name von dem ausgewählt Restaurant"
      break;
    case "sehenswürdigkeit-nachfragen":
      ans = "Hier ist ein paar Sehenswürdigkeiten zu empfehlen"
      break;
    case "zustimmen":
      ans = "Ja"
      break;
    case "ablehnen":
      ans = "Nein"
      break;
  }
  return ans;
}

function botResponsePrint() {
  var reply;
  predict().then(function(result){
    reply = result})
  setTimeout(() => {
    console.log(ansGenerator(reply))
    // appendMessage(BOT_NAME, BOT_IMG, "left", ansGenerator(reply))
  }, 1300);
}

function fallBackMessage() {
  return FALL_BACK_MESSAGES_LIST[random(0, (FALL_BACK_MESSAGES_LIST.length))]
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

botResponsePrint()