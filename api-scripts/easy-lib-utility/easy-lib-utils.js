/*!
@language: en-US
@title: Easy Utility Library Module
@subject: This module provides utility functions for Easy Modules in Roll20. It allows other modules to selectively retrieve and use utility functions, maintaining modularity and reusability.
@author: Mhykiel
@version 0.1.0
@license MIT License
@see {@link https://github.com/Tougher-Together-Gaming/default-game-assets/tree/main/api-scripts/easy-lib-utility|GitHub Repository}
!*/

// eslint-disable-next-line no-unused-vars
const EASY_MODULE_FORGE = (() => {

	const factories = {};

	return {
		setFactory: (type, factory) => {
			factories[type] = factory;
		},
		getFactory: (type) => {
			return factories[type] || null;
		},
	};
})();

// eslint-disable-next-line no-unused-vars
const EASY_LIB_UTILITIES = (() => {

	/*******************************************************************************************************************
	* SECTION PRIVATE DATA                                                                                            *
	*******************************************************************************************************************/

	// ANCHOR moduleSettings; Metadata and configurations for the module
	const moduleSettings = {
		modName: "Easy-LibUtils",
		chatName: "ezlibutils",
		globalName: "EASY_LIB_UTILS",
		version: "1.0.0",
		author: "Mhykiel",
		verbose: true,
		sharedState: "EasyModuleVault",
		sharedObject: "EASY_MODULE_FORGE",
		phraseLanguage: "enUS",
	};

	// Populated during checkInstall()
	let PhraseFactory = {};
	let TemplateFactory = {};
	let ThemeFactory = {};

	// !SECTION END of Private Data

	/*******************************************************************************************************************
	* SECTION UTILITY FUNCTIONS: Low Level                                                                             *
	*******************************************************************************************************************/

	// ANCHOR Function _applyCssToHtmlJson
	/**
	 * Applies CSS rules to an HTML JSON structure as inline styles.
	 *
	 * This function processes CSS and HTML JSON inputs, resolving styles in the following precedence:
	 * Universal > Element > Class > ID > Inline. It supports child-specific and `:nth-child` styles, 
	 * as well as CSS variable resolution.
	 *
	 * @example
	 * const cssJson = `
	 * {
	 *   "universal": { "margin": "0" },
	 *   "elements": { "div": { "color": "blue" } },
	 *   "classes": { ".highlight": { "background": "yellow" } },
	 *   "ids": { "#unique": { "border": "1px solid black" } }
	 * }`;
	 *
	 * const htmlJson = `
	 * [
	 *   {
	 *     "element": "div",
	 *     "props": { "class": ["highlight"], "id": "unique" },
	 *     "children": [{ "element": "span", "props": {}, "children": [] }]
	 *   }
	 * ]`;
	 *
	 * const styledHtmlJson = _applyCssToHtmlJson(cssJson, htmlJson);
	 * console.log(JSON.parse(styledHtmlJson));
	 *
	 * @param {string|object} cssJson - CSS rules as a JSON string or object.
	 * @param {string|object} htmlJson - HTML structure as a JSON string or object.
	 * @returns {string} - HTML JSON with inline styles applied.
	 */
	function _applyCssToHtmlJson({ cssJson, htmlJson }) {

		const cssRules = JSON.parse(cssJson);
		const htmlStructure = JSON.parse(htmlJson);

		// Extract CSS variables defined in the `:root` section
		const cssVariables = {};
		if (cssRules.functions && cssRules.functions[":root"]) {
			cssRules.functions[":root"].forEach(entry => {
				Object.assign(cssVariables, entry.styles);
			});
		}

		// Helper function to resolve CSS variables in style values
		function resolveCssVariables(value) {
			if (typeof value === "string") {
				return value.replace(/var\((--[a-zA-Z0-9-]+)\)/g, (_, variable) => {
					return cssVariables[variable] || `var(${variable})`; // Use variable value or leave unresolved
				});
			}

			return value;
		}

		// Merges new styles into existing styles while respecting inline styles and "!important" rules
		function mergeStyles(existingStyles, newStyles, inlineStyles = {}) {
			for (const [key, value] of Object.entries(newStyles)) {
				const resolvedValue = resolveCssVariables(value);

				// Overwrite inline styles only if the rule is marked as "!important"
				if (resolvedValue.includes("!important")) {
					inlineStyles[key] = resolvedValue;
				} else if (!(key in inlineStyles)) {
					existingStyles[key] = resolvedValue;
				}
			}

			return existingStyles;
		}

		// Retrieves styles for `:nth-child` pseudo-class if applicable
		function getNthChildStyles(node) {
			const nthChildRules = cssRules.functions && cssRules.functions[":nth-child"];
			if (!nthChildRules || !node.childIndex) {
				return {};
			}

			const styles = {};
			nthChildRules.forEach(rule => {
				const target = rule.target;
				const args = rule.args;
				const ruleStyles = rule.styles || {};

				// Skip if the rule target does not match the element
				if (target && target !== node.element) {
					return;
				}

				const childIndex = node.childIndex;
				// Apply styles based on `even`, `odd`, or specific child index
				if (args[0] === "even" && childIndex % 2 === 0) {
					Object.assign(styles, ruleStyles);
				} else if (args[0] === "odd" && childIndex % 2 !== 0) {
					Object.assign(styles, ruleStyles);
				} else if (!isNaN(Number(args[0])) && childIndex === Number(args[0])) {
					Object.assign(styles, ruleStyles);
				}
			});

			return styles;
		}

		// Computes styles for a given element based on its properties and hierarchy
		function getStylesForElement(element, props, node, parent) {
			let styles = {};

			// Apply universal styles
			if (cssRules.universal) {
				styles = mergeStyles(styles, cssRules.universal, props.inlineStyle);
			}

			// Apply element-specific styles
			if (cssRules.elements && cssRules.elements[element]) {
				styles = mergeStyles(styles, cssRules.elements[element].styles || {}, props.inlineStyle);
			}

			// Apply child-specific styles from the parent
			if (parent && cssRules.elements && cssRules.elements[parent.element] && cssRules.elements[parent.element].children) {
				const parentChildRules = cssRules.elements[parent.element].children[element];
				if (parentChildRules) {
					styles = mergeStyles(styles, parentChildRules.styles || {}, props.inlineStyle);
				}
			}

			// Apply class-based styles
			const classList = props.class || [];
			for (const cls of classList) {
				const clsKey = `.${cls}`;
				if (cssRules.classes && cssRules.classes[clsKey]) {
					styles = mergeStyles(styles, cssRules.classes[clsKey].styles || {}, props.inlineStyle);
				}
			}

			// Apply attribute-based styles
			if (cssRules.attributes && cssRules.attributes[element]) {
				for (const attrRule of cssRules.attributes[element]) {
					if (props[attrRule.name] === attrRule.value) {
						styles = mergeStyles(styles, attrRule.styles || {}, props.inlineStyle);
					}
				}
			}

			// Apply ID-based styles
			if (props.id) {
				const idKey = `#${props.id}`;
				if (cssRules.ids && cssRules.ids[idKey]) {
					styles = mergeStyles(styles, cssRules.ids[idKey].styles || {}, props.inlineStyle);
				}
			}

			// Apply nth-child styles
			const nthChildStyles = getNthChildStyles(node);
			styles = mergeStyles(styles, nthChildStyles, props.inlineStyle);

			return styles;
		}

		// Recursively apply styles to the HTML JSON structure
		function applyStylesRecursively(node, parent = null) {
			if (Array.isArray(node)) {
				// Process each child node in an array
				node.forEach(child => { return applyStylesRecursively(child, parent); });
			} else if (typeof node === "object" && node !== null) {
				const element = node.element;
				const props = node.props || {};

				// Initialize inlineStyle if not already defined
				props.inlineStyle = props.inlineStyle || {};

				// Compute styles for the current element
				const computedStyles = getStylesForElement(element, props, node, parent);

				// Assign computed styles and preserve existing inline styles
				const existingInlineStyle = props.inlineStyle;
				props.style = { ...computedStyles }; // Store computed styles here
				props.inlineStyle = { ...existingInlineStyle }; // Retain user-defined inline styles

				// Recursively process children
				const children = node.children || [];
				applyStylesRecursively(children, node);
			}
		}

		// Apply styles recursively to the HTML structure
		applyStylesRecursively(htmlStructure);

		try {

			// Return the html json as a JSON string
			const output = JSON.stringify(htmlStructure, null, 2);

			return output;
		}
		catch (err) {
			_logSyslogMessage({
				severity: 3,
				code: "30000",
				message: `${err}`,
			});

			return 1;
		}
	}

	// ANCHOR Function _convertCssToJson
	/**
	 * Converts a CSS string into a structured JSON format.
	 *
	 * Parses a CSS string, removes comments, and converts selectors and their styles into a 
	 * JSON representation. Handles universal, element, class, ID, attribute, pseudo-class, 
	 * and child selectors, organizing them for easy manipulation.
	 *
	 * @example
	 * const css = `
	 *   * { margin: 0; padding: 0; }
	 *   .class > .child { color: red; }
	 * `;
	 * const cssJson = _convertCssToJson(css);
	 * console.log(JSON.parse(cssJson));
	 * 
	 * Output:
	 * {
	 *   "universal": { "margin": "0", "padding": "0" },
	 *   "classes": { ".class": { "children": { ".child": { "color": "red" } } } },
	 *   "elements": {},
	 *   "ids": {}
	 * }
	 *
	 * @param {string} css - The CSS string to convert.
	 * @returns {string} - Stringified JSON representation of CSS rules.
	 */
	function _convertCssToJson({ css }) {

		const cleanedCSS = css
			.replace(/\/\*[\s\S]*?\*\//g, "")
			.replace(/\n/g, " ").trim();

		// Initialize the JSON structure to categorize selectors
		const cssRules = {
			universal: {},
			elements: {},
			classes: {},
			attributes: {},
			functions: {},
			ids: {},
		};

		// Match expressions for selectors and each of thier properties
		const ruleRegex = /([^\{]+)\{([^\}]+)\}/g;
		const propertiesRegex = /([\w-]+)\s*:\s*([^;]+);/g;

		// Parse CSS rules
		let match;
		while ((match = ruleRegex.exec(cleanedCSS))) {
			const selector = match[1].trim();       // Selector(s)
			const propertiesBlock = match[2].trim(); // Style properties

			// Parse style properties into key-value pairs
			const properties = {};
			let propMatch;
			while ((propMatch = propertiesRegex.exec(propertiesBlock))) {
				const key = propMatch[1].trim();
				const value = propMatch[2].trim();
				properties[key] = value;
			}

			// Split selectors (e.g., `.class, #id`) into individual selectors
			const selectors = selector.split(",").map(s => { return s.trim(); });
			for (const individualSelector of selectors) {
				// Process universal selector (*)
				if (individualSelector === "*") {
					Object.assign(cssRules.universal, properties);

					// Process class selectors (.class)
				} else if (individualSelector.startsWith(".")) {
					const className = individualSelector;
					if (!cssRules.classes[className]) {
						cssRules.classes[className] = { styles: {}, children: {} };
					}
					Object.assign(cssRules.classes[className].styles, properties);

					// Process ID selectors (#id)
				} else if (individualSelector.startsWith("#")) {
					const idName = individualSelector;
					if (!cssRules.ids[idName]) {
						cssRules.ids[idName] = { styles: {}, children: {} };
					}
					Object.assign(cssRules.ids[idName].styles, properties);

					// Process attribute selectors ([attr=value])
				} else if (individualSelector.match(/\[.+\]/)) {
					const attrMatch = individualSelector.match(/^([\w-]+)\[(.+)\]$/);
					if (attrMatch) {
						const target = attrMatch[1];
						const attr = attrMatch[2].split("=");
						const attrName = attr[0];
						const attrValue = attr[1]?.replace(/"/g, "") || null;
						if (!cssRules.attributes[target]) {
							cssRules.attributes[target] = [];
						}
						cssRules.attributes[target].push({
							name: attrName,
							value: attrValue,
							styles: properties,
						});
					}

					// Process pseudo-classes and functional selectors (e.g., :nth-child)
				} else if (individualSelector.includes(":")) {
					const pseudoMatch = individualSelector.match(/^([\w-]+)?(:[\w-]+)(\((.+)\))?$/);
					if (pseudoMatch) {
						const baseSelector = pseudoMatch[1] || null;
						const pseudoClass = pseudoMatch[2];
						const args = pseudoMatch[4] ? pseudoMatch[4].split(",") : [];

						if (!cssRules.functions[pseudoClass]) {
							cssRules.functions[pseudoClass] = [];
						}
						cssRules.functions[pseudoClass].push({
							target: baseSelector,
							args,
							styles: properties,
						});
					}

					// Process child selectors (.parent > .child)
				} else if (individualSelector.includes(">")) {
					const parts = individualSelector.split(">").map(s => { return s.trim(); });
					let currentParent = cssRules.elements;
					parts.forEach((part, index) => {
						if (!currentParent[part]) {
							currentParent[part] = { styles: {}, children: {} };
						}
						if (index === parts.length - 1) {
							Object.assign(currentParent[part].styles, properties);
						} else {
							currentParent = currentParent[part].children;
						}
					});

					// Process element selectors (e.g., div, p)
				} else {
					if (!cssRules.elements[individualSelector]) {
						cssRules.elements[individualSelector] = { styles: {}, children: {} };
					}
					Object.assign(cssRules.elements[individualSelector].styles, properties);
				}
			}
		}

		try {

			// Return the CSS rules as a JSON string
			const output = JSON.stringify(cssRules, null, 2);

			return output;
		}
		catch (err) {
			_logSyslogMessage({
				severity: 3,
				code: "30000",
				message: `${err}`,
			});

			return 1;
		}
	}

	// ANCHOR Function _convertHtmlToJson
	/**
	 * Converts an HTML string into a structured JSON format.
	 *
	 * Parses an HTML string, building a hierarchical JSON representation with support for attributes 
	 * such as `style`, `class`, and `id`. The output is a stringified JSON structure useful for applications 
	 * requiring structured HTML data.
	 *
	 * @example
	 * const html = `
	 * <div class="container" style="color: red;">
	 *   <p>Hello, <span id="highlight">world</span>!</p>
	 * </div>`;
	 *
	 * const json = _convertHtmlToJson({ html });
	 * console.log(JSON.parse(json));
	 *
	 * @param {Object} param - The parameter object.
	 * @param {string} param.html - The HTML string to convert.
	 * @returns {string} - A stringified JSON representation of the HTML structure.
	 */
	function _convertHtmlToJson({ html }) {
		// Regex to match both HTML tags and text nodes
		const regex = /<\/?\w+[^>]*>|[^<>]+/g;

		// Tokenize the HTML into an array of elements, trimming whitespace and filtering out empty strings
		const elementsArray = html.match(regex).map(item => { return item.trim(); }).filter(Boolean);

		const parseHTMLToJSON = (nodeArray) => {
			const stack = []; // Stack to track nested elements
			const root = { children: [] }; // Root node for the resulting JSON structure
			stack.push(root);

			nodeArray.forEach(element => {
				const openingTagMatch = element.match(/^<(\w+)([^>]*)>$/); // Match opening tags
				const closingTagMatch = element.match(/^<\/(\w+)>$/); // Match closing tags

				if (openingTagMatch) {
					// Handle opening tags
					const [, tag, attributes] = openingTagMatch;

					// Initialize properties for the tag
					const props = { style: {}, class: [], id: null, inlineStyle: {} };

					if (attributes) {
						// Extract attributes using regex
						const attributeRegex = /([\w-]+)\s*=\s*["']([^"']+)["']/g;
						let attrMatch;
						while ((attrMatch = attributeRegex.exec(attributes))) {
							const [, key, value] = attrMatch;

							if (key === "style") {
								// Parse inline styles into an object
								const styleObject = {};
								value.split(";").forEach(style => {
									const [styleKey, styleValue] = style.split(":").map(s => { return s.trim(); });
									if (styleKey && styleValue) {
										styleObject[styleKey] = styleValue;
									}
								});
								props.inlineStyle = styleObject;
							} else if (key === "class") {
								// Parse class attribute into an array
								props.class = value.split(" ").filter(Boolean);
							} else if (key === "id") {
								// Handle id attribute
								props.id = value;
							} else {
								// Handle other attributes
								props[key] = value;
							}
						}
					}

					// Create a new node for the opening tag
					const node = { element: tag, props, children: [], childIndex: 0 };
					const parent = stack[stack.length - 1]; // Get the current parent node

					if (parent) {
						// Update child index and add the new node to the parent's children
						node.childIndex = parent.children.length + 1;
						parent.children.push(node);
					}

					stack.push(node); // Push the new node onto the stack
				} else if (closingTagMatch) {
					// Handle closing tags by popping the stack
					stack.pop();
				} else {
					// Handle text nodes
					const textNode = {
						element: "text", // Text nodes use a generic "text" element
						children: [{ innerText: element.trim() }], // Store the text content
						childIndex: 0
					};

					const parent = stack[stack.length - 1]; // Get the current parent node

					if (parent) {
						// Update child index and add the text node to the parent's children
						textNode.childIndex = parent.children.length + 1;
						parent.children.push(textNode);
					}
				}
			});

			// If the stack isn't back to the root, there are unclosed tags
			if (stack.length !== 1) {

				_logSyslogMessage.call(moduleSettings, {
					severity: 3,
					code: "50000",
					message: `${PhraseFactory.get({ code: "0x0CBDE1DE" })}`
				});
			}

			
			return root.children; // Return the parsed structure
		};

		try {

			// Parse the tokenized elements and return the JSON stringified representation
			const output = JSON.stringify(parseHTMLToJSON(elementsArray), null, 2);

			return output;
		}
		catch (err) {
			_logSyslogMessage({
				severity: 3,
				code: "30000",
				message: `${err}`,
			});

			return 1;
		}
	}

	// ANCHOR Function _convertJsonToHtml
	/**
	 * Converts a JSON representation of HTML into an HTML string.
	 *
	 * Recursively processes a JSON structure, generating equivalent HTML. Attributes, classes, 
	 * IDs, and styles are converted into their respective HTML formats. Nested elements are 
	 * handled hierarchically.
	 *
	 * @example
	 * const json = `
	 * [
	 *   {
	 *     "element": "div",
	 *     "props": { "styles": { "color": "red" }, "class": ["container"] },
	 *     "children": [
	 *       {
	 *         "element": "p",
	 *         "props": {},
	 *         "children": [ { "innerText": "Hello, World!" } ]
	 *       }
	 *     ]
	 *   }
	 * ]`;
	 *
	 * const html = _convertJsonToHtml({ htmlJson: json });
	 * console.log(html);
	 * // Output: <div class="container" style="color: red;"><p>Hello, World!</p></div>
	 *
	 * @param {Object} param - The parameter object.
	 * @param {string} param.htmlJson - The JSON string representing the HTML structure.
	 * @returns {string} - The reconstructed HTML string.
	 */
	function _convertJsonToHtml({ htmlJson }) {
		// Helper function to convert a style object into a CSS inline string
		function styleToString(styleObj) {
			return Object.entries(styleObj)
				.map(([key, value]) => {
					// Convert camelCase properties to kebab-case and format as key: value;
					return `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`;
				})
				.join(" ");
		}

		// Recursive function to process each node in the JSON structure
		function processNode(node) {
			if (!node.element) return ""; // Return an empty string if the node has no element

			if (node.element === "text") {
				// Handle text nodes
				return node.children && node.children[0]?.innerText ? node.children[0].innerText : "";
			}

			// Combine style and inlineStyle properties, with inlineStyle taking precedence
			const combinedStyle = { ...node.props?.style, ...node.props?.inlineStyle };
			const styleString = styleToString(combinedStyle);

			// Build an array of attributes for the HTML tag
			const attributes = [];
			if (styleString) attributes.push(`style="${styleString}"`);
			if (node.props?.class?.length) attributes.push(`class="${node.props.class.join(" ")}"`);
			if (node.props?.id) attributes.push(`id="${node.props.id}"`);

			// Include any other attributes not explicitly handled
			Object.keys(node.props || {})
				.filter(key => { return !["style", "inlineStyle", "class", "id"].includes(key); })
				.forEach(key => {
					attributes.push(`${key}="${node.props[key]}"`);
				});

			// Recursively process children and concatenate their HTML
			const childrenHtml = (node.children || []).map(child => { return processNode(child); }).join("");

			// Construct the HTML string for this node
			return `<${node.element} ${attributes.join(" ")}>${childrenHtml}</${node.element}>`;
		}

		// Parse the JSON string and process each top-level node
		const json = JSON.parse(htmlJson);

		try {
			
			// Generate the final HTML string by processing all nodes
			const output = json.map(node => { return processNode(node); }).join("");

			return output;
		}
		catch (err) {
			_logSyslogMessage({
				severity: 3,
				code: "30000",
				message: `${err}`,
			});

			return 1;
		}
	}

	// ANCHOR Function _convertToSingleLine
	/**
	 * Converts a multiline string into a single-line string while preserving quoted text.
	 *
	 * Replaces all whitespace with single spaces, except within quoted text (single or double quotes), 
	 * which remains unchanged.
	 *
	 * @example
	 * const singleLine = _convertToSingleLine({ multiline: "This is \n a 'test of \nquotes'." });
	 * console.log(singleLine); 
	 * // Output: "This is a 'test of \nquotes'."
	 *
	 * @param {Object} options - The parameter object.
	 * @param {string} options.multiline - The multiline string to convert.
	 * @returns {string} - The resulting single-line string.
	 */
	const _convertToSingleLine = ({ multiline }) => {
		// Regex to match quoted text or whitespace:
		// - Group 1 (`("[^"]*"|'[^']*')`): Matches quoted text, either single or double quotes.
		// - `\s+`: Matches any sequence of whitespace outside of quoted text.
		const regex = /("[^"]*"|'[^']*')|\s+/g;

		// Replace all whitespace with a single space, unless it's within quoted text.
		return multiline.replace(regex, (_, quoted) => {
			return quoted ? quoted : " "; // Preserve quoted text; replace other matches with a single space.
		});
	};

	// ANCHOR Function _decodeNoteContent
	/**
	 * Decodes HTML-encoded text into plain readable text.
	 *
	 * Converts HTML entities (e.g., `&lt;`, `&gt;`, `&nbsp;`) into their plain text equivalents, including special characters, spaces, and line breaks. Useful for working with Roll20 Notes content programmatically.
	 *
	 * @example
	 * const decodedText = _decodeNoteContent({ encodedText: "Hello&nbsp;&lt;World&gt;&nbsp;&amp;&nbsp;&#39;Friends&#39;" });
	 * console.log(decodedText); 
	 * // Output: "Hello <World> & 'Friends'"
	 *
	 * @param {Object} params - The parameters for decoding.
	 * @param {string} params.text - The HTML-encoded string.
	 * @returns {string} - The plain text with HTML entities decoded.
	 */
	function _decodeNoteContent({ text }) {
		return text
			.replace(/&lt;/g, "<")    // Decode <
			.replace(/&gt;/g, ">")    // Decode >
			.replace(/&quot;/g, "\"") // Decode "
			.replace(/&#39;/g, "'")   // Decode '
			.replace(/&nbsp;/g, " ")  // Decode non-breaking spaces
			.replace(/<br>/g, "\n")   // Decode line breaks
			.replace(/&amp;/g, "&");  // Decode & (must be done last to avoid double replacements)
	}

	// ANCHOR Function _encodeNoteContent
	/**
	 * Encodes plain text into HTML-safe text.
	 *
	 * Converts special characters, spaces, and newlines into their HTML entity equivalents (e.g., `<` to `&lt;`, `\n` to `<br>`). Ensures compatibility with Roll20 Notes, GM Notes, and Character Bio fields.
	 *
	 * @example
	 * const encodedText = _encodeNoteContent({ plainText: "Hello <World> & 'Friends'" });
	 * console.log(encodedText); 
	 * // Output: "Hello&nbsp;&lt;World&gt;&nbsp;&amp;&nbsp;&#39;Friends&#39;"
	 *
	 * @param {Object} params - The parameters for encoding.
	 * @param {string} params.plainText - The plain text string to encode.
	 * @returns {string} - The HTML-encoded string.
	 */
	function _encodeNoteContent({ text }) {
		return text
			.replace(/&/g, "&amp;")   // Encode & (must be done first to avoid double replacements)
			.replace(/</g, "&lt;")    // Encode <
			.replace(/>/g, "&gt;")    // Encode >
			.replace(/"/g, "&quot;")  // Encode "
			.replace(/'/g, "&#39;")   // Encode '
			.replace(/ /g, "&nbsp;")  // Encode spaces as non-breaking
			.replace(/\n/g, "<br>");  // Encode newlines as <br>
	}

	// ANCHOR Function _getSharedForge
	/**
	 * Retrieves the global in-memory shared object for EasyModules.
	 *
	 * Provides access to the `EASY_MODULE_FORGE` object, which serves as a shared
	 * in-memory object for managing factories and shared data across modules.
	 *
	 * @example
	 * const sharedFactories = _getSharedForge();
	 * PhraseFactory = sharedFactories.getFactory("PhraseFactory");
	 *
	 * @returns {Object} - The global `EASY_MODULE_FORGE` object.
	 */
	function _getSharedForge() {

		// FIXME Implement a way to dynamically reference this shared in-memory object
		// Currently _fetchingUtilities binds this to the moduleSettings of the importing module overwriting this ones.
		return EASY_MODULE_FORGE;
	}

	// ANCHOR Function _getSharedVault
	/**
	 * Retrieves the persistent shared vault for Easy-Modules using Roll20's state.
	 *
	 * @example
	 * const sharedVault = _getSharedVault();
	 * sharedVault.someKey = 'someValue';
	 * log(sharedVault.someKey);
	 *
	 * @returns {Object} - The persistent `EasyModuleVault` object.
	 */
	function _getSharedVault() {

		// FIXME Implement a way to dynamically reference this shared state object
		// Currently _fetchingUtilities binds this to the moduleSettings of the importing module overwriting this ones.
		const vaultName = "EasyModuleVault";

		// Check if the vault exists in state
		if (!state[vaultName]) {

			// Initialize the vault in state if it doesn't exist
			state[vaultName] = {};
		}

		return state[vaultName];
	}

	// ANCHOR Function _logSyslogMessage
	/**
	 * Logs a syslog-compatible message to the API console.
	 *
	 * Formats a log message with a timestamp, severity level, module name, and payload. 
	 * Severity levels are represented as numeric values based on syslog standards, 
	 * ensuring consistent logging across systems. Falls back to severity `INFO (6)` if an 
	 * invalid severity is provided.
	 *
	 * ### Severity Levels:
	 * - **7 (DEBUG)**: Detailed debug-level messages, useful during development.
	 * - **6 (INFO)**: General informational messages about normal operations.
	 * - **4 (WARN)**: Indications of potential problems or unexpected situations.
	 * - **3 (ERROR)**: Critical issues requiring immediate attention.
	 *
	 * @example
	 * const logMessage = _logSyslogMessage({
	 *   severity: 7,
	 *   code: "70000",
	 *   message: "Debugging mode enabled.",
	 * });
	 * // Example Output: 2024-12-14T10:30:45.123Z [Easy-Utility] (DEBUG): {"code": 70000, "message": "Debugging mode enabled."}
	 *
	 * @param {Object} params - Parameters for the log message.
	 * @param {number} params.severity - Numerical severity level (e.g., 7 for DEBUG, 3 for ERROR).
	 * @param {string} params.code - Application-specific code identifying the log context.
	 * @param {string} params.message - The log message.
	 * @param {string} [params.moduleName] - Name of the module (default is "SYSTEM").
	 * @returns {string} - The formatted syslog message.
	 */
	function _logSyslogMessage({ severity, code, message }) {
		// Helper function to get the current timestamp in ISO format
		const _getSyslogTimestamp = () => {
			return new Date().toISOString();
		};

		// Map severity levels to numerical values
		const severityMap = {
			7: "DEBUG",
			6: "INFO",
			4: "WARN",
			3: "ERROR"
		};

		// Normalize severity to one of the accepted numerical values
		const normalizedSeverity = severityMap[severity]
			? severity
			: 6; // Default to INFO (6) if severity is invalid

		// Construct the formatted log message
		const logMessage = `${_getSyslogTimestamp()} [${this.modName}] (${severityMap[normalizedSeverity]}): {"code": ${code}, "message": "${message}"}`;

		// Output the log message to the API console
		log(logMessage);

		return logMessage;
	}


	// ANCHOR Function _makeCurryFunc
	/**
	 * Creates a curried function with named arguments for preset and later arguments.
	 *
	 * Combines preset arguments and new arguments into a single object for a target function, 
	 * prioritizing new arguments.
	 *
	 * @example
	 * const add = ({ a, b, c }) => a + b + c;
	 * const curriedAdd = _makeCurryFunc({ func: add, presetArgs: { a: 1, b: 2 } });
	 * console.log(curriedAdd({ c: 3 })); // Output: 6
	 *
	 * @param {Object} params - Parameters for creating the curried function.
	 * @param {Function} params.func - The target function to curry.
	 * @param {Object} [params.presetArgs={}] - Preset arguments for the function.
	 * @returns {Function} - A new function that applies additional arguments to the target function.
	 */
	function _makeCurryFunc({ func, presetArgs = {} }) {
		return (laterArgs = {}) => {
			// Merge preset and later arguments, prioritizing later arguments
			return func({ ...presetArgs, ...laterArgs });
		};
	}

	// ANCHOR Function _parseDataFromContent
	/**
	 * Extracts JSON content from `<div>` elements in a provided HTML string.
	 *
	 * Searches the provided string for matches of JSON content within specific `<div>` elements, 
	 * returning an array of all matches.
	 *
	 * @example
	 * const gmNotes = `<div id="data-container">{"key":"value1"}</div>`;
	 * const dataRegex = "<div id=\"data-container\">(.*?)</div>";
	 * const extractedData = _parseDataFromContent({ content: gmNotes, regexString: dataRegex });
	 * console.log(extractedData); // Output: ['{"key":"value1"}']
	 *
	 * @param {Object} params - Parameters for extracting data.
	 * @param {string} params.content - The content string to search.
	 * @param {string} params.regexString - The regex string to match `<div>` elements.
	 * @returns {string[]} - An array of matched JSON content strings.
	 */
	function _parseDataFromContent({ content, regexString }) {
		const regex = new RegExp(`${regexString}`, "gs");
		const matchesArray = [...content.matchAll(regex)];

		// Extract and return the matched content
		return matchesArray.map(match => { return match[1] || ""; }).filter(Boolean);
	}

	// ANCHOR Function _parseChatCommands
	/**
	 * Parses commands and their arguments from a chat message.
	 *
	 * Splits a chat message into commands and their arguments using `--` as a delimiter, 
	 * returning a `Map` where each command is a key and its arguments are an array.
	 *
	 * @example
	 * const commands = _parseChatCommands({ apiCallContent: "--menu option1 option2 --help" });
	 * console.log(commands);
	 * // Output: Map { "--menu" => ["option1", "option2"], "--help" => [] }
	 *
	 * @param {Object} params - Parameters for parsing chat commands.
	 * @param {string} params.apiCallContent - The full chat message containing commands.
	 * @returns {Map<string, string[]>} - A map of commands and their arguments.
	 */
	function _parseChatCommands({ apiCallContent }) {
		const commandMap = new Map();

		// Normalize the input by trimming leading and trailing whitespace
		const normalizedContent = apiCallContent.trim();

		// Split the message into segments using '--' as a delimiter
		const segments = normalizedContent.split("--").filter(segment => { return segment.trim() !== ""; });

		// Process each segment
		segments.forEach((segment, index) => {
			// Skip the first segment if it's not a valid command (i.e., starts with '!')
			if (index === 0 && segment.trim().startsWith("!")) {
				return; // Skip this segment
			}

			// Trim the segment and split into command and arguments
			const trimmedSegment = segment.trim();
			const [command, ...args] = trimmedSegment.split(/\s+/);

			// Ensure the command has no leading or trailing whitespace
			const cleanCommand = command.toLowerCase().trim();

			// Store the command and its arguments in the map
			commandMap.set(`--${cleanCommand}`, args);
		});

		return commandMap;
	}

	// ANCHOR Function _parseChatSubcommands
	/**
	 * Parses command arguments into key-value pairs or standalone flags.
	 *
	 * Splits arguments using `|` or `#` as delimiters for key-value pairs. Arguments without 
	 * delimiters are treated as standalone flags with a value of `true`.
	 *
	 * @example
	 * const parsedArgs = _parseChatSubcommands({ subcommands: ["key1|value1", "flag"] });
	 * console.log(parsedArgs); // Output: { key1: "value1", flag: true }
	 *
	 * @param {Object} params - Parameters for parsing subcommands.
	 * @param {string[]} params.subcommands - The array of arguments to parse.
	 * @returns {Object<string, string|boolean>} - A map of argument keys to values or `true` for flags.
	 */
	function _parseChatSubcommands({ subcommands }) {
		const subcommandMap = {};

		// Process each argument
		subcommands.forEach(arg => {
			// Check for key-value pair using | or #
			const delimiterMatch = arg.includes("|") ? "|" : arg.includes("#") ? "#" : null;

			if (delimiterMatch) {
				const [key, value] = arg.split(delimiterMatch);
				subcommandMap[key] = value; // Store key-value pair
			} else {
				subcommandMap[arg] = true; // Treat as a standalone flag
			}
		});

		return subcommandMap;
	}

	// ANCHOR Function _purgeApiState
	/**
	 * Clears a specific sub-node of the Roll20 API state or the entire state if no argument is provided.
	 * Optionally forces a sandbox restart after clearing the state.
	 *
	 * @param {string} [key] - The specific key in the `state` object to purge. If not provided, clears the entire `state`.
	 * @param {boolean} [restart=true] - Whether to force a sandbox restart after purging the state.
	 *
	 * @example
	 * // Clear a specific sub-node
	 * _purgeApiState('EasyModuleVault');
	 *
	 * // Clear the entire state
	 * _purgeApiState();
	 *
	 * @returns {void}
	 */
	function _purgeApiState(key, restart = true) {
		if (key) {
			if (state[key]) {
				delete state[key]; // Delete the specified sub-node
			}
		} else {
			// Clear the entire state
			state = {};
			//log("Entire Roll20 API state has been cleared.");
		}

		// Optionally force a sandbox restart
		if (restart) {
			throw new Error("API sandbox restart triggered by _purgeApiState.");
		}
	}

	// ANCHOR Function _replacePlaceholders
	/**
	 * Replaces placeholders in a string using one of three modes:
	 * - String placeholders: {{key}}
	 * - Expression placeholders: [[expression]]
	 * - CSS variables: var(--key)
	 *
	 * @example
	 * const input = {
	 *     string: `
	 *         Hello, {{name}}!
	 *         The sum is [[a + b]].
	 *         The background color is var(--bg-color).
	 *     `,
	 *     tokens: { name: "Alice", a: 5, b: 10 },
	 *     cssVars: { "--bg-color": "#00ff00" },
	 * };
	 *
	 * log(_replacePlaceholders(input));
	 * // Output:
	 * // Hello, Alice!
	 * // The sum is 15.
	 * // The background color is #00ff00.
	 *
	 * @param {Object} input - An object containing the string and placeholders.
	 * @param {string} input.string - The string containing placeholders.
	 * @param {Object} input.tokens - An object where keys match placeholders for string and CSS var replacements.
	 * @param {Object} [input.cssVars] - An optional object representing CSS variables.
	 * @returns {string} - The processed string with placeholders replaced.
	 */
	function _replacePlaceholders({ string, tokens, cssVars = {} }) {
		return string
		// Replace {{key}} placeholders
			.replace(/{{(.*?)}}/g, (_, key) => {return tokens[key.trim()] || "";})

		// Replace [[expression]] placeholders
			.replace(/\[\[(.*?)\]\]/g, (_, expression) => {
				try {
					const func = new Function(...Object.keys(tokens), `return ${expression.trim()};`);

					return func(...Object.values(tokens));
				} catch (e) {
					console.error(`Failed to evaluate expression: [[${expression.trim()}]]`, e);

					return `[[${expression.trim()}]]`; // Return the placeholder if evaluation fails
				}
			})

		// Replace var(--key) placeholders
			.replace(/var\((--[\w-]+)\)/g, (_, cssVar) => {return cssVars[cssVar.trim()] || `var(${cssVar.trim()})`;});
	}

	// ANCHOR Function _whisperPlayerMessage
	/**
	 * Sends a whispered message to a specified player or GM based on preprocessed parameters.
	 *
	 * Assumes that the recipient (to) is already resolved to either "gm" or the player's name. 
	 * This function does not attempt to resolve player IDs or names and relies on preprocessed inputs.
	 *
	 * @example
	 * _whisperPlayerMessage({ 
	 *   from: "System", 
	 *   to: "PlayerName", 
	 *   message: "Hello, Player!" 
	 * });
	 * // Sends: "/w PlayerName Hello, Player!"
	 *
	 * @param {Object} params - Parameters for the whisper message.
	 * @param {string} params.from - The sender's name or identifier.
	 * @param {string} params.to - The recipient's resolved name ("gm" or player name).
	 * @param {string} params.message - The message content to be whispered.
	 * @returns {string} - A formatted string showing the sender, recipient, and message.
	 */
	function _whisperPlayerMessage({ from, to, message }) {
		// Ensure sender has a default value
		const sender = from || `${moduleSettings.modName}`;

		// Ensure recipient has a default value
		const recipient = to || "gm";

		// Send the chat message using Roll20's sendChat API
		sendChat(sender, `/w ${recipient} ${message}`);

		// Return a string summarizing the message details
		return `${sender};;${recipient};;${message}`;
	}

	// !SECTION End of Utility Functions: Low Level

	/*******************************************************************************************************************
	* SECTION UTILITY FUNCTIONS: High Level                                                                            *
	*******************************************************************************************************************/

	// ANCHOR Function _createPhraseFactory
	/**
	 * Creates a factory for managing localized phrases.
	 *
	 * Initializes phrases only for the currently set language and provides methods
	 * to retrieve, add, update, and remove phrases. Supports dynamic content in phrases.
	 *
	 * Phrases are organized per language and accessed via the global state.
	 *
	 * @returns {Object} - A factory with methods to manage phrases.
	 */
	function _createPhraseFactory() {
		const defaultLanguage = moduleSettings.phraseLanguage;
	
		// Default phrases with {{ ... }} placeholders
		const defaultPhrases = {
			enUS: {
				"0": "Success",
				"1": "Failure",
				"10000": ".=> Initializing <=.",
				"20000": ".=> Complete <=.",
				"20100": "{{remark}} has been created.",
				"40000": "Invalid Arguments: {{remark}}",
				"40400": "Not Found: {{remark}}",
				"50000": "Error: {{remark}}",
				"30000": "Warning: {{remark}}",
				"60000": "Information: {{remark}}",
				"70000": "Debug: {{remark}}",
				"0x0CBDE1DE": "Error: Failure parsing HTML. Verify HTML is well formed with nested opening and closing tags.",
				"0x026DAC9E": "Not Found: Could not find '{{aRequestedFunc}}' available from {{moduleSettings.globalName}}.",
				"0x081AD87E": "Invalid Arguments: When adding new phrases, 'language' must be a string and 'newPhrases' an object.",
				"0x0E9FE4D0": "Invalid Arguments: When adding new phrases, '{{key}}' must be a function.",
				"0x058089AE": "Invalid Arguments: The 'newTemplates' parameter must be an object mapping template names to functions.",
				"0x020E634E": "Invalid Arguments: The template '{{name}}' must be a function.",
				"0x0A8E5CFE": "Invalid Arguments: The 'newThemes' parameter must be an object mapping theme names to functions.",
				"0x0AA3C5BE": "Invalid Arguments: The theme '{{name}}' must be a function.",
				"0x00784CBE": "There is an unrecognized command, check the module for available options.",
				"0x004A7742": "error",
				"0x0B672E77": "warning",
				"0x0758A77E": "information",
				"0x000058E0": "tip",
			},
			frFR: {
				"0": "Succès",
				"1": "Échec",
				"10000": ".=> Initialisation <=.",
				"20000": ".=> Terminé <=.",
				"20100": "{{remark}} a été créé.",
				"40000": "Arguments invalides : {{remark}}",
				"40400": "Introuvable : {{remark}}",
				"50000": "Erreur : {{remark}}",
				"30000": "Avertissement : {{remark}}",
				"60000": "Information : {{remark}}",
				"70000": "Débogage : {{remark}}",
				"0x0CBDE1DE": "Erreur : Échec de l'analyse du HTML. Vérifiez que le HTML est bien formé avec des balises d'ouverture et de fermeture imbriquées.",
				"0x026DAC9E": "Introuvable : Impossible de trouver '{{aRequestedFunc}}' disponible depuis {{moduleSettings.globalName}}.",
				"0x081AD87E": "Arguments invalides : Lors de l'ajout de nouvelles phrases, 'language' doit être une chaîne et 'newPhrases' un objet.",
				"0x0E9FE4D0": "Arguments invalides : Lors de l'ajout de nouvelles phrases, '{{key}}' doit être une fonction.",
				"0x058089AE": "Arguments invalides : Le paramètre 'newTemplates' doit être un objet mappant les noms de modèles à des fonctions.",
				"0x020E634E": "Arguments invalides : Le modèle '{{name}}' doit être une fonction.",
				"0x0A8E5CFE": "Arguments invalides : Le paramètre 'newThemes' doit être un objet mappant les noms de thèmes à des fonctions.",
				"0x0AA3C5BE": "Arguments invalides : Le thème '{{name}}' doit être une fonction.",
				"0x00784CBE": "Commande non reconnue, vérifiez le module pour les options disponibles.",
				"0x004A7742": "erreur",
				"0x0B672E77": "avertissement",
				"0x0758A77E": "information",
				"0x000058E0": "conseil",
			},
		};
	
		const l10n = {}; // Internal storage for localized phrases
		const phraseConfigKey = "PhraseConfig"; // Key for storing language choices in sharedVault
	
		/**
		 * Retrieves the player's language preference.
		 * @param {string} playerId - The Roll20 player ID.
		 * @returns {string} - The player's preferred language or the default language.
		 */
		function getPlayerLanguage(playerId) {
			const vault = _getSharedVault();
			const playerLangChoice = vault[phraseConfigKey]?.playerLangChoice || {};

			return playerLangChoice[playerId] || defaultLanguage;
		}
	
		/**
		 * Updates the player's language preference.
		 * @param {string} playerId - The Roll20 player ID.
		 * @param {string} language - The language to set for the player.
		 */
		function setPlayerLanguage(playerId, language) {
			const vault = _getSharedVault();
			if (!vault[phraseConfigKey]) {
				vault[phraseConfigKey] = { playerLangChoice: {} };
			}
			vault[phraseConfigKey].playerLangChoice[playerId] = language;
		}
	
		return {
			/**
			 * Initializes the phrase factory with available languages.
			 * Loads the player's language preferences from the shared vault.
			 */
			init: () => {
				const vault = _getSharedVault();
				const playerLangChoice = vault[phraseConfigKey]?.playerLangChoice || {};
				const languages = Object.keys(defaultPhrases);
	
				// Ensure default phrases for all supported languages
				languages.forEach((lang) => {
					l10n[lang] = { ...defaultPhrases[lang] };
				});
	
				// Restore player language preferences
				vault[phraseConfigKey] = { playerLangChoice };
			},
	
			/**
			 * Retrieves a phrase for the given code and player ID.
			 * @param {string} playerId - The Roll20 player ID.
			 * @param {string} code - The phrase code.
			 * @param {Object} [args={}] - Arguments for replacing placeholders in the phrase.
			 * @returns {string} - The localized phrase.
			 */
			get: ({ playerId, code, args = {} }) => {
				const language = getPlayerLanguage(playerId);
				const currentLangPhrases = l10n[language] || {};
				const fallbackLangPhrases = l10n[defaultLanguage] || {};
				const template = currentLangPhrases[code] || fallbackLangPhrases[code];
	
				if (typeof template === "string") {
					return _replacePlaceholders(template, args);
				}
	
				return code; // Return the code if the phrase is missing
			},
	
			/**
			 * Changes the language preference for a specific player.
			 * @param {string} playerId - The Roll20 player ID.
			 * @param {string} newLanguage - The language code to set.
			 */
			changeLanguage: (playerId, newLanguage) => {
				if (!defaultPhrases[newLanguage]) {
					log(`[PhraseFactory] Language '${newLanguage}' is not available.`);

					return;
				}
				setPlayerLanguage(playerId, newLanguage);
				log(`[PhraseFactory] Player '${playerId}' language set to '${newLanguage}'.`);
			},
	
			/**
			 * Adds new phrases to a specific language.
			 * @param {string} language - The language code.
			 * @param {Object} newPhrases - An object mapping codes to phrases.
			 */
			add: ({ language, newPhrases }) => {
				if (!language || typeof newPhrases !== "object" || newPhrases === null) {
					throw new Error("Invalid parameters: 'language' must be a string and 'newPhrases' an object.");
				}
				l10n[language] = l10n[language] || {};
				Object.entries(newPhrases).forEach(([key, phrase]) => {
					if (typeof phrase !== "string") {
						throw new Error(`The phrase '${key}' must be a string.`);
					}
					l10n[language][key] = phrase;
				});
			},
	
			/**
			 * Removes a phrase for a specific language.
			 * @param {string} language - The language code.
			 * @param {string} code - The phrase code to remove.
			 */
			remove: ({ language, code }) => {
				if (l10n[language]) {
					delete l10n[language][code];
				}
			},
		};
	}

	// ANCHOR Function _createTemplateFactory
	/**
 * Creates a factory for managing reusable templates.
 *
 * Initializes with default templates and provides methods to retrieve, add, update, 
 * and remove templates. Templates are used to generate structured HTML or other 
 * content dynamically.
 *
 * @example
 * const templateFactory = _createTemplateFactory();
 * const tableTemplate = templateFactory.get({ template: "default", content: { key: "value" } });
 * console.log(tableTemplate); // Outputs the default template as a single-line string.
 *
 * @returns {Object} - A factory with methods to manage templates.
 */
	function _createTemplateFactory() {

		// Default templates for the factory
		const defaultTemplateMap = {
			"default": "[\n{\"element\": \"table\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {\"border-collapse\": \"collapse\",\"width\": \"50%\"},\"border\": \"1\"},\"children\": [\n{\"element\": \"thead\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"tr\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"th\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {\"padding\": \"8px\",\"text-align\": \"left\"}},\"children\": [\n{\"element\": \"text\",\"children\": [\n{\"innerText\": \"Key\"}\n],\"childIndex\": 1}\n],\"childIndex\": 1},\n{\"element\": \"th\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {\"padding\": \"8px\",\"text-align\": \"left\"}},\"children\": [\n{\"element\": \"text\",\"children\": [\n{\"innerText\": \"Value\"}\n],\"childIndex\": 1}\n],\"childIndex\": 2}\n],\"childIndex\": 1}\n],\"childIndex\": 1},\n{\"element\": \"tbody\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {}},\"children\": [\n${tableRows}\n],\"childIndex\": 2}\n]\n]\n}",

			"chatAlert": "[\n{\"element\": \"div\",\"props\": {\"style\": {},\"class\": [\"alert-message\"],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"h3\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"text\",\"children\": [\n{\"innerText\": \"${title}\"}\n],\"childIndex\": 1}\n],\"childIndex\": 1},\n{\"element\": \"p\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"text\",\"children\": [\n{\"innerText\": \"${description}\"}\n],\"childIndex\": 1}\n],\"childIndex\": 2},\n{\"element\": \"div\",\"props\": {\"style\": {},\"class\": [\"alert-command\"],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"p\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"text\",\"children\": [\n{\"innerText\": \"${command}\"}\n],\"childIndex\": 1}\n],\"childIndex\": 1}\n],\"childIndex\": 3},\n{\"element\": \"p\",\"props\": {\"style\": {},\"class\": [],\"id\": null,\"inlineStyle\": {}},\"children\": [\n{\"element\": \"text\",\"children\": [\n{\"innerText\": \"${remark}\"}\n],\"childIndex\": 1}\n],\"childIndex\": 4}\n]\n}\n]"
		};

		const templates = {}; // Internal storage for localized templates

		return {
			/**
         * Reinitializes the factory with default templates.
         *
         * Clears current templates and reloads the default templates.
         */
			init: () => {
				if (Object.keys(templates).length === 0) {
					Object.assign(templates, defaultTemplateMap);
				}
			},

			/**
         * Retrieves a template by name or defaults to the "default" template.
         *
         * Templates are returned as single-line strings. If arguments are provided, they are used 
         * to populate placeholders within the template.
         *
         * @param {Object} options - The options object.
         * @param {string} [options.template="default"] - The name of the template to retrieve.
         * @param {Object} [options.content={}] - Data to pass into the template.
         * @returns {string} - The requested template as a single-line string.
         */
			get: ({ template, content = {} } = {}) => {
				const templateString = templates[template] || templates["default"];

				// Replace placeholders
				return _replacePlaceholders({ template: templateString, content });
			},

			/**
         * Replaces all current templates with a new set.
         *
         * @param {Object} options - The options object.
         * @param {Object<string, string>} options.newMap - A map of template names to template strings.
         */
			set: ({ newMap }) => {
				Object.keys(templates).forEach(key => { return delete templates[key]; });
				Object.assign(templates, newMap);
			},

			/**
         * Adds or updates specific templates in the factory.
         *
         * New templates must be provided as strings with placeholders.
         *
         * @param {Object} options - The options object.
         * @param {Object<string, string>} options.newTemplates - The new templates to add or update.
         * @throws {Error} If any template is not a string.
         */
			add: ({ newTemplates }) => {
				if (typeof newTemplates !== "object" || newTemplates === null) {
					_logSyslogMessage.call(moduleSettings, {
						severity: 3,
						code: "40000",
						message: `${PhraseFactory.get({ code: "0x058089AE" })}`
					});

					return;
				}

				Object.entries(newTemplates).forEach(([name, templateString]) => {
					if (typeof templateString !== "string") {
						_logSyslogMessage.call(moduleSettings, {
							severity: 3,
							code: "40000",
							message: `${PhraseFactory.get({ code: "0x020E634E", params: [name] })}`
						});

						return;
					}
					templates[name] = templateString;
				});
			},

			/**
         * Removes a specific template by name from the factory.
         *
         * @param {Object} options - The options object.
         * @param {string} [options.template] - The name of the template to remove.
         */
			remove: ({ template } = {}) => {
				delete templates[template];
			}
		};
	}


	// ANCHOR Function _createThemeFactory
	/**
	 * Creates a factory for managing reusable themes.
	 *
	 * Initializes with default themes and provides methods to retrieve, add, update, 
	 * and remove themes. Themes define CSS styles for elements, classes, or IDs 
	 * and are dynamically generated for flexibility.
	 *
	 * @example
	 * const themeFactory = _createThemeFactory();
	 * const theme = themeFactory.get({ theme: "default" });
	 * console.log(theme); // Outputs the default theme as a single-line string.
	 *
	 * @returns {Object} - A factory with methods to manage themes.
	 */
	function _createThemeFactory() {

		// Default themes for the factory
		const defaultThemes = {
			"default": () => {
				return `{
					"universal": {},
					"elements": {},
					"classes": {},
					"attributes": {},
					"functions": {},
					"ids": {}
					}`;
			},
			"chatAlert": ({ bgColor, titleColor }) => {
				return `{
				"universal": {},
				"elements": {
					"h3": {
					"styles": {
						"color": "var(--alert-title-color)",
						"margin": "0",
						"font-size": "1.2em"
					},
					"children": {}
					},
					"p": {
					"styles": {
						"margin": "0",
						"overflow-wrap": "break-word"
					},
					"children": {}
					}
				},
				"classes": {
					".alert-message": {
					"styles": {
						"border": "1px solid black",
						"background-color": "var(--alert-bg)",
						"padding": "5px 10px",
						"border-radius": "10px"
					},
					"children": {}
					},
					".alert-command": {
					"styles": {
						"margin": "8px 0",
						"padding": "5px",
						"background-color": "var(--alert-command-bg)",
						"border": "var(--alert-command-border)",
						"border-radius": "5px",
						"font-family": "monospace"
					},
					"children": {}
					}
				},
				"attributes": {},
				"functions": {
					":root": [
					{
						"target": null,
						"args": [],
						"styles": {
						"--alert-bg": "${bgColor}",
						"--alert-title-color": "${titleColor}",
						"--alert-command-bg": "#ffffff",
						"--alert-command-border": "1px solid #cccccc"
						}
					}
					]
				},
				"ids": {}
				}`;
			}
		};

		const themes = {}; // Internal storage for localized themes

		return {
			/**
			 * Reinitializes the factory with default themes.
			 *
			 * Clears current themes and reloads the default themes.
			 */
			init: () => {
				if (Object.keys(themes).length === 0) {
					Object.assign(themes, defaultThemes);
				}
			},

			/**
			 * Retrieves a theme by name or defaults to the "default" theme.
			 *
			 * Themes are returned as single-line strings.
			 *
			 * @param {Object} options - The options object.
			 * @param {string} [options.theme="default"] - The name of the theme to retrieve.
			 * @returns {string} - The requested theme as a single-line string.
			 */
			get: ({ theme, palette = {} } = {}) => {
				const cssGenerator = themes[theme] || themes["default"];
				const themeString = cssGenerator(palette);

				// Convert the theme to a single-line string for easy integration
				return _convertToSingleLine({ multiline: themeString });
			},

			/**
			 * Replaces all current themes with a new set.
			 *
			 * @param {Object} options - The options object.
			 * @param {Object<string, Function>} options.newMap - A map of theme names to theme functions.
			 */
			set: ({ newMap }) => {
				Object.keys(themes).forEach(key => { return delete themes[key]; });
				Object.assign(themes, newMap);
			},

			/**
			 * Adds or updates specific themes in the factory.
			 *
			 * New themes must be provided as functions, which will generate CSS styles dynamically.
			 *
			 * @param {Object} options - The options object.
			 * @param {Object<string, Function>} options.newThemes - The new themes to add or update.
			 * @throws {Error} If any theme is not a function.
			 */
			add: ({ newThemes }) => {
				if (typeof newThemes !== "object" || newThemes === null) {

					_logSyslogMessage.call(moduleSettings, {
						severity: 3,
						code: "40000",
						message: `${PhraseFactory.get({ code: "0x0A8E5CFE" })}`
					});

				}

				Object.entries(newThemes).forEach(([name, themeFunction]) => {
					if (typeof themeFunction !== "function") {

						_logSyslogMessage.call(moduleSettings, {
							severity: 3,
							code: "40000",
							message: `${PhraseFactory.get({ code: "0x0AA3C5BE", params: [name] })}`
						});
					}

					themes[name] = themeFunction;
				});
			},

			/**
			 * Removes a specific theme by name from the factory.
			 *
			 * @param {Object} options - The options object.
			 * @param {string} [options.theme] - The name of the theme to remove.
			 */
			remove: ({ theme } = {}) => {
				delete themes[theme];
			}
		};
	}

	// ANCHOR Function _fetchUtilities
	/**
	 * Retrieves utility functions for use by other modules.
	 *
	 * Dynamically fetches and returns a set of utility functions by name, optionally injecting module-specific settings. 
	 * Logs a warning if a requested function is unavailable.
	 *
	 * @example
	 * const utilities = _fetchUtilities({
	 *   requestedFunctionsArray: ["utilityFunc1", "utilityFunc2"]
	 * });
	 * utilities.utilityFunc1(arg1, arg2);
	 *
	 * @param {Object} options - Options for fetching utilities.
	 * @param {string[]} options.requestedFunctionsArray - An array of utility function names to retrieve.
	 * @param {Object} [options.thisModuleSettings={}] - Optional module settings to override defaults.
	 * @returns {Object<string, Function>} - An object containing the requested utility functions as key-function pairs.
	 */
	function _fetchUtilities({ requestedFunctionsArray = [], thisModuleSettings = {} } = {}) {
		// Initialize an object to store the selected utilities
		const selectedUtilities = {};

		// Merge default module settings with any provided overrides
		const effectiveModuleSettings = { ...moduleSettings, ...thisModuleSettings };

		// Iterate over the requested function names
		requestedFunctionsArray.forEach((aRequestedFunc) => {
			if (availableUtilities[aRequestedFunc]) {
				// If the utility exists, wrap it to inject the effective module settings dynamically
				selectedUtilities[aRequestedFunc] = (...args) => {
					return availableUtilities[aRequestedFunc].call(effectiveModuleSettings, ...args);
				};
			} else {
				// Log a warning if the requested utility function is not found
				_logSyslogMessage.call(moduleSettings, {
					severity: 4,
					code: "40400",
					message: `${PhraseFactory.get({ code: "0x026DAC9E", params: [aRequestedFunc] })}`
				});
			}
		});

		// Return the object containing the selected utility functions
		return selectedUtilities;
	}

	// ANCHOR Function _renderTemplate
	/**
	 * Renders a template with a given theme and data.
	 *
	 * Asynchronously retrieves the specified template and theme, applies the theme's styles to the 
	 * template, and injects the provided content into the template. The result is a fully rendered 
	 * HTML string with inline styles.
	 *
	 * @example
	 * const renderedHtml = await _renderTemplate({
	 *   template: "default",
	 *   theme: "default",
	 *   content: { key1: "value1", key2: "value2" },
	 *   palette: { primaryColor: "#007bff" }
	 * });
	 * console.log(renderedHtml); // Outputs styled and rendered HTML as a string.
	 *
	 * @param {Object} options - Options for rendering the template.
	 * @param {string} options.template - The name of the template to render.
	 * @param {Object} options.content - Data to inject into the template.
	 * @param {string} options.theme - The name of the theme to apply.
	 * @param {Object} [options.palette] - Optional palette for dynamic theme customization.
	 * @returns {Promise<string>} - The rendered HTML string.
	 */
	async function _renderTemplate({ template, content, theme, palette }) {

		// Fetch the specified template and theme concurrently
		const [fetchedTemplate, fetchedTheme] = await Promise.all([
			TemplateFactory.get({ template, content }),
			ThemeFactory.get({ theme, palette })
		]);

		// Apply the theme's CSS styles to the fetched template
		const styledJson = _applyCssToHtmlJson({
			cssJson: fetchedTheme,
			htmlJson: fetchedTemplate
		});

		// Convert the styled JSON into an inline HTML string
		const renderedHtml = _convertJsonToHtml({ htmlJson: styledJson });

		// Return the fully rendered HTML string
		return renderedHtml;
	}

	// ANCHOR Function _whisperAlertMessage
	/**
	 * Sends a styled alert message in chat to the player who issued a command.
	 *
	 * Formats and whispers an alert message (e.g., tip, warning, or error) to the player who sent the command.
	 * The function uses syslog-compatible severity levels (numerical) and integrates with the Phrase Factory
	 * for localized and reusable messages.
	 *
	 * @param {Object} params - Parameters for the alert message.
	 * @param {Object} params.apiCall - The Roll20 message object containing player and command details.
	 * @param {number} params.severity - Numerical severity level (e.g., 7 for DEBUG, 6 for INFO).
	 * @param {string} params.description - A description of the alert.
	 * @param {string} [params.remark] - Additional contextual remark for the alert.
	 * @returns {Promise<string>} - The formatted alert message sent to the player.
	 */
	async function _whisperAlertMessage({ apiCall, severity, title, description, remark }) {
	
		// Define a unified severity configuration
		const severityEnum = {
			TIP: { code: 7, bgColor: "#C3FDB8", titleColor: "#16F529" },
			INFO: { code: 6, bgColor: "#b8defd", titleColor: "#2516f5" },
			WARNING: { code: 4, bgColor: "#FBE7A1", titleColor: "#CA762B" },
			ERROR: { code: 3, bgColor: "#ffdddd", titleColor: "red" },
		};
	
		// Create a lookup map for numeric and string severities
		const severityLookup = Object.entries(severityEnum).reduce((lookup, [key, value]) => {
			lookup[value.code] = value; // Map numeric codes
			lookup[key.toLowerCase()] = value; // Map string keys (case insensitive)

			return lookup;
		}, {});
	
		// Normalize severity input to default (INFO) if invalid
		const normalizedSeverity = typeof severity === "string" ? severity.toLowerCase() : severity;
		const alertConfig = severityLookup[normalizedSeverity] || severityEnum.INFO;
	
		// Construct alert content
		const alertContent = {
			title: title.toUpperCase(),
			description: _encodeNoteContent({ text: description }),
			command: apiCall.content,
			remark: _encodeNoteContent({ text: remark }),
		};
	
		// Palette for the alert message
		const alertPalette = {
			bgColor: alertConfig.bgColor,
			titleColor: alertConfig.titleColor,
		};
	
		// Render the final styled and populated message
		const styledMessage = await _renderTemplate({
			template: "chatAlert",
			content: alertContent,
			theme: "chatAlert",
			palette: alertPalette,
		});
	
		// Send the styled message to the player via whisper
		_whisperPlayerMessage({
			from: `${this.modName}`,
			toId: `${apiCall.playerid}`,
			message: styledMessage,
		});
	
		// Optionally log the message if verbose mode is enabled
		if (moduleSettings.verbose) {
			log(`${styledMessage}`);
		}
	
		return `${this.modName};;${apiCall.playerid};;${styledMessage}`;
	}

	// !SECTION End of Utility Functions: High Level

	/*******************************************************************************************************************
	 * SECTION PRIVATE FUNCTIONS                                                                                       *
	*******************************************************************************************************************/

	// ANCHOR Check Install
	const checkInstall = () => {
		try {

			// Initialize factories
			const phraseFactoryInit = _createPhraseFactory();
			phraseFactoryInit.init(moduleSettings.phraseLanguage);

			const templateFactoryInit = _createTemplateFactory();
			templateFactoryInit.init();

			const themeFactoryInit = _createThemeFactory();
			themeFactoryInit.init();
	
			// Set the PhraseFactory into EASY_MODULE_FORGE
			EASY_MODULE_FORGE.setFactory("PhraseFactory", phraseFactoryInit);
			EASY_MODULE_FORGE.setFactory("TemplateFactory", templateFactoryInit);
			EASY_MODULE_FORGE.setFactory("ThemeFactory", themeFactoryInit);
	
			// Retrieve the factory using getFactory
			PhraseFactory = EASY_MODULE_FORGE.getFactory("PhraseFactory");
			TemplateFactory = EASY_MODULE_FORGE.getFactory("TemplateFactory");
			ThemeFactory = EASY_MODULE_FORGE.getFactory("ThemeFactory");
	
			// Log the initialization
			_logSyslogMessage.call(moduleSettings, {
				severity: 6,
				code: "10000",
				message: `${PhraseFactory.get({ code: "10000" })}`
			});

			return 0;
	
		} catch (anError) {
			_logSyslogMessage.call(moduleSettings, {
				severity: 3,
				code: "50000",
				message: `${anError}`
			});

			return 1;
		}
	};
	
	// ANCHOR Register Handlers
	const registerEventHandlers = () => {

		// NOTE Possibly more events to watch for in the future...

		// Script is ready
		_logSyslogMessage.call(moduleSettings, {
			severity: 6,
			code: "20000",
			message: `${PhraseFactory.get({ code: "20000" })}`
		});

		return 0;
	};

	// !SECTION End of Private Functions

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

	// ANCHOR Registry for available utility functions
	// FIXME For now hand writing functions in this mapping. Had issues automating because the object was not inialized
	// and could not be inspected for each function starting with "_". 
	const availableUtilities = {
		ApplyCssToHtmlJson: _applyCssToHtmlJson,
		ConvertCssToJson: _convertCssToJson,
		ConvertHtmlToJson: _convertHtmlToJson,
		ConvertJsonToHtml: _convertJsonToHtml,
		ConvertToSingleLine: _convertToSingleLine,
		CreatePhraseFactory: _createPhraseFactory,
		CreateTemplateFactory: _createTemplateFactory,
		CreateThemeFactory: _createThemeFactory,
		DecodeNoteContent: _decodeNoteContent,
		EncodeNoteContent: _encodeNoteContent,
		GetSharedForge: _getSharedForge,
		GetSharedVault: _getSharedVault,
		LogSyslogMessage: _logSyslogMessage,
		MakeCurryFunc: _makeCurryFunc,
		ParseChatCommands: _parseChatCommands,
		ParseChatSubcommands: _parseChatSubcommands,
		ParseDataFromContent: _parseDataFromContent,
		PurgeApiState: _purgeApiState,
		RenderTemplate: _renderTemplate,
		ReplacePlaceholders: _replacePlaceholders,
		WhisperAlertMessage: _whisperAlertMessage,
		WhisperPlayerMessage: _whisperPlayerMessage
	};

	return {
		FetchUtilities: _fetchUtilities,
	};

	// !SECTION END of Public Interface
})();
