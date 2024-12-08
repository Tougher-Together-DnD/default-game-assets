/*
@language: en-US
@title: Easy Utility Library Module
@subject: Utility Functions for Roll20 Easy Modules
@tags: Roll20, Easy Module, Utility
@category: Roll20 API Scripting
@content status: UAT
@company: Tougher Together Gaming (https://github.com/Tougher-Together-Gaming)
@author: Mhykiel
@comment: This module provides utility functions for Easy Modules in Roll20. It allows other modules to selectively 
		  retrieve and use utility functions, maintaining modularity and reusability.
@license: Modified BSD-3-Clause License
*/

// eslint-disable-next-line no-unused-vars
const EASY_LIB_UTILITY = (() => {

	/*******************************************************************************************************************
	* SECTION PRIVATE DATA                                                                                            *
	*******************************************************************************************************************/

	// Configuration and settings for the module
	const moduleSettings = {
		modName: "Easy-LibUtility",
		shortName: "easyutility",
		environmentName: "EASY_LIB_UTILITY",
		version: "0.1.0",
		author: "Mhykiel",
		verbose: true
	};
	// !SECTION END of Private Data

	/*******************************************************************************************************************
	* SECTION UTILITY FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	// ANCHOR Utility Create System Log Message
	/**
	 * Generates and sends a syslog-compatible log message to the API console.
	 *
	 * Creates a timestamped log message using severity, code, and message fields.
	 *
	 * This utility function formats log messages in a syslog-compatible format, including 
	 * a UTC timestamp, module name, severity level, and a JSON-formatted payload. It ensures 
	 * consistent log structure and supports common severity aliases, like "Information" 
	 * (mapped to "INFO") and "Warning" (mapped to "WARN"). The `severity` is normalized to 
	 * ensure compatibility with expected levels, and a default value is used if unrecognized.
	 *
	 * This improves readability and standardization of log messages, making them easier to parse,
	 * debug, and integrate with log analysis tools. The use of destructured parameters ensures
	 * clarity and scalability when additional fields are added.
	 *
	 * @param {Object} params - The parameters for the log message.
	 * @param {string} params.severity - The severity level of the log (e.g., "INFO", "ERROR", "DEBUG").
	 * @param {string} params.code - The application or script code generating the log.
	 * @param {string} params.message - The log message to be included.
	 * @param {string} [params.moduleName] - The name of the module generating the log (defaults to "SYSTEM").
	 * @returns {string} The formatted syslog message.
	 * 
	 * @example
	 * const logMessage = _logSyslogMessage({
	 *   severity: "DEBUG",
	 *   code: "70000",
	 *   message: "The system is running smoothly.",
	 *   moduleName: "Easy-Utility"
	 * });
	 * // Ex Output: 2024-12-03T10:30:45.123Z [Easy-Utility] (DEBUG) : {"code": 70000, "message": "The system is running smoothly."}"
	 */
	const _logSyslogMessage = ({ severity, code, message, moduleName = `[${moduleSettings.modName}]` }) => {
		// Helper function to generate the syslog-compatible timestamp
		const _getSyslogTimestamp = () => {
			const now = new Date();
			const year = now.getUTCFullYear();
			const month = String(now.getUTCMonth() + 1).padStart(2, "0");
			const day = String(now.getUTCDate()).padStart(2, "0");
			const hours = String(now.getUTCHours()).padStart(2, "0");
			const minutes = String(now.getUTCMinutes()).padStart(2, "0");
			const seconds = String(now.getUTCSeconds()).padStart(2, "0");
			const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");
			return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
		};

		// Valid severity levels
		const validSeverityLevelsEnum = ["DEBUG", "INFO", "WARN", "ERROR"];

		// Map for alternate severity names
		const severityAliases = {
			information: "INFO",
			warning: "WARN"
		};

		// Normalize input and adjust severity level
		let severityLevel = severity.toLowerCase();
		severityLevel = severityAliases[severityLevel] ||
			(validSeverityLevelsEnum.includes(severityLevel.toUpperCase()) ? severityLevel.toUpperCase() : validSeverityLevelsEnum[0]);

		// Generate the syslog message
		const timestamp = _getSyslogTimestamp();
		const formattedMessage = `${timestamp} [${moduleName}] (${severityLevel}) : {"code": ${code}, "message": "${message}"}`;

		// Log to the console (replace this with actual logging mechanism if needed)
		log(formattedMessage);

		// Return the formatted syslog message for testing or further processing
		return formattedMessage;
	};

	// !SECTION End of Utility Functions

	/*******************************************************************************************************************
	* SECTION PRIVATE FUNCTIONS                                                                                        *
	*******************************************************************************************************************/
	// !SECTION End of Private Functions

	/*******************************************************************************************************************
	* SECTION PUBLIC INTERFACE                                                                                        *
	*******************************************************************************************************************/

		// ANCHOR Function Map for Status and Error Codes
	/**
	 * Maps status codes to their corresponding log or error handler functions.
	 *
	 * Associates numeric status codes with specific handler functions for logging and error reporting.
	 *
	 * This map provides a standardized way to handle and report different statuses and errors. Each 
	 * status code is mapped to a function that performs a specific action, such as logging messages 
	 * or sending whispers. This approach ensures consistent feedback to users, simplifies debugging, 
	 * and makes it easier to localize or translate logs for different environments.
	 *
	 * A centralized map for status codes ensures modular and maintainable error handling, 
	 * standardizes responses, and reduces redundancy in logging logic.
	 *
	 * @constant {Object<string, Function>} statusHandlerMap
	 * @property {Function} 0 - Logs a success message, indicating the script ran without errors.
	 * @property {Function} 1 - Logs a failure message.
	 * @property {Function} 10000 - Logs a message for initializing with a custom remark.
	 * @property {Function} 10010 - Logs a message for synchronous processing with a custom remark.
	 * @property {Function} 10020 - Logs a message for asynchronous processing with a custom remark.
	 * @property {Function} 20000 - Logs a message for completed actions with a custom remark.
	 * @property {Function} 20010 - Logs a message for creation actions with a custom remark.
	 * @property {Function} 40000 - Logs a warning message with a custom remark.
	 * @property {Function} 50000 - Logs a critical failure message with a custom remark.
	 * @property {Function} 50010 - Logs a "not found" error with a custom remark.
	 * @property {Function} 50011 - Logs a "function not found" error with a custom remark.
	 * @property {Function} 50012 - Logs a "player not found" error with a custom remark.
	 * @property {Function} 50013 - Logs a "token not found" error with a custom remark.
	 * @property {Function} 50014 - Logs a "character sheet not found" error with a custom remark.
	 * @property {Function} 50015 - Logs a "handout not found" error with a custom remark.
	 * @property {Function} 50020 - Logs a "bad arguments" error with a custom remark.
	 * @property {Function} 50021 - Logs a "bad arguments" error for invalid API commands with a custom remark.
	 * @property {Function} 60000 - Sends a whisper to a player with a custom remark and player ID.
	 * @property {Function} 60010 - Sends a styled error whisper to a player with a custom remark and player ID.
	 * @property {Function} 70000 - Logs a debug message with a custom remark.
	 */
	const _statusHandlerMap = {
		"0": () => { return log("Success"); },
		"1": () => { return log("Failure"); },
		"10000": () => { _logSyslogMessage({ severity: "INFO", code: "10000", message: `.=> Initializing <=.` }); },
		"10010": (remark) => { _logSyslogMessage({ severity: "INFO", code: "10010", message: `Synchronously Processing: ${remark}` }); },
		"10020": (remark) => { _logSyslogMessage({ severity: "INFO", code: "10020", message: `Asynchronously Processing: ${remark}` }); },
		"20000": () => { _logSyslogMessage({ severity: "INFO", code: "10010", message: `.=> Ready <=.` }); },
		"20010": (remark) => { _logSyslogMessage({ severity: "INFO", code: "20000", message: `Completed: ${remark}` }); },
		"20020": (remark) => { _logSyslogMessage({ severity: "INFO", code: "20010", message: `Created: ${remark}` }); },
		"40000": (remark) => { _logSyslogMessage({ severity: "WARN", code: "40000", message: `Warning: ${remark}` }); },
		"50000": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50000", message: `Critical Failure: ${remark}` }); },
		"50010": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50010", message: `Not Found: ${remark}` }); },
		"50011": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50011", message: `Not Found: ${remark} is an unavailable function.` }); },
		"50012": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50012", message: `Not Found: The Player '${remark}' was not found.` }); },
		"50013": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50013", message: `Not Found: The Token '${remark}' was not found.` }); },
		"50014": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50014", message: `Not Found: The Character Sheet '${remark}' was not found.` }); },
		"50015": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50015", message: `Not Found: The Handout '${remark}' was not found.` }); },
		"50020": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50020", message: `Bad Arguments: ${remark}` }); },
		"50021": (remark) => { _logSyslogMessage({ severity: "ERROR", code: "50021", message: `Bad Arguments: The api command '${remark}' is invalid.` }); },
		"60000": (remark, playerId) => { _whisperPlayerMessage({ from: `${moduleSettings.name}`, toId: playerId, message: `${remark}` }); },
		"60010": (remark, apiCall) => { _whisperErrorMessage({ apiCall: apiCall, errDescription: `${remark}` }); },
		"70000": (remark) => { _logSyslogMessage({ severity: "DEBUG", code: "70000", message: `${remark}` }); },
	};

	// ANCHOR ...INITIALIZATION...
	on("ready", () => {

		// Alert Script is Initializing
		_logSyslogMessage({
			severity: "INFO",
			code: "10000",
			message: ".=> Initializing <=.",
			moduleName: `${moduleSettings.modName}`
		});

		//checkInstall();
		//registerEventHandlers();

		// Script is ready
		_logSyslogMessage({
			severity: "INFO",
			code: "10000",
			message: ".=> Ready <=.",
			moduleName: `${moduleSettings.modName}`
		});
	});

	// ANCHOR Registry for available utility functions
	const availableUtilities = {
		LogSyslogMessage: _logSyslogMessage
	};

	return {

		// ANCHOR Utility Get Selected Utilities
		/**
		 * Selectively retrieves utility functions by other modules for use.
		 * 
		 * This function allows external modules to request only the utility functions they need, 
		 * promoting modularity and reducing unnecessary overhead. By passing a list of function names, 
		 * the requested utilities are returned as an object for easy integration.
		 * 
		 * Using selective retrieval ensures that modules only access the functionality they require, 
		 * improving code organization and performance by avoiding unnecessary imports.
		 * 
		 * @param {string[]} desiredFuncArray - A list of utility function names to retrieve.
		 * @returns {Object<string, Function>} An object containing the requested utilities as key-function pairs.
		 * @throws {Error} If a requested utility function is not found in the registry.
		 * 
		 * @example
		 * const { logSyslogMessage, parseChatCommands } = getUtilities(["logSyslogMessage", "parseChatCommands"]);
		 * logSyslogMessage("INFO", "10001", "System initialized.");
		 * const commands = parseChatCommands("!easyutility --log INFO Initialization successful");
		 * console.log(commands);
		 */
		getUtilities: (desiredFuncArray, moduleSettingsOverride = {}) => {
			const selectedUtilities = {};
			
			// Merge default settings with the module-specific overrides
			const effectiveModuleSettings = { ...moduleSettings, ...moduleSettingsOverride };
		
			desiredFuncArray.forEach((aDesiredFunc) => {
				if (availableUtilities[aDesiredFunc]) {
					// Dynamically bind the effectiveModuleSettings to the utility function
					selectedUtilities[aDesiredFunc] = availableUtilities[aDesiredFunc].bind(effectiveModuleSettings);
				} else {
					_logSyslogMessage({
						severity: "WARN",
						code: "50010",
						message: `'${aDesiredFunc}' is an unavailable function from ${moduleSettings.modName}.`,
						moduleName: `${moduleSettings.modName}`
					});
				}
			});
			
			return selectedUtilities;
		},
		

		// Syslog Utility for logging by simpler scripts
		LogSyslogMessage: _logSyslogMessage,
		StatusHandlerMap: _statusHandlerMap
	};
	// !SECTION END of Public Interface
})();
