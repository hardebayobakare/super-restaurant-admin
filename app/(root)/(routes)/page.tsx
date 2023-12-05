"use client"

import { useRestaurantModal } from "@/hooks/use-restaurant-modal";

import { useEffect } from "react";



const RootPage = () => {
  const onOpen = useRestaurantModal((state) => state.onOpen);
  const isOpen = useRestaurantModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen){
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
     
    </div>
  )
}

export default RootPage;
