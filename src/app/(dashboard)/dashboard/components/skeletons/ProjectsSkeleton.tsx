import {TablePageSkeleton} from "./TablePageSkeleton";

export function ProjectsSkeleton() {
    return (
        <TablePageSkeleton
            titleWidth="w-56"
            subtitleWidth="w-96"
            hasActionBtn={true}
            columnsCount={6}
            rowsCount={7}
        />
    );
}
