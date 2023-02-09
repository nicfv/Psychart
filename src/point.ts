/**
 * Represents an `(x,y)` cartesian coordinate pair.
 */
export class Point {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toString(): string {
        return this.x + ',' + this.y;
    }
}