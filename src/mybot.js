var rp = require('request-promise');
var querystring = require('querystring');
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const BOT_IMG = "https://thumbs.dreamstime.com/b/netter-l%C3%A4chelnder-lustiger-roboterchat-bot-105585370.jpg";
const PERSON_IMG = "https://i.pinimg.com/550x/18/b9/ff/18b9ffb2a8a791d50213a9d595c4dd52.jpg";
const BOT_NAME_LIST = [
  "Michael",
  "Max",
  "Susanne",
  "Eva",
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
const BOT_NAME = BOT_NAME_LIST[random(0, BOT_NAME_LIST.length)]
const PERSON_NAME = "DU";
var userInput;
const RESTAURANT_INFO = require('../database/data-restaurant.json')
const SIGHT_INFO = require('../database/data-sight.json')
const WHAT_ELSE_LIST = [
  "Was kann ich Dir noch Helfen?",
  "Willst Du noch was suchen?",
  "Suchst Du noch andere Empfehlung?"
]
botStart()
var endMsg = true;

/**
 * API calls and fetches a reply from Luis AI
 * @returns JSON.parse(luisReply)
 */
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

  if (endMsg) {
    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    userInput = msgerInput.value;
    msgerInput.value = "";
    botResponsePrint();
  }
  
});

/**
 * 
 * @param {*} name Name of the speaker, in this case the bot / user
 * @param {*} img Image of the speaker, in the case the bot / user
 * @param {*} side Side of the message that is appended to the chat, bot on left, user on right
 * @param {*} text Message from bot / user
 */
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

/**
 * Bot starts the conversation by greeting
 */
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

/**
 * 
 * @param {*} reply reply from Luis AI
 * @returns answer that should be replied by the bot based on different cases (intents)
 */
function ansGenerator(reply) {
  var ans;
  switch (reply.prediction.topIntent) {
    case "None":
      ans = fallBackMessage();
      reAsk();
      break;
    case "restaurant-nachfragen":
      // ans = "I found a bug"
      appendMessageRestaurantNachfragen(BOT_NAME, BOT_IMG, RESTAURANT_INFO)
      break;
    case "restaurant-wählen":
      appendMessageRestaurantWaehlen(BOT_NAME, BOT_IMG, reply, RESTAURANT_INFO)
      break;
    case "sight-nachfragen":
      appendMessageSightNachfragen(BOT_NAME, BOT_IMG, SIGHT_INFO)
      break;
    case "sight-wählen":
      appendMessageSightWaehlen(BOT_NAME, BOT_IMG, reply, SIGHT_INFO)
      break;
    case "zustimmen":
      ans = "Wie immer, ich habe einige Empfehlungen von Restaurant und \
      Sehenswürdigkeit 😀 Was soll ich Dir empfehlen?"
      break;
    case "ablehnen":
      byebye();
      break;
    case "gruss":
      ans = helloMessage()
      break;
    case "anderer-ort":
      ans = `Es tut mir so leid, dass ich Deinen genannten Ort in meinem Datenbank nicht finden kann. \
      Ich bin noch auf dem weg, besser zu werden und zu erweitern. `
      reAsk();
      break;
  }
  return ans;
}

/**
 * Print out the reply from Bot
 */
function botResponsePrint() {
  var reply;
  predict().then(function(result){
    reply = result})
  setTimeout(() => {
    console.log(reply)
    appendMessage(BOT_NAME, BOT_IMG, "left", ansGenerator(reply))
  }, 1300);
}

/**
 * Generate a fallback message from the fallback message list if the bot doesn't understand what the user is saying
 * @returns the chosen fallback message from the list
 */
function fallBackMessage() {
  return FALL_BACK_MESSAGES_LIST[random(0, (FALL_BACK_MESSAGES_LIST.length))]
}

/**
 * Generate a fallback message from the fallback message list if the bot doesn't understand what the user is saying
 * @returns the chosen hello message from the list
 */
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

/**
 * Append message to the chat for the intent restaurant-nachfragen
 * @param {*} name Name of the speaker, in this case the bot / user
 * @param {*} img Image of the speaker, in the case the bot / user
 * @param {*} RESTAURANT_INFO Information from data-restaurant.json file
 * @returns NONE
 */
function appendMessageRestaurantNachfragen(name, img, RESTAURANT_INFO) {
  const msgHTML = `
    <div class="msg left-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">
          Hier gibt es einige Restaurants 😊 <br>
          Bitte die Name des Restaurants eingeben, für das Du interessiert bist 😊 <br>
          <br>
          1. ${RESTAURANT_INFO.restaurant[0].name} <br>
          2. ${RESTAURANT_INFO.restaurant[1].name} <br>
          3. ${RESTAURANT_INFO.restaurant[2].name} <br>
          4. ${RESTAURANT_INFO.restaurant[3].name} <br>
          5. ${RESTAURANT_INFO.restaurant[4].name}
        </div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
  return NONE;
}

/**
 * Append message to the chat for the intent restaurant-wählen
 * @param {*} name Name of the speaker, in this case the bot / user
 * @param {*} img Image of the speaker, in the case the bot / user
 * @param {*} reply Reply from Luis AI
 * @param {*} RESTAURANT_INFO Information from data-restaurant.json file
 * @returns NONE
 */
function appendMessageRestaurantWaehlen(name, img, reply, RESTAURANT_INFO) {
  var x = true
  var i = 0
  while (x) {
    if (Object.keys(reply.prediction.entities)[0] == RESTAURANT_INFO.restaurant[i].name) {
      x = false
      break;
    } else {
      i++
    }
  }
  const msgHTML = `
    <div class="msg left-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">
          Das klingt sehr gut! Du hast <b>${Object.keys(reply.prediction.entities)[0]}</b> ausgewählt 👍 <br>
          Darunter ist die Information über <b>${Object.keys(reply.prediction.entities)[0]}</b> 👇<br>
          <br>
          <b>Name</b> ${RESTAURANT_INFO.restaurant[i].name}<br>
          <b>Addresse</b> ${RESTAURANT_INFO.restaurant[i].address}<br>
          <b>Öffnungszeiten</b> ${RESTAURANT_INFO.restaurant[i]["opening hour"]}<br>
          <b>Kontakt</b> ${RESTAURANT_INFO.restaurant[i]["contact number"]}<br>
          <b>Menu Link</b> <a href="${RESTAURANT_INFO.restaurant[i]["menu link"]}">${RESTAURANT_INFO.restaurant[i]["menu link"]}</a><br>
          <img src="${RESTAURANT_INFO.restaurant[i]["image link"]}" alt="Error Link here" style="width:400px;height:300px;"><br>
        </div>
      </div>
    </div>
  `;

  function inerFunction() {
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
    anythingElse();
    return NONE;
  }

  if (Object.keys(reply.prediction.entities)[0] != undefined) {
    inerFunction()
  } else {
    return NONE;
  }
}

function appendMessageSightNachfragen(name, img, SIGHT_INFO) {
  const msgHTML = `
    <div class="msg left-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">
          Hier gibt es einige Sehenswürdigkeiten 😊 <br>
          Bitte die Name der Sehenswürdigkeit eingeben, für das Du interessiert bist 😊 <br>
          <br>
          1. ${SIGHT_INFO.sight[0].name} <br>
          2. ${SIGHT_INFO.sight[1].name} <br>
          3. ${SIGHT_INFO.sight[2].name} <br>
          4. ${SIGHT_INFO.sight[3].name} 
        </div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
  return NONE;
}

function appendMessageSightWaehlen(name, img, reply, SIGHT_INFO) {
  var x = true
  var i = 0
  while (x) {
    if (Object.keys(reply.prediction.entities)[0] == SIGHT_INFO.sight[i].name) {
      x = false
      break;
    } else {
      i++
    }
  }
  const msgHTML = `
    <div class="msg left-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">
          Das klingt sehr gut! Du hast <b>${Object.keys(reply.prediction.entities)[0]}</b> ausgewählt 👍 <br>
          Darunter ist die Information über <b>${Object.keys(reply.prediction.entities)[0]}</b> 👇<br>
          <br>
          <b>Name</b> ${SIGHT_INFO.sight[i].name}<br>
          <b>Addresse</b> ${SIGHT_INFO.sight[i].address}<br>
          <b>Öffnungszeiten</b> ${SIGHT_INFO.sight[i]["opening hour"]}<br>
          <b>Kontakt</b> ${SIGHT_INFO.sight[i]["contact number"]}<br>
          <b>Eintrittspreise</b> ${SIGHT_INFO.sight[i]["entry price"]}<br>
          <img src="${SIGHT_INFO.sight[i]["image link"]}" alt="alternatetext" style="width:400px;height:300px;"><br>
        </div>
      </div>
    </div>
  `;

  function inerFunction() {
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
    anythingElse();
    return NONE;
  }

  if (Object.keys(reply.prediction.entities)[0] != undefined) {
    inerFunction()
  } else {
    return NONE;
  }
}

function anythingElse() {
  var WHAT_ELSE = WHAT_ELSE_LIST[random(0, WHAT_ELSE_LIST.length)]
  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", WHAT_ELSE);
  }, 2000);
}

function byebye() {
  appendMessage(BOT_NAME, BOT_IMG, "left", "Alles klar 😊 Danke Dir, dass Du unseres Chatbot nutzt. \
  Ich wünsche Dir eine \
  angenehme Reise in München! Servus 👋")

  const byeHtml = `
    <h1 style="font-size: 15px;
    text-align: center;
    padding: 10px;">
    Dein Bot hat verlassen</h1>
  `
  setTimeout(() => {
    msgerChat.insertAdjacentHTML("afterend", byeHtml);
    msgerChat.scrollTop += 500;
    endMsg = false
  }, 1500)
  return endMsg, NONE
}

function reAsk() {
  setTimeout(() => {
    const TRY_AGAIN_MESSAGE = `Ich habe einige wunderbare Restaurants bzw. Touristenattraktionen zu empfehlen. Was soll ich Dir zeigen?`
    appendMessage(BOT_NAME, BOT_IMG, "left", TRY_AGAIN_MESSAGE);
  }, 1000);
}

