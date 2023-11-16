const { Telegraf } = require('telegraf');

const bot = new Telegraf('YOUR_BOT_TOKEN');

const userData = {};

// Middleware for handling commands
bot.start((ctx) => {
  ctx.reply('Welcome to the Ignite Event Registration Bot! Please enter your Full Name:');
});

// Handling user input for Full Name
bot.hears(/\/register/, (ctx) => {
  ctx.reply('Great! Please enter your Full Name:');
});

bot.on('text', (ctx) => {
  const userId = ctx.from.id;

  if (!userData[userId]) {
    userData[userId] = {};
  }

  const currentStep = userData[userId].currentStep || 1;

  switch (currentStep) {
    case 1:
      // Full Name validation
      if (ctx.message.text.trim() === '') {
        ctx.reply('Please enter a valid Full Name.');
        return;
      }

      userData[userId].fullName = ctx.message.text.trim();
      ctx.reply('Next, please select your Age Group:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '12-16', callback_data: '12-16' }],
            [{ text: '17-20', callback_data: '17-20' }],
            [{ text: '21-25', callback_data: '21-25' }],
          ],
        },
      });
      userData[userId].currentStep = 2;
      break;

    case 2:
      // Age Group validation
      const ageGroup = ctx.callbackQuery.data;
      userData[userId].ageGroup = ageGroup;

      ctx.reply('Next, please select your Life Stage:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Sec student', callback_data: 'Sec student' }],
            [{ text: 'Uni', callback_data: 'Uni' }],
            [{ text: 'NS', callback_data: 'NS' }],
            [{ text: 'FT Working', callback_data: 'FT Working' }],
          ],
        },
      });
      userData[userId].currentStep = 3;
      break;

    case 3:
      // Life Stage validation
      const lifeStage = ctx.callbackQuery.data;
      userData[userId].lifeStage = lifeStage;

      ctx.reply('Next, please enter your Contact number:');
      userData[userId].currentStep = 4;
      break;

    case 4:
      // Contact number validation
      if (!/^\d{10}$/.test(ctx.message.text.trim())) {
        ctx.reply('Please enter a valid 10-digit Contact number.');
        return;
      }

      userData[userId].contactNumber = ctx.message.text.trim();
      ctx.reply('Finally, how did you come to know about Ignite?', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Social Media', callback_data: 'Social Media' }],
            [{ text: 'Friend', callback_data: 'Friend' }],
            [{ text: 'Others', callback_data: 'Others' }],
          ],
        },
      });
      userData[userId].currentStep = 5;
      break;

    case 5:
      // How did you come to know about Ignite validation
      const source = ctx.callbackQuery.data;
      userData[userId].source = source;

      // Registration completed, store data or perform further actions
      ctx.reply('Thank you for registering for Ignite!');

      // Reset user data for next registration
      delete userData[userId];
      break;

    default:
      ctx.reply('Invalid input. Please start the registration process again.');
      delete userData[userId];
      break;
  }
});

bot.launch();
