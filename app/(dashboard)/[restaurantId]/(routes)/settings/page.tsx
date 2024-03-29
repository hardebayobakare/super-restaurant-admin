import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";


interface SettingsPageProps {
    params: {
        restaurantId: string;
    }
}


const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const restaurant = await prismadb.restaurant.findFirst({
        where: {
            id: params.restaurantId,
            userId
        }
    });

    if (!restaurant) {
        redirect('/');
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={ restaurant }/>   
            </div>
        </div>
     );
}
 
export default SettingsPage;