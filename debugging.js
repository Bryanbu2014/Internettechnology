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
    var utterance = "gorreshof wirtshaus";
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
    var ans = "Fml";
    switch (reply.prediction.topIntent) {
      case "None":
        ans = fallBackMessage();
        setTimeout(() => {
          const TRY_AGAIN_MESSAGE = `Ich habe einige wunderbare Restaurants bzw. Touristenattraktionen zu empfehlen. Was soll ich Dir zeigen?`
          appendMessage(BOT_NAME, BOT_IMG, "left", TRY_AGAIN_MESSAGE);
        }, 1000);
        break;
      case "restaurant-nachfragen":
        // ans = "I found a bug"
        appendMessageRestaurantNachfragen(BOT_NAME, BOT_IMG);
        break;
      case "restaurant-wählen":
        ans = `Das klingt gut! Du hast ${reply.prediction.entities[Object.keys(reply.prediction.entities)[0]]} gewählt!` 
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
      case "gruss":
        ans = helloMessage();
        break;
      case "anderer-ort":
        ans = "Es tut mir so leid, dass ich immer noch auf dem Weg bin, besser zu werden."
        break;
    }
    return ans;
  }

function botResponsePrint() {
  var reply;
  predict().then(function(result){
    reply = result})
  setTimeout(() => {
    console.log(Object.keys(reply.prediction.entities))
    // appendMessage(BOT_NAME, BOT_IMG, "left", ansGenerator(reply))
    console.log(ansGenerator(reply))
  }, 1300);
}

function fallBackMessage() {
  return FALL_BACK_MESSAGES_LIST[random(0, (FALL_BACK_MESSAGES_LIST.length))]
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

botResponsePrint()


const RESTAURANT_INFO = {
  "restaurant": [
    {
      "name": "Görreshof Wirtshaus",
      "address": "A.Görreshof Wirtshaus",
      "contact number": "C.Görreshof Wirtshaus",
      "menu link": "www.Görreshof Wirtshaus.com"
    },

    {
      "name": "Münchner Stubn",
      "address": "A.Münchner Stubn",
      "contact number": "C.Münchner Stubn",
      "menu link": "www.Münchner Stubn.com"
    },
    {
      "name": "Görreshof Wirtshaus",
      "address": "A.Wirtshaus in der Au",
      "contact number": "C.Wirtshaus in der Au",
      "menu link": "www.Wirtshaus in der Au.com"
    }
  ]
}