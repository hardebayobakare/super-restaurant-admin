import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { SizePrice } from "@prisma/client";
import { connect } from "http2";

interface Product {
    id: string;
    name: string;
    sizePrices: SizePrice[];
    // Define other properties as needed
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
};

export async function POST(req: Request, { params }: { params: {restaurantId: string } }) {
    const { items, redirectUrl} = await req.json();

    const products: Product[] = JSON.parse(items);

    

    if(!items || items.length === 0) {
        return new NextResponse("Products are required", { status: 400});
    }
    
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product: Product & { sizePrices: SizePrice[] }) => {
        
        line_items.push({
            quantity: product.sizePrices[0].quantity,
            price_data: {
                currency: "USD",
                product_data: {
                    name: product.name,
                },
                unit_amount: new Decimal(product.sizePrices[0].price).toNumber() * 100,
            }
        });
    });
    

    const order = await prismadb.order.create({
        data: {
            restaurantId: params.restaurantId,
            isPaid: false,
            orderItems: {
                create: products.flatMap((product: Product) => {
                    return {
                        product: {
                            connect: {
                                id: product.id
                            }
                        },
                        quantity: product.sizePrices[0].quantity,
                        size: {
                            connect: {
                                id: product.sizePrices[0].sizeId
                            }
                        },
                        price: product.sizePrices[0].price
                    };
                }),
            },
        },
    });
    


    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true
        },
        success_url: `${redirectUrl}/cart?success=1`,
        cancel_url: `${redirectUrl}/cart?cancel=1`,
        metadata: {
            orderId: order.id
        }

    });

    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders
    });
}



