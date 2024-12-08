/**
 * @language: en-US
 * @title: Module B (Syslog Test)
 * @subject: Testing Syslog Function from Easy Utility Library
 * @tags: Roll20, Easy Module, Utility Test
 */

const MODULE_B = (() => {
	// Load the necessary utility functions from EASY_LIB_UTILITY
	const { LogSyslogMessage } = EASY_LIB_UTILITY.getUtilities(["LogSyslogMessage"]);
  
	// Simulate various syslog messages
	const simulateSyslogMessages = () => {
	  LogSyslogMessage({
		severity: "DEBUG",
		code: "70000",
		message: "Debugging information for Module B.",
		moduleName: "Module B",
	  });
  
	  LogSyslogMessage({
		severity: "INFO",
		code: "20000",
		message: "Module B is processing.",
		moduleName: "Module B",
	  });
  
	  LogSyslogMessage({
		severity: "WARN",
		code: "40000",
		message: "Potential issue detected in Module B.",
		moduleName: "Module B",
	  });
  
	  LogSyslogMessage({
		severity: "ERROR",
		code: "50000",
		message: "Critical failure in Module B.",
		moduleName: "Module B",
	  });
	};
  
	// Register event handlers
	const registerEventHandlers = () => {
	  on("chat:message", (msg) => {
		if (msg.type === "api" && msg.content.startsWith("!moduleB")) {
		  simulateSyslogMessages();
		}
	  });
	};
  
	// Initialize the module
	on("ready", () => {
	  LogSyslogMessage({
		severity: "INFO",
		code: "10010",
		message: "Module B initialized.",
		moduleName: "Module B",
	  });
  
	  registerEventHandlers();
	});
  
	return {};
  })();
  