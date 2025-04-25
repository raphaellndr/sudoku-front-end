import { Accordion } from "@chakra-ui/react";

import StatsCharts from "./stats-charts";

const StatsBody = () => {
    return (
        <Accordion.ItemBody>
            <StatsCharts />
        </Accordion.ItemBody>
    );
};

export default StatsBody;