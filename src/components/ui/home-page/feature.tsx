import React from "react";
import { Card, Heading, Text } from "@chakra-ui/react";

interface FeatureProps {
    title: string;
    description: string;
}

export const Feature: React.FC<FeatureProps> = ({ title, description }) => {
    return (
        <Card.Root
            _hover={{
                shadow: "lg",
                transform: "translateY(-5px)",
                transition: "all 0.2s ease-in-out",
            }}
        >
            <Card.Header>
                <Heading size="md">{title}</Heading>
            </Card.Header>
            <Card.Body>
                <Text>{description}</Text>
            </Card.Body>
        </Card.Root>
    );
};
