export class CommandInvalidError extends Error {
    constructor(object: any) {
        super(`Command invalid: ${JSON.stringify(object)}`);
        this.name = 'CommandInvalidError';
    }
}

export class OptimisticLockError extends Error {
    constructor(object: any) {
        super(
            `Object was modified by another transaction: ${JSON.stringify(object)}`,
        );
        this.name = 'OptimisticLockError';
    }
}
