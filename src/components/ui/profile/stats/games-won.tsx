import React from 'react';
import StatCard from "./stats-card";

interface GamesWonProps {
    value: number;
    evolution?: number | null;
    evolutionPercentage?: number | null;
}

const GamesWon: React.FC<GamesWonProps> = ({
    value,
    evolution,
    evolutionPercentage
}) => {
    const statHasIncreased = evolution !== undefined && evolution !== null ? evolution >= 0 : false;

    return (
        <StatCard
            label="Games Won"
            statValue={value}
            statHasIncreased={statHasIncreased}
            percentageChange={evolutionPercentage || 0}
            helpText="since last month"
        />
    );
};

export default GamesWon;
