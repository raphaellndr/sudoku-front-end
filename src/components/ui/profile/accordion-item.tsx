import { Accordion, Icon, Span } from "@chakra-ui/react";

interface AccordionItemProps {
    value: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
};

const AccordionItem: React.FC<AccordionItemProps> = ({
    value,
    title,
    icon,
    content
}) => {
    return (
        <Accordion.Item value={value}>
            <Accordion.ItemTrigger>
                <Icon fontSize="lg" color="fg.subtle">
                    {icon}
                </Icon>
                <Span flex="1">{title}</Span>
                <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                {content}
            </Accordion.ItemContent>
        </Accordion.Item>
    );
};

export default AccordionItem;
