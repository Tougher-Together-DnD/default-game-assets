// eslint-disable-next-line no-unused-vars
const EASY_NOTE_STYLES = (() => {
	/*******************************************************************************************************************
	 * SECTION PRIVATE DATA                                                                                            *
	*******************************************************************************************************************/

	// Configuration and settings for the module
	const moduleSettings = {
		modName: "Easy-NoteStyles",
		shortName: "easynotestyles",
		environmentName: "EASY_NOTE_STYLES",
		version: "0.1.0",
		author: "Mhykiel",
		verbose: true,
	};

	/*******************************************************************************************************************
	* SECTION UTILITY FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	let utils = {}
	let StatusHandlerMap = {}

	// END of Utility Functions

	/*******************************************************************************************************************
	* SECTION PRIVATE FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	const handleChatMessages = (apiCall) => {
		const parsedCommands = utils.ParseChatCommands({
			apiCallContent: apiCall.content,
		});

		// Example: Process commands
		if (parsedCommands.has("--encode")) {
			const noteContent = parsedCommands.get("--encode").join(" ");
			const encodedContent = utils.EncodeNoteContent({ plainText: noteContent });
			utils.WhisperPlayerMessage({
				from: moduleSettings.modName,
				toId: apiCall.playerid,
				message: `Encoded Content: ${encodedContent}`,
			});
			// StatusHandlerMap["70000"]("encode was passed in the command.");
		} else if (parsedCommands.has("--decode")) {
			const noteContent = parsedCommands.get("--decode").join(" ");
			const decodedContent = utils.DecodeNoteContent({ encodedText: noteContent });
			utils.WhisperPlayerMessage({
				from: moduleSettings.modName,
				toId: apiCall.playerid,
				message: `Decoded Content: ${decodedContent}`,
			});
		} else {
			utils.WhisperErrorMessage({
				apiCall,
				errDescription: "Invalid command. Use --encode or --decode.",
			});
		}
	};

	const checkInstall = () => {

		// Ensure EASY_LIB UTILITIES are available or cease operation
		if (typeof EASY_LIB_UTILITY !== "undefined") {

			// Dynamically load utilities from EASY_LIB_UTILITY
			utils = EASY_LIB_UTILITY.FetchUtilities({
				requestedFunctionsArray: [
					"CreateCssStyleMappings",
					"CreateStatusCodeMappings",
					"DecodeNoteContent",
					"EncodeNoteContent",
					"LogSyslogMessage",
					"NewCurryFunc",
					"ParseChatCommands",
					"ParseSubcommandArgs",
					"ParseDataFromContent",
					"WhisperErrorMessage",
					"WhisperPlayerMessage"
				],
				thisModuleSettings: moduleSettings,
			});

			// Create a StatusHandlerMap dynamically bound to this module's settings and utilities
			StatusHandlerMap = (utils.CreateStatusCodeMappings({
				thisUtilities: utils
			})).get();
			utils.LogSyslogMessage({ severity: "INFO", code: "20010", message: `Completed: from later check install.` })

			StatusHandlerMap["10000"]()

			return 0;

		} else {

			log("EASY_LIB_UTILITY is not available:");

			return 1
		}
	};

	const registerEventHandlers = () => {

		on("chat:message", (apiCall) => {
			if (apiCall.type === "api" && apiCall.content.startsWith(`!${moduleSettings.shortName}`)) {
				handleChatMessages(apiCall);

			}
		});

		StatusHandlerMap["20000"]()

		return 0;
	};

	/*******************************************************************************************************************
	 * SECTION PUBLIC INTERFACE                                                                                        *
	*******************************************************************************************************************/

	// ANCHOR ...INITIALIZATION...
	on("ready", () => {

		const continueMod = checkInstall();

		// If installation successful continue
		if (continueMod === 0) {
			registerEventHandlers();
		}
	});

	return {};
})();
