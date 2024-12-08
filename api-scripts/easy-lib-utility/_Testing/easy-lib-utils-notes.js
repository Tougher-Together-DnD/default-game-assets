// eslint-disable-next-line no-unused-vars
const EASY_NOTE_STYLES = (() => {
    // Define module-specific settings
    const moduleSettingsOverride = {
        environmentName: "ImportModuleEnv",
        logLevel: 1,
        prefix: "[ImportModule]",
        suffix: "!",
    };

    // Import selected utilities
    const { logMessage, formatString } = coreModule.GetUtilities(
        ["logMessage", "formatString", "bolofunc"],
        moduleSettingsOverride
    );

    // Use the imported functions
    if (logMessage && formatString) {
        logMessage("This is a test message."); // Logs: "[ImportModuleEnv] This is a test message."
        const formattedString = formatString("Hello");
        logMessage(formattedString); // Logs: "[ImportModuleEnv] [ImportModule]Hello!"
    } else {
        log("Failed to import utilities.");
    }
})();
