import { useState, useEffect} from "react";

/** hucky */
export const useOrigin = () => {
    const [mounted, setMounted] = useState(false); 
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    useEffect(() => {
        setMounted(true);
    },[]);

    if (!mounted) return null;

    return origin;  
}