"use client";

import {useEffect, useState} from "react";

/**
 * Custom hook to debounce any rapidly changing value (e.g., search queries).
 *
 * @param value The value to be debounced.
 * @param delay The debounce delay in milliseconds (default: 400ms).
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

