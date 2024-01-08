"use client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { BillboardColumn, columns } from "./columns"

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboard (${ data.length })`}
                    description="Manage restaurant billboards" 
                />
                <Button onClick={()=> router.push(`/${params.restaurantId}/billboards/new`)}>
                    <Plus />
                    Add Now
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label"/>
            <Heading title="API" description="API calls for Billboard"/>
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}