import {TablePageSkeleton} from "./TablePageSkeleton";

export function MessagesSkeleton() {
    return (
        <TablePageSkeleton
            titleWidth="w-52"
            subtitleWidth="w-80"
            hasActionBtn={false}
            columnsCount={5}
            rowsCount={6}
        />
    );
}
