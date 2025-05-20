import React from "react";

import { Card, Heading, Text } from "@chakra-ui/react";

interface CustomCardProps {
    title: string;
    description: string;
    rootProps?: Card.RootProps;
    bodyProps?: Card.BodyProps;
}

const CustomCard: React.FC<CustomCardProps> = ({
    title, description, rootProps, bodyProps
}) => {
    return (
        <Card.Root
            {...rootProps}
        >
            <Card.Header>
                <Heading size="md">{title}</Heading>
            </Card.Header>
            <Card.Body {...bodyProps}>
                <Text>{description}</Text>
            </Card.Body>
        </Card.Root>
    );
};

export default CustomCard;
