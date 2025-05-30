const displayMDLCurrency = (num) => {
    // Determină automat numărul de zecimale necesare
    const decimalPlaces = (num.toString().split('.')[1] || []).length;
    const needsThreeDecimals = decimalPlaces > 2 && num % 0.01 !== 0;
    
    // Rotunjire inteligentă
    const processedNum = needsThreeDecimals ? num : Math.round(num * 100) / 100;
    
    // Formatare manuală pentru a afișa "L" în loc de "MDL"
    const formattedNum = new Intl.NumberFormat('ro-MD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: needsThreeDecimals ? 3 : 2
    }).format(processedNum);
    
    return `${formattedNum} MDL`;
}

export default displayMDLCurrency;