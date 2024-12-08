const EASY_NOTE_STYLES = (() => {
    const moduleSettings = {
        modName: "Easy-NoteStyles",
        shortName: "easynotestyles",
        environmentName: "EASY_NOTE_STYLES",
        version: "0.1.0",
        author: "Mhykiel",
        verbose: true,
    };

    let utils = {};

    const handleChatMessages = (apiCall) => {
        if (!apiCall.content.includes("test")) {
            utils.whisperErrorMessage({
                apiCall,
                errDescription: "Invalid command syntax or missing parameters",
            });
        } else {
            const message = utils.encodeNoteContent({
                plainText: apiCall.content,
            });
            utils.whisperPlayerMessage({
                from: moduleSettings.modName,
                toId: apiCall.playerid,
                message: `Encoded message: ${message}`,
            });
        }
    };

    const checkInstall = () => {
        if (typeof EASY_LIB_UTILITY !== "undefined") {
            utils = EASY_LIB_UTILITY.getUtilities(
                ["logSyslogMessage", "whisperPlayerMessage", "whisperErrorMessage", "encodeNoteContent", "decodeNoteContent"],
                { moduleSettings }
            );
        } else {
            log("EASY_LIB_UTILITY is not available.");
            return 1;
        }
    };

    const registerEventHandlers = () => {
        on("chat:message", (apiCall) => {
            if (apiCall.type === "api" && apiCall.content.startsWith(`!${moduleSettings.shortName}`)) {
                handleChatMessages(apiCall);
            }
        });
    };

    on("ready", () => {
        const continueMod = checkInstall();
        if (continueMod === 0) {
            registerEventHandlers();
        }
    });

    return {};
})();
