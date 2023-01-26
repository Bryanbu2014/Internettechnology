var rp = require('request-promise');
var querystring = require('querystring');
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const BOT_IMG = "https://thumbs.dreamstime.com/b/netter-l%C3%A4chelnder-lustiger-roboterchat-bot-105585370.jpg";
const PERSON_IMG = "https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/262576088_439193947781320_3937104719251372821_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=rd6GB7LnRikAX8hmcIn&_nc_ht=scontent-muc2-1.xx&oh=00_AfDTCNYHX3lnUQOwWhikzBYM7ktJl2cnUpzXJO5GR-FdtQ&oe=63CE9352";
const BOT_NAME_LIST = [
  "Bryan",
  "Sean",
  "Jimmy",
];
const FALL_BACK_MESSAGES_LIST = [
  "Sorry, ich verstehe Dir nicht :( Bitte nochmals probieren",
  "Es tut mir leid, das verstehe ich nicht so ganz :( Bitte antwortest Du nur mit den genannten Schlüsselworter",
]
const HELLO_MESSAGE_LIST = [
  "Hallo! Willkommen zu München! Was kann ich Dir helfen?",
  "Servus aus München! Was kann ich Dir helfen?",
  "Servus! Willkommen zu München! Was kann ich dir helfen?",
]
const r = random(0, BOT_NAME_LIST.length);
const BOT_NAME = BOT_NAME_LIST[r]
const PERSON_NAME = "YOU";
var userInput;
botStart();

async function predict(){
  var endpointKey = "c071c67f69ab46d1932b1469ca809303";
  var endpoint = "https://internettechnology-psta.cognitiveservices.azure.com";
  var appId = "5fccac12-5e0b-4cd5-b716-371b00ba108c";
  var utterance = userInput;
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

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  userInput = msgerInput.value;
  msgerInput.value = "";

  botResponsePrint();
});

function appendMessage(name, img, side, text) {
//     Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function appendMessageRestaurantNachfragen(name, img, side) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">
          Hier gibt es einige Restaurants 😊 <br>
          Bitte die Name des Restaurants auswählen 😊 <br>
          <br>
          1. Görreshof Wirtschaus <br>
          2. Münchner Stubn <br>
          3. Wirtshaus in der Au
        </div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
  return NONE;
}

function botStart() {
  setTimeout(() => {
    const BOT_STARTING_MSG = `Willkommen zu München! Ich bin ${BOT_NAME}, Dein intelligente Reisepartner 🙆‍♂️🙆‍♂️`
    appendMessage(BOT_NAME, BOT_IMG, "left", BOT_STARTING_MSG);
  }, 1000);
  setTimeout(() => {
    const BOT_STARTING_MSG_2 = "Ich bin gut darin, Reisenden einige berühmte Restaurants 🍽 \
    und Sehenswürdigkeiten 🚩 zu empfehlen!\n\
    Was kann ich Dir dabei helfen?"
    appendMessage(BOT_NAME, BOT_IMG, "left", BOT_STARTING_MSG_2);
  }, 2000);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
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
      appendMessageRestaurantNachfragen(BOT_NAME, BOT_IMG, "left");
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
    case "gruss":
      ans = helloMessage();
      break;
  }
  return ans;
}

function botResponsePrint() {
  var reply;
  predict().then(function(result){
    reply = result})
  setTimeout(() => {
    console.log(reply)
    appendMessage(BOT_NAME, BOT_IMG, "left", ansGenerator(reply))
  }, 1300);
}

function fallBackMessage() {
  return FALL_BACK_MESSAGES_LIST[random(0, (FALL_BACK_MESSAGES_LIST.length))]
}

function helloMessage() {
  return HELLO_MESSAGE_LIST[random(0, (HELLO_MESSAGE_LIST.length))]
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}