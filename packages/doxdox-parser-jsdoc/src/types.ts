export interface Jsdoc {
    kind: string;
    name: string;
    description: string;
    params: JsdocParam[];
    returns: JsdocParam[];
    access: string;
    undocumented?: boolean;
}

export interface JsdocParam {
    name?: string;
    description: string;
    type: {
        names: string[];
    };
}
