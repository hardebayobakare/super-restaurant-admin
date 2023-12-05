"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRestaurantModal } from "@/hooks/use-restaurant-modal";
import { Restaurant } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, PlusCircle, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface RestaurantSwitcherProps extends PopoverTriggerProps {
    items: Restaurant[];
}


export default function RestaurantSwitcher ({
    className,
    items = []
}: RestaurantSwitcherProps) {
    const restaurantModal = useRestaurantModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentRestaurant = formattedItems.find((item) => item.value === params.restaurantId);

    const  [open, setOpen] = useState(false);

    const onRestaurantSelect = (restaurant: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/${restaurant.value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a restaurant"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <Store className="mr-2 h-4 w-4" />
                    { currentRestaurant?.label }
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search restaurant..."/>
                        <CommandEmpty>No restaurant found.</CommandEmpty>
                        <CommandGroup heading="Restaurants">
                            {formattedItems.map((restaurant) => (
                                <CommandItem key={restaurant.value} onSelect={() => onRestaurantSelect(restaurant)} className="text-sm">
                                    <Store className="mr-2 h-4 w-4"/>
                                    {restaurant.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentRestaurant?.value === restaurant.value ? "opacity-100" : "opacity-0")}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(false);
                                restaurantModal.onOpen();
                            }}>
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Create restaurant
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>

            </PopoverContent>
        </Popover>
    )
}