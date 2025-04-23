import { HStack, Separator, Text } from "@chakra-ui/react";

const OrSeparator = () => {
    return (
        <HStack>
            <Separator flex="1" />
            <Text flexShrink="0" fontSize="sm">OR</Text>
            <Separator flex="1" />
        </HStack>
    );
};

export default OrSeparator;