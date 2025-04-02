import { ButtonGroup, Center, IconButton, Pagination, Show } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface SudokuSolutionsPaginationProps {
    count: number;
    pageSize: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const SudokuSolutionsPagination: React.FC<SudokuSolutionsPaginationProps> = (
    { count, pageSize, page, setPage }
) => {
    return (
        <Center p={4}>
            <Show when={count > pageSize}>
                <Pagination.Root
                    count={count}
                    pageSize={pageSize}
                    page={page}
                    onPageChange={(e) => setPage(e.page)}
                >
                    <ButtonGroup variant="ghost" size="sm">
                        <Pagination.PrevTrigger asChild>
                            <IconButton>
                                <HiChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton>
                                <HiChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </Show>
        </Center>
    );
}

export default SudokuSolutionsPagination;