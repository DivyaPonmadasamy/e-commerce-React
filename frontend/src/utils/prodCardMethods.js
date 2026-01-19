export function calculatePrice(mrp, discount) {
    return Math.floor(mrp - mrp * (discount / 100));
};

export function calculateSaving(mrp, discount) {
    return Math.ceil(mrp * (discount / 100));
};

export const calculateTotal = (products) => {
    return products.reduce((acc, item) => {
        const pricePerKg = calculatePrice(item.mrp, item.discount);
        return acc + pricePerKg * item.quantity;
    }, 0);
};

export const calculateSavings = (products) => {
    return products.reduce((acc, item) => {
        return acc + Math.ceil(item.mrp * (item.discount / 100)) * item.quantity;
    }, 0);
}