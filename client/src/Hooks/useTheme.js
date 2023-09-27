import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { computeThemeColourAndImage } from "../Functions/computeThemeColourAndImage";

/**
 * Provides theming information using the user's favorite's list.
 * 
 * @returns Stateful theme colour and theme image references
 */
export const useTheme = () => {

    const { user } = useAuthContext();

    // Set white title fallback colour
    const [themeColour, setThemeColour] = useState("#FFFFFF");

    // Fall back image will be defined directly in the component
    // this will be used if this string is blank
    const [themeImage, setThemeImage] = useState("");


    // Update if the user state changes
    useEffect(() => {
        if (user) {
            computeThemeColourAndImage(user, setThemeColour, setThemeImage);
        }

    }, [user, themeColour, themeImage]);


    return { themeColour, themeImage };
};
