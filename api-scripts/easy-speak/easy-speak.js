/*
@language: en-US
@title:
@subject: Inspects a character sheet for the language proficiencies it has, whispers to the players who know that language (via a handout visibility), but for others sends to chat a random string of words.
@tags:
@category:
@content status: draft
@company: 
@author:
@comment: 
@copyright: © 2024 XXX. All rights reserved.
*/

const easySpeak = (() => {

	// ANCHOR API Script Defaults
	/**
	 * Default configuration for the API module.
	 * Contains metadata and settings used across the script.
	 *
	 * @constant {Object} apiDefaults - Configuration for the API module.
	 */
	const apiDefaults = {
		name: 'Easy-Speak',
		shortname: "ezspeak",
		version: "0.1.0",
		author: "Mhykiel",
		verbose: true,
		dataContainingHandoutIcon: null,
		dataContainingHandoutName: "Language: ",
		dataContainingHandoutDivId: "data-ezSpeak",
		// Lazy initialization for things that may not be ready at load.
		get dataContainingHandoutDivRegex() {
			return `<div[^>]*id=["']${this.dataContainingHandoutDivId}["'][^>]*>(.*?)<\\/div>`;
		},
		get htmlBuilderCSS() {
			try {
				return easyChatStyle?.getChatStyleJson() || {
					styles: {
						menuBox: {
							background: '#ffdddd',
							border: '1px solid black',
							'border-radius': '5px',
							padding: '10px',
							'font-family': 'Arial, sans-serif',
							margin: '10px 0'
						},
						menuHeader: {
							color: '#cc0000',
							'font-size': '1.2em',
							'font-weight': 'bold',
							margin: '0 0 10px 0',
						},
						menuBody: {
							margin: '10px 0',
							'font-size': '1em',
						},
						codeBlock: {
							margin: '10px 0',
							padding: '5px',
							'background-color': '#ffffff',
							border: '1px solid #cccccc',
							'border-radius': '3px',
							'font-family': 'monospace',
						},
						FooterNote: {
							color: '#555',
							'font-size': '0.9em',
						},
						errorMenuBox: {
							background: '#ffdddd',
							border: '1px solid black',
							'border-radius': '5px',
							padding: '10px',
							'font-family': 'Arial, sans-serif',
							margin: '10px 0'
						},
						errorMenuHeader: {
							color: '#cc0000',
							'font-size': '1.2em',
							'font-weight': 'bold',
							margin: '0 0 10px 0',
						},
						errorMenuBody: {
							margin: '10px 0',
							'font-size': '1em',
						},
						errorCodeBlock: {
							margin: '10px 0',
							padding: '5px',
							'background-color': '#ffffff',
							border: '1px solid #cccccc',
							'border-radius': '3px',
							'font-family': 'monospace',
						},
						errorFooterNote: {
							color: '#555',
							'font-size': '0.9em',
						}
					}
				};
			} catch (error) {
				log(`${apiDefaults.name}: Error while getting htmlBuilderCSS - ${error.message}`);
				return {
					styles: { /* Your fallback styles here */ }
				};
			}
		}
	};

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
	const startActionMap = {
		"--menu": (msg) => _sendErrorMessage(msg, "using menu."),
//		"--speak": (msg) => _sendErrorMessage(msg, "using speak command."),
//		"--remark": (msg) => _sendErrorMessage(msg, "using remark command."),
//		"--as": (msg) => _sendErrorMessage(msg, "using as command."),
//		"--add": (msg) => _sendErrorMessage(msg, "using add command."),
//		"--remove": (msg) => _sendErrorMessage(msg, "using remove command."),
		"--ids": (msg) => _sendErrorMessage(msg, "using ids command."),
	};

	// ANCHOR Status Code to Log Message Map 
	/**
	 * A mapping of status codes to logging functions for reporting messages.
	 * Each status code corresponds to a specific log message, aiding in debugging
	 * and providing context for script execution states.
	 *
	 * @constant {Object.<string, Function>} sendMessageMap - Map of status codes to log actions.
	 */
	const sendMessageMap = {
		"0": () => log(`${apiDefaults.name}: Success`),
		"50000": (genericMessage) => log(`${apiDefaults.name}: ${genericMessage}`),
		"50001": () => log(`${apiDefaults.name}: --- Initializing ---`),
		"50002": () => log(`${apiDefaults.name}: ${apiDefaults.name} v${apiDefaults.version} by ${apiDefaults.author} is ready.`),
		"50010": (msg) => _sendErrorMessage(msg, `no tokens selected for: ${msg.content}`),
	}

	// SECTION BOILER PLATE UTILITY FUNCTIONS
	/**
	 * Decodes HTML-encoded text into plain text.
	 * Converts encoded characters and entities to their readable equivalents.
	 *
	 * @param {string} encodedText - The HTML-encoded input string.
	 * @returns {string} The decoded plain text.
	 */
	const _decodeNoteContent = function (encodedText) {
		return encodedText
			.replace(/&lt;/g, "<")   // Decode <
			.replace(/&gt;/g, ">")   // Decode >
			.replace(/&amp;/g, "&")  // Decode &
			.replace(/&quot;/g, '"') // Decode "
			.replace(/&#39;/g, "'")  // Decode '
			.replace(/&nbsp;/g, " ") // Decode non-breaking spaces
			.replace(/<br>/g, "\n"); // Decode line breaks
	};

	/**
	 * Encodes plain text into HTML-encoded text.
	 * Converts characters and whitespace into their HTML-encoded equivalents for GM notes.
	 *
	 * @param {string} plainText - The plain text input.
	 * @returns {string} The HTML-encoded text.
	 */
	const _encodeNoteContent = function (plainText) {
		return plainText
			.replace(/&/g, "&amp;")     // Encode &
			.replace(/</g, "&lt;")      // Encode <
			.replace(/>/g, "&gt;")      // Encode >
			.replace(/"/g, "&quot;")    // Encode "
			.replace(/'/g, "&#39;")     // Encode '
			.replace(/ /g, "&nbsp;")    // Encode spaces as non-breaking
			.replace(/\n/g, "<br>");    // Encode newlines as <br>
	};

	/**
	 * Parses commands and their arguments from a message string.
	 * 
	 * @param {string} msgContent - The input message containing commands and arguments.
	 * @returns {Map<string, string[]>} A map where keys are commands (with '--' prefix) 
	 * and values are arrays of arguments for each command.
	 */
	function _parseCommandsFromMsg(msgContent) {
		const commandMap = new Map();

		// Step 1: Split the string by '--'
		const segments = msgContent.split('--').filter(segment => segment.trim() !== '');

		// Step 2: Skip the first segment (API call) and process the rest
		segments.slice(1).forEach(segment => {
			const [command, ...args] = segment.trim().split(/\s+/); // Split by whitespace
			commandMap.set(`--${command}`, args); // Add to map with '--' prefix for the command
		});

		return commandMap;
	}

	/**
	 * Sends a styled error message to the player who issued a command.
	 * 
	 * @param {Object} msg - The Roll20 message object containing player and command details.
	 * @param {string} errorText - The error message to display to the player.
	 */

	function _sendErrorMessage(msg, errorText) {

		const player = msg.playerid ? getObj('player', msg.playerid) : null;
		const playerName = player ? player.get('_displayname') : "Unknown Player";

		if (!player) {
			log(`Error: No valid player found for msg.playerid ${msg.playerid}`);
		}

		sendChat(apiDefaults.name,
			`/w "${playerName}" ` +
			`<div style="border:1px solid black; background-color:#ffdddd; padding:10px; border-radius:5px;">` +
			`<h3 style="color:#cc0000; margin:0; font-size:1.2em;">Error</h3>` +
			`<p style="margin:5px 0;">` +
			`You attempted to run the following command:` +
			`</p>` +
			`<div style="margin:10px 0; padding:5px; background-color:#ffffff; border:1px solid #cccccc; border-radius:3px; font-family:monospace;">` +
			`${msg.content}` +
			`</div>` +
			`<p style="margin:5px 0;">` +
			`${errorText}.` +
			`</p>` +
			`<p style="margin:5px 0; font-size:0.9em; color:#555;">` +
			`If you continue to experience issues, contact the script author for assistance.` +
			`</p>` +
			`</div>`
		);
	}

	/**
	 * Sends a whispered message to a specified player name.
	 *
	 * @param {string} playerName - The player to whisper to. (cleaning it if GM)
	 * @param {string} message - The message to send.
	 */
	function _whisper(from, to, message) {
		cleanedName = to.replace(/\(GM\)/g, '').trim();
		sendChat(from, `/w "${cleanedName}" ${message}`);
	};
	// !SECTION

	// SECTION PRIVATE FUNCTIONS AND DATA

	/**
	 * Extracts JSON content embedded in a specific div from a handout's GM notes.
	 * Matches the content of a hidden div by its ID.
	 *
	 * @param {string} contentString - The GM notes content as a string.
	 * @returns {string|null} The extracted JSON string or null if not found.
	 */
	function _extractDivFromContent(contentString) {
		const regex = new RegExp(`${apiDefaults.dataContainingHandoutDivRegex}`, 's');
		const matchesArray = regex.exec(contentString);

		if (matchesArray && matchesArray[1]) {
			return _decodeNoteContent(matchesArray[1]);
		} else {
			throw new Error("Failed to parse Div for content.");
		}
	}

	/**
	 * Ensures the handout exists and is properly formatted.
	 * Creates or updates the handout as needed for script functionality.
	 */
	const checkInstall = function () {
		// EMPTY
	};

	// SECTION PUBLIC FUNCTIONS


	// ANCHOR API ON CHAT MESSAGE
	on('chat:message', function (msg) {

		if (msg.type === 'api' && msg.content.indexOf(`!${apiDefaults.shortname}`) !== -1) {

			/* NOTE If the message comes from a player, thisPlayerId will hold the player object for further use (e.g.,
			retrieving the player's name or sending a whisper to them). If no player is associated (e.g., the message is 
			from an API command), thisPlayerId will be null, avoiding unnecessary errors.
			*/
			const thisPlayerId = msg.playerid ? getObj('player', msg.playerid) : null;
			const thisPlayerName = thisPlayerId ? thisPlayerId.get('_displayname') : "Unknown Player";
			const thisPlayerIsGm = thisPlayerId && playerIsGM(msg.playerid) ? true : false;

			const msgDetails = {
				raw: msg,
				commandMap: _parseCommandsFromMsg(msg.content),
				isFromGm: thisPlayerIsGm,
				senderId: thisPlayerId,
				senderDisplayName: thisPlayerName.replace(/\(GM\)/g, '').trim(),
			};

			// Check if --ids is provided
			if (!msgDetails.commandMap.has('--ids')) {
				if (!msg.selected || msg.selected.length === 0) {
					// No --ids and no tokens selected. Use errorMap to handle the error.
					sendMessageMap[50010](msg)
					return;
				} else {
					// --ids not provided. Use selected token IDs
					const selectedTokenIds = msg.selected.map(sel => sel._id);
					msgDetails.commandMap.set('--ids', selectedTokenIds);
				}
			}

			if (apiDefaults.verbose) {
				let chatOutput = `/w gm <b>Command Map from ${msg.playerid}:</b><br>`;
				msgDetails.commandMap.forEach((args, command) => {
					chatOutput += `<strong>${command}:</strong> [${args.join(", ")}]<br>`;
				});
				sendChat("System", chatOutput);
			}

			// Debugging: Output the command map
			let chatOutput = `/w gm <b>Command Map from ${msg.playerid}:</b><br>`;

			msgDetails.commandMap.forEach((args, command) => {
				chatOutput += `<strong>${command}:</strong> [${args.join(", ")}]<br>`;
			});
			sendChat("System", chatOutput);

			// Check if a command exists in the commandMap and execute the corresponding action
			msgDetails.commandMap.forEach((args, command) => {
				if (startActionMap.hasOwnProperty(command)) {
					// Execute the corresponding action, passing the message and arguments
					startActionMap[command](msg);
				} else {
					// Handle unknown command
					if (msgDetails.isFromGm) {
						sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" GM ALERRT!!! Unknown command: ${command}`);
					}
					sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" Unknown command: ${command}`);
				}
			});

		} else {
			return
		}
	});

	// ANCHOR API ON READY 
	on("ready", () => {

		// Alert Script is Initializing
		sendMessageMap[50001]()

		checkInstall();

		// Script is ready
		sendMessageMap[50002]()
	});

	// ANCHOR EXPOSED FUNCTIONS
	return {
		//speak,
		//speakAs,
	};

})();
