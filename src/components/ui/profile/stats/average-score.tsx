import StatCard from "./stats-card";

const AverageScore = () => {
    return (
        <StatCard
            label="Average Score Per game"
            statValue={645}
            statHasIncreased={true}
            percentageChange={3}
            helpText="since last month"
        />
    );
};

export default AverageScore;
