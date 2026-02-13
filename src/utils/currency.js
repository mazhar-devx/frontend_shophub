export const formatPrice = (price, currency = 'PKR') => {
    if (!price && price !== 0) return "Rs. 0";

    const currencyMap = {
        'PKR': { locale: 'en-PK', symbol: 'Rs.' },
        'USD': { locale: 'en-US', symbol: '$' },
        'EUR': { locale: 'en-DE', symbol: '€' },
        'GBP': { locale: 'en-GB', symbol: '£' },
        'INR': { locale: 'en-IN', symbol: '₹' },
        'AED': { locale: 'ar-AE', symbol: 'AED ' },
    };

    const config = currencyMap[currency] || currencyMap['PKR'];

    // Special case for old data: if currency is not provided and we are using default PKR,
    // we might need to check if the price was stored as USD (old behavior).
    // However, to follow the user's "perfect" fix, we'll favor the new explicit currency.

    try {
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: currency === 'PKR' ? 'PKR' : currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(price).replace(currency, config.symbol).trim();
    } catch (e) {
        return `${config.symbol}${price}`;
    }
};
