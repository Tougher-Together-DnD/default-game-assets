// eslint-disable-next-line no-unused-vars
class EasyLibUtility {
    constructor(moduleSettings = {}) {
        this.defaultSettings = {
            modName: "Easy-LibUtility",
            shortName: "easyutility",
            environmentName: "EASY_LIB_UTILITY",
            version: "0.1.0",
            author: "Mhykiel2",
            verbose: true,
        };

        // Merge provided settings with default settings
        this.settings = { ...this.defaultSettings, ...moduleSettings };
    }

    /**
     * Updates settings dynamically for a module.
     * @param {Object} newSettings - The new settings to merge.
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    /**
     * Logs a syslog-compatible message.
     * @param {Object} params - The log parameters.
     * @param {string} params.severity - Log severity.
     * @param {string} params.code - Log code.
     * @param {string} params.message - Log message.
     * @returns {string} The formatted log message.
     */
    logSyslogMessage({ severity, code, message }) {
        const timestamp = new Date().toISOString();
        const severityLevels = ["DEBUG", "INFO", "WARN", "ERROR"];
        const normalizedSeverity = severityLevels.includes(severity.toUpperCase())
            ? severity.toUpperCase()
            : "INFO";

        const logMessage = `${timestamp} [${this.settings.modName}] (${normalizedSeverity}): {"code": ${code}, "message": "${message}"}`;
        log(logMessage);
        return logMessage;
    }

    /**
     * Sends a whisper message to a player or GM.
     * @param {Object} params - The whisper parameters.
     * @param {string} params.from - Sender's name.
     * @param {string} params.toId - Player ID.
     * @param {string} params.message - The message to send.
     */
    whisperPlayerMessage({ from, toId, message }) {
        const sender = from || `[${this.settings.modName}]`;
        const recipient = toId === "gm" ? "gm" : (getObj("player", toId)?.get("_displayname") || "gm");
        sendChat(sender, `/w ${recipient} ${message}`);
    }

    /**
     * Sends a styled error message as a whisper.
     * @param {Object} params - The error parameters.
     * @param {Object} params.apiCall - The API call object.
     * @param {string} params.errDescription - The error description.
     */
    whisperErrorMessage({ apiCall, errDescription }) {
        const styledMessage = `
            <div style="border:1px solid black; background-color:#ffdddd; padding:10px; border-radius:10px;">
                <h3 style="color:#cc0000; margin:0; font-size:1.2em;">Error</h3>
                <p style="margin:5px 0;">You attempted to run the following command:</p>
                <div style="margin:8px 0; padding:0 5px; background-color:#ffffff; border:1px solid #cccccc; border-radius:5px; font-family:monospace;">
                    <p>${apiCall.content}</p>
                </div>
                <p style="margin:5px 0;">${errDescription}.</p>
                <p style="margin:5px 0; font-size:0.9em; color:#555;">
                    If you continue to experience issues, contact the script author (${this.settings.author}) for assistance.
                </p>
            </div>`;
        this.whisperPlayerMessage({
            from: `[${this.settings.modName}]`,
            toId: apiCall.playerid,
            message: styledMessage,
        });
    }

    /**
     * Returns a utility function map with injected settings and state.
     * @param {string[]} utilityNames - List of utility functions to include.
     * @param {Object} context - Context with settings and state.
     * @returns {Object<string, Function>} The utility map.
     */
    getUtilities(utilityNames, context) {
        const utilities = {
            logSyslogMessage: this.logSyslogMessage.bind(this),
            whisperPlayerMessage: this.whisperPlayerMessage.bind(this),
            whisperErrorMessage: this.whisperErrorMessage.bind(this),
            encodeNoteContent: this.encodeNoteContent.bind(this),
            decodeNoteContent: this.decodeNoteContent.bind(this),
        };
    
        const selectedUtilities = {};
        utilityNames.forEach((name) => {
            if (utilities[name]) {
                selectedUtilities[name] = utilities[name];
            } else {
                this.logSyslogMessage({
                    severity: "WARN",
                    code: "50010",
                    message: `Utility "${name}" not found in EasyLibUtility. Ensure the method exists and is correctly defined.`,
                });
            }
        });
    
        return selectedUtilities;
    }
    
}

// Initialize EasyLibUtility globally
const EASY_LIB_UTILITY = new EasyLibUtility();
