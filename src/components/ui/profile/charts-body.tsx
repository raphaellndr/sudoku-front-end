import { Accordion } from "@chakra-ui/react";

import Charts from "./charts";

const ChartsBody = () => {
    return (
        <Accordion.ItemBody>
            <Charts />
        </Accordion.ItemBody>
    );
};

export default ChartsBody;
