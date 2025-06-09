import { Accordion } from "@chakra-ui/react";

import StatsCharts from "./stats-charts";

const ChartsBody = () => {
    return (
        <Accordion.ItemBody>
            <StatsCharts />
        </Accordion.ItemBody>
    );
};

export default ChartsBody;
