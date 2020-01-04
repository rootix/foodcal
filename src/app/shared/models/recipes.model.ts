export interface Recipe {
    _id?: string;
    name: string;
    url?: string;
    lastPreparation?: Date;
    note?: string;
    tags?: [];
    _ts?: number;
    deleted?: boolean;
}
