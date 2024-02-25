import prismadb from "@/lib/prismadb";

export const getStockCount = async (restaurantId: string) => {
    try {
        // Find all sizePrices associated with the restaurant
        const sizePrices = await prismadb.sizePrice.findMany({
            where: {
                product: {
                    restaurantId: restaurantId
                }
            },
            select: {
                quantity: true // Select only the quantity field
            }
        });

        // Calculate total stock count by summing up the quantities
        const totalStockCount = sizePrices.reduce((total, sizePrice) => {
            return total + sizePrice.quantity;
        }, 0);

        return totalStockCount;
    } catch (error) {
        // Handle any errors
        console.error("Error fetching stock count:", error);
        throw error; // Rethrow the error for the caller to handle
    }
};
