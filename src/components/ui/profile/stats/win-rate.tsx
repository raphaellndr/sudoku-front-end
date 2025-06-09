import StatCard from "./stats-card";

interface WinRateProps {
    value: number;
};

const WinRate: React.FC<WinRateProps> = ({
    value,
}) => {
    return (
        <StatCard
            label="Win rate"
            statValue={value}
            numberStyle="percent"
            statHasIncreased={true}
            percentageChange={5}
            helpText="since last month"
        />
    );
};

export default WinRate;
