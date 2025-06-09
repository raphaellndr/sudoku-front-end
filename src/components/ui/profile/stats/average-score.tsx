import StatCard from "./stats-card";

interface AverageScoreProps {
    value: number;
    evolution?: number | null;
    evolutionPercentage?: number | null;
};

const AverageScore: React.FC<AverageScoreProps> = ({
    value,
    evolution,
    evolutionPercentage,
}) => {
    const statHasIncreased = evolution !== undefined && evolution !== null ? evolution >= 0 : false;

    return (
        <StatCard
            label="Average Score Per game"
            statValue={value}
            statHasIncreased={statHasIncreased}
            percentageChange={evolutionPercentage || 0}
            helpText="since last month"
        />
    );
};

export default AverageScore;
