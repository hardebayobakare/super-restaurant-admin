import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";


const OrderPage = async ({
    params
}: {
    params: { restaurantId: string}
}) => {
    const orders = await prismadb.order.findMany({
        where: {
            restaurantId: params.restaurantId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedOrders: OrderColumn [] = orders.map((item) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => orderItem.product.name +" :X "+ orderItem.quantity).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + (Number(item.price) * item.quantity)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 ">
                <OrderClient data={ formattedOrders }/>
            </div>
        </div>
     );
}
 
export default OrderPage;