import { IconButton, Menu, Portal, Text } from "@chakra-ui/react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const GithubMenu = () => {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <IconButton
                    asChild
                    variant="ghost"
                    _hover={{ backgroundColor: "transparent" }}
                    _expanded={{ backgroundColor: "transparent" }}
                >
                    <div>
                        <FaGithub size="24" />
                        <Text display={{ base: "none", md: "flex" }}>Source code</Text>
                    </div>
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {repoLinks.map((link) => (
                            <Menu.Item key={link.value} asChild value={link.value}>
                                <a href={link.href} target="_blank" rel="noreferrer">
                                    {link.label}
                                    <Menu.ItemCommand><FaExternalLinkAlt /></Menu.ItemCommand>
                                </a>
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

const repoLinks = [
    {
        value: "frontend",
        href: "https://github.com/raphaellndr/sudoku-front-end",
        label: "Frontend",
    },
    {
        value: "backend",
        href: "https://github.com/raphaellndr/SudokuAPI",
        label: "Backend",
    },
    {
        value: "resolution",
        href: "https://github.com/raphaellndr/sudoku-resolver",
        label: "Computation logic",
    },

]

export default GithubMenu;