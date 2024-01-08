import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillboardPage = async ({
    params
}: {
    params: { restaurantId: string}
}) => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            restaurantId: params.restaurantId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedBillboards: BillboardColumn [] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 ">
                <BillboardClient data={ formattedBillboards }/>
            </div>
        </div>
     );
}
 
export default BillboardPage;