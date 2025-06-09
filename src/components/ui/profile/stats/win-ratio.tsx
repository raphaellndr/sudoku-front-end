import StatCard from "./stats-card";

const WinRatio = () => {
    return (
        <StatCard
            label="Win ratio"
            statValue={0.68}
            numberStyle="percent"
            statHasIncreased={true}
            percentageChange={5}
            helpText="since last month"
        />
    );
};

export default WinRatio;
