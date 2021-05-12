"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configuration for streaming job
 */
class SessionConfig {
    /**
     * @param metadata (Optional) metadata to be associated with the streaming job
     * @param customVocabularyID (Optional) id of custom vocabulary to be used for
     *      this session
     * @param filterProfanity (Optional) whether to remove profanity from the
     *      transcript
     * @param removeDisfluencies (Optional) whether to remove disfluencies
     *      (ums, ahs) from transcript
     * @param deleteAfterSeconds (Optional) number of seconds after job completion
     *      when job is auto-deleted
     */
    constructor(metadata, customVocabularyID, filterProfanity, removeDisfluencies, deleteAfterSeconds) {
        this.metadata = metadata;
        this.customVocabularyID = customVocabularyID;
        this.filterProfanity = filterProfanity;
        this.removeDisfluencies = removeDisfluencies;
        this.deleteAfterSeconds = deleteAfterSeconds;
    }
}
exports.SessionConfig = SessionConfig;
//# sourceMappingURL=SessionConfig.js.map