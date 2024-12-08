/**
 * @language: en-US
 * @title: Module A (Whisper Error Test)
 * @subject: Testing Whisper Error Function from Easy Utility Library
 * @tags: Roll20, Easy Module, Utility Test
 */

const MODULE_A = (() => {
	// Load the necessary utility functions from EASY_LIB_UTILITY
	const { WhisperErrorMessage, LogSyslogMessage } = EASY_LIB_UTILITY.getUtilities([
	  "WhisperErrorMessage",
	  "LogSyslogMessage",
	]);
  
	// Simulate an API call with an error
	const simulateError = (apiCall, errorMessage) => {
	  try {
		// Simulate an intentional error to demonstrate the whisper error functionality
		throw new Error(errorMessage);
	  } catch (error) {
		// Log the error using the syslog function
		LogSyslogMessage({
		  severity: "ERROR",
		  code: "50020",
		  message: error.message,
		  moduleName: "Module A",
		});
  
		// Whisper the error message to the player
		WhisperErrorMessage({
		  apiCall,
		  errDescription: error.message,
		});
	  }
	};
  
	// Register event handlers
	const registerEventHandlers = () => {
	  on("chat:message", (msg) => {
		if (msg.type === "api" && msg.content.startsWith("!moduleA")) {
		  simulateError(msg, "This is a test error from Module A.");
		}
	  });
	};
  
	// Initialize the module
	on("ready", () => {
	  LogSyslogMessage({
		severity: "INFO",
		code: "10010",
		message: "Module A initialized.",
		moduleName: "Module A",
	  });
  
	  registerEventHandlers();
	});
  
	return {};
  })();
  