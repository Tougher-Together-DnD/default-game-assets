// markdownDocumentation.js
var markdownDocumentation = markdownDocumentation || (() => {
    const version = '1.0.3';
    const lastUpdate = 1578236090;

    var documentationCSS = '[css]<br>'
        + 'bg {<br>'
        + "padding: 10px; background: AliceBlue; background-image: url('https://i.imgur.com/i9vmkzO.png');<br>"
        + '}<br>'
        + '<br>'
        + 'h1 {<br>'
        + "color: red;<br>"
        + '}<br>'
        + '<br>'
        + 'h2 {<br>'
        + "color: purple;<br>"
        + '}<br>'
        + '<br>'
        + 'h3 {<br>'
        + "color: pink;<br>"
        + '}<br>'
        + '<br>'
        + 'h4 {<br>'
        + "color: blue;<br>"
        + '}<br>'
        + '<br>'
        + 'h5 {<br>'
        + "color: brown;<br>"
        + '}<br>'
        + '<br>'
        + 'h6 {<br>'
        + "color: green;<br>"
        + '}<br>'
        + '<br>'
        + 'blockquote {<br>'
        + 'box-sizing: border-box;<br>'
        + 'box-shadow: 1px 4px 6px #888888;<br>'
        + 'background: WhiteSmoke;<br>'
        + 'border: 1px solid #333333;<br>'
        + 'width:60%;<br>'
        + 'font-family: "Patrick Hand", cursive, sans-serif;<br>'
        + '}<br>'
        + '<br>'
        + 'p.blockquote {<br>'
        + 'font-family: "Patrick Hand", cursive, sans-serif;<br>'
        + '}<br>'
        + '<br>'
        + 'table {<br>'
        + 'box-shadow: 1px 4px 6px #888888;<br>'
        + 'border: 1px solid #333333;<br>'
        + '}<br>'
        + '<br>'
        + 'tbody {<br>'
        + 'font-style: italic;<br>'
        + '}<br>'
        + '<br>'
        + 'tr:first-child {<br>'
        + 'background-color: gray;<br>'
        + '}<br>'
        + '<br>'
        + 'tr:nth-child(even) {<br>'
        + 'background-color: white;<br>'
        + '}<br>'
        + '<br>'
        + 'tr:nth-child(odd) {<br>'
        + 'background-color: gainsboro;<br>'
        + '}<br>'
        + '<br>'
        + 'tr:nth-child(last) {<br>'
        + 'background-color: beige;<br>'
        + '}<br>'
        + '<br>'
        + 'td.align-left {<br>'
        + 'border: 1px solid #333333;<br>'
        + 'text-align: left;<br>'
        + 'color: red;<br>'
        + '}<br>'
        + '<br>'
        + 'td.align-center {<br>'
        + 'border: 1px solid #333333;<br>'
        + 'text-align: center;<br>'
        + 'color: blue;<br>'
        + '}<br>'
        + '<br>'
        + 'td.align-right {<br>'
        + 'border: 1px solid #333333;<br>'
        + 'text-align: right;<br>'
        + 'color: green;<br>'
        + '}<br>'
        + '<br>'
        + 'ol {<br>'
        + 'list-style-type: decimal;<br>'
        + '}<br>'
        + '<br>'
        + 'ul {<br>'
        + 'list-style-type: square;<br>'
        + '}<br>'
        + '<br>'
        + 'pre {<br>'
        + 'display: block;<br>'
        + 'border-radius: 3px;<br>'
        + 'background: #2b2b2b;<br>'
        + 'unicode-bidi: embed;<br>'
        + 'font-family: monospace;<br>'
        + 'color: #bababa;<br>'
        + 'white-space: pre;<br>'
        + '}<br>'
        + '<br>'
        + 'code {<br>'
        + 'border-radius: 3px;<br>'
        + 'background: #2b2b2b;<br>'
        + 'unicode-bidi: embed;<br>'
        + 'font-family: monospace;<br>'
        + 'color: #bababa;<br>'
        + 'white-space: pre;<br>'
        + 'padding: 1px;<br>'
        + 'margin: 1px;<br>'
        + '}<br>'
        + '<br>'
        + 'li.ordered {<br>'
        + 'font-weight: lighter;<br>'
        + '}<br>'
        + '<br>'
        + 'li.unordered {<br>'
        + 'font-style: italic;<br>'
        + '}<br>'
        + '<br>'
        + 'p {<br>'
        + 'font-family:inherit;<br>'
        + 'font-size:inherit;<br>'
        + '}<br>'
        + '<br>'
        + 'img_mountain {<br>'
        + 'float: right;<br>'
        + 'width: 87px;<br>'
        + 'height: 100px;<br>'
        + '}<br>';

    var documentationMD = '# Heading 1<br>'
        + '## Heading 2<br>'
        + '### Heading 3<br>'
        + '#### Heading 4<br>'
        + '##### Heading 5<br>'
        + '###### Heading 6<br>'
        + '&gt; Quote<br>'
        + '<br>'
        + '&gt; Multi-line quote sentence one.<br>'
        + '&gt; Multi-line quote sentence two.<br>'
        + '<br>'
        + '&gt; Nested.<br>'
        + '&gt; &gt; Quotes. <br>'
        + '<br>'
        + '```<br>'
        + 'Code Block<br>'
        + '```<br>'
        + '<br>'
        + 'This is inline ```code.```<br>'
        + '|Cell A1|Cell B1|Cell B1|<br>'
        + '|:---|:----:|---:|<br>'
        + '|Cell A2|Cell B2|Cell B2|<br>'
        + '|Cell A3|Cell B3|Cell B3|<br>'
        + '|Cell A4|Cell B4|Cell B4|<br>'
        + '<br>'
        + '![img_mountain This is the title](https://i.imgur.com/hFGlOI7.png)<br>'
        + '1. Item # 1<br>'
        + '1. Item # 2<br>'
        + '    1. Sub Item # 1 (indented four (4) spaces)<br>'
        + '    1. Sub Item # 2 (indented four (4) spaces)<br>'
        + '1. Item # 3<br>'
        + '<br>'
        + '- Item<br>'
        + '- Item<br>'
        + '    - Sub Item (indented four (4) spaces)<br>'
        + '    - Sub Item (indented four (4) spaces)<br>'
        + '- Item<br>'
        + '<br>'
        + '**Link to Handout:** [(Markdown Getting Started)]<br>'
        + '**Link to webpage:** [Journal Command Buttons](https://wiki.roll20.net/Journal#Journal_Command_Buttons)<br>'
        + '**Link to chat oll:** [Dagger Attack](`/roll 1d20+2 vs AC&#13;/roll 1d4 Damage&#13;)<br>'
        + '**Link to chat inline roll:** [Roll 1d6](`[[1d6]])<br>'
        + '**Link to API command:** [API Command](`!apitlinktest)<br>'
        + '*italic* **bold** ***italic and bold*** ~~strike~~<br>'
        + '&lt;div style="text-align: center"&gt;<br>'
        + '#### Center this section<br>'
        + 'Using direct HTML<br>'
        + '&lt;/div&gt;<br>'
        + '```<br>'
        + '&lt;div style="text-align: center"&gt;<br>'
        + '#### Center this section<br>'
        + 'Using direct HTML<br>'
        + '&lt;/div&gt;<br>'
        + '```<br>'
        + 'Make this text &lt;span style="color:red;"&gt;red&lt;/span&gt; using the "span" tag.<br>'
        + '```<br>'
        + 'Make this text &lt;span style="color:red;"&gt;red&lt;/span&gt; using the "span" tag.<br>'
        + '```<br>'
        + '```<br>'
        + 'bg, //background, if included<br>'
        + 'h1, h2, h3, h4, h5, h6,<br>'
        + 'pre, // code block<br>'
        + 'code, //inline code<br>'
        + 'blockquote,<br>'
        + 'p.blockquote,<br>'
        + 'table, tbody,<br>'
        + 'tr:first-child, tr:nth-child(even), tr:nth-child(odd), tr:nth-child(last),<br>'
        + 'td.align-left, td.align-center, td.align-right, // |:---|:----:|---:|<br>'
        + 'ol, ul, li.ordered, li.unordered,<br>'
        + 'img_mountain, //example of user defined img selector.<br>'
        + '```<br>';

    var documentationGettingStarted = '### Getting Started<br>'
        + 'Create a new **"Handout"** named **"Style Sheet"** and in the **"GM Notes"** place:<br>'
        + '```<br>'
        + '&#91;css&#93;<br>'
        + 'h1 {color: red;}<br>'
        + '```<br>'
        + '**Save changes.**<br>'
        + 'In the **"Description & Notes"** section you should see the processed **CSS**<br>'
        + '```<br>'
        + '&#91;css&#93;(-LxpMeYSNUYwZIVXxguT)<br>'
        + 'h1 {color: red;}<br>'
        + '```<br>'
        + '&gt; **NOTE:** The "-LxpMeYSNUYwZIVXxguT"` part is the object id for your handout. It will not be the same as you see in this example.<br>'
        + 'That is the "link" for this style sheet. ***Copy*** *it to the clipboard.*<br>'
        + 'Create a new **"Handout"** named **"Markdown Handout"** and in the **"GM Notes"** place:<br>'
        + '```<br>'
        + '&#91;md]<br>'
        + '&#91;css&#93;(-LxpMeYSNUYwZIVXxguT)<br>'
        + '# This Heading should be red.<br>'
        + '```<br>'
        + '(You should ***paste*** in what you *copied to the clipboard* to the second line.)<br>'
        + '&gt; **NOTE:** The "-LxpMeYSNUYwZIVXxguT"` part is the object id for your handout. It will not be the same as you see in this example.<br>'
        + '**Save changes.**<br>'
        + 'In the **"Description & Notes"** section you should see the processed **Markdown.**<br>'
        + 'It should be large red text reading:<br>'
        + '&lt;span style="font-size: 2em; font-weight: bolder; color: red;"&gt;This Heading should be red.&lt;/span&gt;<br>'
        + '(if you tire of the "Getting Started" or "Example" handouts, delete this script or archive the handouts.)<br>';

    const readyScript = () => {
        var sampleMD;
        var sampleCSS;
        var gettingStarted;

        log('-=> markdownDocumentation v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');

        if (typeof markdownNotesBio === 'undefined') {
            log("  > Missing 'markdownNotesBio.js'");
            return;
        }

        if (typeof markdown === 'undefined') {
            log("  > Missing 'markdown.js'");
            return;
        }

        sampleMD = findObjs({type: 'handout', name: 'Example Markdown'})[0] || createObj('handout', {name: 'Example Markdown'});
        sampleCSS = findObjs({type: 'handout', name: 'Example Markdown CSS'})[0] || createObj('handout', {name: 'Example Markdown CSS'});
        gettingStarted = findObjs({type: 'handout', name: 'Markdown Getting Started'})[0] || createObj('handout', {name: 'Markdown Getting Started'});

        if ( sampleCSS && !sampleCSS.get('archived') ) {
            sampleCSS.set('gmnotes', documentationCSS);
        }

        if ( sampleMD && !sampleMD.get('archived') ) {
            sampleMD.set('gmnotes', `[md]<br>[css](${ sampleCSS.id })<br>${ documentationMD }`);
        }

        if ( gettingStarted && !gettingStarted.get('archived') ) {
            gettingStarted.set('gmnotes', `[md]<br>[css](${ sampleCSS.id })<br>${ documentationGettingStarted }`);
        }

    };

    on("ready",()=>{
        readyScript();
    });

    return {
        // Public interface here
    };

})();