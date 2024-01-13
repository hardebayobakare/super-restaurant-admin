"use client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { CategoryColumn, columns } from "./columns"

interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${ data.length })`}
                    description="Manage restaurant categories" 
                />
                <Button onClick={()=> router.push(`/${params.restaurantId}/categories/new`)}>
                    <Plus />
                    Add Now
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Heading title="API" description="API calls for Category"/>
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    )
}