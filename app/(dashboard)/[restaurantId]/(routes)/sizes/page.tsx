import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({
    params
}: {
    params: { restaurantId: string}
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            restaurantId: params.restaurantId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedSizes: SizeColumn [] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 ">
                <SizeClient data={ formattedSizes }/>
            </div>
        </div>
     );
}
 
export default SizesPage;