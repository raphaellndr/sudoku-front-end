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
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AppBar() {
    const { data: session, status } = useSession()
    const [username, setUsername] = useState(session ? session.user.username : "Unknown Person");
    const boxBgColor = useColorModeValue('gray.200', 'gray.900');
    const router = useRouter();

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
                                        return (
                                            <>
                                                <MenuItem textAlign="center" value="profile" onClick={() => router.push("profile/")}>Profile</MenuItem>
                                                <MenuItem textAlign="center" value="logout" onClick={() => signOut()}>Log out</MenuItem>
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                <MenuItem textAlign="center" value="signup" onClick={() => router.push("registration/")}>Sign up</MenuItem>
                                                <MenuItem textAlign="center" value="login" onClick={() => signIn(undefined, { callbackUrl: '/' })}>Log in</MenuItem>
                                            </>
                                        )
                                    }
                                })()}
                            </MenuItemGroup>
                        </MenuContent>
                    </MenuRoot>
                </HStack>
            </Flex>
        </Box>
    );
}
