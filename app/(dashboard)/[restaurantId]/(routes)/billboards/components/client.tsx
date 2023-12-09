"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export const BillboardClient = () => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Billboard (0)"
                    description="Manage restaurant billboards" 
                />
                <Button onClick={()=> router.push(`/${params.restaurantId}/billboards/new`)}>
                    <Plus />
                    Add Now
                </Button>
            </div>
            <Separator />
        </>
    )
}