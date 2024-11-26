// markdown.js
var markdown = markdown || (() => {

    const version = '1.0.9';

    const lastUpdate = 1578236090;

    const checkInstall = () => {
        log('-=> markdown v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');
    };

    var MDA = [];

    var STYLES = {};

    var escpUnescp = escpUnescp || (() => {
        const decodeArray = [
            {find: /(%%GREATERTHANSIGN%%%)/g, rplc:'>'},
            {find: /(%%UMBERSIGN%%%%%%%%%)/g, rplc:'#'},
            {find: /(%%ASTERISK%%%%%%%%%%)/g, rplc:'*'},
            {find: /(%%GRAVEACCENT%%%%%%%)/g, rplc:'`'},
            {find: /(%%TILDE%%%%%%%%%%%%%)/g, rplc:'~'},
            {find: /(%%HYPHEN%%%%%%%%%%%%)/g, rplc:'-'},
            {find: /(%%VERTICALBAR%%%%%%%)/g, rplc:'|'},
            {find: /(%%PERIOD%%%%%%%%%%%%)/g, rplc:'.'},
            {find: /(%%PARENTHESISLEFT%%%)/g, rplc:'('},
            {find: /(%%PARENTHESISRIGHT%%)/g, rplc:')'},
            {find: /(%%SQUAREBRACKETRIG%%)/g, rplc:'['},
            {find: /(%%SQUAREBRACKETLEF%%)/g, rplc:']'}
        ];

        const encodeArray = [
            {regexp: /(\\#)/g, newSubstr:'%%UMBERSIGN%%%%%%%%%'},
            {regexp: /(\\`)/g, newSubstr:'%%GRAVEACCENT%%%%%%%'},
            {regexp: /(\\~)/g, newSubstr:'%%TILDE%%%%%%%%%%%%%'},
            {regexp: /(\\-)/g, newSubstr:'%%HYPHEN%%%%%%%%%%%%'},
            {regexp: /(\\&gt;)/g, newSubstr:'%%GREATERTHANSIGN%%%'},
            {regexp: /(\\(\*))/g, newSubstr:'%%ASTERISK%%%%%%%%%%'},
            {regexp: /(\\(\|))/g, newSubstr:'%%VERTICALBAR%%%%%%%'},
            {regexp: /(\\(\.))/g, newSubstr:'%%PERIOD%%%%%%%%%%%%'},
            {regexp: /(\\(\())/g, newSubstr:'%%PARENTHESISLEFT%%%'},
            {regexp: /(\\(\)))/g, newSubstr:'%%PARENTHESISRIGHT%%'},
            {regexp: /(\\(\[))/g, newSubstr:'%%SQUAREBRACKETRIG%%'},
            {regexp: /(\\(\]))/g, newSubstr:'%%SQUAREBRACKETLEF%%'}
        ];

        const encode = (s) => {
            encodeArray.forEach(function(item) {
                (s.match(item.regexp)||[]).forEach(function(regexp) {
                    s = s.replace(regexp, item.newSubstr );
                });
            });
            return s;
        };

        const decode = (s) => {
            decodeArray.forEach(function(item) {
                (s.match(item.find)||[]).forEach(function(each) {
                    s = s.replace( each, item.rplc );
                });
            });
            return s;
        };

        return {
            Encode: encode,
            Decode: decode
        };

    })();

    const getCSS = (props) => {
        var txt = '';
        var stl = {};
        var htm = {};
        var declarations;
        var selector;

        props.text = props.text.replace( /(<!--\sAPI_markdown\s-->)/g, '' )
            .replace( /(<!--\sAPI_markdown_end\s-->)/g, '' )
            .replace( /^\[css\]\(.*?\)/mi, '' )
            .replace( /^\[css\]/m, '' )
            .replace( /&nbsp;/g, '' )
            .replace( /"/g, "'" )
            .replace( /\n/g, '')
            .replace( /\s+/g, ' ').trim();

        if ( !(/.*?\{(.*?)\}/g).test(props.text) ) return {cssId: null, styles: null, markdown: null, mdCssTag: null};

        props.text.match(/.*?\{(.*?)\}/g).forEach(function(css) {
            selector = css.substring(0, css.indexOf('{')).trim();
            declarations = css.substring(css.indexOf('{') + 1,css.indexOf('}'));
            htm[selector] = declarations.split(';').filter(Boolean);
            stl[selector] = ` style="${ declarations }" `;
        });

        Object.keys(htm).forEach(function(selector) {
            txt = `${ txt }${ selector }&nbsp;{<br>`;
            htm[selector].forEach(function(declaration) {
                txt = `${ txt }&nbsp;&nbsp;&nbsp;&nbsp;${ declaration.trim() };<br>`;
            });
            txt = `${ txt }}<br><br>`;
        });

        return {
            cssId: null,
            styles: stl,
            markdown: escpUnescp.Decode(`<!-- API_markdown -->[css](${props.cssId})<br><br>${txt}<!-- API_markdown_end -->`),
            mdCssTag: props.mdCssTag
        };
    };

    const getMd = ( cid, mdtag ) => {

        let count = {// add ol and ul counts to this
            bqCount: 0,
            bqDepth: 0,
            tableStarted: false,
            tdStyles: [],
            thStyles: [],
            rowCount: 0
        };

        let txt = '';
        
        let passcount = 0;

        let dirTags = [
            {opn: /(&lt;)(\s*?div style=").*?(\s*?&gt;)/gi, cls: /(&lt;\/div&gt;)/gi, tagOpn: '<div>', tagCls: '</div>'},
            {opn: /(&lt;)(\s*?span style=").*?(\s*?&gt;)/gi, cls: /(&lt;\/span&gt;)/gi, tagOpn: '<span>', tagCls: '</span>'},
            {opn: /(&lt;)(\s*?p style=").*?(\s*?&gt;)/gi, cls: /(&lt;\/p&gt;)/gi, tagOpn: '<p>', tagCls: '</p>'},
            {opn: /(&lt;)(\s*?table\s+?style=).*?(\s*?&gt;)/gmi, cls: /(&lt;)(\s*?\/table\s*?&gt;)/gi, tagOpn: '<table>', tagCls: '</table>'},
            {opn: /(&lt;)(\s*?tbody\s+?style=).*?(\s*?&gt;)/gmi, cls: /(&lt;)(\s*?\/tbody\s*?&gt;)/gi, tagOpn: '<tbody>', tagCls: '</tbody>'},
            {opn: /(&lt;)(\s*?tr\s+?style=).*?(\s*?&gt;)/gmi, cls: /(&lt;)(\s*?\/tr\s*?&gt;)/gi, tagOpn: '<tr>', tagCls: '</tr>'},
            {opn: /(&lt;)(\s*?td\s+?style=).*?(\s*?&gt;)/gmi, cls: /(&lt;)(\s*?\/td\s*?&gt;)/gi, tagOpn: '<td>', tagCls: '</td>'}
        ];

        const getStyle = (s) => ((STYLES ? hasOwnProperty.call(STYLES, s) : false) ? STYLES[s] : '');

        const getBetween = (s1, s2, s3) => s1.substring(s1.indexOf(s2) + s2.length, s1.indexOf(s3));

        const tdAsArray = (s) => s.line.split('|').filter(Boolean);

        const isEven = ( n ) => n % 2 == 0;

        const getStyleTD = ( s ) => {
            s = s.replace(/&nbsp;/g, ' ' ).trim();
            s = ((/^-{3,}:$/m).test(s)
                ? 'td.align-right'
                : ((/^:-{3,}:$/m).test(s)
                    ? 'td.align-center'
                    : 'td.align-left'));
            return getStyle(s);
        };

        const has = {
            fence: (i) => (/^`{3,}(?!.*`)/m).test(MDA[i].line),
            inLineCode: (i) => (/`{3,}(?=.*`{3,})/g).test(MDA[i].line),
            hRule: (i) => (/^(_{3}_*|-{3}-*|\*{3}\**)$/m).test(MDA[i].line),
            blockquote: (i) => (/^&gt;(\s|&nbsp;)(?=\S)/m).test(MDA[i].line),
            tableRow: (i) => (/^\|.*\|$/m).test(MDA[i].line),
            tdStyles: (i) => (/((\|:-{3,}:)|(\|:-{3,})|(\|-{3,}:))/gm).test(MDA[i].line.replace(/(&nbsp;|\s)/g, '')),
            ol: (i) => (/^(&nbsp;|\s)*\d+\.(&nbsp;|\s)(?=\S+)/m).test(MDA[i].line),
            ul: (i) => (/^(&nbsp;|\s)*-(&nbsp;|\s)(?=\S+)/m).test(MDA[i].line),
            heading: (i) => (/^#{1,6}(?=\s\S+)/m).test(MDA[i].line),
            breakTag: (i) => (/(&lt;)\s*?(br)\s*?(\/|)(&gt;)/mi).test(MDA[i].line),
            breakSpaces: (i) => (/(&nbsp;|\s)(&nbsp;|\s)$/mi).test(MDA[i].line),
            typeComment: (i) => MDA[i].type === 'comment',
            typeCode: (i) => MDA[i].type === 'code',
            typeUnknown: (i) => MDA[i].type === 'unknown',
            typeQuote: (i) => MDA[i].type === 'quote'
        };

        const parseFence = (i) => {
            let k;
            let j = i + 1;
            while (j < MDA.length) {
                if ( has.fence(j) ) {
                    k = i + 1;
                    while (k < MDA.length) {
                        if (has.fence(k)) {
                            MDA[i] = {type: 'code', line: MDA[i].line.replace(/^`{3,}(?!.*`)/m, `<pre${ getStyle('pre') }>`)};
                            MDA[k] = {type: 'code', line: MDA[k].line.replace(/^`{3,}(?!.*`)/m, '</pre>')};
                            break;
                        }
                        MDA[k] = {type: 'code', line: (k == (i + 1) ? MDA[k].line : '<br/>'.concat(MDA[k].line))};
                        k++;
                    }
                    break;
                }
                j++;
            }
        };

        const parseInLineCode = (i) => {
            while ( has.inLineCode(i) ) {
                MDA[i].line = MDA[i].line.replace(/`{3}/m, `<span${ getStyle('code') }>`).replace(/`{3}/m, '</span>');
            }
        };

        const parseHrule = (i) => {
            var n = ('*-_').indexOf(MDA[i].line.charAt(0));
            if ( n !== -1 ) {
                MDA[i] = {type: '<hr />', line: `<hr${ getStyle(['hr','hr.style2','hr.style3'][n]) }>`};
            }
        };

        const parseFormateElements = ( i ) => {
            [
                {rx: /(\*{3}).+?(\*{3})/gm, s1: '***', s2: `<b ${getStyle('b')}>`.concat(`<i ${getStyle('i')}>`), s3: '</i>'.concat('</b>')},
                {rx: /(\*{2}).+?(\*{2})/gm, s1: '**', s2: `<b ${getStyle('b')}>`, s3: '</b>'},
                {rx: /(\*{1}).+?(\*{1})/gm, s1: '*', s2: `<i ${getStyle('i')}>`, s3: '</i>'},
                {rx: /~~.+?~~/gm, s1: '~~', s2: `<del ${getStyle('del')}>`, s3: '</del>'}
            ].forEach(function(each) {
                (MDA[i].line.match(each.rx) || []).forEach(function(match) {
                    MDA[i].line = MDA[i].line.replace(each.s1, each.s2).replace(each.s1, each.s3);
                });
            });
        };

        const parseImages = ( i ) => {
            (MDA[i].line.match(/(!\[.*?\]\(.*?\))/g)||[]).forEach(function (img) {
                let sel = _.first(getBetween(img,'[',']').split(' ')).trim();
                let ttl = getBetween(img,'[',']').replace(sel,'').trim();
                let url = getBetween(img, '(', ')');
                ttl = (ttl === '') ? sel : ttl;
                MDA[i].line = MDA[i].line.replace(img, `<img src="${ url }"${ getStyle(sel) } title="${ ttl }" >`
                );
            });
        };

        const parseLinks = ( i ) => {
            (MDA[i].line.match(/\[.*?\]\(.*?\)/g) || []).forEach(function(link) {
                MDA[i].line = MDA[i].line.replace(
                    link,
                    `<a href="${ getBetween(link,'(',')') }">${ getBetween(link,'[',']') }</a>`);
            });
        };

        const parseRollTwentyLinks = ( i ) => {
            (MDA[i].line.match(/\[\(.*?\)\]/g) || []).forEach(function(link) {
                let o = filterObjs(function(obj) {
                    return obj.get('name') === getBetween(link, '(', ')');
                });
                if (o && undefined !== o[0] ) {
                    MDA[i].line = MDA[i].line.replace(link, `<a href="https://journal.roll20.net/${ o[0].get('type') }/${ o[0].id }">${ o[0].get('name') }</a>`);
                }
            });
        };
        passcount = 0;
        do {
            let olTabs = 0;
            let olCount = 0;
            let ulTabs = 0;
            let ulCount = 0;
            cleanPass = true;
            
            for (let i = 0; i < MDA.length; i++) {

                if ( has.typeComment(i) || has.typeCode(i) ) continue;

                if ( has.fence(i) ) parseFence(i);

                if ( has.inLineCode(i) ) parseInLineCode(i);

                if ( has.hRule(i) ) parseHrule(i);

                parseFormateElements(i);

                parseImages(i);

                parseLinks(i);

                parseRollTwentyLinks(i);

                if ( has.blockquote(i) ) {
                    count.bqDepth = MDA[i].line.match(/&gt;(\s|&nbsp;)(?=\S)/g).length;
                    while (count.bqCount < count.bqDepth) {
                        count.bqCount++;
                        MDA[i].line = MDA[i].line.replace(/^&gt;(\s|&nbsp;)(?=\S)/m, '');
                        MDA.splice(i, 0, {type: '<blockquote>', line: `<blockquote ${getStyle('blockquote')}>`});
                        i++;
                    }
                    while (count.bqCount > count.bqDepth) {
                        count.bqCount--;
                        MDA[i].line = MDA[i].line.replace(/^&gt;(\s|&nbsp;)(?=\S)/m, '');
                        MDA.splice(i, 0, {type: '</blockquote>', line: '</blockquote>'});
                        i++;
                    }
                    if (count.bqCount == count.bqDepth) {
                        for (let j = 0; j < count.bqDepth; j++) {
                            MDA[i] = {type: 'quote', line: MDA[i].line.replace(/^&gt;(\s|&nbsp;)(?=\S)/m, '')};
                        }
                    }
                    cleanPass = false;
                    continue;
                }

                while (count.bqCount > 0) {
                    count.bqCount--;
                    MDA.splice(i, 0, {type: '</blockquote>', line: '</blockquote>'});
                    i++;
                    cleanPass = false;
                } // blockquote-------------------------------------------------

                if ( has.tableRow(i) ) {
                    if (!count.tableStarted) {
                        count.tableStarted = true;
                        if ( has.tdStyles(i + 1) ) {
                            tdAsArray(MDA[i + 1]).forEach((each, j) => {
                                count.tdStyles[j] = getStyleTD(each);
                            });
                            MDA.splice(i + 1, 1);
                            MDA.splice(i, 0, {type: '<tr>', line: `<tr${ getStyle('tr:first-child') }>`});
                            MDA.splice(i, 0, {type: '<tbody>', line: `<tbody${ getStyle('tbody') }>`});
                            MDA.splice(i, 0, {type: '<table>', line: `<table${ getStyle('table') }>`});
                            i = 1 + 3;
                        }else{
                            tdAsArray(MDA[i]).forEach((each, j) => {
                                count.tdStyles[j] = getStyleTD(each);
                            });
                            MDA.splice(i, 0, {type: '<tr>', line: `<tr${ getStyle('tr:first-child') }>`});
                            MDA.splice(i, 0, {type: '<tbody>', line: `<tbody${ getStyle('tbody') }>`});
                            MDA.splice(i, 0, {type: '<table>', line: `<table${ getStyle('table') }>`});
                            i = i + 3;
                        }
                        _.each(tdAsArray(MDA[i]), (eachTd, j) => {
                            MDA.splice(i, 0, {type: '</td>', line: '</td>'});
                            MDA.splice(i, 0, {type: 'data', line: eachTd});
                            MDA.splice(i, 0, {type: '<td>', line: `<td${ count.tdStyles[j] }>`});
                            i = i + 3;
                        });
                        MDA[i] = {type: '</tr>', line: '</tr>'};
                        count.rowCount++;
                    } else {
                        MDA.splice(i, 0, {type: '<tr>', line: `<tr${
                            (!(/^\|.*\|$/m).test(MDA[i + 1].line) && STYLES.hasOwnProperty('tr:nth-child(last)')
                                ? STYLES['tr:nth-child(last)']
                                : (isEven(count.rowCount) && STYLES.hasOwnProperty('tr:nth-child(odd)')
                                    ? STYLES['tr:nth-child(odd)']
                                    : (STYLES.hasOwnProperty('tr:nth-child(even)')
                                        ? STYLES['tr:nth-child(even)']
                                        : '')))}>`});
                        i++;
                        _.each(tdAsArray(MDA[i]), (eachTd, j) => {
                            MDA.splice(i, 0, {type: '</td>', line: '</td>'});
                            MDA.splice(i, 0, {type: 'data', line: eachTd});
                            MDA.splice(i, 0, {type: '<td>', line: `<td${ count.tdStyles[j] }>`});
                            i = i + 3;
                        });
                        MDA[i] = {type: '</tr>', line: '</tr>'};
                        count.rowCount++;
                    }
                    continue;
                } else {
                    if (count.tableStarted) {
                        count.tableStarted = false;
                        MDA.splice(i, 0, {type: '</table>', line: '</table>'});
                        MDA.splice(i, 0, {type: '</tbody>', line: '</tbody>'});
                        i = i + 2;
                        count.rowCount = 0;
                        count.tdStyles = [];
                        count.thStyles = [];
                        cleanPass = false;
                    }
                } // table------------------------------------------------------

                if ( has.ol(i) ) {
                    let bullet = MDA[i].line.match(/^(&nbsp;|\s)*\d+\.(&nbsp;|\s)(?=\S+)/m)[0].match(/^(&nbsp;|\s)*(?=\S)/m)[0].replace(/&nbsp;/g, ' ');
                    olTabs = (bullet.length / 4) + 1;
                    while (olCount < olTabs) {
                        MDA.splice(i, 0, {type: '<ol>', line: `<ol${ getStyle('ol') }>`});
                        i++;
                        olCount++;
                    }
                    MDA[i] = {type: '<li>', line: `<li${(_.has(STYLES, 'li.ordered') ? STYLES['li.ordered'] : '')}>${ MDA[i].line.replace(MDA[i].line.match(/^(&nbsp;|\s)*\d+\.(&nbsp;|\s)(?=\S+)/m)[0], '') }</li>`};
                    while (olCount > olTabs) {
                        MDA.splice(i, 0, {type: '</ol>', line: '</ol>'});
                        i++;
                        olCount--;
                    }
                    continue;
                } else {
                    while (olCount > 0) {
                        MDA.splice(i, 0, {type: '</ol>', line: '</ol>'});
                        i++;
                        olCount--;
                    }
                } // ordered list-----------------------------------------------

                if ( has.ul(i) ) {
                    let bullet = MDA[i].line.match(/^(&nbsp;|\s)*-(&nbsp;|\s)(?=\S+)/m)[0].match(/^(&nbsp;|\s)*(?=\S)/m)[0].replace(/&nbsp;/g, ' ');
                    ulTabs = (bullet.length / 4) + 1;
                    while (ulCount < ulTabs) {
                        MDA.splice(i, 0, {type: '<ul>', line: `<ul${ getStyle('ul') }>`});
                        i++;
                        ulCount++;
                    }
                    MDA[i] = {type: '<li>', line: `<li${(_.has(STYLES, 'li.unordered') ? STYLES['li.unordered'] : '')}>${ MDA[i].line.replace(MDA[i].line.match(/^(&nbsp;|\s)*-(&nbsp;|\s)(?=\S+)/m)[0], '') }</li>`};
                    while (ulCount > ulTabs) {
                        MDA.splice(i, 0, {type: '</ul>', line: '</ul>'});
                        i++;
                        ulCount--;
                    }
                    continue;
                } else {
                    while (ulCount > 0) {
                        MDA.splice(i, 0, {type: '</ul>', line: '</ul>'});
                        i++;
                        ulCount--;
                    }
                } // unordered list---------------------------------------------

                if ( has.heading(i) ) {
                    let hDepth = MDA[i].line.match(/^#{1,6}(?=\s\S+)/m)[0].length;
                    MDA.splice(i, 0, {type: `<h${ hDepth }>`, line: `<h${ hDepth }${ getStyle('h' + hDepth) }>`});
                    i++;
                    MDA[i] = {type: `<h${ hDepth }>`, line: MDA[i].line.replace(MDA[i].line.match(/^#{1,6}(?=\s\S+)/m)[0] + ' ', '')};
                    MDA.splice(i + 1, 0, {type: `</h${ hDepth }>`, line: `</h${ hDepth }>`});
                    i++;
                } // heading----------------------------------------------------

                dirTags.forEach(function(eachTag) {
                    if ((eachTag.opn).test(MDA[i].line)) {
                        var j = i;
                        while (j < MDA.length) {
                            if ((eachTag.cls).test(MDA[j].line)) {
                                MDA[i] = {type: 'tag', line: MDA[i].line.replace(MDA[i].line.match(eachTag.opn)[0], MDA[i].line.match(eachTag.opn)[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>'))};
                                MDA[j] = {type: 'tag', line: MDA[j].line.replace(MDA[j].line.match(eachTag.cls)[0], MDA[j].line.match(eachTag.cls)[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>'))};
                                break;
                            }
                            j++;
                        }
                    }
                }); // direct tags----------------------------------------------

                if ( has.breakTag(i) && has.typeUnknown(i + 1) ) {
                    MDA[i].line = MDA[i].line.replace(/(&lt;)\s*?(br)\s*?(\/|)(&gt;)/mi, '<br/>') + MDA[i + 1].line;
                    MDA.splice(i + 1, 1);
                } // break in text tag------------------------------------------

                if ( has.breakSpaces(i) && has.typeUnknown(i + 1) ) {
                    MDA[i].line = MDA[i].line.replace(/(&nbsp;|\s)(&nbsp;|\s)$/mi, '<br/>') + MDA[i + 1].line;
                    MDA.splice(i + 1, 1);
                } // break in text spaces----------------------------------------

                if ( has.typeUnknown(i) ) {
                    MDA[i] = {type: '<p>', line: `<p${getStyle('p')}>${MDA[i].line}</p>`};
                } // p----------------------------------------------------------

                if ( has.typeQuote(i) ) {
                    MDA[i] = {type: '<p>', line: `<p${getStyle('p.blockquote')}>${MDA[i].line}</p>`};
                } // p----------------------------------------------------------

                if (passcount == 5) {
                    cleanPass = true;
                } // limits passes----------------------------------------------

            }
            passcount++;

        } while (!cleanPass);

        if (_.has(STYLES, 'bg')) {
            MDA.splice(1, 0, {type: 'div', line: `<div${ STYLES.bg }>`});
            MDA.splice(MDA.length - 1, 0, {type: '/div', line: '</div>'});
        } // Background---------------------------------------------------------

        _.each( MDA, ( line )=>{ //foreach
            txt = `${ txt }${ line.line }`;
        });

        txt = escpUnescp.Decode(txt);

        if ( txt == '<!-- API_markdown --><!-- API_markdown_end -->' ) {
            return {
                cssId: null,
                styles: null,
                markdown: null,
                mdCssTag: null,
            };
        }

        return {
            cssId: cid,
            styles: null,
            markdown: txt,
            mdCssTag: mdtag
        };
    };

    const parser = ( props ) => {
        var rgx = {
            pClose: /(<\s*?\/\s*?p\s*?>)/gi,
            br_Tag: /(<\s*?br(\s*?|\/|\s*?style.*?)>)/gi,
            anyTag: /(<([^>]+)>)/gi,
            md_Tag: /^\[md\]/m,
            cssTag: /^\[css\]/m,
            cssLnk: /(?:\[css\]\()(.*?)(?:\))/mi
        };
        var cssId;
        var styles;
        var mdCssTag;
        var firstLine = false;
        var returnNull={cssId:null,styles:null,markdown:null,mdCssTag: null};

        MDA = [];

        props = props || {};
        props.text = props.text || '';
        props.styles = props.styles || {};
        props.objid = props.objid || '';

        if ( 0 === props.text.length ) return returnNull;

        props.text = escpUnescp.Encode(props.text);

        [rgx.pClose, rgx.br_Tag].forEach(function(each) {
            props.text = props.text.replace(each, '\n');
        });

        props.text = props.text.replace(rgx.anyTag, '');

        mdCssTag = ((rgx.md_Tag).test(props.text)
                ? '[md]'
                : ((rgx.cssTag).test(props.text)
                    ? '[css]'
                    : undefined));

        if ( mdCssTag == '[md]' ) {
            cssId = (((rgx.cssLnk).test(props.text) && getObj( 'handout', props.text.match(rgx.cssLnk)[1]))
                ? props.text.match(rgx.cssLnk)[1]
                : null);

            STYLES = (props.styles.hasOwnProperty(cssId)
                ? props.styles[cssId]
                : {});
        }

        if ( mdCssTag == '[css]' ) {
            var o = getObj( 'handout', props.objid);
            if( undefined === o ) return returnNull;
            cssId = o.id;
        }

        if ( mdCssTag === void 0 ) return returnNull;

        [rgx.md_Tag, rgx.cssLnk, rgx.cssTag].forEach(function(each) {
            props.text = ((each).test(props.text)
                ? props.text.replace(props.text.match(each)[0], '')
                : props.text);
        });

        props.text = '<!-- API_markdown -->'
            + '\n'
            + props.text
            + '\n'
            + '<!-- API_markdown_end -->';

        props.text.split('\n').forEach( (each) => {
            if ( each == '<!-- API_markdown -->' || each == '<!-- API_markdown_end -->' ) {
                MDA.push({ type: 'comment', line: each });
            }else{
                if ( firstLine ) {
                    MDA.push({ type: 'unknown', line: each });
                }else{
                    if ( each.length != 0 ) { //avoid "/n" lines at that start
                        firstLine = true;
                        MDA.push({ type: 'unknown', line: each });
                    }
                }
            }
        });

        if ( mdCssTag == '[css]' ) return getCSS({text: props.text, mdCssTag: mdCssTag, cssId: cssId});

        if ( mdCssTag == '[md]' ) return getMd(cssId, mdCssTag);

        return returnNull;
    };

    on("ready",()=>{
        checkInstall();
    });

    return {
        Parser: parser
    };

})();