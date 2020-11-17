// 2. Створити функцію з колбеком для генерування знижки, яка поверне свій результат в колбек через 50мс.
// Згенерувати знижку випадковим чином в діапазоні від 1 до 99%.
// Оскільки магазин не може собі дозволити великі знижки, то якщо знижка буде більше 20 (включно),
// функція поверне помилку, інакше поверне значення знижки.
// Створити обгортки над функцією з колбеком для полегшення роботи з асинхронними функціями.
// Обгортки мають бути реалізовані двома способами.
require('dotenv').config();

const maxDiscount = +process.env.MAXDISCOUNT || 20;
const delay = 50;
const errorMessage = `TOO BIG DISCOUNT!`;

const discountGenerator = () => (Math.floor(Math.random() * 1e6) % 99) + 1;

const callback = (err, data) => (err ? console.error(errorMessage) : data);

const getDiscount = () => {
  const currentDiscount = discountGenerator();
  setTimeout(() => {
    if (currentDiscount >= maxDiscount) throw new Error(errorMessage);
    return callback(null, currentDiscount);
  }, delay);
};

// getDiscount();

const getDiscountPromise = () => {
  const currentDiscount = discountGenerator();
  return new Promise((resolve, reject) => {
    if (currentDiscount >= maxDiscount) reject(new Error(errorMessage));
    setTimeout(() => resolve(currentDiscount), delay);
  });
};

// getDiscountPromise();

const getDiscountAsync = async () => {
  try {
    const currentDiscount = await getDiscountPromise();
    return currentDiscount;
  } catch (error) {
    console.error(errorMessage);
    return error;
  }
};

// getDiscountAsync();

module.exports = { getDiscount, getDiscountPromise, getDiscountAsync };
