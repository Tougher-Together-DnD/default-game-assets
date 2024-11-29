// markdownNotesBio.js
var markdownNotesBio = markdownNotesBio || (() => {

    const version = '1.0.1';
    const lastUpdate = 1578078196;
    const schemaVersion = 1.0;

    const CONFIG = {
        apiStart: '<!-- API_markdown -->',
        apiEnd: '<!-- API_markdown_end -->'
    };

    const REGEX = {
        apiNote: /(<!--\sAPI_markdown\s-->)/g
    };

    var DATA = {
        styles: {},
        mdList: {}
    };

    const badParse = ( o ) => {
        return _.isUndefined(o) || _.isNull(o) || _.isNull(o.mdCssTag);
    };

    const purgeAsCss = ( oid ) => {
        //purge any [css] handouts changed to [md] handouts
        delete DATA.styles[oid];
        delete state.markdownNotesBio.data.styles[oid];
        delete DATA.mdList[oid];
        delete state.markdownNotesBio.data.mdList[oid];
    };

    const purgeAsMd = ( oid ) => {
        //purce any [md] handouts changed to [css] handouts
        if( !_.isNull(Object.keys(DATA.mdList)) ) {
            Object.keys(DATA.mdList).forEach(function(each) {
                if ( _.contains(DATA.mdList[each], oid) ) {
                    DATA.mdList[each] = _.without(DATA.mdList[each], oid);
                }
            });
            state.markdownNotesBio.data.mdList = DATA.mdList;
        }
    };

    const setMdState = ( oid, cssId ) => {
        purgeAsCss(oid);
        if ( _.has(DATA.mdList,cssId) && !_.contains(DATA.mdList[cssId],oid)) {
            DATA.mdList[cssId].push(oid);
            state.markdownNotesBio
                .data.mdList[cssId]=_.clone(DATA.mdList[cssId]);
        }
    };

    const setCssState = ( oid, styles ) => {
        DATA.styles[oid] = styles;
        state.markdownNotesBio.data.styles[oid] = styles;
        purgeAsMd(oid);
        if( !_.has(DATA.mdList, oid) ) {
            DATA.mdList[oid] = [];
            state.markdownNotesBio.data.mdList[oid] = [];
        }
    };

    const processGmnote = (obj) => {
        var type = obj.get('type');
        var mdResults;

        obj.get( 'gmnotes', (gmnotes) => {
            mdResults = markdown.Parser({
                text: gmnotes,
                styles: DATA.styles,
                objid: obj.id
            });

            if ( badParse(mdResults) ) {
                purgeAsCss(obj.id);
                purgeAsMd(obj.id);
                return;
            }

            if ( mdResults.mdCssTag == '[md]' ) {
                setMdState(obj.id, mdResults.cssId);
            }

            if ( mdResults.mdCssTag == '[css]' ) {
                setCssState(obj.id, mdResults.styles);
                if ( !_.isNull(DATA.mdList[obj.id]) ) {
                    DATA.mdList[obj.id].forEach(function(each) {
                        var o = getObj('handout', each) || getObj('character', each);
                        if (o) {
                            processGmnote(o);
                        }
                    });
                }
            }

            obj.set((type === 'handout' ? 'notes' : 'bio'), mdResults.markdown);
        });
    };

    const handleGmnotesChange = (obj) => {
        processGmnote(obj);
    };

    const handleNotesBioChange = (obj) => {
        obj.get((obj.get('type')==='handout' ? 'notes' : 'bio'), (notesBio) => {
            if( notesBio.match(REGEX.apiNote) !== null ) {
                return;
            }
            processGmnote(obj);
        });
    };

    const handleHandoutDestroy = (obj) => {
        var tempList;
        purgeAsMd(obj.id);
        if ( !_.isNull(DATA.mdList[obj.id]) ) {
            tempList = _.clone(DATA.mdList[obj.id]);
            purgeAsCss(obj.id);
            if ( !_.isNull(tempList) && !_.isUndefined(tempList) ) {
                tempList.forEach(function(each) {
                    var o = getObj('handout', each) || getObj('character', each);
                    if (o) {
                        processGmnote(o);
                    }
                });
            }
        }
        
    };

    const registerEventHandlers = () => {
        on('change:handout:notes', handleNotesBioChange);
        on('change:character:bio', handleNotesBioChange);
        on('change:handout:gmnotes', handleGmnotesChange);
        on('change:character:gmnotes', handleGmnotesChange);
        on('destroy:handout', handleHandoutDestroy);
        on('destroy:character', handleHandoutDestroy);
    };

    const readyScript = () => {
        var handouts = _.pluck( findObjs({type: 'handout'}), 'id');
        var refreshList = [];
        var sampleCss;

        log('-=> markdownNotesBio v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');

        if( ! _.has(state,'markdownNotesBio') || state.markdownNotesBio.version !== schemaVersion) {
            log('  > Updating Schema to v'+schemaVersion+' <');
            state.markdownNotesBio = {
                version: schemaVersion,
                data: {
                    styles: {},
                    mdList: {}
                }
            };
        }

        if (typeof markdown === 'undefined') {
            log("  > Missing 'markdown.js'");
        }

        _.each( _.difference(Object.keys(state.markdownNotesBio.data.styles), handouts), (id) => {
            delete state.markdownNotesBio.data.styles[id];
        });

        _.each( _.difference(Object.keys(state.markdownNotesBio.data.mdList), handouts ), (id) => {
            refreshList = _.union(refreshList, state.markdownNotesBio.data.mdList[id]);
            delete state.markdownNotesBio.data.mdList[id];
        });

        refreshList = _.intersection( refreshList, handouts).slice(0);

        _.each( refreshList, (id) => {
            let mdObj = getObj('handout', id) || getObj('character', id);
            if ( mdObj ) {
                handleGmnotesChange(mdObj);
            }
        });

        _.each( Object.keys(state.markdownNotesBio.data.mdList), (id) => {
            state.markdownNotesBio.data.mdList[id] = _.intersection( state.markdownNotesBio.data.mdList[id], handouts).slice(0);
        });

        DATA.styles = state.markdownNotesBio.data.styles;
        DATA.mdList = state.markdownNotesBio.data.mdList;
    };

    on("ready",()=>{
        readyScript();
        registerEventHandlers();
    });

    return {
        // Public interface here
    };

})();