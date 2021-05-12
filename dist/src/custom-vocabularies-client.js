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
const api_request_handler_1 = require("./api-request-handler");
/**
* Client to submit and retreive status of custom vocabularies
* from the rev.ai api. Check rev.ai/docs for more information.
*/
class RevAiCustomVocabulariesClient {
    /**
     * @param accessToken Access token used to authenticate API requests
     * @param version (optional) version of the API to be used
     */
    constructor(accessToken, version = 'v1') {
        this.apiHandler = new api_request_handler_1.ApiRequestHandler(`https://api.rev.ai/speechtotext/${version}/vocabularies`, accessToken);
    }
    /**
     * See https://www.rev.ai/docs/streaming#operation/SubmitCustomVocabulary
     * Submit custom vocabularies to be built. This is primarily
     * useful for using the custom vocabulary with streaming jobs.
     * @param customVocabularies array of CustomVocabulary objects.
     *                           For more information visit rev.ai/docs
     * @param callbackUrl (optional) string url to be called when custom
     *                    vocabulary submission is completed
     * @param metadata (optional) string to include with this custom
     *                 vocabulary submission
     * @returns Submitted custom vocabulary information
     */
    submitCustomVocabularies(customVocabularies, callbackUrl = undefined, metadata = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!customVocabularies) {
                throw Error('customVocabularies is a required parameter');
            }
            let options = { custom_vocabularies: customVocabularies };
            if (callbackUrl) {
                options.callback_url = callbackUrl;
            }
            if (metadata) {
                options.metadata = metadata;
            }
            return yield this.apiHandler.makeApiRequest('post', '', { 'Content-Type': 'application/json' }, 'json', options);
        });
    }
    /**
     * See https://www.rev.ai/docs/streaming#operation/GetCustomVocabulary
     * Retreive the information of a submitted custom vocabulary.
     * @param id string id of the custom vocabulary submission whose
     *           information is to be retreived.
     * @returns Custom vocabulary information
     */
    getCustomVocabularyInformation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('id is a required parameter');
            }
            return yield this.apiHandler.makeApiRequest('get', `/${id}`, {}, 'json');
        });
    }
    /**
     * See https://www.rev.ai/docs/streaming#operation/GetCustomVocabularies
     * Gets a list of most recent custom vocabularies' processing information
     * @param limit (optional) maximum number of jobs to retrieve, default is 100, maximum is 1000
     * @returns List of custom vocabulary informations
     */
    getListOfCustomVocabularyInformations(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = limit ? `?limit=${limit}` : '';
            return yield this.apiHandler.makeApiRequest('get', url, {}, 'json');
        });
    }
    /**
     * See https://www.rev.ai/docs/streaming#operation/DeleteCustomVocabulary
     * Delete a submitted custom vocabulary.
     * @param id string id of the custom vocabulary to be deleted
     */
    deleteCustomVocabulary(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('id is a required parameter');
            }
            return yield this.apiHandler.makeApiRequest('delete', `/${id}`, {}, 'text');
        });
    }
}
exports.RevAiCustomVocabulariesClient = RevAiCustomVocabulariesClient;
//# sourceMappingURL=custom-vocabularies-client.js.map