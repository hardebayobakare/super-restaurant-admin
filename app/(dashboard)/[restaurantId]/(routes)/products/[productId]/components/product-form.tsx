"use client"

import axios from "axios";
import * as z from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Image, Product, Category, Size, SizePrice } from "@prisma/client";
import { Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-model";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    categoryId: z.string().min(1),
    sizePrices: z.array(z.object({
        sizeId: z.string().min(1),
        quantity: z.coerce.number().min(1),
        price: z.coerce.number().min(1),
    })),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[],
        sizePrices: SizePrice[],
    } | null;
    categories: Category[];
    sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sizePrices, setSizePrices] = useState<{ sizeId: string; quantity: number; price: number}[]>([]);

    useEffect(() => {
        if (initialData && initialData.sizePrices) {
            setSizePrices(initialData.sizePrices.map(sizePrice => ({
                sizeId: sizePrice.sizeId,
                quantity: sizePrice.quantity,
                price: Number(sizePrice.price)
            })));
        }else {
            // Initialize sizePrices with default values if no initial data provided
            setSizePrices([{ sizeId: '', quantity: 0, price: 0.0 }]);
        }
    }, [initialData]);
    

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a product" : "Create a product";
    const toastmessage = initialData ? "Product update." : "Product created.";
    const action = initialData ? "Save changes" : "Create";


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            sizePrices: initialData.sizePrices.map((sizePrice) => ({
                ...sizePrice,
                price: parseFloat(String(sizePrice.price))
            })),
        } : {
            name: '',
            images: [],
            sizePrices: [],
            categoryId: '',
            isFeatured: false,
            isArchived: false,
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.restaurantId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.restaurantId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.restaurantId}/products`)
            toast.success(toastmessage);
        } catch (error: any) {
            toast.error(error.response.data)
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async  () => {
        try {
           setLoading(true);
           await axios.delete(`/api/${params.restaurantId}/products/${params.billboardId}`)
           router.refresh();
           router.push(`/${params.restaurantId}/products`);
           toast.success("Product deleted.");
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading= {loading} 
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                    disabled={ loading }
                    variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url )])} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                    <div className="grid grid-cols-3 gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={ loading } placeholder="Product name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}                                            
                                            </SelectContent>
                                        </Select>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )} 
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the restaurant
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )} 
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="sizePrices"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size, Quantity and Price</FormLabel>
                                    {sizePrices.map((sizePrice, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            {/* Select sizes */}
                                            <Select
                                                disabled={loading}
                                                value={sizePrice.sizeId}
                                                onValueChange={(value) => {
                                                    const updatedSizePrices = [...sizePrices];
                                                    updatedSizePrices[index].sizeId = value;
                                                    setSizePrices(updatedSizePrices);
                                                    form.setValue("sizePrices", updatedSizePrices);
                                                }}
                                            >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={sizePrice.sizeId} placeholder="Select a Size"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sizes.map((size) => (
                                                    <SelectItem key={size.id} value={size.id}>
                                                        {size.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                            {/* Input for quantity */}
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={loading}
                                                    placeholder="Quantity"
                                                    value={sizePrice.quantity}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const updatedSizePrices = [...sizePrices];
                                                        updatedSizePrices[index].quantity = Number(e.target.value);
                                                        setSizePrices(updatedSizePrices);
                                                        form.setValue("sizePrices", updatedSizePrices);
                                                    }}
                                                />
                                            </FormControl>
                                            {/* Input for price */}
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    disabled={loading}
                                                    placeholder="Price"
                                                    value={sizePrice.price}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const updatedSizePrices = [...sizePrices];
                                                        updatedSizePrices[index].price = parseFloat(e.target.value);
                                                        setSizePrices(updatedSizePrices);
                                                        form.setValue("sizePrices", updatedSizePrices);
                                                    }}
                                                />
                                            </FormControl>
                                            {/* Button to remove sizePrice */}
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setSizePrices(prev => [...prev, { sizeId: '', quantity: 0, price: 0.0 }]);
                                                }}
                                                disabled={sizePrices.some(sizePrice => {
                                                    const size = sizes.find(size => size.id === sizePrice.sizeId);
                                                    return size && size.name === "Not Applicable";
                                                })}
                                            >
                                                <Plus />
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const updatedSizePrices = [...sizePrices];
                                                    updatedSizePrices.splice(index, 1);
                                                    setSizePrices(updatedSizePrices);
                                                }}
                                                disabled={sizePrices.length === 1}
                                            >
                                                <Minus />
                                            </Button>
                                        </div>
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </> 
        
     );
}
 