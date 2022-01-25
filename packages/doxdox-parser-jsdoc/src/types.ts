export interface Jsdoc {
    kind: string;
    name: string;
    description: string;
    params: JsdocParam[];
    returns: JsdocParam[];
    access: string;
}

export interface JsdocParam {
    name?: string;
    description: string;
    type: {
        names: string[];
    };
}
