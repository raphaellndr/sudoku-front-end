import { FaTrophy } from "react-icons/fa";

import TooltipIconButton from "@/components/ui/tooltip-icon-button";

interface LeaderboardButtonProps {
    onClick?: () => void;
};

const LeaderboardButton = ({ onClick }: LeaderboardButtonProps) => {
    return (
        <TooltipIconButton
            tooltipText={"Open leaderboard"}
            rightIcon={<FaTrophy />}
            variant="ghost"
            onClick={onClick}
        />
    );
};

export default LeaderboardButton;
