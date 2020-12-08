const fs = require('fs');

const handleArray = (inputArray, outputArray) => {
  const handledArray = outputArray;

  inputArray.forEach(product => {
    const { type, color, quantity, price } = product;

    const elementIndex = handledArray.findIndex(
      element => element.type === type && element.color === color && element.price === price,
    );

    if (elementIndex >= 0) {
      handledArray[elementIndex].quantity += +quantity;
    } else {
      handledArray.push({ ...product, quantity: +quantity });
    }
  });
  return handledArray;
};

const jsonOptimizer = filename => {
  return new Promise((resolve, reject) => {
    const filepath = `upload/${filename}`;
    const filepathOpt = `upload/opt-${filename}`;
    const inputStream = fs.createReadStream(filepath);

    let outputProducts = [];
    let last = '';

    inputStream.on('data', chunk => {
      const str = chunk.toString('utf8');

      if (last) last += str.split('{', 1)[0];

      const stringifiedJson = `${last}${str.slice(str.indexOf('{'), str.lastIndexOf('}') + 1)}`;

      const inputProducts = JSON.parse(`[${stringifiedJson}]`);

      outputProducts = handleArray(inputProducts, outputProducts);

      last = str.slice(str.lastIndexOf('},') + 2);
    });

    inputStream.on('end', async () => {
      const totalQuantity = outputProducts.reduce((acc, current) => {
        return acc + current.quantity;
      }, 0);
      console.log('\nTotal quantity =', totalQuantity);

      fs.writeFile(filepathOpt, JSON.stringify(outputProducts, 0, '  '), () => {
        console.log(`\nFile ${filename} has been successfully optimized to opt-${filename}!\n`);
        fs.unlink(filepath, () => {
          console.log(`${filename} has been removed`);
        });
      });
      resolve();
    });

    inputStream.on('error', error => {
      console.error(error.message);
      reject(error);
    });
  });
};

module.exports = { jsonOptimizer };
