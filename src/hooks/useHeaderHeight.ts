import { useRef, useState, useEffect } from "react";

export const useHeaderHeight = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            const height = headerRef.current.getBoundingClientRect().height;
            setHeaderHeight(height);
        }
    }, []);

    return { headerRef, headerHeight };
};
