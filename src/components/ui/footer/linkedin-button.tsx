import { IconButton, Text } from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";

const LinkedInButton = () => {
    return (
        <IconButton asChild variant="ghost"
            _hover={{
                backgroundColor: "transparent",
            }}>
            <a href="https://www.linkedin.com/in/rapha%C3%ABl-landur%C3%A9-16028a183/">
                <FaLinkedin size="24" />
                <Text display={{ base: "none", md: "flex" }}>LinkedIn profile</Text>
            </a>
        </IconButton>
    );
};

export default LinkedInButton;