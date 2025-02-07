/// <reference types="node" />
import { Duplex, PassThrough } from 'stream';
/**
 * Represents a two way buffered stream. Extends Duplex which implements both Readable and Writable
 */
export declare class BufferedDuplex extends Duplex {
    input: PassThrough;
    output: PassThrough;
    /**
     * @param input Buffer for the Writable side of the stream.
     * @param output Buffer for the Readable side of the stream.
     * @param options Options to be passed through to the superclass.
     */
    constructor(input: PassThrough, output: PassThrough, options?: any);
    _write(chunk: any, encoding: string, callback: any): boolean;
    _read(size: number): any;
    private setupInput;
    private setupOutput;
}
