require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const WEB_APP_URL = process.env.WEB_APP_URL;

const strings = {
  kg: {
    selectLang: 'Тилди тандаңыз / Выберите язык:',
    welcome: 'Салам! 👋\nБизге кош келиңиз!\n\n🍔 Даамдуу тамактар\n🚚 Тез жеткирүү\n💸 Жеткиликтүү баалар\n\nМенюну ачып, сүйүктүү тамагыңызды тандаңыз 👇',
    menuBtn: '🍕 Менюну ачуу',
    orderSuccess: '🎉 Сиздин заказыңыз ийгиликтүү кабыл алынды! (#ORDER_ID)\n\nКурьер жакында сиз менен байланышат.',
    adminNewOrder: '🔴 <b>Жаңы заказ! (#ORDER_ID)</b>',
    adminCustomer: '👤 <b>Кардар:</b>',
    adminPhone: '📞 <b>Тел:</b>',
    adminAddress: '📍 <b>Дарек:</b>',
    adminItems: '🛒 <b>Заказдар:</b>',
    adminTotal: '💰 <b>Жалпы:</b>',
    unknown: 'Белгисиз',
    currency: 'сом'
  },
  ru: {
    selectLang: 'Выберите язык / Тилди тандаңыз:',
    welcome: 'Привет! 👋\nДобро пожаловать к нам!\n\n🍔 Вкусная еда\n🚚 Быстрая доставка\n💸 Доступные цены\n\nОткройте меню и выберите любимое блюдо 👇',
    menuBtn: '🍕 Открыть меню',
    orderSuccess: '🎉 Ваш заказ успешно принят! (#ORDER_ID)\n\nКурьер скоро свяжется с вами.',
    adminNewOrder: '🔴 <b>Новый заказ! (#ORDER_ID)</b>',
    adminCustomer: '👤 <b>Клиент:</b>',
    adminPhone: '📞 <b>Тел:</b>',
    adminAddress: '📍 <b>Адрес:</b>',
    adminItems: '🛒 <b>Заказы:</b>',
    adminTotal: '💰 <b>Итого:</b>',
    unknown: 'Неизвестно',
    currency: 'сом'
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware for bot
bot.use((ctx, next) => {
  if (ctx.update) {
    // console.log('Incoming update:', JSON.stringify(ctx.update, null, 2));
  }
  return next();
});

// --- Telegram Bot Logic ---

const sendWelcome = async (ctx, lang, telegramId, firstName) => {
  const s = strings[lang];
  const webAppUrlWithLang = `${WEB_APP_URL}?lang=${lang}`;
  
  await ctx.reply(s.welcome, {
    reply_markup: {
      keyboard: [
        [{ text: s.menuBtn, web_app: { url: webAppUrlWithLang } }],
        [{ text: '🇰🇬 Кыргызча / 🇷🇺 Русский' }]
      ],
      resize_keyboard: true
    }
  });
};

bot.start(async (ctx) => {
  await ctx.reply(strings.kg.selectLang, {
    reply_markup: {
      keyboard: [
        [{ text: '🇰🇬 Кыргызча' }, { text: '🇷🇺 Русский' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.hears(['🇰🇬 Кыргызча', '🇷🇺 Русский', '🇰🇬 Кыргызча / 🇷🇺 Русский'], async (ctx) => {
  const text = ctx.message.text;
  let lang = 'kg';
  if (text === '🇷🇺 Русский') lang = 'ru';
  
  if (text === '🇰🇬 Кыргызча / 🇷🇺 Русский') {
      return ctx.reply(strings.kg.selectLang, {
          reply_markup: {
              keyboard: [
                  [{ text: '🇰🇬 Кыргызча' }, { text: '🇷🇺 Русский' }]
              ],
              resize_keyboard: true,
              one_time_keyboard: true
          }
      });
  }

  const telegramId = ctx.from.id.toString();
  const firstName = ctx.from.first_name || 'User';

  await prisma.user.upsert({
    where: { telegramId },
    update: { language: lang, name: firstName },
    create: { telegramId, name: firstName, language: lang }
  });

  await sendWelcome(ctx, lang, telegramId, firstName);
});

// Launch bot
bot.launch()
  .catch((err) => {
    console.error('Failed to start bot:', err);
  });
console.log('Bot successfully started!');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// --- API Endpoints ---

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const lang = req.query.lang || 'kg';
    const categories = await prisma.category.findMany();
    
    const localizedCategories = categories.map(c => ({
      id: c.id,
      name: lang === 'ru' ? c.nameRu : c.nameKg
    }));
    
    res.json(localizedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const lang = req.query.lang || 'kg';
    const products = await prisma.product.findMany();
    
    // Map products to the requested language
    const localizedProducts = products.map(p => ({
      id: p.id,
      name: lang === 'ru' ? p.nameRu : p.nameKg,
      description: lang === 'ru' ? p.descRu : p.descKg,
      price: p.price,
      imageUrl: p.imageUrl,
      categoryId: p.categoryId
    }));
    
    res.json(localizedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { telegramId, name, phone, address, items, totalAmount } = req.body;

    if (!telegramId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const order = await prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { telegramId: telegramId.toString() }
      });

      if (!user) {
        user = await tx.user.create({
          data: { telegramId: telegramId.toString(), name, phone }
        });
      } else if (phone && !user.phone) {
        user = await tx.user.update({
          where: { id: user.id },
          data: { phone, name }
        });
      }

      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: parseFloat(totalAmount),
          address: address || 'No address provided',
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: { include: { product: true } },
          user: true
        }
      });

      return newOrder;
    });

    const lang = order.user.language || 'kg';
    const s = strings[lang];

    // Notify Admin (Always in Kyrgyz/Russian mixed or just Kyrgyz)
    if (process.env.ADMIN_ID) {
      const orderDetails = order.items
        .map(i => `${lang === 'ru' ? i.product.nameRu : i.product.nameKg} (x${i.quantity}) - ${i.price * i.quantity} ${s.currency}`)
        .join('\n');
      
      const adminMessage = `
${s.adminNewOrder.replace('#ORDER_ID', order.id)}

${s.adminCustomer} ${order.user.name}
${s.adminPhone} ${order.user.phone || s.unknown}
${s.adminAddress} ${order.address}

${s.adminItems}
${orderDetails}

${s.adminTotal} ${order.totalAmount} ${s.currency}
`;
      
      try {
        await bot.telegram.sendMessage(process.env.ADMIN_ID, adminMessage, { parse_mode: 'HTML' });
      } catch (err) {
        console.error('Error sending admin notification:', err);
      }
    }

    // Notify User
    try {
      await bot.telegram.sendMessage(
        telegramId, 
        s.orderSuccess.replace('#ORDER_ID', order.id),
        { parse_mode: 'HTML' }
      );
    } catch (err) {
      console.error('Error sending user notification:', err);
    }

    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
app.get('/api/orders/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const lang = req.query.lang || 'kg';
    
    const user = await prisma.user.findUnique({
      where: { telegramId: telegramId.toString() }
    });

    if (!user) return res.json([]);

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const localizedOrders = orders.map(order => ({
        ...order,
        items: order.items.map(i => ({
            ...i,
            product: {
                ...i.product,
                name: lang === 'ru' ? i.product.nameRu : i.product.nameKg,
                description: lang === 'ru' ? i.product.descRu : i.product.descKg
            }
        }))
    }));

    res.json(localizedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
