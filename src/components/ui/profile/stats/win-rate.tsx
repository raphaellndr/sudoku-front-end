import StatCard from "./stats-card";

interface WinRateProps {
    value: number;
    evolution?: number | null;
    evolutionPercentage?: number | null;
    helpText: string;
};

const WinRate: React.FC<WinRateProps> = ({
    value,
    evolution,
    evolutionPercentage,
    helpText,
}) => {
    const statHasIncreased = evolution !== undefined && evolution !== null ? evolution >= 0 : false;

    return (
        <StatCard
            label="Win rate"
            statValue={value}
            numberStyle="percent"
            statHasIncreased={statHasIncreased}
            percentageChange={evolutionPercentage || 0}
            helpText={helpText}
        />
    );
};

export default WinRate;
