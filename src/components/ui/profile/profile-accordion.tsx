import { Accordion, Icon } from "@chakra-ui/react";
import { ImStatsDots } from "react-icons/im";
import { LuSettings } from "react-icons/lu";

import SettingsBody from "./settings-body";
import StatsBody from "./stats-body";

const ProfileAccordion = () => {
    return (
        <Accordion.Root multiple defaultValue={["stats"]}>
            <Accordion.Item value="stats">
                <Accordion.ItemTrigger>
                    <Icon fontSize="lg" color="fg.subtle">
                        <ImStatsDots />
                    </Icon>
                    Stats
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <StatsBody />
                </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="settings">
                <Accordion.ItemTrigger>
                    <Icon fontSize="lg" color="fg.subtle">
                        <LuSettings />
                    </Icon>
                    Settings
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <SettingsBody />
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    );
};

export default ProfileAccordion;