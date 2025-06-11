import StatCard from "./stats-card";

interface GamesPlayedProps {
    value: number;
    evolution?: number | null;
    evolutionPercentage?: number | null;
    helpText: string;
};

const GamesPlayed: React.FC<GamesPlayedProps> = ({
    value,
    evolution,
    evolutionPercentage,
    helpText,
}) => {
    const statHasIncreased = evolution !== undefined && evolution !== null ? evolution >= 0 : false;

    return (
        <StatCard
            label="Games played"
            statValue={value}
            statHasIncreased={statHasIncreased}
            percentageChange={evolutionPercentage || 0}
            helpText={helpText}
        />
    );
};

export default GamesPlayed;
