export interface Doc {
    name?: string;
    description?: string;
    version?: string;
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

export interface Package {
    name?: string;
    description?: string;
    version?: string;
    exports?: string;
}

export interface Param {
    name?: string;
    description: string;
    types: string[];
}
