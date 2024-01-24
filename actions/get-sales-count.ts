import prismadb from "@/lib/prismadb";

export const getSalesCount = async (restaurantId: string) => {
    const salesCount = await prismadb.order.count({
        where:{
            restaurantId,
            isPaid: true,
        },
    });



    return salesCount;
}