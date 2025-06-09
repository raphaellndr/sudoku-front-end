import StatCard from "./stats-card";

const GamesWon = () => {
    return (
        <StatCard
            label="Games Won"
            statValue={17}
            statHasIncreased={true}
            percentageChange={12}
            helpText="since last month"
        />
    );
};

export default GamesWon;
