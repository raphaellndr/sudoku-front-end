export type DailyParams = {
    date: string;
};

export type WeeklyParams = {
    week: number;
    year: number;
};

export type MonthlyParams = {
    month: number;
    year: number;
};

export type YearlyParams = {
    year: number;
};

export type PreviousDateParams = DailyParams | WeeklyParams | MonthlyParams | YearlyParams;
