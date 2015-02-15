
"use strict";


function showAlert( message )
{
    if ( giMode == DEBUG_MODE )
    {
        showMessage( message );
    }
}




// replace the native api (parseInt) cause the browser change 09 to 0 in Android ...
// ex. 09 -> 9
function getNumber( sNumber )
{
    if ( !isNumber( sNumber ) )
        return null;

    var iNumber = 0;

    for ( var i = 0; i < sNumber.length; i ++ )
    {
        var sToken = sNumber.substring( i, i + 1 );
        var iToken = 0;
        for ( var j = 0; j < 10; j ++ )
        {
            if ( sToken == "" + j )
            {
                iToken = j;
                break;
            }
        }

        iNumber = iNumber * 10 + iToken;
    }

    return iNumber;
}




function initData()
{

}


function checkLocale()
{
    if ( !navigator.globalization )
    {
        //showMessage( S_NOT_SUPPORT[giLanguageIndex] + "navigator.globalization" );
        return;
    }

    navigator.globalization.getLocaleName(
        function ( locale )
        {
            //alert('locale: ' + locale.value + '\n');
            var sLocale = locale.value.toLowerCase();

            if ( sLocale.indexOf( "zw" ) >= 0 ||
                 sLocale.indexOf( "tw" ) >= 0 ||
                 sLocale.indexOf( "hk" ) >= 0 )
            {
                gLocalLanguageIndex = ZH;
            }
            else if ( sLocale.indexOf( "cn" ) >= 0 )
            {
                gLocalLanguageIndex = CN;
            }
            else if ( sLocale.indexOf( "ja" ) >= 0 ||
                      sLocale.indexOf( "jp" ) >= 0 )
            {
                gLocalLanguageIndex = JA;
            }
            else if ( sLocale.indexOf( "ko" ) >= 0 ||
                      sLocale.indexOf( "kr" ) >= 0 )
            {
                gLocalLanguageIndex = KO;
            }
            else
            {
                gLocalLanguageIndex = EN; // English for default
            }

        },
        function ()
        {
            //alert('Error getting locale\n');
        }
    );
}


function setDocumentTitle( sTitle )
{
    //$.ui.setTitle( sTitle );
    document.title = sTitle;
}

function initSetting()
{
    //removeAllItem(); // for recovery when the wrong items are stored
    //removeItem( KEY_TICKET_CATEGORY_INDEXS );

    setLanguage();
    setDocumentTitle( S_APP_NAME[giLanguageIndex] );
    setRegularColor(); // set the color array

    // set color and image
    gsBackgroundImage = getBackgroundImage();
    showBackgroundImage( gsBackgroundImage );


    // ---- Tuya ----
    initDelayPenHistoryCount();    
    
    //parseSingleLanguage( gsLanguage, ZH );
    //buildLanguage( gsLanguage, gasLanguage );
    
    if ( !notSupportInneractive() )
    {
        geInneractiveAD = Inneractive.createAd( geOptions );
    }
}


function log( text )
{
    if ( console != null )
        console.log( text );
}

// ex. ID_STYLE -> aStyleSlectedIndex
function getSelectArrayByID( sDivID )
{
    var abSelected = new Array();
    var i = 0;
    
    if ( sDivID === ID_STYLE )
    {
        for ( i = 0; i < S_STYLE_ARRAY.length; i ++ )
        {
            abSelected[i] = ( i == getStyleIndex() );
        }
    }
    else if ( sDivID === ID_LANGUAGE )
    {
        for ( i = 0; i < S_LANGUAGE_ARRAY.length; i ++ )
        {
            abSelected[i] = ( i == getLanguageIndex() );
        }
    }

    return abSelected;
}

function getRelatedUrlByIndex( index )
{
    if ( S_RELATED_LINKS_ARRAY[index].toString() === S_GOOGLE_PLAY.toString() )
    {
        return "https://play.google.com/store/apps/details?id=org.sk.tuya";
    }
    else if ( S_RELATED_LINKS_ARRAY[index].toString() === S_WINDOWS_STORE.toString() )
    {
        return "http://apps.microsoft.com/windows/en-us/app/tuya/19b2056a-6c93-4f89-8844-d583b9963331";
    }
    else if ( S_RELATED_LINKS_ARRAY[index].toString() === S_WINDOWS_PHONE_STORE.toString() )
    {
        return "http://www.windowsphone.com/en-us/store/app/tuya/379609c0-e983-46f5-bc45-c7977fa80fce";
    }
    else if ( S_RELATED_LINKS_ARRAY[index].toString() === S_CHROME_WEB_STORE.toString() )
    {
        return "https://chrome.google.com/webstore/detail/tuya/mpgcknahnhkphbjahkhpkdpgaipolkgb?utm_source=chrome-ntp-icon";
    }
    else if ( S_RELATED_LINKS_ARRAY[index].toString() === S_FIREFOX_MARKETPLACE.toString() )
    {
        return "https://marketplace.firefox.com/app/tuya-1/";
    }
    else if ( S_RELATED_LINKS_ARRAY[index].toString() === S_GITHUB.toString() )
    {
        return "https://github.com/abc9070410/Tuya";
    }
    else if ( S_RELATED_LINKS_ARRAY[index].toString() === S_UBUNTU_APP_DIRECTORY.toString() )
    {
        return "https://myapps.developer.ubuntu.com/dev/click-apps/";
    }
    else if ( S_RELATED_LINKS_ARRAY[index].toString() === S_TIZEN_STORE.toString() )
    {
        return "http://seller.tizenstore.com/product/content/inputformbasic.as#";
    }
    else
    {
        showMessage( "no such related link index: " + index );

        return "";
    }
}

// return a random color between #000000 to #FFFFFF
function getRandomColor()
{
    var asSeed = new Array( "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" );

    var sColor = "#";
    for ( var i = 0; i < 6; i ++ )
    {
        sColor += asSeed[Math.floor( Math.random() * 16 )];
    }

    return sColor;
}










function saveTextFile( text )
{

    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "hello world.txt");
}

function downloadImageFile( fileURL )
{
    var beginIndex = fileURL.lastIndexOf( "/" ) + 1;
    var fileName = fileURL.substring( beginIndex, fileURL.length );

    var oReq = new XMLHttpRequest();
    oReq.open("GET", fileURL, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(oEvent) {
        var blob = new Blob([oReq.response], {type: "image/png"});
        saveAs(blob, fileName);
    };

    oReq.send();
}




function addJS( sJsFile, bLocalFile )
{
    var oHead = document.getElementsByTagName("head")[0];
    var oScript = document.createElement("script");
    
    giPrevListIndex = giCurrentListIndex;
    giPrevNameIndex = giCurrentNameIndex;
    
    lockWait();
    
    //alert( sJsFile );
    
    if ( giPlatform == PLATFORM_WP )
    {
        sJsFile = ( gbJSFileOnline && !bLocalFile ) ? sJsFile : getAbsolutePath() + sJsFile;
    }
    
    if ( oScript.onreadystatechange )
    {
        oScript.type = "text/javascript";
        oScript.src = sJsFile;
        oScript.onreadystatechange = function() {
        
            if (this.readyState == 'complete') 
            {
                showAlert( "complete :" + PT_TEMP_DATA.length );
                //alert("complete");
                loadDone();
                
            }
            else if (this.readyState == 'loaded') 
            {
                alert("loaded : " + PT_TEMP_DATA.length );
                loadDone();
            }
        };
        //head.appendChild(oScript);
        document.head.appendChild(oScript);
        
        
    }
    else
    {
        oScript.type = "text/javascript";
        oScript.src = sJsFile;
        oScript.async = true;
        //oHead.appendChild( oScript);
        oScript.onload = function() {
            //alert("onloaded : " + PT_TEMP_DATA.length );
            loadDone();
        };
        document.head.appendChild(oScript);
        //unlockWait();
        
        //alert( sJsFile );
    }
}

function loadDone() 
{
    if ( giPrevListIndex == giCurrentListIndex && 
         giPrevNameIndex == giCurrentNameIndex )
    {
        backupCurrentData();
    }
    else
    {
        //alert( gsCurrentName + "->" + gsBackupName );
        restoreCurrentData();
    }
    
    unlockWait();
    //alert( getCurrentDirectory() + "/" + getCurrentFileName() + "\n\n" + gsCurrentBasicIntroduction );
    
    //alert( "merged: " + getPostCount() );
    
    giUpdateState = STATE_UPDATE_FINISHED;
}

function isLock()
{
    return gbLockWait;
}

function lockWait()
{
    gbLockWait = true;
    $.ui.showMask( S_UPDATING[giLanguageIndex] );
}

function unlockWait()
{
    gbLockWait = false;
    $.ui.hideMask();
}

function getAbsolutePath()
{
    var sFilePath1 = window.location.pathname;
    var sFilePath2 = window.location.href;
    
    //alert( sFilePath + "\n" + sFilePath2 );
    
    var iBeginIndex = sFilePath1.lastIndexOf(':') - 1;
    var iEndIndex = sFilePath1.lastIndexOf('/') + 1;
    var sAbsolutePath = sFilePath1.substring( iBeginIndex, iEndIndex );
    
    //alert( sFilePath );
    
    if ( gbOnReady )
    {
        // ex. x-wmapp0:www/index.html
        iEndIndex = sFilePath2.indexOf(':') + 1;
        var sHeadPart = sFilePath2.substring( 0, iEndIndex );
        var sTailPart = "www/";
        sAbsolutePath = sHeadPart + sTailPart;
    }
    
    return sAbsolutePath;
}

// --------------GWAI-----------------

// get 0 ~ number-1
function getRandom( number )
{
    return Math.floor(Math.random() * number);
}


function getGoogleURL()
{
    var sSearchName = "";
    var asNameToken = getCurrentName().split( " " );
    
    for ( var i = 0; i < asNameToken.length; i ++ )
    {
        if ( i > 0 )
            sSearchName += "+";
            
        sSearchName += asNameToken[i];
    }
    
    return gsGoogleURL + sSearchName;
}


function getScreenHeight()
{
    //return window.screen.height;    
    return getMyHeight();
}

function getScreenWidth()
{
    //return window.screen.width;
    return getMyWidth();
}


function deviceAlert( sMessage )
{
    if ( typeof navigator.notification == 'undefined' )
    {
        showAlert( sMessage );
    }
    else
    {
        navigator.notification.alert(
            sMessage,           // message
            null,               // callback
            'Alert Message',    // title
            'OK'                // buttonName
        );
    }
}



// ------ part-time king -----------

function toggleHeader()
{
    $.ui.toggleHeaderMenu();
    
    gbHeaderShowed = gbHeaderShowed ? false : true;
}


function disableHeader()
{
    if ( gbHeaderShowed )
    {
        toggleHeader();
    }
}

function enableHeader()
{
    if ( !gbHeaderShowed )
    {
        toggleHeader();
    }
}

function toggleFooter()
{
    $.ui.toggleNavMenu();
    
    gbFooterShowed = gbFooterShowed ? false : true;
}

function disableFooter()
{
    if ( gbFooterShowed )
    {
        toggleFooter();
    }
}

function enableFooter()
{
    if ( !gbFooterShowed )
    {
        toggleFooter();
    }
}

function clickImgFilePicker()
{   
    giOpenImageType = IMAGE_TO_CANVAS;
    pickSinglePhoto();
}

function clickImgStuffFilePicker()
{
    giOpenImageType = IMAGE_TO_STUFF;
    pickSinglePhoto();
}

function clickRelatedLink( iClickIndex )
{

}

function clickStyleEvent( event )
{
    clickStyle( event.target.iArgument );
}

function clickStyle( iClickIndex )
{
    setStyeIndex( iClickIndex );
    setStyle();
    
    updateDiv( ID_STYLE, getHTMLOfStyleDiv() );
}

function clickLanguageEvent( event )
{
    log( "LE:" + event.target.iArgument );
    clickLanguage( event.target.iArgument );
}

function clickLanguage( iClickIndex )
{
    setLanguageIndex( iClickIndex );
    setLanguage();
    setDocumentTitle( S_APP_NAME[giLanguageIndex] );
    
    updateDiv( ID_LANGUAGE, getHTMLOfLanguageDiv() );
    //updateDiv( ID_OPTION, getHTMLOfLanguageDiv() );
    updateDiv( ID_HEADER, getHTMLOfHeaderDiv() );
}

function clickFontSizeEvent( event )
{
    clickFontSize( event.target.iArgument );
}

function clickFontSize( iClickIndex )
{
    setFontSizeIndex( iClickIndex );
    updateDiv( ID_FONT_SIZE, getHTMLOfFontSizeDiv() );
}


function isNumber( sText )
{
    return !isNaN( parseInt( sText, 10 ) );
}

function showMessage( sMessage )
{
    onMessage();

    //alert( sMessage );
    var sTitle = S_INFO[giLanguageIndex];
    var sCancel = S_CANCEL[giLanguageIndex];
    var sDone = S_CONFIRM[giLanguageIndex];
    
    // replace cancel button with done button
    $( '#afui' ).popup(
    {
        title: "",
        message: sMessage,
        cancelText: sDone,
        //doneText: sDone
        cancelCallback: offMessage,
        cancelOnly: true
    });
    
    //$( '#afui' ).popup( sMessage );
}

// "must" call offMessage() in fDoneFunction
function showConfirmMessage( sMessage, fDoneFunction )
{
    showInputTextMessage( sMessage, "", fDoneFunction );
}

// "must" call offMessage() in fDoneFunction
function showInputTextMessage( sMessage, sInputText, fDoneFunction )
{
    onMessage();

    var sTitle = S_CONFIRM[giLanguageIndex] + S_MESSAGE[giLanguageIndex];
    var sCancel = S_CANCEL[giLanguageIndex];
    var sDone = S_CONFIRM[giLanguageIndex];
    
    if ( sInputText ) // for input text 
    {
        sTitle = sMessage;
        sMessage = "";
    }
    
    $('#afui').popup(
    {
        title: sTitle,
        message: sMessage,
        cancelText: sCancel,
        cancelCallback: function () {
            offMessage();
            console.log('cancelled');
        },
        doneText: sDone,
        inputText: sInputText,
        doneCallback: fDoneFunction,
        cancelOnly: false
    });
}




function scrollToTop( sDivID )
{
    $.ui.scrollToTop( "#" + sDivID );
}

function isPageAboutOtpion( sDivID )
{
    return ( sDivID === ID_STYLE ||
             sDivID === ID_FONT_SIZE ||
             sDivID === ID_LANGUAGE ||
             sDivID === ID_RELATED_LINKS ||
             sDivID === ID_ABOUT_APP ||
             sDivID === ID_ABOUT_AUTHOR );
}

function needConfirmHeader( sDivID )
{
    return isPageAboutOtpion( sDivID );
}

function bindScrollEvent( sDivID )
{
    var myScroller = $( "#" + sDivID ).scroller();
    //myScroller.addInfinite();  
    var iEnd = 0;
    var iStart = 0;
    
    if ( isPaintPageID( sDivID ) )
    {
        myScroller.lock(); // disable the scroll for the canvas
    }
    
    $.bind( myScroller, 'scrollend', function () {  
        iEnd = Math.floor( myScroller.scrollTop );

        if ( iEnd < 0 )
            iEnd = - iEnd;
        // console.log("scroll end");  

        if ( iStart < iEnd )
        {
            if ( gbFooterShowed )
            {
                //toggleFooter();
            }
            if ( !gbHeaderShowed )
            {
                //toggleHeader();
            }
            //alert( "DOWN: " + iStart + "->" + iEnd  );
        }
        else if ( iStart > iEnd )
        {
            if ( !gbFooterShowed )
            {
                //toggleFooter();
            }
            if ( gbHeaderShowed && !needConfirmHeader( sDivID ) )
            {
                //toggleHeader();
            }
            //alert( "UP: " + iStart + "->" + iEnd  );
        }
        else if ( iStart === 0 && iEnd === 0 )
        {
            //enableFooter();
            
            if ( gbSwipeDown )
            {
                //enableHeader();
                
                if ( isNewListPageID( gsNowDivID ) )
                {
                    //alert( "pull to refresh : " );
                }
            }
        }
        //alert( "scrollend : " + iStart + "->" + iEnd );
    });  
    $.bind(myScroller, 'scrollstop', function () {  
        iStart = Math.floor( myScroller.scrollTop );
    });  
    $.bind(myScroller, 'infinite-scroll-end', function () {  
        //alert( "infinite-scroll-end" );
    });
}





function goLocation()
{
    window.open( getGmapURL( gsLocation ), "_system" );
}

function goEmail()
{
    window.open( getEmailURL( gsEmail ), "_system" );
}

function goEmailOfAuthor()
{
    window.open( getEmailURL( gsEmailOfAuthor ), "_system" );
}

function goOriginalURL()
{
    goURL( gsOriginalPostURL );
}

function goURL( sURL )
{
    window.open( sURL, "_system" );
}

function goRelatedLinkURLEvent( event )
{
    goRelatedLinkURL( event.target.iArgument );
}

function goRelatedLinkURL( index )
{
    goURL( getRelatedUrlByIndex( index ) );
}

function showMask()
{
    $.ui.showMask();
}


function loadPage( sDivID )
{
    $.ui.loadContent( "#" + sDivID, false, false, gsTransition );
}

function clickDate( iClickIndex )
{
    loadPage( ID_P_SEARCH );
}

function clickPeriod( iClickIndex )
{
    setPeriodIndex( iClickIndex );
    loadPage( ID_P_SEARCH );
}

function clickGoBack()
{
    $.ui.goBack();
}

function clickKeyword()
{
}


function getTextWithoutTag( sText, sTag, sReplace )
{
    while ( sText.indexOf( sTag ) >= 0 )
    {
        sText = sText.replace( sTag, sReplace );
    }
    
    return sText
}

function calendarSupported()
{
    return window.plugins && window.plugins.calendar;
}

function addCalendar()
{
}

function updateData()
{
}

function getNowHash()
{
    return window.location.hash;
}

function backToDefault()
{
    offMessage();

    if ( notSupportStored() )
    {
         gStoredItem = {};
    }
    else
    {
        removeAllSetting();
        //window.location.hash = "#" + ID_LANGUAGE;
        updateHash( ID_LANGUAGE );
        window.location.reload();    
    }
}

function onClickBackToDefault()
{
    var sMessage = S_ARE_YOU_SURE[giLanguageIndex] + S_CLEAN_ALL_RECORDS[giLanguageIndex].toLowerCase() + QUESTION_MARK;
    
    showConfirmMessage( sMessage, backToDefault );
}

// -- Tuya --

function getPaintHeight()
{
    return getScreenHeight() - getHeaderHeight();
}

function getPaintWidth()
{
    return getScreenWidth() * 0.99;
}

function initCanvas( height, width )
{
    //alert( height + "," + width );
    gCanvas = document.getElementById( 'c' + giPlayNumber );  //canvas itself
    gContext = gCanvas.getContext( '2d' );
    
    gCanvas.height = height;
    gCanvas.width  = width;

    if ( !gbCanvasInitized )
    {
        cleanPenHistory();
        cleanCanvas( CLEAN_STYLE_NORMAL );
        initPenHistory();
        //storeNowDrawing(); 
        //showMessage( "NEW CANVAS" + getGlobal() );
        storeNowDrawing();
    }
    //drawLine( 50, 50, 100, 100 );
    
    
    gbCanvasInitized = true;

    //alert( gCanvas.height + "," + gCanvas.width );
}

function enableSideMenu()
{
    if ( navSupported() )
        $.ui.toggleSideMenu( true ); // always call this function by menu
}

function disableSideMenu()
{
    if ( navSupported() )
    {
        $.ui.toggleSideMenu( false ); // always call this function by menu
    }
    else
    {
        //window.location.hash = "#" + getPaintPageID();
        //updateHash( getPaintPageID() );
        //changeHash( getPaintPageID() );
        //updateDiv( getNavID(), getHTMLOfPaintDiv() );
        if ( gbOnFullScreenMenu )
        {
            //gbOnFullScreenMenu = false;
            //initPaintPage( getNavID() );
        }
    }
}


function clickUndo()
{
    if ( existDrawing( getPrevDrawIndex() ) )
    {
        showStoredDrawing( UNDO );
        undoPenHistory(); // 2014.10.26
        disableSideMenu();
    }
    else
    {
        showMessage( S_PREV_STEP_NOT_EXISTED[giLanguageIndex] );
    }
}

function clickRedo()
{
    if ( existDrawing( getNextDrawIndex() ) )
    {
        showStoredDrawing( REDO );
        redoPenHistory(); // 2014.10.26
        disableSideMenu(); 
    }
    else
    {
        showMessage( S_NEXT_STEP_NOT_EXISTED[giLanguageIndex] );
    }
}

function clickGoBackToPenStyle()
{
    //scrollToTop( ID_NAV );
    updateDiv( getNavID(), getHTMLOfNavPenStyleDiv() );
    
    if ( navSupported() )
    {
        initPaintPage( gsLastDivID ); // suppose that the demo was just played
    }
    
    giNowSideMenu = SIDEMENU_PEN_STYLE;
}

function clickGoBackToPaint()
{
    //scrollToTop( ID_NAV );
    updateDiv( getNavID(), getHTMLOfNavPaintDiv() );
    giNowSideMenu = SIDEMENU_PAINT;
}

function clickPenRecordSideMenu()
{
    updateDiv( getNavID(), getHTMLOfNavPenRecordDiv() );
    giNowSideMenu = SIDEMENU_PEN_RECORD;
}

function clickPenStyleSideMenu()
{
    updateDiv( getNavID(), getHTMLOfNavPenStyleDiv() );
    giNowSideMenu = SIDEMENU_PEN_STYLE;
}

function clickColorSideMenu()
{
    updateDiv( getNavID(), getHTMLOfNavColorDiv() );
    giNowSideMenu = SIDEMENU_COLOR;
}

function clickForeColorSideMenu()
{
    updateDiv( getNavID(), getHTMLOfNavColorListDiv( FOREGROUND ) );
    giNowSideMenu = SIDEMENU_FORE_COLOR;
}

function clickBackColorSideMenu()
{
    updateDiv( getNavID(), getHTMLOfNavColorListDiv( BACKGROUND ) );
    giNowSideMenu = SIDEMENU_BACK_COLOR;
}


function changeRandomColor()
{
    setForeColor( getRandomColor() );
    addGlobal();
}

function clickForeColorEvent( event )
{
    clickForeColor( event.target.iArgument );
}

function clickForeColor( iColorIndex )
{
    setForeColorIndex( iColorIndex );
    
    if ( iColorIndex == 0 )
    {
        setForeColor( getRandomColor() );
    }
    else
    {
        setForeColor( gColors[iColorIndex - 1] );
    }
    
    addGlobal();

    disableSideMenu();
}

function clickBackColorEvent( event )
{
    clickBackColor( event.target.iArgument );
}

function clickBackColor( iColorIndex )
{
    setBackColorIndex( iColorIndex );
    
    if ( iColorIndex == 0 )
    {
        setBackColor( getDefaultColor() );
    }
    else
    {
        setBackColor( gColors[iColorIndex - 1] );
    }
    
    addGlobal();
    
    //disableSideMenu();
 
    var sMessage = S_SETTING_DONE[giLanguageIndex] + ".  " + S_PLAY[giLanguageIndex] + " ?";
    showConfirmMessage( sMessage, clickPlayObverse );
}


function notSetCutBeginYet()
{
    return giCutBeginIndex < 0;
}

function markCutBegin()
{
    offMessage();

    giCutBeginIndex = giTouchOrder;
}

function markCutEnd()
{
    offMessage();

    giCutEndIndex = giTouchOrder;
    
    //alert( giCutBeginIndex + "->" + giCutEndIndex );
    
    abortPlay( false );
    
    gPenHistory = cutPenHistory( gPenHistory, giCutBeginIndex, giCutEndIndex );
    
    //giPlayNumberForPlayedAfterCut = giPlayNumber;
    //gbPlayedAfterCut = false;
    
    showMessage( "Cut" );
    
    cleanCanvas( CLEAN_STYLE_NORMAL );
    issuePlay( PLAY_STYLE_DEMO );
}

function playCutMode()
{
    offMessage();

    giCutBeginIndex = giCutEndIndex = -1;
    
    issuePlay( PLAY_STYLE_CUT );
}

function clickCutPenHistory()
{
    var sMessage = S_CUT_MODE_MESSAGE[giLanguageIndex];
    showConfirmMessage( sMessage, playCutMode );
}

function clickEnableProcessBar()
{
    setProcessBarEnabled( !getProcessBarEnabled() );
    updateDiv( getNavID(), getHTMLOfNavPlayDiv() );
}

function clickUnifyPlaySpeed()
{
    setPlaySpeedUnified( !getPlaySpeedUnified() );
    updateDiv( getNavID(), getHTMLOfNavPlayDiv() );
}

function clickPlaySideMenu()
{
    updateDiv( getNavID(), getHTMLOfNavPlayDiv() );
    giNowSideMenu = SIDEMENU_PLAY;
}

function clickClean()
{
    var sSinglePenHistory = cleanCanvas( CLEAN_STYLE_NORMAL );
    
    recordPenHistory( sSinglePenHistory );
    
    disableSideMenu();
}

function clickDelay()
{
    var iDelaySecond = getDelaySecond();
    var sSinglePenHistory = delayPlay( iDelaySecond );
    
    recordPenHistory( sSinglePenHistory );
    disableSideMenu();
    
    showMessage( S_IT_IS_ALREADY_DELAY[giLanguageIndex] + iDelaySecond + S_SECOND[giLanguageIndex] );
}

function clickContinueDefault()
{
    clickContinue( giPlayNumber );
}

function clickContinue( iPlayNumber )
{
    if ( iPlayNumber != giPlayNumber )
    {
        return;
    }

    gbTotalQueueLoaded = true;
    
    //alert( giCanvasMode + "RESUME" + iPlayNumber );
    log( "CON : " + giPlayNumber + "," + giPlayStyle + "," + giTouchOrder + "," + giTouchOrder );
    playPenHistory( giPlayNumber, giPlayStyle, giTouchOrder, giTouchOrder );
}

function clickPause()
{
    giPlayNumber++; // do not play the remainder
    setCanvasMode( PAUSE_MODE );
    
    if ( giPlayStyle == PLAY_STYLE_CUT )
    {
        if ( notSetCutBeginYet() )
        {
            var sMessage = S_CUT_BEGIN_MESSAGE[giLanguageIndex];
            showConfirmMessage( sMessage, markCutBegin );
        }
        else
        {
            var sMessage = S_CUT_END_MESSAGE[giLanguageIndex];
            showConfirmMessage( sMessage, markCutEnd );
        }
        
    }

    //alert( giCanvasMode + "PAUSE:" + giTouchOrder );
}

// abort current play & show the last drawing
function abortPlay( bNeedShowBackupDrawing )
{
    giPlayNumber++;
    playStopped( bNeedShowBackupDrawing );
    //showStoredDrawing( NOWDO ); // 2014.11.16
}

function isNowCanvasMode( iMode )
{
    return giCanvasMode == iMode;
}

function setCanvasMode( iMode )
{
    giCanvasMode = iMode;
    updateDiv( ID_HEADER, getHTMLOfHeaderDiv() ); // change the header button
    
    //alert( "SET: " + giCanvasMode );
}

function issuePlay( iPlayStyle )
{
    giPlayStyle = iPlayStyle;
    
    initQueue();
    
    if ( iPlayStyle != PLAY_STYLE_REVERSE )
    {
        playPenHistory( giPlayNumber, iPlayStyle, 0, 0 );
    }
    else
    {
        var iEndOrder = getTouchCount();
        playPenHistory( giPlayNumber, iPlayStyle, iEndOrder, iEndOrder );
    }
}

function clickMenu()
{
    savePenHistory();    
    abortPlay( true );
    
    if ( giNowSideMenu == SIDEMENU_PAINT )
    {
        clickPaintSideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_COLOR )
    {
        clickColorSideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_PLAY )
    {
        clickPlaySideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_FILE )
    {
        clickFileSideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE )
    {
        clickPenStyleSideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_RECORD )
    {
        clickPenRecordSideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_ERASER )
    {
        clickPenStyleEraser();
    }
    else if ( giNowSideMenu == SIDEMENU_FORE_COLOR )
    {
        clickForeColorSideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_BACK_COLOR )
    {
        clickBackColorSideMenu();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_LINE )
    {
        clickPenStyleLine();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_DOT )
    {
        clickPenStyleDot();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_TEXT )
    {
        clickPenStyleText();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_RECTANGLE )
    {
        clickPenStyleRectangle();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_CIRCLE )
    {
        clickPenStyleCircle();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_ERASER )
    {
        clickPenStyleEraser();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_OTHER )
    {
        clickPenStyleOther();
    }
    else if ( giNowSideMenu == SIDEMENU_PEN_STYLE_IMAGE )
    {
        clickPenStyleImage();
    }
    else
    {
        showAlert( "Error sideMenu : " + giNowSideMenu );
    }
    
    enableSideMenu();
}

function clickPlayObverse()
{
    clickPlay( PLAY_STYLE_OBVERSE );
    gbDebug = true;
}

function clickPlayReverse()
{
    clickPlay( PLAY_STYLE_REVERSE );
}

function clickPlayDefault()
{
    clickPlay( getPlayStyle() );
}

function clickPlay( iPlayStyle )
{
    offMessage();

    disableSideMenu();
    
    setPlayStyle( iPlayStyle );
    issuePlay( iPlayStyle );
}

function showOpenImage( iCenterX, iCenterY )
{
    log( "show loadImage: " + gImageNowCount );

    issueNewFile( false );

    giImageTargetIndex = gImageNowCount - 1;

    var sPenStyleBackup = gPenStyle;
    gPenStyle = TYPE_IMAGE;
    draw( iCenterX, iCenterY );
    gPenHistory += TOUCH_GAP;
    gPenStyle = sPenStyleBackup;

    clickPlay( PLAY_STYLE_DEMO );
}

function clickFileSideMenu()
{
    var e;

    if ( notSupportJsLink() )
    {
        if ( e = document.getElementById( ID_IMG_FILE_SELECTOR ) )
        {
            e.removeEventListener( "change", file_viewer_load, false );
        }
    }

    updateDiv( getNavID(), getHTMLOfNavFileDiv() );
    
    var e;
    
    e = document.getElementById( ID_DOWNLOAD_ANIMATION_LINK );
    e.addEventListener( 'click', clickSaveAnimationFile, false );
    
    e = document.getElementById( ID_DOWNLOAD_DRAWING_LINK );
    e.addEventListener( 'click', clickSaveDrawingFile, false );    
    
    giNowSideMenu = SIDEMENU_FILE;

    if ( notSupportJsLink() )
    {
        if ( e = document.getElementById( ID_IMG_FILE_SELECTOR ) )
        {
            e.addEventListener( "change", file_viewer_load, false );
        }
    }
}

function clickChangeFileName()
{
    showInputTextMessage( S_ENTER_TEXT_FOR_PRINTING[giLanguageIndex], gsFileName, issueChangeFileName );   
}

function issueChangeFileName()
{
    offMessage();

    var e;
    var sText;
    
    if ( e = document.getElementById( ID_INPUT_TEXT ) )
    {
        sText = e.value;
        
        if ( sText && sText != "" )
        {
            gsFileName = sText;
            
            //alert( gDrawText );
        }
        
        //disableSideMenu();
    }
}

function clickNewFile()
{
    var sMessage = S_NEW[giLanguageIndex] + " " + S_FILE[giLanguageIndex] + " ?";
    var fDoneFunction = issueNewFileDefault;
    showConfirmMessage( sMessage, fDoneFunction );
}

function issueNewFileDefault()
{
    issueNewFile( true );
}

function issueNewFile( bShowMessage )
{
    giPlayNumber = giNowPlayNumberOfPaint;
    gbCanvasInitized = false;
    initCanvas( getPaintHeight(), getPaintWidth() );
    
    if ( bShowMessage )
    {
        var sMessage = S_NEW[giLanguageIndex] + " " + S_FILE[giLanguageIndex] + " " + S_SUCCESS[giLanguageIndex];
        showMessage( sMessage );
    }
    
    disableSideMenu();
}

function clickOpenFile()
{
    /*
    var baseimage = new Image();
    baseimage.onload = function() { 
        var dataURL = gCanvas.toDataURL("image/png");
        gsBmpDataURL = dataURL;
    }
    */
}

function writeHTMLOfSaveCanvas( sDataURL )
{
    var sHTML = "";

    sHTML += getHTMLOfText( S_FILE_SAVE_BY_RIGHT_CLICK_MESSAGE[giLanguageIndex], getFontRatio() );
    //sHTML += getHTMLOfNewLine( 1 );
    sHTML += "<img src='"+ sDataURL + "' alt='from canvas'/>";

    var ref = window.open(sDataURL, '_system', "location=yes");
    //ref.executeScript({ code: "alert( 'hello1' );" });

    /*
    ref.addEventListener( "loadstop", function() {
        ref.document.write( sHTML );
    });
    */
    /*
    ref.addEventListener( "loadstart", function() {
        //ref.executeScript({ code: "alert( 'loadstart' );" });
        //alert("loadstart");
        this.href = sDataURL;
    });
    ref.addEventListener( "loaderror", function() {
        //ref.executeScript({ code: "alert( 'loaderror' );" });
        alert("loaderror");
    });
    */
    //var w = window.open('about:blank', '_system', 'location=yes'); // _blank:InAppBrower
    //w.document.write( sHTML );
}

function clickSaveDrawingFile()
{
    var sFileName = getImageFileName( IMAGE_TYPE_PNG );

    if ( typeof Windows != 'undefined' ) // for Win 8 APP only
    {
        if ( giPlatform == PLATFORM_WP )
        {
            saveImageInWindowsPhone81( IMAGE_TYPE_PNG );
        }
        else
        {
            saveImageInWindows8( IMAGE_TYPE_PNG );
        }
    }
    else if ( window.navigator.msSaveBlob ) // for IE only
    {
        var blobObject = getImageBlob( IMAGE_TYPE_PNG );
        window.navigator.msSaveBlob(blobObject, sFileName );
        //showMessage( S_SUCCESS[giLanguageIndex] + " : " + sFileName );
    }
    else if ( navigator.getDeviceStorage ) // for FirefoxOS only
    {
        saveImageOnFirefoxOS( IMAGE_TYPE_PNG );
    }
    else if ( supportCanvas2ImagePlugin() )
    {
        saveImageFileByPlugin( IMAGE_TYPE_PNG );
    }
    else 
    {
        this.href = gsPngDataURL;
        //showMessage( S_SUCCESS[giLanguageIndex] + " : " + sFileName );
    }
    
    disableSideMenu();
}

function clickSaveAnimationFile()
{
    var sFileName = getImageFileName( IMAGE_TYPE_BMP );

    if ( filePrepared() )
    {
        if ( typeof Windows != 'undefined' ) // for Win 8 APP only
        {
            if ( giPlatform == PLATFORM_WP )
            {
                saveImageInWindowsPhone81( IMAGE_TYPE_BMP );
            }
            else
            {
                saveImageInWindows8( IMAGE_TYPE_BMP );
            }
        }
        /*
        else if ( typeof chrome !== 'undefined' )
        {
            showMessage( "chrome: " + chrome.fileSystem.chooseEntry );
            chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
                writableFileEntry.createWriter(function(writer) {
                  writer.onerror = errorHandler;
                  writer.onwriteend = function(e) {
                    console.log('write complete');
                  };
                  writer.write(new Blob(['1234567890'], {type: 'text/plain'}));
                }, errorHandler);
            });
        }
        */
        else if ( window.navigator.msSaveBlob )  // for IE only
        {
            var blobObject = getImageBlob( IMAGE_TYPE_BMP );
            window.navigator.msSaveBlob(blobObject, sFileName );
            //showMessage( S_SUCCESS[giLanguageIndex] + " : " + sFileName );
        }
        else if ( navigator.getDeviceStorage ) // for FirefoxOS only
        {
            saveImageOnFirefoxOS( IMAGE_TYPE_BMP );
        }
        else if ( supportCanvas2ImagePlugin() )
        {
            saveImageFileByPlugin( IMAGE_TYPE_BMP ); // Android OK
            
            //saveImageFileByPlugin2( IMAGE_TYPE_BMP );
            //goURL( gsBmpDataURL ); // -> not work in Android
            
            // http://blogs.telerik.com/appbuilder/posts/13-12-23/cross-window-communication-with-cordova%27s-inappbrowser
            // http://plugins.cordova.io/#/package/org.apache.cordova.inappbrowser
            // https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage
            //writeHTMLOfSaveCanvas( gsBmpDataURL );
        }
        else
        {
            this.href = gsBmpDataURL;
            //showMessage( S_SUCCESS[giLanguageIndex] + " : " + sFileName );
        }
    }
    else
    {
        showMessage( S_PIC_NOT_GENERATED_YET_MESSAGE[giLanguageIndex] );
    }
    
    disableSideMenu();
}

function filePrepared()
{   
    var encodeIsFail = false;

    if ( gsBmpDataURL && gsBmpDataURL != "" )
    {
        //window.open( gsBmpDataURL, "_system" );
    
        var beginIndex = getPenHistoryBeginIndex( gsBmpDataURL );
        
        try {
            //var de = atob( gsBmpDataURL.substring( beginIndex + getDivisionOffset(), gsBmpDataURL.length ) );
            var de = decodeBase64( gsBmpDataURL.substring( beginIndex, gsBmpDataURL.length ) );
            //var de = atob( gsBmpDataURL.substring( 0, beginIndex ) );

            //alert( "PASS: " + de );
            
            //alert( de.substring( 0, 20 ) );
            
            //alert( "PASS gPenHistory=" + gPenHistory );
        }
        catch(err) {
            //showMessage( S_GENERATE_FILE_FAIL_MESSAGE[giLanguageIndex] + "<br>" + err.message );
            showAlert( "[" + err.stack + "][" + beginIndex + "]FAIL gPenHistory=" + gPenHistory );
            
            encodeIsFail = true;
        }
        //showMessage( gsBmpDataURL.substring( beginIndex + 1, beginIndex + 40 ) );

        return !encodeIsFail;
    }
    else
    {
        alert("NO gsBmpDataURL !");
    }
    
    return false;
}

function getSpecificWidth( iPenStyle )
{
    if ( iPenStyle == TYPE_PEN_LINE || 
         iPenStyle == TYPE_PEN_DOT )
    {
        return getPenWidth();
    }
    else if ( iPenStyle == TYPE_TEXT )
    {
        return getTextWidth();
    }
    else if ( iPenStyle == TYPE_PEN_RECTANGLE )
    {
        return getRectangleWidth();
    }
    else if ( iPenStyle == TYPE_PEN_CIRCLE )
    {
        return getCircleWidth();
    }
    else if ( iPenStyle == TYPE_PEN_ERASER )
    {
        return getEraserWidth();
    }
    else if ( iPenStyle == TYPE_IMAGE )
    {
        return getImageStuffRatio();
    }
    else
    {
        return null;
    }
}

function setSpecificWidth( iPenStyle, iWidth )
{
    if ( iPenStyle == TYPE_PEN_LINE || 
         iPenStyle == TYPE_PEN_DOT )
    {
        setPenWidth( iWidth );
    }
    else if ( iPenStyle == TYPE_TEXT )
    {
        setTextWidth( iWidth );
    }
    else if ( iPenStyle == TYPE_PEN_RECTANGLE )
    {
        setRectangleWidth( iWidth );
    }
    else if ( iPenStyle == TYPE_PEN_CIRCLE )
    {
        setCircleWidth( iWidth );
    }
    else if ( iPenStyle == TYPE_PEN_ERASER )
    {
        setEraserWidth( iWidth );
    }
    else if ( iPenStyle == TYPE_IMAGE )
    {
        return setImageStuffRatio( iWidth );
    }
}



function clickDelaySecondIncrease()
{
    setDelaySecond( getDelaySecond() + 1 );
    updateDiv( getNavID(), getHTMLOfNavPenStyleOtherDiv() );
}

function clickDelaySecondDecrease()
{
    if ( getDelaySecond() > 2 )
    {
        setDelaySecond( getDelaySecond() - 1 );
        updateDiv( getNavID(), getHTMLOfNavPenStyleOtherDiv() );
    }
}

function clickPenStyleDemoIncreaseDefault()
{
    clickPenStyleDemoIncrease( getPenStyleBySideMenu() );
}

function clickPenStyleDemoIncrease( iPenStyle )
{
    var iIncrease = iPenStyle == TYPE_TEXT ? 15 : 5;
    
    var iWidth = getSpecificWidth( iPenStyle ) + iIncrease;

    setSpecificWidth( iPenStyle, iWidth );
    
    addGlobal();
    
    showDemoPage( iPenStyle );
}

function getPenStyleBySideMenu()
{
    return giNowSideMenu == SIDEMENU_PEN_STYLE_IMAGE ? TYPE_IMAGE : gPenStyle;
}

function clickPenStyleDemoDecreaseDefault()
{
    clickPenStyleDemoDecrease( getPenStyleBySideMenu() );
}

function clickPenStyleDemoDecrease( iPenStyle )
{
    var iMinWidth = 3;
    var iDecrease = iPenStyle == TYPE_TEXT ? 15 : 5;
    
    var iWidth = getSpecificWidth( iPenStyle ) - iDecrease;
    
    if ( iWidth > iMinWidth )
    {
        setSpecificWidth( iPenStyle, iWidth );
    }
    addGlobal();
    
    showDemoPage( iPenStyle );
}

function clickPlaySpeedUp()
{
    if ( getPlaySpeed() > 5 )
    {
        setPlaySpeed( getPlaySpeed() - 5 );
        updateDiv( getNavID(), getHTMLOfNavPlayDiv() );
    }
}

function clickPlaySpeedDown()
{
    setPlaySpeed( getPlaySpeed() + 5 );
    
    updateDiv( getNavID(), getHTMLOfNavPlayDiv() );
}

function clickConfirm()
{
    disableSideMenu();
}

function clickPenStyleLine()
{
    giNowSideMenu = SIDEMENU_PEN_STYLE_LINE;
    setPenStyle( TYPE_PEN_LINE );
    showDemoPage( TYPE_PEN_LINE );
}

function showDemoPage( iPenStyle )
{
    log( "-showDemoPage:" + iPenStyle );
    
    if ( iPenStyle == TYPE_IMAGE )
    {
        updateDiv( getNavID(), getHTMLOfNavPenStyleImageDiv() );
    }
    else
    {
        updateDiv( getNavID(), getHTMLOfNavPenStyleDemoDiv( iPenStyle ) );
        playDemo( iPenStyle );
    }
}


function clickPenStyleSpecificStyleEvent( event )
{
    clickPenStyleSpecificStyle( gPenStyle, event.target.iArgument );
}

function clickPenStyleSpecificStyle( iPenStyle, iSpecificStyle )
{
    if ( iPenStyle == TYPE_PEN_LINE )
    {
        setLineStyle( iSpecificStyle );
    }
    else if ( iPenStyle == TYPE_PEN_DOT )
    {
        setDotStyle( iSpecificStyle );
    }
    else if ( iPenStyle == TYPE_TEXT )
    {
        setTextStyle( iSpecificStyle );
    }
    else if ( iPenStyle == TYPE_PEN_RECTANGLE )
    {
        setRectangleStyle( iSpecificStyle );
    }
    else if ( iPenStyle == TYPE_PEN_CIRCLE )
    {
        setCircleStyle( iSpecificStyle );
    }
    else if ( iPenStyle == TYPE_PEN_ERASER )
    {
        setEraserStyle( iSpecificStyle );
    }
    
    showDemoPage( iPenStyle );
}

function clickPenStyleCircle()
{
    setPenStyle( TYPE_PEN_CIRCLE );
    
    

    giNowSideMenu = SIDEMENU_PEN_STYLE_CIRCLE;
    showDemoPage( TYPE_PEN_CIRCLE );
}

function clickPenStyleRectangle()
{
    giNowSideMenu = SIDEMENU_PEN_STYLE_RECTANGLE;
    setPenStyle( TYPE_PEN_RECTANGLE );
    showDemoPage( TYPE_PEN_RECTANGLE );
}

function clickChangeText()
{
    showInputTextMessage( S_ENTER_TEXT_FOR_PRINTING[giLanguageIndex], decodeText( gDrawText ), issueChangeText );
}

function issueChangeText()
{
    offMessage();
    
    var e;
    var sText;
    
    if ( e = document.getElementById( ID_INPUT_TEXT ) )
    {
        sText = e.value;

        if ( sText && sText != "" )
        {
            gDrawText = encodeText( sText );
            
            //alert( gDrawText );
        }
    }

    setPenStyle( TYPE_TEXT );
    showDemoPage( TYPE_TEXT );
}

function clickPenStyleText()
{
    giNowSideMenu = SIDEMENU_PEN_STYLE_TEXT;
    setPenStyle( TYPE_TEXT );
    showDemoPage( TYPE_TEXT );
}

function imageExisted()
{
    return gImageNowCount > 0;
}

function clickPenStylePictureEvent( event )
{
    log( "PSP:" + event.target.iArgument );
    clickPenStylePicture( event.target.iArgument );
}

function clickPenStylePicture( iImageIndex )
{
    if ( !imageExisted() )
    {
        showMessage( S_NO_IMAGE_MESSAGE[giLanguageIndex] );
        return;
    }
    
    giImageTargetIndex = iImageIndex;

    setPenStyle( TYPE_IMAGE );
    
    disableSideMenu();
}

function clickPenStyleEraser()
{           
    giNowSideMenu = SIDEMENU_PEN_STYLE_ERASER;
    setPenStyle( TYPE_PEN_ERASER );
    showDemoPage( TYPE_PEN_ERASER );
}

function clickPenStyleDot()
{
    giNowSideMenu = SIDEMENU_PEN_STYLE_DOT;
    setPenStyle( TYPE_PEN_DOT );
    showDemoPage( TYPE_PEN_DOT );
}

function clickPenStyleOther()
{           
    giNowSideMenu = SIDEMENU_PEN_STYLE_OTHER;
    updateDiv( getNavID(), getHTMLOfNavPenStyleOtherDiv() );
}

function clickPenStyleImage()
{   
    var e;

    if ( notSupportJsLink() )
    {
        if ( e = document.getElementById( ID_IMG_STUFF_FILE_SELECTOR ) )
        {
            e.removeEventListener( "change", openImageStuff, false );
        }
    }
        
    giNowSideMenu = SIDEMENU_PEN_STYLE_IMAGE;
    updateDiv( getNavID(), getHTMLOfNavPenStyleImageDiv() );

    if ( notSupportJsLink() )
    {
        if ( e = document.getElementById( ID_IMG_STUFF_FILE_SELECTOR ) )
        {
            e.addEventListener( "change", openImageStuff, false );
        }
    }
}

function inCanvas( iTouchX, iTouchY )
{
    return getHeaderHeight() < iTouchY;
}

function touchStartEvent( iTouchX, iTouchY )
{
    gbTouchInvalid = isMessageOn();
    gsTouchStartDivID = gsNowDivID;
    
    if ( gbTouchInvalid )
        return;

    if ( !inCanvas( iTouchX, iTouchY ) )
    {
        return; // not the draw area
    }
    
    if ( isNowCanvasMode( PLAY_MODE ) )
    {
        clickPause();
    }
    else if ( isNowCanvasMode( PAUSE_MODE ) )
    {
        clickContinue( giPlayNumber );
    }

    if ( !drawAllowed() )
        return;
        
    initQueue();

    giStartTouchX = iTouchX;
    giStartTouchY = iTouchY;
   
    gPreviousPhyX = INIT_POS;
    gPreviousPhyY = INIT_POS;
    
    //cleanUndoAndRedo(); // clean the record of undo & redo
    
    //gCutEnable = false;
    //draw( iTouchX, iTouchY );
    
    if ( isRandomForeColorMode() )
    {
        changeRandomColor();
    }
}

function touchMoveEvent( iTouchX, iTouchY )
{
    if ( gbTouchInvalid || !drawAllowed() )
        return;

    gCutEnable = false;
    mousemove( iTouchX, iTouchY );
}

// do not draw only if we use line and the line style is normal
function needDrawWhenTouchEnd()
{
    return ( gPenStyle != TYPE_PEN_LINE || 
             getLineStyle() == LINE_STYLE_NORMAL );
}

function touchEndEvent( iTouchX, iTouchY )
{
    if ( gbTouchInvalid )
        return;
        
    if ( isSideMenuOn() &&
         !isMessageOn() && 
         iTouchX > $.ui.getSideMenuPosition() )
    {
        // disable sideMenu if we click the non-sideMenu location
        disableSideMenu();
        
        if ( existDemoInSideMenu() )
        {
            initPaintPage( gsLastDivID );
        }
    }
    
    if ( !drawAllowed() )
    {
        return;
    }
    
    if ( !gCutEnable )
    {
        //enableSideMenu(); // TEST 20141226
    
        gCutEnable = true; // disconnect the line
        
        if ( !inCanvas( iTouchX, iTouchY ) )
        {
            return; // not the draw area
        }
 
        if ( needDrawWhenTouchEnd() )
        {       
            draw( iTouchX, iTouchY );
        }
        //alert( "DRAW END : " + gCanvas.height + "," + gCanvas.width );
        
        gPreviousPhyX = INIT_POS;
        gPreviousPhyY = INIT_POS;
        
        gPenHistory += TOUCH_GAP; // record the current touch
        
        storeNowDrawing();
    }
    else
    {
        if ( inCanvas( iTouchX, iTouchY ) )
        {
            draw( iTouchX, iTouchY ); // only touch, not swipe
        }
        
        if ( gPenHistory && gPenHistory != "" )
        {
            gPenHistory += TOUCH_GAP; // record the current touch
        }
    }
}

function getDateString()
{
    var date = new Date(); 
    return date.getFullYear() + "." + 
       (date.getMonth()+1) + "." + 
       date.getDate() + "." + 
       date.getHours() + "." + 
       date.getMinutes() + "." + 
       date.getSeconds();
}

function getImageFileName( iImageType )
{
    var sExtension = iImageType == IMAGE_TYPE_BMP ? ".bmp" : ".png";
    var sName = gsFileName ? gsFileName : getDefaultImageFileName();

    return sName + "_" + getDateString() + sExtension;
}

function getDefaultImageFileName()
{
    return "pic";
} 

function getImageDownloadID( iImageType )
{
    if ( iImageType == IMAGE_TYPE_BMP )
        return ID_DOWNLOAD_ANIMATION_LINK;
    else
        return ID_DOWNLOAD_DRAWING_LINK;
}

function setRandomColor()
{
    if ( gColors.length > 1 )
        return; // set one time only
        
    var iCount = 10;

    for ( var i = 0; i < iCount; i ++ )
    {
        gColors[i] = getRandomColor();
    }
    
    gColors[0] = "black";
    gColors[iCount - 1] = "white";
}

function setRegularColor()
{
    if ( gColors.length > 1 )
        return; // set one time only
        
    var iCount = 20;

    for ( var i = 0; i < iCount; i ++ )
    {
        gColors[i] = getColor( iCount, i );
    }
    
    gColors[0] = "black";
    gColors[iCount - 1] = "white";
}

function addGlobal()
{
    gPenHistory += setGlobal( getBackColor(), getForeColor(), getPenWidth(), getRectangleWidth(), getCircleWidth(), getEraserWidth(), getTextWidth(),  getPlaySpeed() );
    gPenHistory = gPenHistory.replace( MOTION_GAP + TOUCH_GAP, TOUCH_GAP );

    if ( isPaintPageNow() || 
         !navSupported() ) // do any setting on ID_MENU page if nav(side menu) is not supported. 
    {
        saveGlobal(); // avoid overwritting the setting after menu button is clicked
    }
}

function drawAllowed()
{
    return !penIsLock() &&
           !isSideMenuOn() && 
           isNowCanvasMode( EDIT_MODE ) && 
           gsTouchStartDivID != ID_MAIN &&
           ( isPaintPageNow() || gsNowDivID == ID_ABOUT_AUTHOR );
}

function getDivisionTag( iTagIndex )
{
    if ( iTagIndex == 0 ) // BMP最後面都補"/" .
        return gsLastEncodeTextOfBMP + gsFirstEncodeTagOfPenHistory; 
    else // AAAAA
        return gsLastEncodeTextOfBMP2;
}

function getDivisionOffset( iTagIndex )
{
    if ( iTagIndex == 0 )
        return gsLastEncodeTextOfBMP.length;
    else
        return gsLastEncodeTextOfBMP2.length;
}

function getPenHistoryBeginIndex( sEncode )
{
    var iTagIndex = 0;
    var beginIndex = sEncode.lastIndexOf( getDivisionTag( iTagIndex ) );
    
    if ( beginIndex < 0 ) // use the second king of tag
    {
        iTagIndex = 1;
        beginIndex = sEncode.lastIndexOf( getDivisionTag( iTagIndex ) );
    }
    
    return beginIndex + getDivisionOffset( iTagIndex );
}

function getDefaultGlobalForEraserDemo()
{
    return getGlobal( getForeColor(), getBackColor(), getPenWidth(), getRectangleWidth(), getCircleWidth(), getEraserWidth(), getTextWidth(), getPlaySpeed() );
}

function getDefaultGlobal()
{
    return getGlobal( getBackColor(), getForeColor(), getPenWidth(), getRectangleWidth(), getCircleWidth(), getEraserWidth(), getTextWidth(), getPlaySpeed() );
}

function setDefaultGlobal()
{
    return setGlobal( getBackColor(), getForeColor(), getPenWidth(), getRectangleWidth(), getCircleWidth(), getEraserWidth(), getTextWidth(), getPlaySpeed() );
}

function initPenHistory()
{
    setDefaultGlobal();
    gPenHistory = getDefaultGlobal();
}

function initDelayPenHistoryCount()
{
    for ( var i = 0; i < 100; i ++ )
    {
        gaiDelayCleanCount[i] = 0;
    }
}

function recordEveryMove()
{
    return true;//gPenStyle != TYPE_IMAGE; //true; //needKeepTrace( gPenStyle );
}

function needKeepTrace( iPenStyle )
{
    return ( iPenStyle == TYPE_PEN_LINE || 
             iPenStyle == TYPE_PEN_DOT || 
             iPenStyle == TYPE_PEN_ERASER );
}

function needPlayTrace( iPenStyle )
{
    return ( !needKeepTrace( iPenStyle ) && 
             //iPenStyle != TYPE_IMAGE && 
             iPenStyle < TYPE_GLOBAL_VALUE );
}


function needWaitingPlay( iPenStyle )
{
    return iPenStyle == TYPE_IMAGE ||
           iPenStyle == TYPE_PEN_CIRCLE ||
           iPenStyle == TYPE_PEN_RECTANGLE ||
           iPenStyle == TYPE_TEXT;
}

function issueDrawQueue( iMode, iPlayNumber, iPlayStyle, iPenStyle, iBeginTouchOrder, iTouchOrder )
{
    log( "issueDrawQueue:" + iMode + ":" + giDrawQueueCount + "," + iBeginTouchOrder + "," + iTouchOrder );
    
    if ( gbTotalQueueLoaded )
    {
        if ( iPenStyle == TYPE_IMAGE )
        {
            drawQueueImage( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder ); // 6
        }
        else if ( iPenStyle == TYPE_TEXT )
        {
            drawQueueText( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder );
        }
        else if ( iPenStyle == TYPE_PEN_CIRCLE )
        {
            drawQueueCircle( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder );
        }
        else if ( iPenStyle == TYPE_PEN_RECTANGLE )
        {
            drawQueueRectangle( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder );
        }
        else
        {
            log( "iPlayStyle : " + iPlayStyle );
        }
    }
    else
    {
        log( "ND : " + giDrawQueueCount + "," + gbTotalQueueLoaded );
    }
}

// ex. factor=3 -> clean the screen after touch moved 3 times
function getDelayFactor()
{
    if ( gPenStyle == TYPE_IMAGE )
        return 1;
    else
        return 3;
}

function recordPenHistory( sSinglePenHistory )
{
    if ( recordEveryMove() || gCutEnable )
    {
        gPenHistory += sSinglePenHistory;
    }
}

function getMyWidth()
{
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var x = w.innerWidth || e.clientWidth || g.clientWidth;
    var y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    //alert( w.innerWidth + "," +  e.clientWidth + "," + g.clientWidth );
    //alert( w.innerHeight + "," +  e.clientHeight + "," + g.clientHeight );
    
    return x;
}

function getMyHeight()
{
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var x = w.innerWidth || e.clientWidth || g.clientWidth;
    return w.innerHeight|| e.clientHeight|| g.clientHeight;
}

function undoPenHistory()
{
    var iBegin = 0;
    var iEnd = gPenHistory.lastIndexOf( TOUCH_GAP ) - 20;
    
    iEnd = gPenHistory.lastIndexOf( TOUCH_GAP, iEnd ) + 1;
    
    if ( iEnd > 1 )
    {
        var iLast = gPenHistory.length;
        gasUndoHistory[giUndoIndex++] = gPenHistory.substring( iEnd, iLast );
        gPenHistory = gPenHistory.substring( 0, iEnd );
        
        //alert( (giUndoIndex-1) + ":" +  gasUndoHistory[giUndoIndex-1].substring(0, 20) );
    }
}

function redoPenHistory()
{
    if ( giUndoIndex < 0 )
        showAlert( "giUndoIndex = " + giUndoIndex );
    else
        gPenHistory += gasUndoHistory[--giUndoIndex];
        
    showAlert( giUndoIndex + ":" + 
            gasUndoHistory[giUndoIndex].substring(0, 20) );
}

function cleanUndoAndRedo()
{
    gasUndoHistory = new Array();
    giUndoIndex = 0;
}

function getPosOfPenHistory( sPenHistory )
{
    var iMinX = 10000;
    var iMinY = 10000;
    var iMaxX = 0;
    var iMaxY = 0;

    var penMotions = sPenHistory.split( MOTION_GAP );

    for ( var j = 0; j < penMotions.length - 1; j ++ )
    {
        var penTokens = penMotions[j].split( TOKEN_GAP );
        
        var x = parseInt( penTokens[1] );
        var y = parseInt( penTokens[2] );
        
        if ( iMinX > x && x > 0 )
            iMinX = x;
        if ( iMinY > y && y > 0 )
            iMinY = y;
        if ( iMaxX < x )
            iMaxX = x;
        if ( iMaxY < y )
            iMaxY = y;
    }
   
    return new Array( iMinX, iMinY, iMaxX - iMinX, iMaxY - iMinY );
}

function illegalMotion( sMotion )
{
    if ( !sMotion )
        return true;

    var sFirstToken = sMotion.split( TOKEN_GAP )[0];
    
    if ( !sFirstToken )
        return true;
        
    var iFirstToken = parseInt( sFirstToken );
    
    if ( isNaN( iFirstToken ) )
        return true;
        
    if ( iFirstToken < 10 && iFirstToken > 30 )
        return true;
   
    return false;
}

function playLogo( iLogoIndex )
{
    if ( iLogoIndex == MAIN_LOGO && isNotBeginPage() )
    {
        //return;
    }
    
    var iCoefficient = getPaintWidth() > getPaintHeight() ? 2 : 3;
    
    var iCanvasWidth = getPaintWidth();
    var iCanvasHeight = getPaintHeight() / iCoefficient;

    initCanvas( iCanvasHeight, iCanvasWidth );

    var sPenHistory = getLogo( iLogoIndex );
    gPenHistory = resetPenHistory2( sPenHistory, iCanvasWidth, iCanvasHeight, false );
    
    issuePlay( PLAY_STYLE_DEMO );
}

function playDemo( iPenStyle )
{
    if ( !navSupported() )
    {
        return; // TODO: remove this after fix the demo problem on Windows Phone 8.1 
    }

    initCanvas( getSideMenuWidth(), getSideMenuWidth() );
    cleanCanvas( CLEAN_STYLE_NORMAL );
    
    var iWidth = getSideMenuWidth();
    var iHeight = getSideMenuWidth();
    var sPenHistory = getSpecificDemo( iPenStyle );
    var iStyle = getSpecificStyle( iPenStyle );

    gPenHistory = changePenHistory( sPenHistory, iPenStyle, null, null, null, iStyle );
    issuePlay( PLAY_STYLE_DEMO );
}

function isSideMenuOn()
{
    return $.ui.isSideMenuOn();
}

function getTouchCount()
{
    return gPenHistory.split( TOUCH_GAP ).length - 1;
}

function getMotionCount()
{
    var iMotionCount = 0;
    var penTouchs = gPenHistory.split( TOUCH_GAP );
    
    for ( var i = 0; i < penTouchs.length; i ++ )
    {
        var penMotions = penTouchs[i].split( MOTION_GAP );
        iMotionCount += penMotions.length;
    }
    
    return iMotionCount;
}

function playAllowed( iPlayNumber, iTouchOrder )
{    
    if ( isNowCanvasMode( PLAY_MODE ) && iPlayNumber == giPlayNumber )
    {
        giTouchOrder = iTouchOrder;
        
        return true;
    }

    return false;
}

function getHeaderHeight()
{
    return $("#header").height();
}

function onMessage()
{
    gbMessageShowed = true;
}

function offMessage()
{
    gbMessageShowed = false;
}

function isMessageOn()
{
    return gbMessageShowed;
}

function savePenHistory()
{
    gbPenHistoryBackupSaved = true;
    gsPenHistoryBackup = gPenHistory;
}

function restorePenHistory()
{
    if ( gbPenHistoryBackupSaved )
    {
        gPenHistory = gsPenHistoryBackup;
        //gbPenHistoryBackupSaved = false;
    }
}

function isNotBeginPage()
{
    //return window.location.hash;
    
    return gbDivWasChanged;
}

function isTempDrawingLoaded()
{
    return gbNowImageLoaded && gbTempDrawingLoaded && gbNowStoredDrawingLoaded;
}

function isRandomForeColorMode()
{
    return getForeColorIndex() == 0;
}

function getSideMenuWidth()
{
    return $("#menu").width();
}

function initPaintPage( sPageID )
{
    updateDiv( sPageID, getHTMLOfPaintDiv() );
    
    initCanvas( getPaintHeight(), getPaintWidth() ); // new a canvas 
    showStoredDrawing( NOWDO );
}

function getSpecificStyle( iPenStyle )
{
    if ( iPenStyle == TYPE_PEN_LINE )
    {
        return getLineStyle();
    }
    else if ( iPenStyle == TYPE_PEN_DOT )
    {
        return getDotStyle();
    }
    else if ( iPenStyle == TYPE_TEXT )
    {
        return getTextStyle();
    }
    else if ( iPenStyle == TYPE_PEN_RECTANGLE )
    {
        return getRectangleStyle();
    }
    else if ( iPenStyle == TYPE_PEN_CIRCLE )
    {
        return getCircleStyle();
    }
    else if ( iPenStyle == TYPE_PEN_ERASER )
    {
        return getEraserStyle();
    }
    
    return null;
}

function getSpecificStyleArray( iPenStyle )
{
    if ( iPenStyle == TYPE_PEN_LINE )
    {
        return S_LINE_STYLE_ARRAY;
    }
    else if ( iPenStyle == TYPE_PEN_DOT )
    {
        return S_DOT_STYLE_ARRAY; 
    }
    else if ( iPenStyle == TYPE_TEXT )
    {
        //return S_TEXT_STYLE_ARRAY; 
        return new Array();
    }
    else if ( iPenStyle == TYPE_PEN_RECTANGLE )
    {
        return S_RECTANGLE_STYLE_ARRAY;
    }
    else if ( iPenStyle == TYPE_PEN_CIRCLE )
    {
        return S_CIRCLE_STYLE_ARRAY;
    }
    else if ( iPenStyle == TYPE_PEN_ERASER )
    {
        return S_ERASER_STYLE_ARRAY;
    }
    else
    {
        showAlert( "Error iPenStyle : " + iPenStyle );
    }
    
    return null;
}

function isSolidRectangle()
{
    return false;
}

function existDemoInSideMenu()
{
    return giNowSideMenu == SIDEMENU_PEN_STYLE_LINE ||
           giNowSideMenu == SIDEMENU_PEN_STYLE_DOT ||
           giNowSideMenu == SIDEMENU_PEN_STYLE_TEXT ||
           giNowSideMenu == SIDEMENU_PEN_STYLE_RECTANGLE ||
           giNowSideMenu == SIDEMENU_PEN_STYLE_CIRCLE ||
           giNowSideMenu == SIDEMENU_PEN_STYLE_ERASER; 
}

function getColorByRGB( iR, iG, iB )
{
    return "#" + iR.toString( 16 ) + iG.toString( 16 ) + iB.toString( 16 );
}

function getDefaultColor()
{
    var iStyleIndex = getStyleIndex();
    var asStyle = S_STYLE_ARRAY[iStyleIndex];
    
    if ( asStyle == S_IOS_7 )
    {
        return getColorByRGB(238,238,238,255);
    }
    else if ( asStyle == S_IOS )
    {
        return "#E7E7E7";
    }
    else if ( asStyle == S_ANDROID )
    {
        return "#000000";
    }
    else if ( asStyle == S_ANDROID_LIGHT )
    {
        return "#FFFFFF"; //"#FDFDFD";
    }
    else if ( asStyle == S_WINDOWS_8 )
    {
        return "#000000";
    }
    else if ( asStyle == S_WINDOWS_8_LIGHT )
    {
        return "#FFFFFF";
    }
    else if ( asStyle == S_BLACK_BERRY_10 )
    {
        return "#FFFFFF";
    }
    else if ( asStyle == S_TIZEN )
    {
        return "#000000";
    }
    else
    {
        return "black";
    }
}


function getFontRatio()
{
    return BASE_FONT_SIZE_RATIO + getFontSizeIndex() * 10;
}



function cleanImageData()
{
    gImageData = new Array();
    gImageWidthRatio = new Array();
    gImageHeightRatio = new Array();
    gImageNowCount = 0;
}

function setImageData( sImageData, sImageName, fWidthRatio, fHeightRatio )
{
    gImageData[gImageNowCount] = sImageData;
    gImageName[gImageNowCount] = sImageName;
    gImageWidthRatio[gImageNowCount] = fWidthRatio;
    gImageHeightRatio[gImageNowCount] = fHeightRatio;
    
    gImageNowCount++;
    
    //alert( "LOAD Image " + gImageNowCount + " : " + sImageData.length );
}

function getImageData( iImageIndex )
{
    return gImageData[iImageIndex];
}

function getPenHistoryOfInfo()
{
    return BEHIND_INFO_GAP + TYPE_INFO + BEHIND_TOKEN_GAP + getDateString() + BEHIND_TOKEN_GAP + gCanvas.width + BEHIND_TOKEN_GAP + gCanvas.height + BEHIND_END_GAP;
}

function getPenHistoryofImageData()
{
    var sData = gImageNowCount == 0 ? "" : BEHIND_INFO_GAP + TYPE_IMAGEDATA;
    
    for ( var i = 0; i < gImageNowCount; i ++ )
    {
        sData += BEHIND_TOKEN_GAP + gImageWidthRatio[i];
        sData += BEHIND_TOKEN_GAP + gImageHeightRatio[i];
        sData += BEHIND_TOKEN_GAP + getImageData( i );
        sData += BEHIND_END_GAP;
        
        //alert( "IMAGE LENGTH:" + getImageData( 0 ).length );
    }

    return sData;
}


function parseInfo( sData )
{
    var sDataTemp = sData.split( BEHIND_END_GAP )[0];
    var asTemp = sDataTemp.split( BEHIND_TOKEN_GAP );
    
    if ( asTemp.length > 3 )
    {
        gsFileDate = asTemp[1].trim();
        giFileWidth = parseInt( asTemp[2].trim(), 10 );
        giFileHeight = parseInt( asTemp[3].trim(), 10 );
    }
    else
    {
        showAlert( "INFO error : " + asTemp );
    }
}

function parseImageData( sData )
{
    var asTemp = sData.split( BEHIND_END_GAP );
    
    //alert( asTemp.length + "," + sData.length + " sImageData: " + sData );
    
    for ( var i = 0; i < asTemp.length; i ++ )
    {
        var asDataTemp = asTemp[i].trim().split( BEHIND_TOKEN_GAP );
        
        //alert( i + " : " + asTemp[i] );
        
        if ( asDataTemp.length >= 4 )
        {
            var fWidthRatio = parseInt( asDataTemp[1] );
            var fHeightRatio = parseInt( asDataTemp[2] );
            var sImageData = asDataTemp[3];
            setImageData( sImageData, "NONE", fWidthRatio, fHeightRatio );
            
            //alert( fWidthRatio + "," + fHeightRatio + "," + sImageData.length );
        }
        else
        {
            // fail
            showAlert( "NOT > 3 :" + asDataTemp.length );
        }
    }
}


function addQueueImage( iImageIndex, x, y, widthRatio, heightRatio )
{
    log( "addQueueImage:" + iImageIndex );
    gaiDrawQueueImageIndex[giDrawQueueCount] = iImageIndex;
    gaiDrawQueueX[giDrawQueueCount] = x;
    gaiDrawQueueY[giDrawQueueCount] = y;
    gaiDrawQueueWidthRatio[giDrawQueueCount] = widthRatio;
    gaiDrawQueueHeightRatio[giDrawQueueCount] = heightRatio;
    giDrawQueueCount++;

    return "" + TYPE_IMAGE + TOKEN_GAP + iImageIndex + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + widthRatio + TOKEN_GAP + heightRatio + MOTION_GAP;
}

function initQueue()
{
    giDrawQueueCount = 0;
    giDrawQueueIndex = 0;
    
    gbTotalQueueLoaded = true;
    
    log( "init Queue" );
}

function initFileSize()
{
    giFileWidth = giFileHeight = 0;
}

function fitFileSize()
{
    gPenHistory = resetPenHistory2( gPenHistory, gCanvas.width, gCanvas.height, true );
}

function backupIndexPath()
{
    gsIndexPath = window.location.href;
}

function restoreIndexPath()
{
    //alert( "Reset: " + gsIndexPath );
    //window.location.href = gsIndexPath;
    //window.location.reload();
    
    window.history.pushState( "CHANGE1", "Title", gsIndexPath );
}

// ---------------------------------



// ex.
// input : 
//      sText : "var S_APP_NAME = new Array( '塗鴉', 'Tuya', '', '', '' );"
//      iLanguageIndex : EN
// output: 
//      sTotalToken : "Tuya,"
function parseSingleLanguage( sText, iLanguageIndex )
{
    var asTemp1 = sText.split( "Array(" );
    var sTotalToken = "";
    log( "-PE asTemp1:" + asTemp1.length );
    
    for ( var i = 0; i < asTemp1.length; i ++ )
    {
        var asTemp2 = asTemp1[i].split( "," );
        
        //log( "-PE asTemp2:" + asTemp2.length );
        
        if ( asTemp2.length > 3 && asTemp2[iLanguageIndex].indexOf( "'" ) >= 0 )
        {
            var sToken = asTemp2[iLanguageIndex].trim();

            sToken = sToken.substring( 1, sToken.length - 1 ).trim();
            
            //log( "A: " + asTemp2[1] );
            
            sTotalToken += "," + sToken;
        }
    }
    log( sTotalToken );
    
    //log( gsLanguage );
}

// ex. 
// input : 
//      sText : "var S_APP_NAME = new Array( '塗鴉', 'Tuya', '', '', '' );"
//      asData : { "塗鴉,", "Tuya,", "A,", "B,", "C,", "D," }
// output: 
//      sAns = "var S_APP_NAME = new Array( '塗鴉', 'Tuya', 'A', 'B', 'C', 'D' );"
function buildLanguage( sText, asData )
{
    var sAns = "";
    var asTemp1 = sText.split( ";" );
    
    var iCount = 0;
    for ( var i = 0; i < asTemp1.length; i ++ )
    {
        var asTemp2 = asTemp1[i].split( " " );
        
        if ( asTemp2 && asTemp2.length > 5 )
        {
            var sVarName = asTemp2[1];
            
            //log( sVarName );
            
            sAns += "var " + sVarName + " = new Array( ";
            
            var sAllLang = "";
            for ( var j = 0; j < asData.length; j ++ )
            {
                if ( j > 0 )
                    sAllLang += ", ";
            
                sAllLang += "'" + asData[j].split( "," )[i] + "'";
            }
            
            //log( sAllLang );
            
            sAns += sAllLang + " );";
            
            //iCount++;
        }
    }
    
    log( sAns );
}

function notSupportInneractive()
{
    //return giPlatform != PLATFORM_FIREFOXOS;
    return true;
}

function notSupportStored()
{
    return giPlatform == PLATFORM_CHROMEOS;
}

function notSupportJsLink()
{
    return giPlatform == PLATFORM_WP ||
           giPlatform == PLATFORM_WINDOWS_8 ||
           giPlatform == PLATFORM_CHROMEOS ||
           giPlatform == PLATFORM_FIREFOXOS;
}

function notSupportDefaultIcon()
{
    return giPlatform == PLATFORM_WP || 
           giPlatform == PLATFORM_WINDOWS_8;
}

function notSupportExternalIcon()
{
    return true;
}

function hardToClickMenu()
{
    return giPlatform == PLATFORM_FIREFOXOS;
}

function supportCanvas2ImagePlugin()
{
    return ( typeof window.canvas2ImagePlugin != 'undefined' ) &&
           ( giPlatform == PLATFORM_ANDROID //||
             // giPlatform == PLATFORM_WP ||
             //giPlatform != PLATFORM_IOS;
           );
}

function getOrientation()
{
    return getScreenHeight() > getScreenWidth() ? PORTRAIT : LANDSCAPE;
}

function getWidthPrecent( iIconType )
{
    var iCoefficient = iIconType == ICON_HEADER ? 10 : 8;

    return parseInt( iCoefficient * getScreenHeight() / getScreenWidth(), 10 );
}



function getStaticHTML( sHtml )
{
    return sHtml;
    //return ( typeof Windows != 'undefined' ) ? toStaticHTML( sHtml ) : sHtml;
}


function getImageDemo()
{
    return "base64,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";
}


