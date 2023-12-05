import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import RestaurantSwitcher from "@/components/restaurant-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
    const {userId } = auth();

    if (!userId) {
        redirect("sign-in");
    }

    const restaurants = await prismadb.restaurant.findMany({
        where: {
            userId,
        }
    })
    return (  
        <div className="border -b">
            <div className="flex h-16 items-center px-4">
                <RestaurantSwitcher items={restaurants}/>
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    );
}
 
export default Navbar;