import {TablePageSkeleton} from "./TablePageSkeleton";

export function TestimonialsSkeleton() {
    return (
        <TablePageSkeleton
            titleWidth="w-52"
            subtitleWidth="w-80"
            hasActionBtn={true}
            columnsCount={6}
            rowsCount={6}
        />
    );
}
