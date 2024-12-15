/*!
@language: en-US
@title: Easy Module
@subject: // TODO Add description of this module.
@author: Mhykiel
@version 0.1.0
@license MIT License
@see {@link https://github.com/Tougher-Together-Gaming/default-game-assets/tree/main/api-scripts/tpl.easy-module|GitHub Repository}
!*/

// eslint-disable-next-line no-unused-vars
const EASY_MODULE = (() => {

	/*******************************************************************************************************************
	 * SECTION PRIVATE DATA                                                                                            *
	*******************************************************************************************************************/

	// ANCHOR moduleSettings; Metadata and configurations for the module
	const moduleSettings = {
		modName: "Easy-Module",
		chatName: "ezmod",
		globalName: "EASY_MODULE",
		version: "0.1.0",
		author: "Mhykiel",
		verbose: true,
	};

	/*******************************************************************************************************************
	* SECTION UTILITY FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	// NOTE During Initialization these will be populated with references from EASY_LIB_UTILITIES
	let PhraseFactory = {};
	const TemplateFactory = {};
	const ThemeFactory = {};

	// END of Utility Functions

	/*******************************************************************************************************************
	* SECTION PRIVATE FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	// ANCHOR _commandFactory
	/**
	 * A map of commands to their corresponding action functions.
	 * 
	 * @type {Object<string, Function>}
	 * @property {Function} --menu - Handles the "menu" command.
	 * @property {Function} --speak - Handles the "speak" command.
	 * @property {Function} --remark - Handles the "remark" command.
	 * @property {Function} --as - Handles the "as" command.
	 * @property {Function} --add - Handles the "add" command.
	 * @property {Function} --remove - Handles the "remove" command.
	 * @property {Function} --ids - Handles the "ids" command.
	 */
	const methodMap = {
		"--menu": (msgDetails, parsedArgs) => { 
			// Preprocess the title, description, and remark
			const title = PhraseFactory.get({ code: "60000" }); // Pre-fetch title based on severity
			const description = "The Chat API commands given were...";
			const remark = `The arguments for those commands were: ${JSON.stringify(parsedArgs)}`;

			// Construct the arguments object
			const whisperArguments = {
				apiCall: msgDetails.raw, // Raw message details
				severity: 6,             // Numeric severity for INFO
				title,                   // Preprocessed title
				description,             // Preprocessed description
				remark,                  // Preprocessed remark
			};

			// Call the whisper function
			Utils.WhisperAlertMessage(whisperArguments);

		  },
		  "--tip": (msgDetails, parsedArgs) => { 
			const whisperArguments = {
				apiCall: msgDetails.raw,
				severity: 7,
				description: `${PhraseFactory.get({code: "0"})}`,
				remark: `${PhraseFactory.get({ code: "0x00FA670E" })}`
			};

			Utils.WhisperAlertMessage( whisperArguments );
		  },
		  "--warn": (msgDetails, parsedArgs) => { 
			const whisperArguments = {
				apiCall: msgDetails.raw,
				severity: 4,
				description: `${PhraseFactory.get({code: "40400"})}`,
				remark: `${PhraseFactory.get({ code: "70000", params: [`${JSON.stringify(parsedArgs)}`] })}`
			};

			Utils.WhisperAlertMessage( whisperArguments );
		  },
		  "--error": (msgDetails, parsedArgs) => {
			const whisperArguments = {
				apiCall: msgDetails.raw,
				severity: 3,
				description: `${PhraseFactory.get({ code: "40000", params: [`${JSON.stringify(parsedArgs)}`] })}`,
				remark: `${PhraseFactory.get({code: "0x00784CBE"})}`
			};

			Utils.WhisperAlertMessage( whisperArguments );
		  },
		"--info": (msgDetails, parsedArgs) => { 
			const whisperArguments = {
				apiCall: msgDetails.raw,
				severity: 6,
				description: `${PhraseFactory.get({code: "0"})}`,
				remark: `${PhraseFactory.get({ code: "70000", params: [`${(msgDetails.selectedIdsArray).join(", ")}`] })}`
			};

			Utils.WhisperAlertMessage( whisperArguments );
		  },
		  "--log": (msgDetails, parsedArgs) => { 
			Utils.LogSyslogMessage({
				severity: 7,
				code: "70000",
				message: `${msgDetails.raw.content};;${parsedArgs}`
			});
		  },
	};

	// ANCHOR _handleChatMessages
	const _handleChatMessages = (apiCall) => {

		/* NOTE: If the message originates from a player, `thisPlayerId` will store the corresponding player object. 
		This can be used for actions like retrieving the player's name or sending them a whisper. 
		If the message does not come from a player (e.g., it comes from an API script), `thisPlayerId` will be set to `null`. 
		The following prevents unnecessary errors when trying to reference a non-existent player. 
		*/

		const thisPlayerId = apiCall.playerid ? getObj("player", apiCall.playerid) : null;
		const thisPlayerName = thisPlayerId ? thisPlayerId.get("_displayname") : "Unknown Player";
		const thisPlayerIsGm = thisPlayerId && playerIsGM(apiCall.playerid) ? true : false;
	
		const msgDetails = {
			raw: apiCall,
			commands: Utils.ParseChatCommands({
				apiCallContent: apiCall.content,
			}),
			isFromGm: thisPlayerIsGm,
			senderId: thisPlayerId,
			senderDisplayName: thisPlayerName.replace(/\(GM\)/g, "").trim(),
		};

		// Check if --ids is provided
		if (!msgDetails.commands.has("--ids")) {
			if (!apiCall.selected || apiCall.selected.length === 0) {
				// No --ids and no tokens selected error
				//MessageFactory["60010"](apiCall, "ERROR", "Invalid Arguments", "Select a token or pass token ids with --ids.");

				//return 1;
				msgDetails.selectedIdsArray = [];

			} else {

				// --ids not provided. Use selected token IDs
				const selectedIdsArray = apiCall.selected.map(sel => {return sel._id;});
				msgDetails.selectedIdsArray = selectedIdsArray;
			}

		} else {

			// --ids was provided use those for the selected tokens, and remove the command from further parsing.
			msgDetails.selectedIdsArray = msgDetails.commands.get("--ids");
			msgDetails.commands.delete("--ids");
		}
	
		// Check if command exists in the methodMap and execute the corresponding action
		// Separate valid and invalid commands
		const validCommands = [];
		const invalidCommands = [];

		// Categorize commands as valid or invalid
		msgDetails.commands.forEach((args, commandName) => {
			if (methodMap.hasOwnProperty(commandName)) {
				validCommands.push({ commandName, args });
			} else {
				invalidCommands.push(commandName);
			}
		});

		// Check if both arrays are empty and default to calling the menu action
		if (validCommands.length === 0 && invalidCommands.length === 0) {
			
			// Default to menu if no command is provided
			methodMap["--menu"](msgDetails, {});
		} else {
			// Execute valid commands
			validCommands.forEach(({ commandName, args }) => {
				const parsedArgs = Utils.ParseChatSubcommands({ subcommands: args });
				methodMap[commandName](msgDetails, parsedArgs);
			});

			// Handle invalid commands
			if (invalidCommands.length > 0) {

				const whisperArguments = {
					apiCall,
					severity: 3,
					description: `${PhraseFactory.get({code: "40000"})}`,
					remark: `${PhraseFactory.get({code: "0x00784CBE"})}`
				};
	
				Utils.WhisperAlertMessage( whisperArguments );
			}
		}
	};

	const checkInstall = () => {

		// Ensure EASY_LIB UTILITIES are available or cease operation
		if (typeof EASY_LIB_UTILITIES !== "undefined") {

			// Dynamically load utilities from EASY_LIB_UTILITIES
			Utils = EASY_LIB_UTILITIES.FetchUtilities({
				requestedFunctionsArray: [
					"ApplyCssToHtmlJson",
					"ConvertCssToJson",
					"ConvertHtmlToJson",
					"ConvertJsonToHtml",
					"ConvertToSingleLine",
					"CreatePhraseFactory",
					"CreateTemplateFactory",
					"CreateThemeFactory",
					"DecodeNoteContent",
					"EncodeNoteContent",
					"GetSharedForge",
					"GetSharedVault",
					"LogSyslogMessage",
					"MakeCurryFunc",
					"ParseChatCommands",
					"ParseChatSubcommands",
					"ParseDataFromContent",
					"PurgeApiState",
					"RenderTemplate",
					"ReplacePlaceholders",
					"WhisperAlertMessage",
					"WhisperPlayerMessage"
				],
				thisModuleSettings: moduleSettings,
			});

			const easySharedObject = Utils.GetSharedForge();
			
			// Retrieve the factory using getFactory
			PhraseFactory = easySharedObject.getFactory("PhraseFactory");

			// Add a new phrase
			PhraseFactory.addPhrases({
				language: "enUS",
				phrases: {
					"0x00FA670E": "You can add custom phrases to the PhraseFactory."
				}
			});

			/* EXAMPLE TEMPLATE ADDITION

			_createTemplateFactory.add({
				newTemplates: {
					"chatAlert": ({ title, command, remark, author }) => {
						return _convertHtmlToJson({ html:`
						<div class="alert-message">
							<h3>${title}</h3>
							<p>You attempted to run the following command:</p>
							<div class="alert-command">
								<p>${command}</p>
							</div>
							<p>${remark}</p>
							<p class="alert-footer">If you continue to experience issues, contact the script author (${author}) for assistance.</p>
						</div>`});
					}
				}
			});

			_createThemeFactory.add({
				newThemes: {
					"chatAlert": ({ bgColor, titleColor }) => {
						return _convertCssToJson({ css:`
						:root {
							--alert-bg: ${bgColor};
							--alert-title-color: ${titleColor};
							--alert-command-bg: #ffffff;
							--alert-command-border: 1px solid #cccccc;
							--alert-footer-color: #555;
						}

						h3 {
							color: var(--alert-title-color);
							margin: 0;
							font-size: 1.2em;
						}

						p {
							margin: 5px 0;
						}

						.alert-message {
							border: 1px solid black;
							background-color: var(--alert-bg);
							padding: 10px;
							border-radius: 10px;
						}

						.alert-command {
							margin: 8px 0;
							padding: 5px;
							background-color: var(--alert-command-bg);
							border: var(--alert-command-border);
							border-radius: 5px;
							font-family: monospace;
						}

						.alert-footer {
							margin: 5px 0;
							font-size: 0.9em;
							color: var(--alert-footer-color);
						}`});
					}
				}
			});

			*/

			// Alert Script is Initializing
			Utils.LogSyslogMessage({
				severity: 6,
				code: "10000",
				message: `${PhraseFactory.get({code: "10000"})}`
			});

			return 0;

		} else {

			const _getSyslogTimestamp = () => {
				const now = new Date();

				return now.toISOString();
			};

			const logMessage = `${_getSyslogTimestamp()} [${moduleSettings.modName}] (ERROR): {"code": 50000, "message": "EASY_LIB_UTILITIES (Easy-LibUtilities) is unavailable; try loading it in the Mod(API) scripts console."}`;
			log(logMessage);

			return 1;
		}
	};

	const registerEventHandlers = () => {

		on("chat:message", (apiCall) => {
			if (apiCall.type !== "api" || !new RegExp(`^!${moduleSettings.chatName}(\\b\\s|$)`).test(apiCall.content)) {
				return;
			}
			 else {
				_handleChatMessages(apiCall);
			}
		});

		Utils.LogSyslogMessage({
			severity: 6,
			code: "20000",
			message: `${PhraseFactory.get({code: "20000"})}`
		});

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
