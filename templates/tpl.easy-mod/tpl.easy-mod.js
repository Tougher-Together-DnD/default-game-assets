/*
@language: en-US
@title: Easy Module
@subject: 
@tags: Roll20, Easy Module
@category: Roll20 API Scripting
@content status: UAT
@company: Tougher Together Gaming (https://github.com/Tougher-Together-Gaming)
@author: Mhykiel
@comment: 
@license: MIT License
*/

// eslint-disable-next-line no-unused-vars
const EASY_GLOBAL_NAME = (() => {

	/*******************************************************************************************************************
	* SECTION PRIVATE DATA                                                                                            *
	*******************************************************************************************************************/

	// Configuration and settings for the module
	const moduleSettings = {
		modName: "Easy-ModName",
		chatName: "ezchatname",
		globalName: "EASY_GLOBAL_NAME",
		version: "0.1.0",
		author: "Mhykiel",
		verbose: true,
		globalState: "EasyModules",
	};
	// !SECTION END of Private Data

	/*******************************************************************************************************************
	* SECTION UTILITY FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	// !SECTION End of Utility Functions

	/*******************************************************************************************************************
	* SECTION PRIVATE FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	const handleChatMessages = () => {
	}

	// ANCHOR Check Install
	const checkInstall = () => {
		const utilities = EASY_LIB_UTILITY.getUtilities(
			[
				"DecodeNoteContent",
				"EncodeNoteContent",
				"LogSyslogMessage",
				"ParseChatCommands",
				"WhisperErrorMessage",
				"WhisperPlayerMessage"
			],
			moduleSettings
		);

		return 0;
	};

	// Create a StatusHandlerMap dynamically bound to this module's settings and utilities
	const StatusHandlerMap = 	EASY_LIB_UTILITY.CreateStatusHandlerMap(utilities, moduleSettings);

	const registerEventHandlers = () => {
		on("chat:message", (apiCall) => {
			if (apiCall.type === "api" && apiCall.content.startsWith(`!${moduleSettings.shortName}`)) {
				//handleChatMessages(apiCall);
				StatusHandlerMap["70000"]("Made it here")
			}
		});

		return 1;
	};
	// !SECTION End of Private Functions

	/*******************************************************************************************************************
	* SECTION PUBLIC INTERFACE                                                                                        *
	*******************************************************************************************************************/

	// ANCHOR ...INITIALIZATION...
	on("ready", () => {

		// Alert Script is Initializing
		EASY_LIB_UTILITY.LogSyslogMessage({
			moduleName: moduleSettings.modName,
			severity: "INFO",
			code: "10000",
			message: ".=> Initializing Easy-NoteStyles <=."
		});

		checkInstall();
		registerEventHandlers();

		// Script is ready
		EASY_LIB_UTILITY.LogSyslogMessage({
			moduleName: moduleSettings.modName,
			severity: "INFO",
			code: "20000",
			message: ".=> Ready <=."
		});
	});

	return {

	};
	// !SECTION END of Public Interface
})();
