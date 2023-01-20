const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];  
const BOT_STARTING_MSG_1 = [
  "Willkommen zu unserer Kundenservice! Ich bin Bryan, Dein intelligente Bot. Was kann ich Dir dabei helfen?",
  "Willkommen zu unserer Kundenservice! Ich bin Sean, Dein intelligente Bot. Was kann ich Dir dabei helfen?",
  "Willkommen zu unserer Kundenservice! Ich bin Jimmy, Dein intelligente Bot. Was kann ich Dir dabei helfen?"
]

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://thumbs.dreamstime.com/b/netter-l%C3%A4chelnder-lustiger-roboterchat-bot-105585370.jpg";
const PERSON_IMG = "https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/262576088_439193947781320_3937104719251372821_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=rd6GB7LnRikAX8hmcIn&_nc_ht=scontent-muc2-1.xx&oh=00_AfDTCNYHX3lnUQOwWhikzBYM7ktJl2cnUpzXJO5GR-FdtQ&oe=63CE9352";
const BOT_NAME_LIST = [
  "Bryan",
  "Sean",
  "Jimmy"
];
const r = random(0, 3);
const BOT_NAME = BOT_NAME_LIST[r]
const PERSON_NAME = "YOU";
botStart();

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  botResponse();
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
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

function botStart() {
  setTimeout(() => {
    const BOT_STARTING_MSG = `Willkommen zu unserer Kundenservice! Ich bin ${BOT_NAME}, Dein intelligente Bot. Was kann ich Dir dabei helfen?`
    appendMessage(BOT_NAME, BOT_IMG, "left", BOT_STARTING_MSG);
  }, 0);
}

function botResponse() {
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
