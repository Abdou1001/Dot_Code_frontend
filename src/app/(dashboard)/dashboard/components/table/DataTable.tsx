"use client";

import React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {DataTableSkeleton} from "./DataTableSkeleton";
import {DataTablePagination} from "./DataTablePagination";
import {DataTableEmptyState} from "./DataTableEmptyState";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    isFetching?: boolean;

    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };

    onPageChange?: (page: number) => void;
    emptyTitle?: string;
    emptyDescription?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading = false,
    isFetching = false,
    pagination,
    onPageChange,
    emptyTitle,
    emptyDescription,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Only render full skeleton when we have no data at all yet
    if (isLoading && (!data || data.length === 0)) {
        return <DataTableSkeleton />;
    }

    const hasRows = table.getRowModel().rows.length > 0;

    return (
        <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b1437]/50 backdrop-blur-md shadow-lg transition-all">
                {/* Subtle top loading bar when refetching/paginating in background */}
                {isFetching && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 animate-pulse z-10" />
                )}

                <div className={isFetching ? "opacity-75 transition-opacity" : "transition-opacity"}>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="text-right">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {hasRows ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-48 text-center p-0">
                                        <DataTableEmptyState
                                            title={emptyTitle}
                                            description={emptyDescription}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {pagination && onPageChange && pagination.totalPages > 1 && (
                <DataTablePagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalResults={pagination.totalResults}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

export default React.memo(DataTable) as typeof DataTable;
