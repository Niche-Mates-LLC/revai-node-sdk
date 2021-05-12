import { ApiRequestHandler } from './api-request-handler';
import { CustomVocabulary } from './models/CustomVocabulary';
import { CustomVocabularyInformation } from './models/CustomVocabularyInformation';
/**
* Client to submit and retreive status of custom vocabularies
* from the rev.ai api. Check rev.ai/docs for more information.
*/
export declare class RevAiCustomVocabulariesClient {
    apiHandler: ApiRequestHandler;
    /**
     * @param accessToken Access token used to authenticate API requests
     * @param version (optional) version of the API to be used
     */
    constructor(accessToken: string, version?: string);
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
    submitCustomVocabularies(customVocabularies: CustomVocabulary[], callbackUrl?: string, metadata?: string): Promise<CustomVocabularyInformation>;
    /**
     * See https://www.rev.ai/docs/streaming#operation/GetCustomVocabulary
     * Retreive the information of a submitted custom vocabulary.
     * @param id string id of the custom vocabulary submission whose
     *           information is to be retreived.
     * @returns Custom vocabulary information
     */
    getCustomVocabularyInformation(id: string): Promise<CustomVocabularyInformation>;
    /**
     * See https://www.rev.ai/docs/streaming#operation/GetCustomVocabularies
     * Gets a list of most recent custom vocabularies' processing information
     * @param limit (optional) maximum number of jobs to retrieve, default is 100, maximum is 1000
     * @returns List of custom vocabulary informations
     */
    getListOfCustomVocabularyInformations(limit?: number): Promise<CustomVocabularyInformation[]>;
    /**
     * See https://www.rev.ai/docs/streaming#operation/DeleteCustomVocabulary
     * Delete a submitted custom vocabulary.
     * @param id string id of the custom vocabulary to be deleted
     */
    deleteCustomVocabulary(id: string): Promise<void>;
}
