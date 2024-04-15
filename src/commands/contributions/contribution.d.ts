export interface Options {
    all?: boolean;
    name?: string;
    today?: boolean;
    week?: boolean;
    month?: boolean;
    count: number;
}

export interface ContributionGraphQLResponse {
    data: {
        user: UserData;
    };
}

export interface UserData {
    contributionsCollection: ContributionsCollection;
}

export interface ContributionsCollection {
    contributionCalendar: ContributionCalendar;
}

export interface ContributionCalendar {
    totalContributions: number;
    weeks: Week[];
}

export interface Week {
    contributionDays: ContributionDay[];
}

export interface ContributionDay {
    contributionCount: number;
    date: string;
}