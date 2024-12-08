// eslint-disable-next-line no-unused-vars
const EASY_LIB_UTILITY = (() => {
    const moduleSettings = {
        environmentName: "defaultEnv",
    };

    function _logMessage(message) {
        if (this.logLevel && this.logLevel > 0) {
            log(`[${this.environmentName}] ${message}`);
        }
    }

    const availableUtilities = {
        logMessage: _logMessage,
        formatString: function (str) {
            const { prefix = "", suffix = "" } = this;
            return `${prefix}${str}${suffix}`;
        },
    };

    const _logSyslogMessage = function ({ severity, code, message }) {
        log(`[${severity}] [${code}] ${message}`);
    };

    const GetUtilities = (desiredFuncArray, moduleSettingsOverride = {}) => {
        const selectedUtilities = {};
        const effectiveModuleSettings = { ...moduleSettings, ...moduleSettingsOverride };

        desiredFuncArray.forEach((aDesiredFunc) => {
            if (availableUtilities[aDesiredFunc]) {
                // Wrap each utility function to inject `moduleSettings` dynamically
                selectedUtilities[aDesiredFunc] = (...args) => {
                    return availableUtilities[aDesiredFunc].call(effectiveModuleSettings, ...args);
                };
            } else {
                // Log a warning if the requested utility is not found
                _logSyslogMessage.call(moduleSettings, {
                    severity: "WARN",
                    code: "50010",
                    message: `Not Found: '${moduleSettings.environmentName}.${aDesiredFunc}()' is unavailable.`,
                });
            }
        });

        return selectedUtilities;
    };

    globalThis.coreModule = {
        GetUtilities,
    };
})();
