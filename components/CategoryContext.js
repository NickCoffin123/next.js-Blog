import {createContext, useState} from "react";

export const CategoryContext = createContext(null);

export function CategoryProvider({children}){
    const [categories, setCategories] = useState([
        'Tech',
        'Lifestyle',
        'College',
        'Travel',
        'Food',
        'Finance'
    ])

    const value = {
        categories,
        setCategories
    }

    return(
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    )

}