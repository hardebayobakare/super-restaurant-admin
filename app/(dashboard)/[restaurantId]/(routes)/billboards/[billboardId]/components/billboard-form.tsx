"use client"

import axios from "axios";
import * as z from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-model";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string(),
    isMainMenu: z.boolean().default(false).optional(),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const description = initialData ? "Edit a billboard" : "Create a billboard";
    const toastmessage = initialData ? "Billboard update." : "Billboard created.";
    const action = initialData ? "Save changes" : "Create";


    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
            isMainMenu: false,
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.restaurantId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.restaurantId}/billboards`, data);
            }
            router.refresh();
            router.push(`/${params.restaurantId}/billboards`)
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
           await axios.delete(`/api/${params.restaurantId}/billboards/${params.billboardId}`)
           router.refresh();
           router.push(`/${params.restaurantId}/billboards`);
           toast.success("Billboard deleted.");
        } catch (error) {
            toast.error("Make sure you remove all categories using billboard first.")
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
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={(url) => field.onChange("")} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                    <div className="grid grid-cols-3 gap-3">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={ loading } placeholder="Billboard label" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        <FormField
                            control={form.control}
                            name="isMainMenu"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Main Menu Billboard
                                        </FormLabel>
                                        <FormDescription>
                                            This billboard will be part of Main menu
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )} 
                        />
                    </div>
                    <Button disabled={ loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
            {/* <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.restaurantId}`} variant="public" /> */}
        </> 
        
     );
}
 