import { signIn, signOut, useSession } from "next-auth/react";

import {
    Box,
    Flex,
    Text,
    Button,
    HStack,
} from "@chakra-ui/react";

import { ColorModeButton } from "../../color-mode";
import CustomDrawer from "../header/custom-drawer";
import HeaderButton from "./header-button";

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
                                <Button variant="ghost" fontSize="md">
                                    Play
                                </Button>
                                <HeaderButton buttonText="Solve" routerHref="/solve" />
                                <Button variant="ghost" fontSize="md">
                                    About
                                </Button>
                                {session && (
                                    <Button variant="ghost" fontSize="md">
                                        Profile
                                    </Button>
                                )}
                            </HStack>
                        </Flex>
                    </HStack>

                    <HStack>
                        <ColorModeButton />

                        {session ? (
                            <Button
                                variant="outline"
                                colorScheme="teal"
                                display={{ base: "none", md: "inline-flex" }}
                                onClick={() => signOut()}
                            >
                                Sign out
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                colorScheme="teal"
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