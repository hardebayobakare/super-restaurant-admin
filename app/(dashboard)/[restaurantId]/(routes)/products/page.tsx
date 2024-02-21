import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import prismadb from "@/lib/prismadb";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";


const ProductPage = async ({
    params
}: {
    params: { restaurantId: string}
}) => {
    const products = await prismadb.product.findMany({
        where: {
            restaurantId: params.restaurantId
        },
        include: {
            category: true,
            sizePrices: {
                include: {
                    size: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedProducts: ProductColumn [] = products.map((item) => ({
        id: item.id,
        name: item.name,
        sizes: item.sizePrices.map((sizePrice) => sizePrice.size.name),
        quantity: item.sizePrices.reduce((total, sizePrice) => total + sizePrice.quantity, 0),
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        category: item.category.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 ">
                <ProductClient data={ formattedProducts }/>
            </div>
        </div>
     );
}
 
export default ProductPage;