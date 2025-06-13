import { Accordion, Icon } from "@chakra-ui/react";
import { FaLightbulb } from "react-icons/fa";
import { MdOutlineRule } from "react-icons/md";

import RulesSection from "./rules-section";
import HowToPlayTimeline from "./how-to-play-timeline";

const HowToPlayAccordion = () => {
    return (
        <Accordion.Root
            collapsible
            multiple
            orientation="horizontal"
            variant="plain"
            defaultValue={["how-to-play"]}
        >
            <Accordion.Item value="how-to-play">
                <Accordion.ItemTrigger>
                    <Icon fontSize="lg">
                        <FaLightbulb />
                    </Icon>
                    How to play
                    <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody>
                        <HowToPlayTimeline />
                    </Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="classic-sudoku-rules">
                <Accordion.ItemTrigger>
                    <Icon fontSize="lg">
                        <MdOutlineRule />
                    </Icon>
                    Classic Sudoku rules
                    <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody>
                        <RulesSection />
                    </Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    );
};

export default HowToPlayAccordion;
