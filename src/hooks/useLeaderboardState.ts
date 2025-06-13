import { useState } from "react";

export const useLeaderboardState = () => {
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

    return { isLeaderboardOpen, setIsLeaderboardOpen };
};
