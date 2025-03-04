"use client"

import {
    Box,
    Flex,
    Avatar,
    Text,
    HStack,
    VStack,
} from '@chakra-ui/react'
import { ColorModeButton, useColorModeValue } from '../color-mode'
import { MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuSeparator, MenuTrigger } from '../menu'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function AppBar() {
    const { data: session, status } = useSession()
    const [username, setUsername] = useState(session ? session.user.username : "Unknown Person");
    const [logButtonText, setLogButtonText] = useState(session ? "Log out" : "Log in");
    const boxBgColor = useColorModeValue('gray.200', 'gray.900');
    const router = useRouter();

    const handleProfileButton = () => {
        router.push("profile/")
    }

    const handleLogInOutButton = () => {
        if (session) {
            signOut();
        } else {
            router.push("registration/")
        }
    };

    return (
        <Box bgColor={boxBgColor} px={4}>
            <Flex h={16} align="center" justify="space-between">
                <Box>SudokuSolver</Box>
                <HStack gap="4">
                    <ColorModeButton />
                    <MenuRoot>
                        <MenuTrigger asChild>
                            <Box as="button" borderRadius="full">
                                <Avatar.Root>
                                    <Avatar.Fallback name={username} />
                                </Avatar.Root>
                            </Box>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItemGroup>
                                <VStack>
                                    <Avatar.Root size="2xl" alignContent="center">
                                        <Avatar.Fallback name={username} />
                                    </Avatar.Root>
                                    <Text>{username}</Text>
                                </VStack>
                            </MenuItemGroup>
                            <MenuSeparator />
                            <MenuItemGroup title="Account">
                                {(() => {
                                    if (session) {
                                        return <MenuItem textAlign="center" value="profile" onClick={handleProfileButton}>Profile</MenuItem>
                                    }
                                })()}
                                <MenuItem textAlign="center" value="logout" onClick={handleLogInOutButton}>{logButtonText}</MenuItem>
                            </MenuItemGroup>
                        </MenuContent>
                    </MenuRoot>
                </HStack>
            </Flex>
        </Box>
    );
}
