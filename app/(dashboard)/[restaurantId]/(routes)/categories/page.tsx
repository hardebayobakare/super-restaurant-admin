import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
    params
}: {
    params: { restaurantId: string}
}) => {
    const categories = await prismadb.category.findMany({
        where: {
            restaurantId: params.restaurantId
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedCategories: CategoryColumn [] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 ">
                <CategoryClient data={ formattedCategories }/>
            </div>
        </div>
     );
}
 
export default CategoriesPage;