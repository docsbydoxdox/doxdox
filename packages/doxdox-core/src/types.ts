export type Config = {
    [key in string]?: string | boolean;
};

export interface Doc extends Options {
    files: File[];
}

export interface File {
    path: string;
    methods: Method[];
}

export interface Method {
    slug: string;
    name: string;
    fullName: string;
    description: string | null;
    params: Param[];
    returns: Param[];
    private: boolean;
}

export interface Options extends Package {
    config?: Config;
}

export interface Package {
    exports?: string;
    name?: string;
    description?: string;
    version?: string;
    homepage?: string;
    doxdoxConfig?: Config;
}

export interface Param {
    name: string | null;
    description: string | null;
    types: string[];
}
