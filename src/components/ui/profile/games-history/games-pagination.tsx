import {
    ButtonGroup,
    IconButton,
    Pagination,
    Flex
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface GamesPaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
};

const GamesPagination = ({
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    onPageChange,
    isLoading = false
}: GamesPaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <Flex justify="center" mt={6}>
            <Pagination.Root
                count={totalCount}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={e => onPageChange(e.page)}
            >
                <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                        <IconButton
                            disabled={currentPage === 1 || isLoading}
                            aria-label="Previous page"
                        >
                            <LuChevronLeft />
                        </IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.Items
                        render={(page) => (
                            <IconButton
                                variant={{ base: "ghost", _selected: "outline" }}
                                key={page.value}
                                disabled={isLoading}
                            >
                                {page.value}
                            </IconButton>
                        )}
                    />
                    <Pagination.NextTrigger asChild>
                        <IconButton
                            disabled={currentPage === totalPages || isLoading}
                            aria-label="Next page"
                        >
                            <LuChevronRight />
                        </IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
            </Pagination.Root>
        </Flex>
    );
};

export default GamesPagination;
