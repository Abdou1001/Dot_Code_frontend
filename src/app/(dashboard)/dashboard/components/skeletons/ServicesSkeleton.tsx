import {TablePageSkeleton} from "./TablePageSkeleton";

export function ServicesSkeleton() {
    return (
        <TablePageSkeleton
            titleWidth="w-48"
            subtitleWidth="w-72"
            hasActionBtn={true}
            columnsCount={4}
            rowsCount={5}
        />
    );
}
