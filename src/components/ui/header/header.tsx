import { useSession } from "next-auth/react";
import { Box, Flex, HStack } from "@chakra-ui/react";

import CustomDrawer from "./custom-drawer";
import SignOutButton from "./buttons/sign-out-button";
import HeaderButton from "./buttons/header-button";
import SignInButton from "./buttons/sign-in-button";
import { ColorModeButton } from "../color-mode";
import { SudokuArenaButton } from "../sudoku-arena-button";
import LeaderboardDialogButton from "./leaderboard/dialog/leaderboard-dialog";

const Header: React.FC = () => {
    const { data: session } = useSession();

    return (
        <Flex align="center">
            <Box
                minH="60px"
                py={{ base: 4 }}
                px={{ base: 10 }}
                width="100%"
            >
                <Flex justify="space-between" align="center" width="100%">
                    <HStack>
                        <SudokuArenaButton
                            textProps={{
                                fontSize: "2xl",
                                textAlign: { base: "center", md: "left" }
                            }}
                        />

                        <Flex display={{ base: "none", md: "flex" }} ml={10}>
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
                        <LeaderboardDialogButton />
                        <ColorModeButton />

                        {session ? (
                            <SignOutButton />
                        ) : (
                            <SignInButton />
                        )}

                        <CustomDrawer />
                    </HStack>
                </Flex>
            </Box>
        </Flex>
    );
};

export default Header;
