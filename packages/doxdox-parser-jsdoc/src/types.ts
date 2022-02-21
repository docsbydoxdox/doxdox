export interface Jsdoc {
    meta: JsdocMeta;
    kind: string;
    name: string;
    description: string;
    tags?: JsdocTag[];
    params: JsdocParam[];
    returns: JsdocParam[];
    access: string;
    undocumented?: boolean;
}

export interface JsdocMeta {
    filename: string;
    path: string;
}

export interface JsdocTag {
    title: string;
    value: string;
}

export interface JsdocParam {
    name?: string;
    description: string;
    type?: {
        names: string[];
    };
}
