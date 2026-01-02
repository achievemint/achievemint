import {useEffect, useState} from "react";

export function useWindowSize() {
    const [width, setWidth] = useState<number | undefined>(undefined)

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return width
}