import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if (!value){
            return new NextResponse("Value is required", {status: 400});
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

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                restaurantId: params.restaurantId,
            }
        });

        return NextResponse.json(size);

    } catch(error){
        console.log('[SIZE_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}

export async function GET(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        if (!params.restaurantId){
            return new NextResponse("Restaurant ID is required", {status: 400});
        }

        const sizes = await prismadb.size.findMany({
            where:{
                restaurantId: params.restaurantId
            }
        });

        return NextResponse.json(sizes);

    } catch(error){
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}