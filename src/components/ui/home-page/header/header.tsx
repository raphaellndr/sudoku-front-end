import { signIn, signOut, useSession } from "next-auth/react";
import {
    Box,
    Flex,
    Text,
    Button,
    HStack,
    IconButton,
} from "@chakra-ui/react";
import { IoMdExit } from "react-icons/io";

import { ColorModeButton } from "../../color-mode";
import CustomDrawer from "../header/custom-drawer";
import HeaderButton from "./header-button";
import { Tooltip } from "../../tooltip";
import { TooltipIconButton } from "../../tooltip-icon-button";

const Header: React.FC = () => {
    const { data: session } = useSession();

    return (
        <Flex align="center">
            <Box
                minH="60px"
                py={{ base: 2 }}
                px={{ base: 4 }}
                width="100%"
            >
                <Flex justify="space-between" align="center" width="100%">
                    <HStack>
                        <Text
                            fontSize="2xl"
                            textAlign={{ base: "center", md: "left" }}
                            fontWeight={"bold"}
                        >
                            SudokuSolver
                        </Text>

                        <Flex display={{ base: "none", md: "flex" }} ml={4}>
                            <HStack>
                                <HeaderButton buttonText="Play" routerHref="/play" />
                                <HeaderButton buttonText="Solver" routerHref="/solver" />
                                <HeaderButton buttonText="About" routerHref="/about" />
                                {session && (
                                    <HeaderButton buttonText="Profile" routerHref="/profile" />
                                )}
                            </HStack>
                        </Flex>
                    </HStack>

                    <HStack>
                        <ColorModeButton />

                        {session ? (
                            <TooltipIconButton
                                icon={<IoMdExit />}
                                tooltipText="Sign out"
                                variant="ghost"
                                display={{ base: "none", md: "inline-flex" }}
                                onClick={() => signOut()}
                            />
                        ) : (
                            <Button
                                variant="outline"
                                display={{ base: "none", md: "inline-flex" }}
                                onClick={() => signIn(undefined, { callbackUrl: "/" })}
                            >
                                Sign in
                            </Button>
                        )}

                        <CustomDrawer />
                    </HStack>
                </Flex>
            </Box>
        </Flex>
    );
};

export default Header;