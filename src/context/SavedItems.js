"use client"

import React, {useState, createContext, useEffect} from "react";

export const SavedItemsContext = createContext();

export const SavedItemsProvider = ({children}) =>{
    const [savedItems, setSavedItems] = useState([]);

    useEffect(()=>{
        const saved = JSON.parse(localStorage.getItem('savedItems')) || [];
        setSavedItems(saved);
    },[]);


    const toggleSaveItem = (item) =>{
        let updatedSavedItems;

        if(savedItems.includes(item._id)){
            updatedSavedItems = savedItems.filter((id)=> id !== item._id);
        }
        else{
            updatedSavedItems = [...savedItems, item._id];
        }
        setSavedItems(updatedSavedItems);
        localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
    }

    return(
        <SavedItemsContext.Provider value ={{savedItems, toggleSaveItem}}>
            {children}
        </SavedItemsContext.Provider>
    )



}
