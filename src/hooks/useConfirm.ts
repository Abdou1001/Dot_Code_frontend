"use client";

import {useState, useCallback} from "react";

export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [targetId, setTargetId] = useState<string | null>(null);

    const promptConfirm = useCallback((id: string) => {
        setTargetId(id);
        setIsOpen(true);
    }, []);

    const closeConfirm = useCallback(() => {
        setIsOpen(false);
        setTargetId(null);
    }, []);

    return {
        isOpen,
        setIsOpen,
        targetId,
        promptConfirm,
        closeConfirm,
    };
}
