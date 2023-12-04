"use client"

import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useRestaurantModal } from "@/hooks/use-restaurant-modal"
import { Modal } from "@/components/ui/modal"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



const formSchema = z.object({
    name: z.string().min(1),
});


export const RestaurantModal = () => {
    const restaurantModal = useRestaurantModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post('/api/restaurants', values)

            toast.success("Restuarant Created.")
        } catch(error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal 
            title="Create Restaurant" 
            description="Add a new restaurant to manage products and categories"
            isOpen={restaurantModal.isOpen}
            onClose={restaurantModal.onclose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                            control={form.control}
                            name="name"
                            render={( {field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={ loading } placeholder="Restaurant" {...field}/>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}/>
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={ loading } variant="outline" onClick={restaurantModal.onclose}>Cancel</Button>
                                <Button disabled={ loading } type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

