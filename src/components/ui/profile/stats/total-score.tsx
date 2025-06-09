import StatCard from "./stats-card";

interface TotalScoreProps {
    value: number;
};

const TotalScore: React.FC<TotalScoreProps> = ({
    value,
}) => {
    return (
        <StatCard
            label="Total Score"
            statValue={value}
            statHasIncreased={true}
            percentageChange={15}
            helpText="all time total"
        />
    );
};

export default TotalScore;
