import { forwardRef } from "react";

import { Box } from "@chakra-ui/react";

import Header from "@/components/ui/header/header";

const PageHeader = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Box ref={ref} width="100%">
            <Header />
        </Box>
    );
});

PageHeader.displayName = "PageHeader";

export default PageHeader;
