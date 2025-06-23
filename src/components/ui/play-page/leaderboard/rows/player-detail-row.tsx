import { useState } from "react";

import { Table, HStack } from "@chakra-ui/react";

import { Leaderboard } from "@/types/leaderboard";

import PlayerAvatar from "./player-avatar"
import RankDisplay from "../rank-display";
import ScoreDisplay from "../score-display";
import PlayerDetailDialog from "../dialog/player-detail-dialog";

interface PlayerDetailRowProps {
    data: Leaderboard;
    position: number;
}

export const PlayerDetailRow: React.FC<PlayerDetailRowProps> = ({
    data,
    position,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = () => setIsDialogOpen(true);
    const handleDialogClose = () => setIsDialogOpen(false);

    return (
        <>
            <Table.Row
                key={data.user_id}
                onClick={handleRowClick}
            >
                <Table.Cell py={4}>
                    <HStack gap={3}>
                        <RankDisplay position={position} />
                    </HStack>
                </Table.Cell>
                <Table.Cell py={4}>
                    <PlayerAvatar
                        username={data.username}
                        totalGames={data.total_games}
                    />
                </Table.Cell>
                <Table.Cell textAlign="end" py={4}>
                    <ScoreDisplay
                        totalScore={data.total_score}
                        bestScore={data.best_score}
                    />
                </Table.Cell>
            </Table.Row>

            <PlayerDetailDialog
                data={data}
                position={position}
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
            />
        </>
    );
};

export default PlayerDetailRow;
