"use client";

import React, {useMemo} from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
    page: number;
    totalPages: number;
    totalResults: number;
    onPageChange: (page: number) => void;
}

function DataTablePaginationComponent({
    page,
    totalPages,
    totalResults,
    onPageChange,
}: DataTablePaginationProps) {
    const pages = useMemo(() => {
        const result: (number | "...")[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                result.push(i);
            }
        } else {
            result.push(1);

            if (page > 3) {
                result.push("...");
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                result.push(i);
            }

            if (page < totalPages - 2) {
                result.push("...");
            }

            result.push(totalPages);
        }

        return result;
    }, [page, totalPages]);

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 md:flex-row">
            <p className="text-xs text-slate-400">
                إجمالي النتائج: <span className="font-semibold text-slate-200">{totalResults}</span>
            </p>

            <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) {
                                    onPageChange(page - 1);
                                }
                            }}
                            aria-disabled={page === 1}
                            className={
                                page === 1
                                    ? "pointer-events-none opacity-50"
                                    : "hover:bg-white/10 text-slate-200"
                            }
                        />
                    </PaginationItem>

                    {pages.map((item, index) => (
                        <PaginationItem key={index}>
                            {item === "..." ? (
                                <PaginationEllipsis className="text-slate-500" />
                            ) : (
                                <PaginationLink
                                    href="#"
                                    isActive={item === page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(item);
                                    }}
                                    className={
                                        item === page
                                            ? "bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(0,117,255,0.4)]"
                                            : "hover:bg-white/10 text-slate-300"
                                    }>
                                    {item}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages) {
                                    onPageChange(page + 1);
                                }
                            }}
                            aria-disabled={page === totalPages}
                            className={
                                page === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "hover:bg-white/10 text-slate-200"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export const DataTablePagination = React.memo(DataTablePaginationComponent);
export default DataTablePagination;
