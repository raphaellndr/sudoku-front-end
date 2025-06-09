import StatCard from "./stats-card";

const GamesPlayed = () => {
    return (
        <StatCard
            label="Games played"
            statValue={7}
            statHasIncreased={false}
            percentageChange={45}
            helpText="since last month"
        />
    );
};

export default GamesPlayed;
