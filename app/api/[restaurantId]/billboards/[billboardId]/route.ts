import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (req: Request, { params }: { params: {restaurantId: string, billboardId: string}}) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!label){
            return new NextResponse("Label is required", {status: 400});
        }

        if(!imageUrl){
            return new NextResponse("Image Url is required", {status: 400});
        }

        if(!params.restaurantId) {
            return new NextResponse("Restaurant Id is required", {status: 400});
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard Id is required", {status: 400});
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}

export async function DELETE (req: Request, { params }: { params: {billboardId: string, restaurantId: string}}) {
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.restaurantId) {
            return new NextResponse("Restaurant Id is required", {status: 400});
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard Id is required", {status: 400});
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}

export async function GET (req: Request, { params }: { params: {billboardId: string}}) {
    try {

        if(!params.billboardId) {
            return new NextResponse("Billboard Id is required", {status: 400});
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}