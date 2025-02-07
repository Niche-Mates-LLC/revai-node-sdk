"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const stream_1 = require("stream");
const websocket_1 = require("websocket");
const BufferedDuplex_1 = require("./models/streaming/BufferedDuplex");
// tslint:disable-next-line
const sdkVersion = require('../package.json').version;
/**
 * Client which handles a streaming connection to the Rev.ai API.
 * @event httpResponse emitted when the client fails to start a websocket connection and
 *      receives an http response. Event contains the http status code of the response.
 * @event connectFailed emitted when the client fails to begin a websocket connection and
 *      received a websocket error. Event contains the received error.
 * @event connect emitted when the client receives a connected message from the API. Contains
 *      the StreamingConnected returned from the API.
 * @event close emitted when the connection is properly closed by the server. Contains the
 *      close code and reason.
 * @event error emitted when an error occurs in the connection to the server. Contains the
 *      thrown error.
 */
class RevAiStreamingClient extends events_1.EventEmitter {
    /**
     * @param accessToken Access token associated with the user's account
     * @param config Configuration of the audio the user will send from this client
     * @param version (optional) Version of the Rev.ai API the user wants to use
     */
    constructor(accessToken, config, version = 'v1') {
        super();
        this.streamsClosed = false;
        this.accessToken = accessToken;
        this.config = config;
        this.baseUrl = `wss://api.rev.ai/speechtotext/${version}/stream`;
        this.requests = new stream_1.PassThrough();
        this.responses = new stream_1.PassThrough({ objectMode: true });
        this.client = new websocket_1.client({ keepalive: true, keepaliveInterval: 30000 });
        this.setUpHttpResponseHandler();
        this.setUpConnectionFailureHandler();
        this.setUpConnectedHandlers();
    }
    /**
     * Begins a streaming connection. Returns a duplex
     * from which the user can read responses from the api and to which the user
     * should write their audio data
     * @param config (Optional) Optional configuration for the streaming session
     *
     * @returns BufferedDuplex. Data written to this buffer will be sent to the api
     * Data received from the api can be read from this duplex
     */
    start(config) {
        let url = this.baseUrl +
            `?access_token=${this.accessToken}` +
            `&content_type=${this.config.getContentTypeString()}` +
            `&user_agent=${encodeURIComponent(`RevAi-NodeSDK/${sdkVersion}`)}`;
        if (config) {
            if (config.metadata) {
                url += `&metadata=${encodeURIComponent(config.metadata)}`;
            }
            if (config.customVocabularyID) {
                url += `&custom_vocabulary_id=${encodeURIComponent(config.customVocabularyID)}`;
            }
            if (config.filterProfanity) {
                url += `&filter_profanity=true`;
            }
            if (config.removeDisfluencies) {
                url += `&remove_disfluencies=true`;
            }
            if (config.deleteAfterSeconds !== null && config.deleteAfterSeconds !== undefined) {
                url += `&delete_after_seconds=${encodeURIComponent(config.deleteAfterSeconds.toString())}`;
            }
        }
        this.client.connect(url);
        return new BufferedDuplex_1.BufferedDuplex(this.requests, this.responses, { readableObjectMode: true });
    }
    /**
     * Signals to the api that you have finished sending data.
     */
    end() {
        this.requests.emit('ending');
        this.requests.end('EOS', 'utf8');
    }
    /**
     * Immediately kills the streaming connection, no more results will be returned from the API
     * after this is called.
     */
    unsafeEnd() {
        this.client.abort();
        this.closeStreams();
    }
    setUpHttpResponseHandler() {
        this.client.on('httpResponse', (response) => {
            this.emit('httpResponse', response.statusCode);
            this.closeStreams();
        });
    }
    setUpConnectionFailureHandler() {
        this.client.on('connectFailed', (error) => {
            this.emit('connectFailed', error);
            this.closeStreams();
        });
    }
    setUpConnectedHandlers() {
        this.client.on('connect', (connection) => {
            connection.on('error', (error) => {
                this.emit('error', error);
                this.closeStreams();
            });
            connection.on('close', (code, reason) => {
                this.emit('close', code, reason);
                this.closeStreams();
            });
            connection.on('message', (message) => {
                if (this.streamsClosed) {
                    return;
                }
                if (message.type === 'utf8') {
                    let response = JSON.parse(message.utf8Data);
                    if (response.type === 'connected') {
                        this.emit('connect', response);
                    }
                    else if (this.responses.writable) {
                        this.responses.write(response);
                    }
                }
            });
            this.doSendLoop(connection, this.requests);
        });
    }
    doSendLoop(connection, buffer) {
        if (connection.connected) {
            let value = buffer.read(buffer.readableLength);
            if (value !== null) {
                connection.send(value);
                if (value.includes('EOS') || value.includes(Buffer.from('EOS'))) {
                    connection.sendUTF('EOS');
                }
            }
            setTimeout(() => this.doSendLoop(connection, buffer), 100);
        }
    }
    closeStreams() {
        if (this.streamsClosed === false) {
            this.streamsClosed = true;
            this.requests.emit('ending');
            this.requests.end();
            this.responses.push(null);
        }
    }
}
exports.RevAiStreamingClient = RevAiStreamingClient;
//# sourceMappingURL=streaming-client.js.map