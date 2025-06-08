import { useRouter } from "next/navigation";

import { signOut, useSession } from "next-auth/react";
import { CloseButton, Drawer, IconButton, Portal, VStack } from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";

import DrawerButton from "./drawer-button";

const CustomDrawer = () => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <Drawer.Root>
            <Drawer.Trigger asChild display={{ base: "inline-flex", md: "none" }}>
                <IconButton variant="ghost" size="md">
                    <RxHamburgerMenu />
                </IconButton>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner padding="1">
                    <Drawer.Content rounded="sm">
                        <Drawer.Body>
                            <VStack mt="10">
                                <DrawerButton buttonText="Play" routerHref="/play" />
                                <DrawerButton buttonText="Solver" routerHref="/solver" />
                                <DrawerButton buttonText="About" routerHref="/about" />
                                {session && (
                                    <DrawerButton buttonText="Profile" routerHref="/profile" />
                                )}
                                {session ? (
                                    <DrawerButton buttonText="Sign out" onClick={() => signOut()} />
                                ) : (
                                    <DrawerButton buttonText="Sign in" onClick={() => router.push("/auth/signin")} />
                                )}
                            </VStack>
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root >
    );
};

export default CustomDrawer;