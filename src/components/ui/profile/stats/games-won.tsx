import StatCard from "./stats-card";

interface GamesWonProps {
    value: number;
};

const GamesWon: React.FC<GamesWonProps> = ({
    value,
}) => {
    return (
        <StatCard
            label="Games Won"
            statValue={value}
            statHasIncreased={true}
            percentageChange={12}
            helpText="since last month"
        />
    );
};

export default GamesWon;
