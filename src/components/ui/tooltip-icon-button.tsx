import { IconButton, IconButtonProps } from "@chakra-ui/react"

import { Tooltip } from "./tooltip"

interface TooltipIconButtonProps extends IconButtonProps {
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    buttonText?: string;
    tooltipText: string;
};

const TooltipIconButton: React.FC<TooltipIconButtonProps> = (
    { rightIcon, leftIcon, buttonText = "", tooltipText, ...props }
) => {
    return (
        <Tooltip content={tooltipText}>
            <IconButton {...props}>
                {leftIcon}
                {buttonText}
                {rightIcon}
            </IconButton>
        </Tooltip>
    );
};

export default TooltipIconButton;
