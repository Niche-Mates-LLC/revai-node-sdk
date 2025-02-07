"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
/**
 * Represents a two way buffered stream. Extends Duplex which implements both Readable and Writable
 */
class BufferedDuplex extends stream_1.Duplex {
    /**
     * @param input Buffer for the Writable side of the stream.
     * @param output Buffer for the Readable side of the stream.
     * @param options Options to be passed through to the superclass.
     */
    constructor(input, output, options) {
        super(options);
        this.input = input;
        this.output = output;
        this.setupInput();
        this.setupOutput();
    }
    _write(chunk, encoding, callback) {
        const needsDrain = this.input.write(chunk, encoding, () => needsDrain && callback());
        if (!needsDrain) {
            this.input.once('drain', callback);
        }
        return needsDrain;
    }
    _read(size) {
        const chunk = this.output.read(size);
        if (chunk !== null) {
            this.push(chunk);
        }
        else {
            this.output.once('readable', s => this._read(s));
        }
    }
    setupInput() {
        this.once('finish', () => this.input.end());
        this.input.on('ending', () => this.writable = false);
        this.input.on('finish', () => this.end());
        this.input.on('error', error => this.emit('error', error));
    }
    setupOutput() {
        this.output.pause();
        this.output.on('end', () => this.push(null));
        this.output.on('error', error => this.emit('error', error));
    }
}
exports.BufferedDuplex = BufferedDuplex;
//# sourceMappingURL=BufferedDuplex.js.map