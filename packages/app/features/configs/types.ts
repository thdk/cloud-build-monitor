export enum ConfigSection {
    General = 0,
    Github = 1,
    Jira = 2,
}

export interface Config {
    value: string | number;
    id: string;
    name: string;
    description?: string;
    section: ConfigSection;
}