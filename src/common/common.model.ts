export class Identity {
    constructor(
        readonly tenantId: string,
        readonly userId: string,
        readonly roles: string[],
    ) {}

    hasTenant(tenantId: string): boolean {
        return this.tenantId === tenantId;
    }

    hasUser(userId: string): boolean {
        return this.userId === userId;
    }
}

export type Pagable = { limit: number; offset: number };

export function pagable(limit?: number, offset?: number): Pagable {
    return {
        limit: Math.min(100, Math.max(1, limit ?? 20)),
        offset: Math.max(0, offset ?? 0),
    };
}

export class Page<T> {
    constructor(
        readonly data: T[],
        readonly paging: {
            readonly limit: number;
            readonly offset: number;
            readonly total: number;
        },
    ) {}

    map<R>(mapper: (T: any) => R): Page<R> {
        return new Page(this.data.map(mapper), this.paging);
    }
}
