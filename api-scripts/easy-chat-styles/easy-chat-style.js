/*
@language: en-US
@title:
@subject: This script returns HTML Builder (a Roll20 api module), for consistent styling across suites.
@tags:
@category:
@content status: draft
@company: 
@author:
@comment: 
@copyright: © 2024 XXX. All rights reserved.
*/

/* 
Usage:
In another Easy API script:
myMenuCss = easyChatStyle.getChatStyleJson()
*/

const easyChatStyle = (() => {

	// ANCHOR API Script Defaults
	/**
	 * Default configuration for the API module.
	 * Contains metadata and settings used across the script.
	 *
	 * @constant {Object} apiDefaults - Configuration for the API module.
	 */
	const apiDefaults = {
		name: 'Easy-ChatStyle',
		shortname: "ezchatstyle",
		version: "0.1.0",
		author: "Mhykiel",
		verbose: true,
		dataContainingHandoutIcon: "https://s3.amazonaws.com/files.d20.io/images/295769190/Abc99DVcre9JA2tKrVDCvA/thumb.png?1658515304",
		dataContainingHandoutName: "Chat Style Sheet",
		dataContainingHandoutDivId: "data-ezChatStyle",
		get dataContainingHandoutDivRegex() {
			return `<div[^>]*id=["']${this.dataContainingHandoutDivId}["'][^>]*>(.*?)<\\/div>`;
		},
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
		"50003": () => log(`${apiDefaults.name}: ${apiDefaults.dataContainingHandoutName} was not found. Creating a handout with default CSS Json.`),
		"50004": () => log(`${apiDefaults.name}: ${apiDefaults.dataContainingHandoutName} was present but malformed. Updating handout with defaults.`),
		"50005": () => log(`${apiDefaults.name}: Attempting to extract data from ${apiDefaults.dataContainingHandoutName}...`),
		"50006": () => log(`${apiDefaults.name}: There was an error extracting Json data from the handout '${apiDefaults.dataContainingHandoutName}'; Returning default CSS from script.`),
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
	 * Creates a new handout with specified content, visibility, and edit permissions.
	 *
	 * @param {string} handoutName - The name of the handout to create.
	 * @param {string} handoutArea - The handout area to store the content (e.g., "gmnotes").
	 * @param {string} plainContent - The plain text content to encode and set in the handout.
	 * @param {string} viewedBy - Comma-separated player IDs or "all" to specify who can view the handout.
	 * @param {string} editedBy - Comma-separated player IDs or "all" to specify who can edit the handout.
	 * @param {string|null} [journalIcon=null] - The optional icon URL for the handout.
	 */
	const _createHandoutWithContent = function (handoutName, handoutArea = "gmnotes", plainContent, viewedBy = "", editedBy = "", journalIcon = null) {
		const handoutContent = _encodeNoteContent(plainContent);

		// Create handout
		const handoutProperties = {
			type: 'handout',
			name: handoutName,
			inplayerjournals: viewedBy, // Specifies who can view the handout (empty means no one initially).
			avatar: journalIcon,
			controlledby: editedBy   // Specifies who can edit the handout ("all" or specific player IDs).
		};
		const newHandout = createObj('handout', Object.assign(handoutProperties));

		// Set handout area with the encoded content
		newHandout.set(handoutArea, handoutContent);
	};

	/**
	 * Updates a specific area of a handout with new content, creating the handout if it doesn't exist.
	 *
	 * @param {string} handoutName - The name of the handout to update or create.
	 * @param {string} [handoutArea="gmnotes"] - The handout area to update (e.g., "gmnotes" or "notes").
	 * @param {string} plainContent - The plain text content to encode and set in the handout.
	 * @param {string} [viewedBy=""] - Comma-separated player IDs or "all" for who can view the handout.
	 * @param {string} [editedBy=""] - Comma-separated player IDs or "all" for who can edit the handout.
	 */
	const _updateHandout = function (handoutName, handoutArea = "gmnotes", plainContent, viewedBy = "", editedBy = "", journalIcon = null) {

		const encodedContent = _encodeNoteContent(plainContent);
		let foundHandout = findObjs({ _type: "handout", name: handoutName })[0];

		// Update permissions for the existing handout
		foundHandout.set({
			name: handoutName,
			inplayerjournals: viewedBy, // Specifies who can view the handout (empty means no one initially).
			avatar: journalIcon,
			controlledby: editedBy   // Specifies who can edit the handout ("all" or specific player IDs).
		});

		// Update the specified area of the handout
		foundHandout.set(handoutArea, encodedContent);
	};
	// !SECTION

	// SECTION PRIVATE FUNCTIONS AND DATA

	// ANCHOR Default CSS Json Data (HTML Builder Syntax)
	/**
	 * Default CSS styles for use with the HTML Builder in Easy scripts.
	 * These styles are stored in the GM notes of a handout, allowing in-game editing.
	 *
	 * @constant {Object} defaultStyleJson - JSON object containing default style definitions.
	 */
	const defaultStyleJson = {
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

		// Ensure css containing handout is present or create one.
		let dataContainingHandout = findObjs({
			_type: 'handout',
			name: apiDefaults.dataContainingHandoutName,
		})[0];

		if (!dataContainingHandout) {

			// Handout not present in Game; create it. This handout records the CSS delivered to other calling scripts.
			const handoutName = apiDefaults.dataContainingHandoutName;
			const handoutArea = "gmnotes"
			const handoutContent = `<div style="display: none;" id="${apiDefaults.dataContainingHandoutDivId}">
				${JSON.stringify(defaultStyleJson, null, "    ")}
				</div>`
			const handoutIcon = apiDefaults.dataContainingHandoutIcon;

			// Create handout
			_createHandoutWithContent(handoutName, handoutArea, handoutContent, "", "", handoutIcon)

			if (apiDefaults.verbose) {

				// Creating handout with defaults
				sendMessageMap[50003]()
			}

		} else {
			dataContainingHandout.get('gmnotes', (gmnotes) => {

				if (apiDefaults.verbose) {
					// sendMessageMap[50000](gmnotes)
				}

				const decodedNotes = _decodeNoteContent(gmnotes);
				const regex = new RegExp(apiDefaults.dataContainingHandoutDivRegex, 's'); // 's' flag allows matching across multiple lines

				if (!decodedNotes || !regex.test(decodedNotes)) {

					// GM Notes is blank or incorrect; update with defaults
					const handoutName = apiDefaults.dataContainingHandoutName;
					const handoutArea = "gmnotes"
					const handoutContent = `<div style="display: none;" id="${apiDefaults.dataContainingHandoutDivId}">
						${JSON.stringify(defaultStyleJson, null, "    ")}
						</div>`
					const handoutIcon = apiDefaults.dataContainingHandoutIcon;

					_updateHandout(handoutName, handoutArea, handoutContent, "", "", handoutIcon)

					if (apiDefaults.verbose) {
						// Alert what content was considered 'malformed' or blank
						sendMessageMap[50000](decodedNotes)

						// Alert updated found handout
						sendMessageMap[50004]()
					}

				} else {

					if (apiDefaults.verbose) {

						// Superfluous Success
						// sendMessageMap[0]()
					}
				}
			});
		}
	};

	// SECTION PUBLIC FUNCTIONS
	/**
	 * Retrieves the default styles JSON.
	 */
	function getDefaultChatStyleJson() {

		const output = JSON.stringify(defaultStyleJson, null, "    ");

		if (apiDefaults.verbose) {

			// Alert returning defaults from this script
			sendMessageMap[50000](output)
		}

		return output
	}

	/**
	 * Retrieves the style JSON from the handout or defaults if not available.
	 */
	function getChatStyleJson() {
		let isHandoutPresent = true;
		let isContentPresent = true;
		let jsonData = "";

		if (apiDefaults.verbose) {
			sendMessageMap[50005]()
		}

		let dataContainingHandout = findObjs({
			_type: 'handout',
			name: apiDefaults.dataContainingHandoutName,
		})[0];

		// Check if Handout is present
		if (!dataContainingHandout) {
			isHandoutPresent = false;
		}

		// Extract data from handout
		dataContainingHandout.get('gmnotes', (gmnotes) => {

			// Check if note content is empty or null
			if (!gmnotes || gmnotes.trim() === "") {
				isContentPresent = false;
			} else {
				const decodedNotes = _decodeNoteContent(gmnotes);
				jsonData = _extractDivFromContent(decodedNotes);

				// Check if jsonData is empty or null
				if (!jsonData || jsonData.trim() === "") {

					isContentPresent = false;
				}
			}
		});

		switch (true) {
			case isHandoutPresent && isContentPresent:
				if (apiDefaults.verbose) {
					sendMessageMap[0]()
				}
				return JSON.stringify(jsonData, null, "    ");

			case isHandoutPresent || isContentPresent:
				if (apiDefaults.verbose) {
					sendMessageMap[50006]()
				}
				return getDefaultChatStyleJson();
		}
	}

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
		getChatStyleJson,
		getDefaultChatStyleJson,
	};

})();
