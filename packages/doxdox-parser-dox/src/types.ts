export interface Jsdoc {
    tags: JsdocTag[];
    description: {
        full: string;
        summary: string;
        body: string;
    };
    isPrivate: boolean;
    isConstructor: boolean;
    isClass: boolean;
    isEvent: boolean;
    ignore: boolean;
    line: number;
    codeStart: number;
    code: string;
    ctx: {
        type: string;
        constructor?: string;
        cons?: string;
        name: string;
        value?: string;
        string: string;
    };
}

export interface JsdocTag {
    name: string;
    description: string;
    type: 'param' | 'property' | 'example' | 'return' | 'returns';
    types: string[];
    optional: boolean;
}
