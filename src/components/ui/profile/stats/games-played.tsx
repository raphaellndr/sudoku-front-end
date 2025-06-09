import StatCard from "./stats-card";

interface GamesPlayedProps {
    value: number;
};

const GamesPlayed: React.FC<GamesPlayedProps> = ({
    value,
}) => {
    return (
        <StatCard
            label="Games played"
            statValue={value}
            statHasIncreased={false}
            percentageChange={45}
            helpText="since last month"
        />
    );
};

export default GamesPlayed;
