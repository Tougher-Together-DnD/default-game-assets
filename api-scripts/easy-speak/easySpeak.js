on('ready', () => {
	log('EasySpeak script is loaded and ready!');

	const getAllLanguages = () => {
		// Find all handouts with names starting with "Language:"
		const languageHandouts = findObjs({ _type: 'handout' })
			.filter(handout => handout.get('name').startsWith('Language:'));

		// Extract the language names from the handout names
		const languages = languageHandouts
			.map(handout => handout.get('name').replace('Language: ', '').trim())
			.filter(lang => lang); // Remove any empty or invalid entries

		return languages;
	};

	// Fetch all languages and log them
	const allLanguages = getAllLanguages();
	state.EasySpeak = state.EasySpeak || {};
	state.EasySpeak.languages = allLanguages;

	const getLanguages = (characterId) => {
		// Find the 'other_languages' attribute
		const otherLanguagesAttr = findObjs({
			_type: 'attribute',
			_characterid: characterId,
			name: 'other_languages'
		})[0];

		if (!otherLanguagesAttr) return []; // Return empty array if attribute is not found

		// Split the languages by commas, trim whitespace, and filter out empty entries
		return otherLanguagesAttr.get('current')
			.split(',')
			.map(lang => lang.trim())
			.filter(lang => lang);
	};

	const decodeHtml = (html) => {
		const text = html.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&amp;/g, '&');
		return text;
	};

	const extractWords = (notes) => {
		const decodedNotes = decodeHtml(notes);
		const match = decodedNotes.match(/<div[^>]*id="easySpeakWords"[^>]*>(.*?)<\/div>/);
		if (!match || !match[1]) return [];
		return match[1].split(',').map(word => word.trim()).filter(Boolean);
	};

	const getRandomWords = (words, count) => {
		const shuffled = [...words].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};

	const updatePlayerJournal = (languages, controllingPlayers, action, playerId) => {
		languages.forEach(language => {
			const handout = findObjs({ _type: 'handout', name: `Language: ${language}` })[0];
			if (!handout) {
				sendChat('EasySpeak', `/w "${getObj('player', playerId).get('_displayname')}" No handout found for "Language: ${language}".`);
				return;
			}

			const currentJournals = handout.get('inplayerjournals').split(',').filter(Boolean);

			if (action === 'add') {
				controllingPlayers.forEach(player => {
					if (!currentJournals.includes(player)) {
						currentJournals.push(player);
					}
				});
				handout.set('inplayerjournals', currentJournals.join(','));
				sendChat('EasySpeak', `/w "${getObj('player', playerId).get('_displayname')}" Added controlling players to "Language: ${language}".`);
			} else if (action === 'remove') {
				const updatedJournals = currentJournals.filter(player => !controllingPlayers.includes(player));
				handout.set('inplayerjournals', updatedJournals.join(','));
				sendChat('EasySpeak', `/w "${getObj('player', playerId).get('_displayname')}" Removed controlling players from "Language: ${language}".`);
			}
		});
	};

	const handleAddRemove = (msg, action) => {
		if (!msg.selected || msg.selected.length === 0) {
			sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No tokens are selected.`);
			return;
		}

		msg.selected.forEach(sel => {
			const token = getObj('graphic', sel._id);
			if (!token) return;

			const character = getObj('character', token.get('represents'));
			if (!character) {
				sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" Token "${token.get('name')}" is not linked to a character.`);
				return;
			}

			// Get controlling players from token and character sheet
			const tokenControllers = token.get('controlledby').split(',').filter(Boolean);
			const characterControllers = character.get('controlledby').split(',').filter(Boolean);
			const controllingPlayers = [...new Set([...tokenControllers, ...characterControllers])]; // Merge and deduplicate

			if (controllingPlayers.length === 0) {
				sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No controlling players found for "${token.get('name')}".`);
				return;
			}

			const languages = getLanguages(character.id);
			if (languages.length === 0) {
				sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No languages found for "${character.get('name')}".`);
				return;
			}

			updatePlayerJournal(languages, controllingPlayers, action, msg.playerid);
		});
	};

	const handleLanguageChoice = (msg, args) => {
		const langIndex = args.findIndex(arg => arg.startsWith('--lang'));

		const messageIndex = args.findIndex(arg => arg.startsWith("--message"));

		// Extract the language string between "--lang" and "--message"
		const language = (messageIndex !== -1
			? args.slice(langIndex + 1, messageIndex)
			: args.slice(langIndex + 1) // Handle case where "--message" might not exist
		).join(' ').replace(/^["']|["']$/g, '').trim(); // Remove quotes and trim

		const tokenIndex = args.findIndex(arg => arg.startsWith("--token"));
		const gmIndex = args.findIndex(arg => arg.startsWith("--gm"));

		const message = messageIndex !== -1
			? args.slice(
				messageIndex + 1,
				tokenIndex !== -1
					? tokenIndex
					: gmIndex !== -1
						? gmIndex
						: args.length
			).join(' ').replace('--message', '').trim()
			: '';
		const tokenId = tokenIndex !== -1
			? args.slice(tokenIndex + 1, gmIndex !== -1 ? gmIndex : args.length).join(' ').replace('--token', '').trim()
			: null;
		const gmName = gmIndex !== -1
			? args.slice(gmIndex + 1).join(' ').replace('--gm', '').trim()
			: null;

		// Ensure required fields are present
		if (!language || !message || (!tokenId && !gmName)) {
			sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" Invalid language, message, or speaker (token or GM required).`);
			return;
		}

		// Determine displayName based on input
		let displayName;
		if (tokenId) {
			const token = getObj('graphic', tokenId);
			if (!token) {
				sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" Token not found.`);
				return;
			}
			displayName = token.get('name');
		} else if (gmName) {
			displayName = gmName;
		}

		// Find the corresponding handout
		const handout = findObjs({ _type: 'handout', name: `Language: ${language}` })[0];
		if (!handout) {
			sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No handout found for "Language: ${language}".`);
			return;
		}

		// Process handout GM notes for words
		handout.get('gmnotes', (notes) => {
			if (!notes) {
				sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No GM Notes found in "Language: ${language}".`);
				return;
			}

			const words = extractWords(notes);
			const randomWords = getRandomWords(words, 5);

			if (randomWords.length > 0) {
				// Public emote as the token or GM
				sendChat(displayName, `/em in an unknown language says, "${randomWords.join(' ')}"`);
				sendChat(displayName, `/w gm (In ${language}): ${message}`);

				// Whisper to players in the journal
				const journalPlayers = handout.get('inplayerjournals').split(',').filter(Boolean);
				if (journalPlayers.length > 0) {
					journalPlayers.forEach(playerId => {
						const playerName = getObj('player', playerId)?.get('_displayname') || 'Unknown Player';
						sendChat(displayName, `/w "${playerName}" (In ${language}): ${message}`);
					});
				} else {
					sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No players have access to "Language: ${language}".`);
				}
			} else {
				sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No words available in "Language: ${language}".`);
			}
		});
	};


	const displayLanguagePrompt = (selected, playerId) => {
		if (!selected || selected.length === 0) {
			sendChat('EasySpeak', `/w "${getObj('player', playerId).get('_displayname')}" No tokens are selected.`);
			return;
		}

		selected.forEach((sel) => {
			const token = getObj('graphic', sel._id);
			if (!token) return;

			const character = getObj('character', token.get('represents'));
			if (!character) {
				sendChat('EasySpeak', `/w "${getObj('player', playerId).get('_displayname')}" Token "${token.get('name')}" is not linked to a character.`);
				return;
			}

			const languages = getLanguages(character.id);

			if (languages.length === 0) {
				sendChat('EasySpeak', `/w "${getObj('player', playerId).get('_displayname')}" No languages found for "${character.get('name')}".`);
				return;
			}

			let languagePrompt = `?{Choose Language:`;
			languagePrompt += languages.map(lang => `|${lang},${lang}`).join('');
			languagePrompt += '}';
			let messagePrompt = `?{Message}`;

			// Start constructing the message body
			let messageBody = `/w "${getObj('player', playerId).get('_displayname')}" &{template:default} {{name=EasySpeak Options}}`;
			
			// Add the "Choose a Language" button
			messageBody += ` {{[Choose a Language](!easyspeak --lang ${languagePrompt} --message ${messagePrompt} --token ${token.id})}}`;
			
			if (state.EasySpeak.isGM) {
				// GM-specific buttons
				const allLangChoices = `${state.EasySpeak.languages}`
					.split(',')               // Split the string by commas
					.map(s => s.trim())       // Trim whitespace from each part
					.filter(s => s !== '')    // Remove empty strings (if any)
					.join('|');
			
				let gmLanguagePrompt = `?{Choose Language:`;
				gmLanguagePrompt += `|`;
				gmLanguagePrompt += allLangChoices;
				gmLanguagePrompt += '}';
			
				let speakAsPrompt = `?{Speak As}`;
			
				messageBody += ` {{[GM Speak As](!easyspeak --lang ${gmLanguagePrompt} --message ${messagePrompt} --gm ${speakAsPrompt})}}`;
				messageBody += ` {{[Add Controller to Languages](!easyspeak --add)}}`;
				messageBody += ` {{[Remove Controller from Languages](!easyspeak --remove)}}`;
			}
			
			// Send the combined message to chat
			sendChat('EasySpeak', messageBody);
			
		});
	};

	on('chat:message', (msg) => {
		if (msg.type !== 'api') return;

		const args = msg.content.split(' ');
		const command = args.shift().toLowerCase();
		const isGM = playerIsGM(msg.playerid); // Check if the player is a GM
		state.EasySpeak = state.EasySpeak || {};
		state.EasySpeak.isGM = isGM;

		if (command === '!easyspeak') {
			const subcommand = args.shift()?.toLowerCase();
			if (!subcommand) {
				sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No subcommand provided.`);
				return;
			}

			switch (subcommand) {
				case '--menu':
					if (msg.selected && msg.selected.length > 0) {
						displayLanguagePrompt(msg.selected, msg.playerid);
					} else {
						sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" No tokens are selected.`);
					}
					break;

				case '--lang':
					handleLanguageChoice(msg, args);
					break;

				case '--add':
					handleAddRemove(msg, 'add');
					break;

				case '--remove':
					handleAddRemove(msg, 'remove');
					break;

				default:
					sendChat('EasySpeak', `/w "${getObj('player', msg.playerid).get('_displayname')}" Unknown subcommand "${subcommand}".`);
					break;
			}
		}
	});
});
