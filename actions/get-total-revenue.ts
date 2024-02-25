import prismadb from "@/lib/prismadb";
import { Decimal } from "@prisma/client/runtime/library";

export const getTotalRevenue = async (restaurantId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where:{
            restaurantId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + ((new Decimal(item.price)).toNumber() * item.quantity);
        }, 0)

        return total + orderTotal;
    }, 0)

    return totalRevenue;
    return 0;
}