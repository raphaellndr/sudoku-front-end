import StatCard from "./stats-card";

interface AverageScoreProps {
    value: number;
};

const AverageScore: React.FC<AverageScoreProps> = ({
    value,
}) => {
    return (
        <StatCard
            label="Average Score Per game"
            statValue={value}
            statHasIncreased={true}
            percentageChange={3}
            helpText="since last month"
        />
    );
};

export default AverageScore;
