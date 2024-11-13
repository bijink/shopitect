// *Amount calculation fn to calculate "sellPrice, profitAmount, profitPercentage"

const amountCalculate = (calcMethod: string, inputValue1: string, inputValue2: string) => {
  let outputValue1: string = '';
  let outputValue2: string = '';

  if (calcMethod === 'method-1') {
    // *(getPrice, sellPrice) =>> (profitAmount, profitPercentage)
    if ((inputValue1 && inputValue2) !== '' && inputValue1 !== '0') {
      const getPrice = parseFloat(inputValue1);
      const sellPrice = parseFloat(inputValue2);

      // #(getPrice, sellPrice) =>> profitAmount
      const profitAmount = sellPrice - getPrice;
      outputValue1 = profitAmount.toFixed(2);

      // #(getPrice, sellPrice) =>> profitPercentage
      const profitPercentage = profitAmount / (getPrice / 100);
      outputValue2 = profitPercentage.toFixed(2);
    }
  } else if (calcMethod === 'method-2') {
    // *(getPrice, profitPercentage) =>> (profitAmount, sellPrice)
    if ((inputValue1 && inputValue2) !== '' && inputValue1 !== '0') {
      const getPrice = parseFloat(inputValue1);
      const profitPercentage = parseFloat(inputValue2);

      // #(getPrice, profitPercentage) =>> profitAmount
      const profitAmount = (getPrice / 100) * profitPercentage;
      outputValue1 = profitAmount.toFixed(2);

      // #(getPrice, profitPercentage) =>> sellPrice
      const sellPrice = profitAmount + getPrice;
      outputValue2 = sellPrice.toFixed(2);
    }
  } else if (calcMethod === 'method-3') {
    // *(getPrice, profitAmount) =>> (sellPrice, profitPercentage)
    if ((inputValue1 && inputValue2) !== '' && inputValue1 !== '0') {
      const getPrice = parseFloat(inputValue1);
      const profitAmount = parseFloat(inputValue2);

      // #(getPrice, profitAmount) =>> sellPrice
      const sellPrice = getPrice + profitAmount;
      outputValue1 = sellPrice.toFixed(2);

      // #(getPrice, profitAmount) =>> profitPercentage
      const profitPercentage = (sellPrice - getPrice) / (getPrice / 100);
      outputValue2 = profitPercentage.toFixed(2);
    }
  }

  return [outputValue1, outputValue2];
};

export default amountCalculate;
