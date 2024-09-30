import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage =  async ({
    params
}: {
    params: {productId: string, restaurantId: string}
}) => {
    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true,
            sizePrices: {
                include: {
                    size: true
                }
            }
        }
    });



    const categories = await prismadb.category.findMany({
        where: {
            restaurantId: params.restaurantId,
        }
    });

    const sizes = await prismadb.size.findMany({
        where: {
            restaurantId: params.restaurantId,
        }
    });

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm initialData={product} categories={categories} sizes={sizes} />
            </div>
            
        </div>
     );
}
 
export default ProductPage;