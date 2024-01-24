import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (req: Request, { params }: { params: {restaurantId: string, productId: string}}) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, price, quantity, categoryId, sizeId, images, isFeatured, isArchived } = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name){
            return new NextResponse("Name is required", {status: 400});
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", {status: 400});
        }

        if (!price){
            return new NextResponse("Price is required", {status: 400});
        }

        if (!categoryId){
            return new NextResponse("Category Id is required", {status: 400});
        }

        if (!sizeId){
            return new NextResponse("Size Id is required", {status: 400});
        }

        if(!params.restaurantId) {
            return new NextResponse("Restaurant Id is required", {status: 400});
        }

        if(!params.productId) {
            return new NextResponse("Product Id is required", {status: 400});
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                quantity,
                categoryId,
                sizeId,
                images: {
                    deleteMany: {

                    }
                },
                isArchived,
                isFeatured
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}

export async function DELETE (req: Request, { params }: { params: {productId: string, restaurantId: string}}) {
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.restaurantId) {
            return new NextResponse("Restaurant Id is required", {status: 400});
        }

        if(!params.productId) {
            return new NextResponse("Product Id is required", {status: 400});
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}

export async function GET (req: Request, { params }: { params: {productId: string}}) {
    try {

        if(!params.productId) {
            return new NextResponse("Product Id is required", {status: 400});
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true
            }
        })

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}