import { create } from "zustand";

interface useRestaurantModalRestaurant {
    isOpen: boolean;
    onOpen: () => void;
    onclose: () => void;

};

export const useRestaurantModal = create<useRestaurantModalRestaurant>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true}),
    onclose: () => set({ isOpen: false})
}));

