import StatCard from "./stats-card";

interface TotalScoreProps {
    value: number;
    evolution?: number | null;
    evolutionPercentage?: number | null;
};

const TotalScore: React.FC<TotalScoreProps> = ({
    value,
    evolution,
    evolutionPercentage,
}) => {
    const statHasIncreased = evolution !== undefined && evolution !== null ? evolution >= 0 : false;

    return (
        <StatCard
            label="Total Score"
            statValue={value}
            statHasIncreased={statHasIncreased}
            percentageChange={evolutionPercentage || 0}
            helpText="since last month"
        />
    );
};

export default TotalScore;
