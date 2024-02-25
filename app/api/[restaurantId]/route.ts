import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {

        if (!params.restaurantId){
            return new NextResponse("Restaurant ID is required", {status: 400});
        }

        const restaurant = await prismadb.restaurant.findUnique({
            where:{
                id: params.restaurantId
            }
        });

        return NextResponse.json(restaurant);

    } catch(error){
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}