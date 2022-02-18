export interface Options {
    name?: string;
    description?: string;
    version?: string;
    homepage?: string;
}

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
    description: string;
    params: Param[];
    returns: Param[];
    private: boolean;
}

export interface Package extends Options {
    exports?: string;
}

export interface Param {
    name?: string;
    description: string;
    types: string[];
}
