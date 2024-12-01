on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content.startsWith('!htmltable')) {
        // Parse the input to extract the table data
        const content = msg.content.slice('!htmltable'.length).trim();
        const rows = content.split('\n').map(row => row.trim()).filter(row => row.length > 0);

        if (rows.length === 0) {
            sendChat('HTML Table Renderer', '/w GM Error: No table data provided.');
            return;
        }

        // Parse the header and rows
        const headerRow = rows.shift(); // First line is the header
        const headers = headerRow.split('|').map(header => header.trim()).filter(header => header.length > 0);

        const tableRows = rows.map(row =>
            row.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0)
        );

        // Validate the rows for consistent columns
        if (!tableRows.every(row => row.length === headers.length)) {
            sendChat('HTML Table Renderer', '/w GM Error: Inconsistent column counts in table rows.');
            return;
        }

        // Generate HTML table
        const htmlTable = generateHtmlTable(headers, tableRows);

        // Send the table to chat
        sendChat('HTML Table Renderer', htmlTable);
    }
});

function generateHtmlTable(headers, rows) {
    let html = '<table style="border-collapse: collapse; width: 100%; border: 1px solid black;">';

    // Add header row
    html += '<thead><tr>';
    headers.forEach(header => {
        html += `<th style="border: 1px solid black; padding: 5px;">${header}</th>`;
    });
    html += '</tr></thead>';

    // Add rows
    html += '<tbody>';
    rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td style="border: 1px solid black; padding: 5px;">${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';

    html += '</table>';
    return html;
}


on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content.startsWith('!htmltable')) {
        // Define the HTML table
        const rawHtmlTable = `
            <table style="border-collapse: collapse; width: 100%; border: 1px solid black;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 5px;">Name</th>
                        <th style="border: 1px solid black; padding: 5px;">Class</th>
                        <th style="border: 1px solid black; padding: 5px;">Level</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Persephoni</td>
                        <td style="border: 1px solid black; padding: 5px;">Wizard</td>
                        <td style="border: 1px solid black; padding: 5px;">3</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Ranch Hand</td>
                        <td style="border: 1px solid black; padding: 5px;">Sorcerer</td>
                        <td style="border: 1px solid black; padding: 5px;">5</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Miss Honey</td>
                        <td style="border: 1px solid black; padding: 5px;">Ranger</td>
                        <td style="border: 1px solid black; padding: 5px;">7</td>
                    </tr>
                </tbody>
            </table>
        `;

        // Remove newlines and extra whitespace
        const htmlTable = rawHtmlTable.replace(/\s+/g, ' ').trim();

        // Log the HTML table to the API console
        log("HTML Table Sent to Chat:");
        log(htmlTable);

        // Send the HTML table to chat
        sendChat('HTML Table Renderer', htmlTable);
    }
});



