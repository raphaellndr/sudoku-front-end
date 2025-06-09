import StatCard from "./stats-card";

const TotalScore = () => {
    return (
        <StatCard
            label="Total Score"
            statValue={3425}
            statHasIncreased={true}
            percentageChange={15}
            helpText="all time total"
        />
    );
};

export default TotalScore;
