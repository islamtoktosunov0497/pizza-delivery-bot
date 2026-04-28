require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
console.log('Testing bot with token:', process.env.BOT_TOKEN);
bot.telegram.getMe().then(me => {
  console.log('Bot me:', me);
  process.exit(0);
}).catch(err => {
  console.error('Bot error:', err);
  process.exit(1);
});
