export interface Jsdoc {
    kind: string;
    name: string;
    description: string;
    tags?: JsdocTag[];
    params: JsdocParam[];
    returns: JsdocParam[];
    access: string;
    undocumented?: boolean;
}

export interface JsdocTag {
    title: string;
    value: string;
}

export interface JsdocParam {
    name?: string;
    description: string;
    type: {
        names: string[];
    };
}
