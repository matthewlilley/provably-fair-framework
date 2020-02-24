export interface Distribution {
    index: number;
    start: number;
    end: number;
    byte: string;
    integer: number;
    float: number;
}
export declare function distribute(hash: string): Distribution[];
