on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content.startsWith('!table')) {
        // Log the raw input for debugging
        log("Raw Chat Input: " + msg.content);

        // Extract table name and multiline content
        const tableName = getTableName(msg.content);
        const multilineContent = getMultilineContent(msg.content);

        if (!tableName) {
            sendChat('Markdown Table Renderer', `/w ${msg.who} Error: Table name must be provided using --name.`);
            return;
        }
        if (!multilineContent) {
            sendChat('Markdown Table Renderer', `/w ${msg.who} Error: Table content must be enclosed in {{ ... }}.`);
            return;
        }

        // Log the extracted table name and content
        log("Extracted Table Name: " + tableName);
        log("Extracted Markdown Content (Before Cleanup): " + multilineContent);

        // Remove <br/> tags from the content
        const cleanedContent = multilineContent.replace(/<br\/?>/g, '').trim();

        // Log the cleaned Markdown content
        log("Extracted Markdown Content (After Cleanup): " + cleanedContent);

        try {
            const outputTemplate = generateTemplate(tableName, cleanedContent);

            if (!outputTemplate) {
                sendChat('Markdown Table Renderer', `/w ${msg.who} Error: No valid rows found to generate template.`);
                return;
            }

            // Send the generated template to chat
            sendChat(msg.who, outputTemplate);
        } catch (error) {
            log("Error Details: " + error.message);
            sendChat('Markdown Table Renderer', `/w ${msg.who} Error parsing markdown: ${error.message}`);
        }
    }
});

function getTableName(content) {
    const match = content.match(/--name\s+([^\s{]+)/);
    return match ? match[1].trim() : null;
}

function getMultilineContent(content) {
    const match = content.match(/{{([\s\S]*?)}}/);
    log("Match Result: " + JSON.stringify(match)); // Log match result for debugging
    return match ? match[1].trim() : null;
}

function generateTemplate(tableName, markdown) {
    let lines = markdown.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Log parsed lines for debugging
    log("Parsed Lines: " + JSON.stringify(lines));

    if (lines.length < 3) {
        throw new Error('Markdown table must have at least a header, a separator, and one row.');
    }

    let [headerLine, separatorLine, ...rowLines] = lines;

    // Log header, separator, and rows for debugging
    log("Header Line: " + headerLine);
    log("Separator Line: " + separatorLine);
    log("Row Lines: " + JSON.stringify(rowLines));

    if (!separatorLine.match(/^\|?[-\s|]+$/)) {
        throw new Error('Invalid table separator line. Must consist of dashes and pipes.');
    }

    // Split columns and remove empty entries caused by leading/trailing pipes
    let headers = headerLine.split('|').map(h => h.trim()).filter(h => h.length > 0);
    if (headers.length !== 2) {
        log("Header Columns: " + JSON.stringify(headers));
        throw new Error('Only two-column tables are supported for this template.');
    }

    let rows = rowLines.map(row =>
        row.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0)
    );

    // Validate rows and build the template
    let templateParts = [`&{template:default} {{name=${tableName}}}`];

    rows.forEach((row, index) => {
        if (row.length !== headers.length) {
            log(`Invalid row data at index ${index}: ${JSON.stringify(row)}`);
            throw new Error(`Row ${index + 1} does not match the header column count.`);
        }
        const [key, value] = row; // Use the first column as the key and the second as the value
        templateParts.push(`{{${key}=${value}}}`);
    });

    // Combine all parts into the final template
    return templateParts.join(' ');
}
