import {TablePageSkeleton} from "./TablePageSkeleton";

export function TechnologiesSkeleton() {
    return (
        <TablePageSkeleton
            titleWidth="w-52"
            subtitleWidth="w-80"
            hasActionBtn={true}
            columnsCount={4}
            rowsCount={6}
        />
    );
}
