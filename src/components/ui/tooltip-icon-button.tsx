import { IconButton, IconButtonProps } from "@chakra-ui/react"

import { Tooltip } from "./tooltip"

interface TooltipIconButtonProps extends IconButtonProps {
    icon: React.ReactNode;
    buttonText?: string;
    isTextBeforeIcon?: boolean;
    tooltipText: string;
};

export const TooltipIconButton: React.FC<TooltipIconButtonProps> = (
    { icon, buttonText = "", isTextBeforeIcon = true, tooltipText, ...props }
) => {
    return (
        <Tooltip content={tooltipText}>
            <IconButton {...props}>
                {isTextBeforeIcon && buttonText}
                {icon}
                {!isTextBeforeIcon && buttonText}
            </IconButton>
        </Tooltip>
    )
}