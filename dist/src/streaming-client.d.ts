/// <reference types="node" />
import { EventEmitter } from 'events';
import { Duplex } from 'stream';
import { client } from 'websocket';
import { AudioConfig } from './models/streaming/AudioConfig';
import { SessionConfig } from './models/streaming/SessionConfig';
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
export declare class RevAiStreamingClient extends EventEmitter {
    baseUrl: string;
    client: client;
    private streamsClosed;
    private accessToken;
    private config;
    private requests;
    private responses;
    /**
     * @param accessToken Access token associated with the user's account
     * @param config Configuration of the audio the user will send from this client
     * @param version (optional) Version of the Rev.ai API the user wants to use
     */
    constructor(accessToken: string, config: AudioConfig, version?: string);
    /**
     * Begins a streaming connection. Returns a duplex
     * from which the user can read responses from the api and to which the user
     * should write their audio data
     * @param config (Optional) Optional configuration for the streaming session
     *
     * @returns BufferedDuplex. Data written to this buffer will be sent to the api
     * Data received from the api can be read from this duplex
     */
    start(config?: SessionConfig): Duplex;
    /**
     * Signals to the api that you have finished sending data.
     */
    end(): void;
    /**
     * Immediately kills the streaming connection, no more results will be returned from the API
     * after this is called.
     */
    unsafeEnd(): void;
    private setUpHttpResponseHandler;
    private setUpConnectionFailureHandler;
    private setUpConnectedHandlers;
    private doSendLoop;
    private closeStreams;
}
