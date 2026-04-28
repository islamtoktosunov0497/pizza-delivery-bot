const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories and products...');

  // Clean up existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  const burgerCat = await prisma.category.create({
    data: { nameKg: 'Бургерлер 🍔', nameRu: 'Бургеры 🍔' }
  });
  const pizzaCat = await prisma.category.create({
    data: { nameKg: 'Пицца 🍕', nameRu: 'Пицца 🍕' }
  });
  const sushiCat = await prisma.category.create({
    data: { nameKg: 'Суши & Роллы 🍣', nameRu: 'Суши & Роллы 🍣' }
  });
  const fastFoodCat = await prisma.category.create({
    data: { nameKg: 'Фастфуд 🍟', nameRu: 'Фастфуд 🍟' }
  });
  const drinksCat = await prisma.category.create({
    data: { nameKg: 'Суусундуктар 🥤', nameRu: 'Напитки 🥤' }
  });

  // Create Products
  const products = [
    // Burgers
    {
      nameKg: 'Чизбургер',
      nameRu: 'Чизбургер',
      descKg: 'Ширелүү уй эти, сыр, помидор жана атайын соус.',
      descRu: 'Сочная говядина, сыр, помидор и специальный соус.',
      price: 250,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop',
      categoryId: burgerCat.id
    },
    {
      nameKg: 'Дабл Бургер',
      nameRu: 'Дабл Бургер',
      descKg: 'Эки эселенген эт жана сыр менен чоң бургер.',
      descRu: 'Большой бургер с двойной котлетой и сыром.',
      price: 380,
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop',
      categoryId: burgerCat.id
    },
    // Pizza
    {
      nameKg: 'Маргарита',
      nameRu: 'Маргарита',
      descKg: 'Помидор, моцарелла сыры жана райхон кошулган классикалык пицца.',
      descRu: 'Классическая пицца с помидорами, сыром моцарелла и базиликом.',
      price: 500,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2938&auto=format&fit=crop',
      categoryId: pizzaCat.id
    },
    {
      nameKg: 'Пепперони',
      nameRu: 'Пепперони',
      descKg: 'Салттуу камырдагы ачуу пепперони жана моцарелла сыры.',
      descRu: 'Острая пепперони и сыр моцарелла на традиционном тесте.',
      price: 650,
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2680&auto=format&fit=crop',
      categoryId: pizzaCat.id
    },
    // Sushi
    {
      nameKg: 'Филадельфия',
      nameRu: 'Филадельфия',
      descKg: 'Лосось, быштак жана бадыраң менен классикалык роллдор.',
      descRu: 'Классические роллы с лососем, творожным сыром и огурцом.',
      price: 450,
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2940&auto=format&fit=crop',
      categoryId: sushiCat.id
    },
    {
      nameKg: 'Калифорния',
      nameRu: 'Калифорния',
      descKg: 'Краб эти жана тобико икрасы менен популярдуу ролл.',
      descRu: 'Популярный ролл с крабовым мясом и икрой тобико.',
      price: 420,
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1925&auto=format&fit=crop',
      categoryId: sushiCat.id
    },
    // Fast Food
    {
      nameKg: 'Картошка фри',
      nameRu: 'Картофель фри',
      descKg: 'Кытырак алтын түстөгү картошка фри.',
      descRu: 'Хрустящий золотистый картофель фри.',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1630384066242-17a17833f347?q=80&w=1973&auto=format&fit=crop',
      categoryId: fastFoodCat.id
    },
    {
      nameKg: 'Наггетсы',
      nameRu: 'Наггетсы',
      descKg: 'Тооктун филесинен жасалган кытырак наггетстер.',
      descRu: 'Хрустящие наггетсы из куриного филе.',
      price: 180,
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=2946&auto=format&fit=crop',
      categoryId: fastFoodCat.id
    },
    // Drinks
    {
      nameKg: 'Кока-Кола',
      nameRu: 'Кока-Кола',
      descKg: 'Муздак газдалган суусундук 0.5л.',
      descRu: 'Холодный газированный напиток 0.5л.',
      price: 60,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2940&auto=format&fit=crop',
      categoryId: drinksCat.id
    },
    {
      nameKg: 'Морс',
      nameRu: 'Морс',
      descKg: 'Табигый мөмө-жемиштерден жасалган морс.',
      descRu: 'Натуральный морс из лесных ягод.',
      price: 80,
      imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1887&auto=format&fit=crop',
      categoryId: drinksCat.id
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
