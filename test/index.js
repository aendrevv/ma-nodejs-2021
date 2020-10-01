// Create a function that receives an array of goods and returns cost that should be paid for all these goods.
// Your code should:
// - Print to the console the total quantity of pairs of socks (Socks - ${quantity});
// - Print to the console the total quantity of the hats of red color (Red Hats - ${quantity});
// - Print to the console the cost of the goods by colors (Red - ${costRed}, Green - ${costGreen}, Blue - ${costBlue});
// - Print to the console the result of the execution of this function.

const inputArray = [
  {"type": "socks", "color": "red", "quantity": 10, "priceForPair": "$3"},
  {"type": "socks", "color": "green", "quantity": 5, "priceForPair": "$10"},
  {"type": "socks", "color": "blue", "quantity": 8, "priceForPair": "$6"},
  {"type": "hat", "color": "red", "quantity": 7, "price": "$5"},
  {"type": "hat", "color": "green", "quantity": 0, "price": "$6"},
  {"type": "socks", "color": "blue", "priceForPair": "$6"},
  {"type": "socks", "color": "red", "quantity": 10, "priceForPair": "$3"},
  {"type": "socks", "color": "white", "quantity": 3, "priceForPair": "$4"},
  {"type": "socks", "color": "green", "priceForPair": "$10"},
  {"type": "socks", "color": "blue", "quantity": 2, "priceForPair": "$6"},
  {"type": "hat", "color": "green", "quantity": 3, "price": "$5"},
  {"type": "hat", "color": "red", "quantity": 1, "price": "$6"},
  {"type": "socks", "color": "blue", "priceForPair": "$6"}
];

const functionThatYouNeed = (array) => {
  let socksQuantity = 0;
  let redHatsQuantity = 0;
  let costRed = 0;
  let costGreen = 0;
  let costBlue = 0;
  let totalCost = 0;  
  
  array.forEach(element => {
    const price = (element.priceForPair || element.price).slice(1);
    
    if (element.type === 'socks') {
      socksQuantity += +element.quantity || 1;
    }

    if (element.color === 'red') {
      redHatsQuantity += +element.quantity;
    }

    if (element.color === 'red') {
      costRed += +element.quantity * +price;
    }

    if (element.color === 'green') {
      costGreen += (+element.quantity || 1) * +price;
    }

    if (element.color === 'blue') {
      costBlue += (+element.quantity || 1) * +price;
    }

    totalCost += (+element.quantity || 1) * +price;
  });
      
  console.log(`Socks - ${socksQuantity}`);
  console.log(`Red hats - ${redHatsQuantity}`);
  console.log(`Red items - ${costRed}`);
  console.log(`Green items - ${costGreen}`);
  console.log(`Blue items - ${costBlue}`);
  console.log(`Total cost of all items is - ${totalCost}`);
  
  return totalCost;  
}

console.log(functionThatYouNeed(inputArray));