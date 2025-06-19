import { Table, VStack, Text } from "@chakra-ui/react";

const ErrorRow = () => {
    return (
        <Table.Row>
            <Table.Cell colSpan={3} textAlign="center" py={8}>
                <VStack gap={2}>
                    <Text color="gray.500" fontSize="lg">No data available</Text>
                    <Text color="gray.400" fontSize="sm">Check back later for leaderboard updates</Text>
                </VStack>
            </Table.Cell>
        </Table.Row>
    );
};

export default ErrorRow
