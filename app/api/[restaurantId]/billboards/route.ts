import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl, isMainMenu } = body;

        if (!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!label){
            return new NextResponse("Label is required", {status: 400});
        }

        if (!imageUrl){
            return new NextResponse("Image URL is required", {status: 400});
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                isMainMenu,
                restaurantId: params.restaurantId,
            }
        });

        return NextResponse.json(billboard);

    } catch(error){
        console.log('[BILLBOARD_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}

export async function GET(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        const { searchParams } = new URL(req.url);
        const isMainMenu = searchParams.get("isMainMenu") || undefined;

        if (!params.restaurantId){
            return new NextResponse("Restaurant ID is required", {status: 400});
        }

        const billboards = await prismadb.billboard.findMany({
            where:{
                restaurantId: params.restaurantId,
                isMainMenu: isMainMenu? false : undefined,
            }
        });

        return NextResponse.json(billboards);

    } catch(error){
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}