"use client"

import { useRestaurantModal } from "@/hooks/use-restaurant-modal"
import { Modal } from "@/components/ui/modal"

export const RestaurantModal = () => {
    const restaurantModal = useRestaurantModal();
    return (
        <Modal 
            title="Create Restaurant" 
            description="Add a New Restaurant"
            isOpen={restaurantModal.isOpen}
            onClose={restaurantModal.onclose}
            >
            Future Restaurant Form
        </Modal>
    );
};

