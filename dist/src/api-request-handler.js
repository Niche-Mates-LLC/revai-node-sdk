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
const axios_1 = require("axios");
const RevAiApiError_1 = require("./models/RevAiApiError");
// tslint:disable-next-line
const sdkVersion = require('../package.json').version;
/**
 * Abstract class which should be inherited to make use of creating api calls
 *
 * This class handles creating and sending requests as well as catching common errors
 */
class ApiRequestHandler {
    constructor(url, accessToken) {
        this.instance = axios_1.default.create({
            baseURL: url,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': `RevAi-NodeSDK/${sdkVersion}`
            }
        });
    }
    makeApiRequest(method, url, headers, responseType, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (method === 'get' || method === 'delete') ? undefined : params;
                const response = yield this.instance.request({
                    method: method,
                    url: url,
                    data: data,
                    headers: headers,
                    responseType: responseType
                });
                return response.data;
            }
            catch (error) {
                // tslint:disable-next-line
                if (error.response == null) {
                    throw error;
                }
                if (responseType === 'stream') {
                    error.response.data = JSON.parse(error.response.data.read());
                }
                switch (error.response.status) {
                    case 400:
                        throw new RevAiApiError_1.InvalidParameterError(error);
                    case 401:
                    case 404:
                        throw new RevAiApiError_1.RevAiApiError(error);
                    case 403:
                        throw new RevAiApiError_1.InsufficientCreditsError(error);
                    case 409:
                        throw new RevAiApiError_1.InvalidStateError(error);
                    default:
                        throw error;
                }
            }
        });
    }
}
exports.ApiRequestHandler = ApiRequestHandler;
//# sourceMappingURL=api-request-handler.js.map