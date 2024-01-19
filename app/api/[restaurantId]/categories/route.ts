import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if (!billboardId){
            return new NextResponse("Billboard Id is required", {status: 400});
        }

        if (!params.restaurantId){
            return new NextResponse("Restaurant ID is required", {status: 400});
        }

        const restaurantbyUserId = prismadb.restaurant.findFirst({
            where: {
                id: params.restaurantId,
                userId
            }
        });

        if (!restaurantbyUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                restaurantId: params.restaurantId,
            }
        });

        return NextResponse.json(category);

    } catch(error){
        console.log('[CATEGORY_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}

export async function GET(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        const { searchParams } = new URL(req.url);
        const billboardId = searchParams.get("billboardId") || undefined;

        if (!params.restaurantId){
            return new NextResponse("Restaurant ID is required", {status: 400});
        }

        const categories = await prismadb.category.findMany({
            where:{
                billboardId,
                restaurantId: params.restaurantId
            }
        });

        return NextResponse.json(categories);

    } catch(error){
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}