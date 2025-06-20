import { Accordion } from "@chakra-ui/react";
import { ImStatsDots } from "react-icons/im";
import { LuSettings } from "react-icons/lu";
import { IoMdStats } from "react-icons/io";
import { FaHistory } from "react-icons/fa";

import SettingsBody from "./settings-body";
import ChartsBody from "./charts/charts-body";
import StatsBody from "./stats/stats-body";
import GamesHistoryBody from "./games-history/games-history-body";
import AccordionItem from "./accordion-item";

const ProfileAccordion = () => {
    return (
        <Accordion.Root multiple collapsible defaultValue={["history"]}>
            <AccordionItem
                value="history"
                title="Games History"
                icon={<FaHistory />}
                content={<GamesHistoryBody />}
            />

            <AccordionItem
                value="stats"
                title="Stats"
                icon={<ImStatsDots />}
                content={<StatsBody />}
            />

            <AccordionItem
                value="charts"
                title="Charts"
                icon={<IoMdStats />}
                content={<ChartsBody />}
            />

            <AccordionItem
                value="settings"
                title="Settings"
                icon={<LuSettings />}
                content={<SettingsBody />}
            />
        </Accordion.Root>
    );
};

export default ProfileAccordion;
