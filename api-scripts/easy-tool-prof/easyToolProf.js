on('ready', () => {
    log('Tool Prof Trait Adder is ready!');

    const decodeHtml = (html) => {
        return html.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');
    };

    const extractJsonFromGmNotes = (notes) => {
        const decodedNotes = decodeHtml(notes);

        const match = decodedNotes.match(/<div[^>]*id="easyToolProf"[^>]*>(.*?)<\/div>/);
        if (!match || !match[1]) {
            log('Error: Could not locate JSON data in GM Notes.');
            return null;
        }

        const jsonContent = match[1]
            .replace(/<br>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();

        try {
            return JSON.parse(jsonContent);
        } catch (error) {
            log('Error parsing JSON content:', error);
            return null;
        }
    };

    const getToolDescriptions = (callback) => {
        const handout = findObjs({ _type: 'handout', name: 'easyToolProf' })[0];
        if (!handout) {
            log('Error: Handout "easyToolProf" not found.');
            callback({});
            return;
        }

        handout.get('gmnotes', (notes) => {
            if (!notes) {
                log('Error: No GM Notes in "easyToolProf" handout.');
                callback({});
                return;
            }

            const toolData = extractJsonFromGmNotes(notes);
            if (!toolData) {
                callback({});
                return;
            }

            const tools = {};
            toolData.components.forEach(tool => {
                tools[tool.name.toLowerCase()] = tool;
            });
            callback(tools);
        });
    };

    const getOtherTools = (characterId) => {
        const otherToolsAttr = findObjs({
            _type: 'attribute',
            _characterid: characterId,
            name: 'other_tool'
        })[0];

        if (!otherToolsAttr) return [];
        return otherToolsAttr.get('current')
            .split(',')
            .map(tool => tool.trim())
            .filter(tool => tool);
    };

    const addAttributesToCharacter = (characterId, attributes) => {
        attributes.forEach(attribute => {
            createObj('attribute', {
                _characterid: characterId,
                name: attribute.name,
                current: attribute.current || '',
                max: attribute.max || ''
            });
        });
    };

    on('chat:message', (msg) => {
        if (msg.type !== 'api') return;

        const command = msg.content.trim().toLowerCase();

        if (command === '!addtools') {
            if (!msg.selected || msg.selected.length === 0) {
                sendChat('Tool Prof Trait Adder', `/w "${getObj('player', msg.playerid).get('_displayname')}" No tokens are selected.`);
                return;
            }

            getToolDescriptions((toolDescriptions) => {
                msg.selected.forEach(sel => {
                    const token = getObj('graphic', sel._id);
                    if (!token) return;

                    const character = getObj('character', token.get('represents'));
                    if (!character) {
                        sendChat('Tool Prof Trait Adder', `/w "${getObj('player', msg.playerid).get('_displayname')}" Token "${token.get('name')}" is not linked to a character.`);
                        return;
                    }

                    const otherTools = getOtherTools(character.id);

                    if (otherTools.length === 0) {
                        sendChat('Tool Prof Trait Adder', `/w "${getObj('player', msg.playerid).get('_displayname')}" No tool proficiencies found for "${character.get('name')}".`);
                    } else {
                        sendChat('Tool Prof Trait Adder', `/w "${getObj('player', msg.playerid).get('_displayname')}" Adding tool proficiencies for "${character.get('name')}":`);
                        otherTools.forEach(tool => {
                            const toolData = toolDescriptions[tool.toLowerCase()];
                            if (toolData) {
                                addAttributesToCharacter(character.id, toolData.attributes);
                                sendChat('Tool Prof Trait Adder', `/w "${getObj('player', msg.playerid).get('_displayname')}" Added attributes for tool: **${tool}**.`);
                            } else {
                                sendChat('Tool Prof Trait Adder', `/w "${getObj('player', msg.playerid).get('_displayname')}" Tool **${tool}** not found in GM Notes.`);
                            }
                        });
                    }
                });
            });
        }
    });
});
