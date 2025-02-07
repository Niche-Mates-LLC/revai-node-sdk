"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FormData = require("form-data");
const fs = require("fs");
const api_request_handler_1 = require("./api-request-handler");
const CaptionType_1 = require("./models/async/CaptionType");
/**
 * Client which handles connection to the rev.ai API.
 */
class RevAiApiClient {
    /**
     * @param accessToken Access token used to validate API requests
     * @param version (optional) version of the API to be used
     */
    constructor(accessToken, version = 'v1') {
        this.apiHandler = new api_request_handler_1.ApiRequestHandler(`https://api.rev.ai/speechtotext/${version}/`, accessToken);
    }
    /**
     * See https://www.rev.ai/docs#tag/Account
     * Get information associated with the account whose access token is used by this client
     * @returns Account object
     */
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiHandler.makeApiRequest('get', '/account', {}, 'json');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/GetJobById
     * Get information about a specific job
     * @param id Id of job whose details are to be retrieved
     * @returns Job details
     */
    getJobDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiHandler.makeApiRequest('get', `/jobs/${id}`, {}, 'json');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/GetListOfJobs
     * Get a list of transcription jobs submitted within the last week in reverse chronological order
     * (last submitted first) up to the provided limit number of jobs per call. Pagination is supported via passing
     * the last job id from previous call into starting_after.
     * @param limit (optional) maximum number of jobs to retrieve, default is 100
     * @param startingAfter (optional) returns only jobs created after the job with this id, exclusive
     * @returns List of job details
     */
    getListOfJobs(limit, startingAfter) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = [];
            if (limit) {
                params.push(`limit=${limit}`);
            }
            if (startingAfter) {
                params.push(`starting_after=${startingAfter}`);
            }
            const query = `?${params.join('&')}`;
            return yield this.apiHandler.makeApiRequest('get', `/jobs${params.length > 0 ? query : ''}`, {}, 'json');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/DeleteJobById
     * Delete a specific transcription job.
     * All data related to the job, such as input media and transcript, will be permanently deleted.
     * A job can only by deleted once it's completed.
     * @param id Id of job to be deleted
     */
    deleteJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiHandler.makeApiRequest('delete', `/jobs/${id}`, {}, 'text');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/SubmitTranscriptionJob
     * Submit media given a URL for transcription. The audio data is downloaded from the URL.
     * @param mediaUrl Web location of media to be downloaded and transcribed
     * @param options (optional) Options submitted with the job, see RevAiJobOptions object
     * @returns Details of the submitted job
     */
    submitJobUrl(mediaUrl, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options) {
                options = this.filterNullOptions(options);
                options.media_url = mediaUrl;
            }
            else {
                options = { 'media_url': mediaUrl };
            }
            return yield this.apiHandler.makeApiRequest('post', `/jobs`, { 'Content-Type': 'application/json' }, 'json', options);
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/SubmitTranscriptionJob
     * Submit audio data for transcription.
     * @param audioData Audio data to be transcribed.
     * @param filename (optional) Name of file associated with audio.
     * @param options (optional) Options submitted with the job, see RevAiJobOptions object
     *     or https://www.rev.ai/docs#operation/SubmitTranscriptionJob
     * @returns Details of submitted job
     */
    submitJobAudioData(audioData, filename, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = new FormData();
            payload.append('media', audioData, { filename: filename || 'audio_file' });
            if (options) {
                options = this.filterNullOptions(options);
                payload.append('options', JSON.stringify(options));
            }
            return yield this.apiHandler.makeApiRequest('post', `/jobs`, payload.getHeaders(), 'json', payload);
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/SubmitTranscriptionJob
     * Send local file for transcription.
     * @param filepath Path to local file to be transcribed. Assumes the process has access to read this file.
     * @param options (optional) Options submitted with the job, see RevAiJobOptions object
     *     or https://www.rev.ai/docs#operation/SubmitTranscriptionJob
     * @returns Details of submitted job
     */
    submitJobLocalFile(filepath, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = new FormData();
            payload.append('media', fs.createReadStream(filepath));
            if (options) {
                options = this.filterNullOptions(options);
                payload.append('options', JSON.stringify(options));
            }
            return yield this.apiHandler.makeApiRequest('post', `/jobs`, payload.getHeaders(), 'json', payload);
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/GetTranscriptById
     * Get transcript of a job as a javascript object, see the RevAiApiTranscript object.
     * @param id Id of job to retrieve the transcript of
     * @returns Transcript of job as a javascript object.
     */
    getTranscriptObject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiHandler.makeApiRequest('get', `/jobs/${id}/transcript`, { 'Accept': "application/vnd.rev.transcript.v1.0+json" /* JSON */ }, 'json');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/GetTranscriptById
     * Get transcript of a job as a stream of JSON.
     * Use for large transcripts or transcripts meant to be written directly to file.
     * @param id Id of job to retrieve transcript of
     * @returns ReadableStream containing JSON of transcript
     */
    getTranscriptObjectStream(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiHandler.makeApiRequest('get', `/jobs/${id}/transcript`, { 'Accept': "application/vnd.rev.transcript.v1.0+json" /* JSON */ }, 'stream');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/GetTranscriptById
     * Get transcript of a job as plain text.
     * @param id Id of job to retrieve transcript of
     * @returns Transcript of the requested job as a readable text string
     */
    getTranscriptText(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiHandler.makeApiRequest('get', `/jobs/${id}/transcript`, { 'Accept': "text/plain" /* TEXT */ }, 'text');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/GetTranscriptById
     * Get transcript of a job as a stream of plain text.
     * Use for large transcripts or transcripts meant to be written directly to file.
     * @param id Id of job to retrieve transcript of
     * @returns ReadableStream containing text of transcript
     */
    getTranscriptTextStream(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiHandler.makeApiRequest('get', `/jobs/${id}/transcript`, { 'Accept': "text/plain" /* TEXT */ }, 'stream');
        });
    }
    /**
     * See https://www.rev.ai/docs#operation/GetCaptions
     * Get captions created from the transcript of a job.
     * Captions are only retrievable in a stream and can be obtained in either SRT or VTT format.
     * @param id Id of job to get captions of
     * @param contentType Type of Captions to retrieve, see enum CaptionType for options
     * @param channelId If the job was submitted using speaker_channels_count,
     *     provide a speaker channel to be captioned. If no speaker_channels_count was provided on submission
     *     this parameter should not be provided.
     * @returns ReadableStream of captions in requested format
     */
    getCaptions(id, contentType, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/jobs/${id}/captions`;
            if (channelId) {
                url += `?speaker_channel=${channelId}`;
            }
            return yield this.apiHandler.makeApiRequest('get', url, { 'Accept': contentType || CaptionType_1.CaptionType.SRT }, 'stream');
        });
    }
    filterNullOptions(options) {
        let filteredOptions = {};
        Object.keys(options).forEach((option) => {
            if (options[option] !== null && options[option] !== undefined) {
                filteredOptions[option] = options[option];
            }
        });
        return filteredOptions;
    }
}
exports.RevAiApiClient = RevAiApiClient;
//# sourceMappingURL=api-client.js.map