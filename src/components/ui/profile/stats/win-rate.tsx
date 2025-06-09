import StatCard from "./stats-card";

interface WinRateProps {
    value: number;
    evolution?: number | null;
    evolutionPercentage?: number | null;
};

const WinRate: React.FC<WinRateProps> = ({
    value,
    evolution,
    evolutionPercentage,
}) => {
    const statHasIncreased = evolution !== undefined && evolution !== null ? evolution >= 0 : false;

    return (
        <StatCard
            label="Win rate"
            statValue={value}
            numberStyle="percent"
            statHasIncreased={statHasIncreased}
            percentageChange={evolutionPercentage || 0}
            helpText="since last month"
        />
    );
};

export default WinRate;
