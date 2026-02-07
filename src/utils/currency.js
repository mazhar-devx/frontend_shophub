export const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    // Assuming the stored price is in USD, convert to PKR (approx 1 USD = 278 PKR)
    const pkrPrice = price * 278;
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(pkrPrice).replace('PKR', 'Rs.');
};
