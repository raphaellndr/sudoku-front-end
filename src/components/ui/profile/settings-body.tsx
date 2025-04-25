import { Accordion, Button, Field, Group, Input, Stack } from "@chakra-ui/react";

const SettingsBody = () => {
    return (
        <Accordion.ItemBody>
            <Stack gap="4" align="stretch" maxW="sm">
                <Field.Root>
                    <Field.Label>Username</Field.Label>
                    <Group attached w="full" maxW="sm">
                        <Input flex="1" placeholder="New username" />
                        <Button bg="bg.subtle" variant="outline">
                            Submit
                        </Button>
                    </Group>
                </Field.Root>
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Group attached w="full" maxW="sm">
                        <Input flex="1" placeholder="New email" />
                        <Button bg="bg.subtle" variant="outline">
                            Submit
                        </Button>
                    </Group>
                </Field.Root>
            </Stack>
        </Accordion.ItemBody>
    );
};

export default SettingsBody;