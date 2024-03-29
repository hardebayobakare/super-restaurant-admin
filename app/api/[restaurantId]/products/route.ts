import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, categoryId, images, sizePrices, isFeatured, isArchived } = body;

        if (!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", {status: 400});
        }

        if (!sizePrices || !sizePrices.length){
            return new NextResponse("At least a size, price and quantity is required", {status: 400});
        }

        if (!categoryId){
            return new NextResponse("Category Id is required", {status: 400});
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

        const product = await prismadb.product.create({
            data: {
                name,
                isFeatured,
                isArchived,
                categoryId,
                restaurantId: params.restaurantId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
                sizePrices: {
                    createMany: {
                        data: [
                            ...sizePrices.map((sizePrice: {}) =>sizePrice)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch(error){
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}

export async function GET(req: Request,  { params }: { params: {restaurantId: string}}) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured") || undefined;
        const billboardId = searchParams.get("billboardId") || undefined;

        if (!params.restaurantId){
            return new NextResponse("Restaurant ID is required", {status: 400});
        }

        const products = await prismadb.product.findMany({
            where:{
                restaurantId: params.restaurantId,
                categoryId,
                isFeatured: isFeatured? true : undefined,
                isArchived: false,
                category: {
                    billboardId: billboardId
                }
            },
            include: {
                images: true,
                sizePrices: {
                    include: {
                        size: true
                    }
                },
                category: {
                    include: {
                        billboard: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);

    } catch(error){
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    } 
}