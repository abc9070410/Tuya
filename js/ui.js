
"use strict";

//
// variable prefix :
//
// e: Element
// i: integer
// f: float
// s: string
// b: boolean
// a: array
// g: global
//


function addDiv( sDivID, sHTML, sTitle )
{
    $.ui.addContentDiv( "#" + sDivID, sDivHTML, sTitle );
}

function updateDiv( sDivID, sDivHTML )
{
    if ( notSupportJsLink() )
    {
        handleClickEventListener( TYPE_REMOVE );
    }
    
    if ( $.os.desktop )
    {
        document.getElementById( sDivID ).innerHTML = sDivHTML;
    }
    else
    {
        //$.ui.showMask("Wait");
        $.ui.updateContentDiv( "#" + sDivID, sDivHTML );
        //$.ui.hideMask();
    }
    
    showInneractiveAD( sDivID );
    
    //storeNowDrawing(); // fix the remain draw after page change
    
    if ( notSupportJsLink() )
    {
        //log( "-3>" +sDivID + "," + gsLastDivID );
        handleClickEventListener( TYPE_ADD );
    }
    
    
    gsLastUpdateDivID = sDivID;
}

function setDivTitle( eDiv, sTitle )
{
    eDiv.setAttribute( "title", sTitle );
}

function clearHistory()
{
    $.ui.clearHistory(); // not allow user go back
}

// ex. search ( without '#' )
function updateHash( sHash )
{
    $.ui.updateHash( sHash );
}

function isListID( sDivID )
{
    return false;
}

function changeHash( sPageID )
{
    //var eContent = document.getElementById( ID_CONTENT );
    
    gbDivWasChanged = true;
    
    gsNowDivID = sPageID;

    //log( "changeHash: " + sPageID );

    var eDiv = document.getElementById( sPageID );
    
    // disable the sort option
    if ( isListID( gsLastDivID ) && !isListID( sPageID ) && sPageID.indexOf( ID_ITEM ) != 0 )
    {
        //if ( navSupported() )
        {
            updateDiv( ID_HEADER, getHTMLOfHeaderDiv() );
            updateDiv( ID_NAV, getHTMLOfNavDiv() );
        }

        //updateDiv( ID_NAV, getHTMLOfNavbarsDiv() );
        gMergeListsList = null; // clean the result

        log( "set nav & header to back to normal" );
    }
    
    updateDiv( ID_HEADER, getHTMLOfHeaderDiv() );
    updateDiv( ID_NAV, getHTMLOfNavDiv() );
    //updateDiv( ID_NAVBAR, getHTMLOfNavbarDiv() );
    
    
    gbFooterShowed = false; // default enable the footer if page is changed
    gbHeaderShowed = true; // default enable the footer if page is changed
    bindScrollEvent( sPageID ); // disable the footer while scroll down
    

    // -----------------------

    if ( sPageID === ID_MENU )
    {
       updateDiv( sPageID, getHTMLOfNavDiv() );
    }
    else if ( sPageID === ID_MAIN )
    {
        // for the case that the user clicks confirm button but does not click any language item 
        if ( !isLanguageSet() )
        {
            setLanguageIndex( getLanguageIndex() );
        }
        
        log( "update ID_MAIN" );
        updateDiv( sPageID, getHTMLOfMainDiv() );

        playLogo( MAIN_LOGO );
    }
    else if ( sPageID === ID_OPTION )
    {    
        if ( gsLastDivID == ID_ABOUT_AUTHOR )
        {
            playStopped( false ); // stop playing & restore the global
        }
        
        //clearHistory();
        updateDiv( sPageID, getHTMLOfOptionDiv() );
    }
    else if ( sPageID === ID_STYLE )
    {
        updateDiv( ID_STYLE, getHTMLOfStyleDiv() );
    }
    else if ( sPageID === ID_LANGUAGE )
    {
        log( "update ID_LANGUAGE" );
        updateDiv( ID_LANGUAGE, getHTMLOfLanguageDiv() );
    }
    else if ( sPageID === ID_FONT_SIZE )
    {
        updateDiv( ID_FONT_SIZE, getHTMLOfFontSizeDiv() );
    }
    else if ( sPageID === ID_BACKGROUND_IMAGE )
    {
        updateDiv( sPageID, getHTMLOfLoadImageDiv() );
    }
    else if ( isPaintPageID( sPageID ) )
    {
        initPaintPage( sPageID );
        //window.open( window.location.href, '_self', 'location=yes' );
    }
    // -------------------------------
    

    else if ( sPageID === ID_ABOUT_AUTHOR )
    {
        updateDiv( sPageID, getHTMLOfAuthorDiv() );
        playLogo( AUTHOR_LOGO );
    }
    else if ( sPageID === ID_ABOUT_APP )
    {
        updateDiv( sPageID, getHTMLOfAppDiv() );
        playLogo( APP_LOGO );
    }
    else if ( sPageID === ID_DELETE_BACKGROUND_IMAGE )
    {
        var ok = window.confirm( S_ARE_YOU_SURE[giLanguageIndex] + S_DELETE_BACKGROUND_IMAGE[giLanguageIndex].toLowerCase() + QUESTION_MARK );

        if ( ok )
        {
            deleteBackgroundImage();

            window.location.hash = "#" + ID_BACKGROUND_IMAGE;
            window.location.reload();
        }
    }

    gsLastDivID = sPageID; // only record the non-item or non-result        
}

function blockUI()
{
    $.ui.blockUI(0.3);

    setTimeout(function(){
        $.ui.unblockUI()
    },3000);
}


function initUI()
{
    var string = "";
    
    gsNowDivID = isLanguageSet() ? ID_MAIN : ID_LANGUAGE;

    // header
    //string += "<p></p><p></p><p></p><p></p><p>";
    string += "<div id='" + ID_HEADER + "'>";
    string += getHTMLOfHeaderDiv();
    string += "</div>";

    // content
    string += "<div id='" + ID_CONTENT + "'>";

    string += getEmptyDiv( ID_PAINT, S_CANVAS[giLanguageIndex] );
    string += getEmptyDiv( ID_MENU, S_MENU[giLanguageIndex] );
    string += getEmptyDiv( ID_OPTION, S_OPTION[giLanguageIndex] );
    
    string += getEmptyDiv( ID_STYLE, S_STYLE[giLanguageIndex] );
    
    string += getEmptyDiv( ID_FONT_SIZE, S_FONT_SIZE[giLanguageIndex] );
    string += getEmptyDiv( ID_DISPLAY, S_DISPLAY[giLanguageIndex] );

    string += getEmptyDiv( ID_RECOVERY, S_RECOVERY[giLanguageIndex] );

    string += getEmptyDiv( ID_ABOUT_APP, S_ABOUT_APP[giLanguageIndex] );
    string += getEmptyDiv( ID_ABOUT_AUTHOR, S_ABOUT_AUTHOR[giLanguageIndex] );
    string += getEmptyDiv( ID_RELATED_LINKS, S_RELATED_LINKS[giLanguageIndex] );

    
    // -------------------
    
    // first page
    // exist scroll problem if we use ID_P_NEW_RESULT_1,2,3 on first page 
    if ( isLanguageSet() )
    {
        log( "start MAIN page" );
        string += getEmptyDiv( ID_LANGUAGE, S_LANGUAGE[giLanguageIndex] );
        string += getPrefixDiv( ID_MAIN, "" );
        string += getHTMLOfMainDiv();
        
    }
    else
    {
        log( "start LANGUAGE page" );
        string += getEmptyDiv( ID_MAIN, S_APP_NAME[giLanguageIndex] );
        string += getPrefixDiv( ID_LANGUAGE, "" );
        string += getHTMLOfLanguageDiv();
        
        //changeHash( ID_LANGUAGE );
        //updateHash( ID_LANGUAGE );
    }
    string += "</div>";
    string += "</div>";

    // navbar (footer)
    string += "<div id='" + ID_NAVBAR + "'>";
    string += getHTMLOfNavbarDiv();
    string += "</div>";

    // left side nav menu
    string += "<nav id='" + ID_NAV + "'>";
    string += getHTMLOfNavDiv();
    string += "</nav>";
    
    setStyle();
    saveGlobal();
    savePenHistory(); // to forget the main demo

    updateDiv( "afui", getStaticHTML( string ) );
    
    if ( gsNowDivID == ID_MAIN )
    {
        playLogo( MAIN_LOGO );
    }
}

// ex. <ul><li ><a class='button next icon home' href='#main'>Home</a></li></ul>
function getHTMLOfListItem( sClass, sHashTag, sText )
{
    if ( notSupportDefaultIcon() )
    {
        if ( notSupportExternalIcon() )
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a class='icon' href='#" + sHashTag + "' data-transition='" + gsTransition + "' >" + getIcon( sHashTag ) + sText + "</a></li></ul>";
        }
        else
        {
            var iWidthPercent = 20;
            
            if ( isFullScreenWidth( sHashTag ) )
            {
                iWidthPercent = getWidthPrecent( ICON_ITEM );
            }
            
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a  href='#" + sHashTag + "' data-transition='" + gsTransition + "' ><img src='" + getIconURL( sHashTag ) + "' style='float:left;width:" + iWidthPercent + "%;height:80%;margin:0;border-style:hidden;'>" + sText + "</img></a></li></ul>";
        }
    }
    else
    {
        return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a class='" + sClass + "' href='#" + sHashTag + "' data-transition='" + gsTransition + "' >" + sText + "</a></li></ul>";
    }
}

function getHTMLOfHeaderIconItem( sClass, sHref, sID, sText )
{
    var sStyle = "float:right";
    
    if ( sID == ID_CLICK_UNDO || 
         sID == getPaintPageID() )
    {
        sStyle = "float:left";
    }

    if ( notSupportJsLink() && sHref.indexOf( "#" ) < 0 )
    {
        if ( notSupportDefaultIcon() )
        {
            if ( notSupportExternalIcon() )
            {
                return "<div class='button icon' style='" + sStyle + "' id='" + sID + "' >" + getIcon( sID ) + "</div>";
            }
            else
            {
                return "<img src='" + getIconURL( sID ) + "' class='" + sClass + "' style='" + sStyle + ";width:" + getWidthPrecent( ICON_HEADER ) + "%;height:100%;margin:0;border-style:hidden;' id='" + sID + "' >" + sText + "</img>";
            }
        }
        else
        {
            return "<div class='" + sClass + "' style='" + sStyle + "' id='" + sID + "' >" + sText + "</div>";
        }
    }
    else
    {
        if ( notSupportDefaultIcon() )
        {
            if ( notSupportExternalIcon() )
            {
                return "<a class='button icon' style='" + sStyle + "' href='" + sHref + "' >" + getIcon( sID ) + sText + "</a>";
            }
            else
            {
                return "<a href='" + sHref + "' class='" + sClass + " style='" + sStyle + "'>" + "<img src='" + getIconURL( sID ) + "' style='width:50%;height:100%;margin:0;border-style:hidden;'  />" + sText + "</a>";
            }
        }
        else
        {
            return "<a class='" + sClass + "' style='" + sStyle + "' href='" + sHref + "' >" + sText + "</a>";
        }
    }
}

function getHTMLOfListLinkItem( sClass, sHref, sID, sText )
{
    if ( notSupportJsLink() )
    {
        if ( notSupportDefaultIcon() )
        {
            if ( notSupportExternalIcon() )
            {
                return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><div id='" + sID + "' data-transition='" + gsTransition + "' >" + getIcon( sID ) + sText + "</div></li></ul>";
            }
            else
            {
                var iWidthPercent = 25;
                
                if ( isFullScreenWidth( sID ) )
                {
                    iWidthPercent = getWidthPrecent( ICON_ITEM );
                }
            
                return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><img src='" + getIconURL( sID ) + "' style='float:left;width:" + iWidthPercent + "%;height:80%;margin:0;border-style:hidden;'/><div  id='" + sID + "' data-transition='" + gsTransition + "' >" + sText + "</div></li></ul>";
            }
        }
        else
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><div class='" + sClass + "' id='" + sID + "' data-transition='" + gsTransition + "' >" + sText + "</div></li></ul>";
        }
    }
    else
    {
        return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a class='" + sClass + "' href='" + sHref + "' data-transition='" + gsTransition + "' >" + sText + "</a></li></ul>";
    }
}

function getHTMLOfListLinkItemWithImage( sClass, sHref, sID, sText, sImage )
{
    if ( notSupportJsLink() )
    {
        if ( notSupportDefaultIcon() )
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><img class='" + sClass + "' id='" + sID + "' data-transition='" + gsTransition + "' style='max-width:100px;max-height:100px;' src='" + sImage + "' >" + sText + "</img></li></ul>";
        }
        else
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><img   style='max-width:100px;max-height:100px;' src='" + sImage + "' ><div class='" + sClass + "' id='" + sID + "' data-transition='" + gsTransition + "'>" + sText + "</div></img></li></ul>";
        }
    }
    else
    {
        return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a class='" + sClass + "' href='" + sHref + "' data-transition='" + gsTransition + "' ><img style='max-width:100px;max-height:100px;' src='" + sImage + "' />" + sText + "</a></li></ul>";
    }
}

function getHTMLOfListLinkItemWithColor( sClass, sHref, sID, sText, sColor )
{
    if ( notSupportJsLink() )
    {
        if ( notSupportDefaultIcon() )
        {
            if ( notSupportExternalIcon() )
            {
                return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><div class='icon' id='" + sID + "' data-transition='" + gsTransition + "' style='color:" + sColor + "'>" + getIcon( sID ) + sText + "</div></li></ul>";
            }
            else
            {
                var iWidthPercent = 25;
            
                if ( isFullScreenWidth( sID ) )
                {
                    iWidthPercent = getWidthPrecent( ICON_ITEM );
                }
                
                return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><img style='float:left;width:" + iWidthPercent + "%;height:80%;margin-bottom:5%;border-style:hidden;' src='" + getIconURL( sID ) + "' /><div id='" + sID + "' data-transition='" + gsTransition + "' style='color:" + sColor + ";'>" + sText + "</div></li></ul>";
            }
        
            
        }
        else
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><div class='" + sClass + "' id='" + sID + "' data-transition='" + gsTransition + "' style='color:" + sColor + "'>" + sText + "</div></li></ul>";
        }
    }
    else
    {
        return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a class='" + sClass + "' href='" + sHref + "' data-transition='" + gsTransition + "' style='color:" + sColor + "'>" + sText + "</a></li></ul>";
    }
}

function getHTMLOfListLinkDownloadItem( iImageType, sClass, sText )
{
    showStoredImage( iImageType ); // prepare the image file
    
    var sID = getImageDownloadID( iImageType );
    
    if ( notSupportDefaultIcon() )
    {
        if ( notSupportExternalIcon() )
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a class='icon' id='" + sID + "' download='" + getImageFileName( iImageType ) + "' data-transition='" + gsTransition + "' >" + getIcon( sID ) + sText + "</a></li></ul>";
        }
        else
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><img src='" + getIconURL( sID ) + "' style='float:left;width:20%;height:80%;margin-bottom:5%;border-style:hidden;'/><a id='" + sID + "' download='" + getImageFileName( iImageType ) + "' data-transition='" + gsTransition + "' >" + sText + "</a></li></ul>";
        }
    }
    else
    {
        return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><a class='" + sClass + "' id='" + sID + "' download='" + getImageFileName( iImageType ) + "' data-transition='" + gsTransition + "' >" + sText + "</a></li></ul>";
    }
}


function getHTMLOfListLinkItemWithTitle( sClass, sHref, sID, sText, sTitle )
{
    if ( !sText )
        return "";
    
    if ( notSupportJsLink() )
    {
        if ( notSupportExternalIcon() )
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><strong style='font-size:" + Math.floor( getFontRatio() * 3 / 6 )  + "%'>" + sTitle + "</strong><div class='icon' id='" + sID + "' data-transition='" + gsTransition + "' >" + getIcon( sID ) + sText + "</div></li></ul>";
        }
        else
        {
            return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><strong style='font-size:" + Math.floor( getFontRatio() * 3 / 6 )  + "%'>" + sTitle + "</strong><div class='" + sClass + "' id='" + sID + "' data-transition='" + gsTransition + "' >" + sText + "</div></li></ul>";
        }
    }
    else
    {
        return "<ul class='list' style='font-size:" + getFontRatio() + "%' ><li><strong style='font-size:" + Math.floor( getFontRatio() * 3 / 6 )  + "%'>" + sTitle + "</strong><a class='" + sClass + "' href='" + sHref + "' data-transition='" + gsTransition + "' >" + sText + "</a></li></ul>";
    }
}

// list item without link
function getHTMLOfListText( sClass, sText )
{
    if ( notSupportDefaultIcon() )
    {
        return "<ul class='list'><li><p class='icon' style='font-size:" + getFontRatio() + "%'>" + sText + "</p></li></ul>";
    }
    else
    {
        return "<ul class='list'><li><p class='" + sClass + "' style='font-size:" + getFontRatio() + "%'>" + sText + "</p></li></ul>";
    }
}

// ex. <div title='Title' id='search' class='panel' selected='true' style='word-wrap:break-word;'>
function getPrefixDiv( sID, sTitle )
{
    return "<div title='" + sTitle + "' id='" + sID + "' class='panel' selected='false' style='word-wrap:break-word;'>";
}

// ex. <div id='search'></div>
function getEmptyDiv( sID, sTitle )
{
    return getPrefixDiv( sID, sTitle ) + "</div>";
    //return "<div id='empty_" + sID + "'><div id='" + sID + "'></div></div>";
}

function getConfirmNextPageID()
{
    return isNotBeginPage() ? ID_OPTION : ID_MAIN;
}

function getHTMLOfHeaderDiv()
{
    var string = "";

    if ( needConfirmHeader( gsNowDivID ) )
    {
        //string += "<a href='#" + getConfirmNextPageID() + "' class='button icon stack'  style='float:right'>" + S_CONFIRM[giLanguageIndex] + "</a>";
        
        string += getHTMLOfHeaderIconItem( "button icon stack", "#" + getConfirmNextPageID(), getConfirmNextPageID(), S_CONFIRM[giLanguageIndex] );
    }
    else if ( navSupported() )
    {   
        if ( gsNowDivID == ID_MAIN || !isNotBeginPage() )
        {
        
        }
        else if ( gsNowDivID == ID_OPTION )
        {
            //string += "<a href='#" + getPaintPageID() + "' class='button icon paper' style='float:left'>" + S_GO_BACK_TO[giLanguageIndex] + S_CANVAS[giLanguageIndex] + "</a>";
            
            string += getHTMLOfHeaderIconItem( "button icon paper", "#" + getPaintPageID(), getPaintPageID(), S_GO_BACK_TO[giLanguageIndex] + S_CANVAS[giLanguageIndex] );
        }
        else
        {
            string += getHTMLOfHeaderIconItem( "button icon refresh", "javascript:clickUndo();", ID_CLICK_UNDO, "" );

            string += getHTMLOfHeaderIconItem( "button icon pencil", "javascript:clickMenu();", ID_CLICK_MENU, "" );
            
            if ( isNowCanvasMode( EDIT_MODE ) )
            {
                string += getHTMLOfHeaderIconItem( "button icon camera", "javascript:clickPlay(" + getPlayStyle() + ");", ID_CLICK_PLAY, "" );
            }
            else if ( isNowCanvasMode( PLAY_MODE ) )
            {
                string += getHTMLOfHeaderIconItem( "button icon pin", "javascript:clickPause();", ID_CLICK_PAUSE, "" );
            }
            else if ( isNowCanvasMode( PAUSE_MODE ) )
            {
                string += getHTMLOfHeaderIconItem( "button icon refresh", "javascript:clickContinue(" + giPlayNumber + ");", ID_CLICK_CONTINUE, "" );
            }
            string += getHTMLOfHeaderIconItem( "button icon paper", "javascript:clickNewFile();", ID_CLICK_NEW_FILE, "" );
        }
    }
    else
    {
        string += "<a href='#" + ID_MENU + "' class='button icon stack' style='float:right' data-transition='up'>" + S_MENU[giLanguageIndex] + "</a>";
    }

    return string;
}


// should enable Navbar (footer menu) if the platorm does not support Nav
function navSupported()
{
    return true;

    var sStyle = S_STYLE_ARRAY[getStyleIndex()].toString();
    
    // not support nav for Win UI Style or WP7/8 platform 
    return ( sStyle != S_WINDOWS_8.toString() && 
             sStyle != S_WINDOWS_8_LIGHT.toString() &&
             giPlatform != PLATFORM_WP &&
             giPlatform != PLATFORM_FIREFOXOS );
}

function shouldStyleSkipped( iStyleIndex )
{
    var sStyle = S_STYLE_ARRAY[iStyleIndex].toString();
    if ( sStyle == S_WINDOWS_8.toString() || sStyle == S_WINDOWS_8_LIGHT.toString() )
    {
        if ( giPlatform == PLATFORM_ANDROID )
        {
            return true;
        }
    }
    
    return false;
}

function togglePaintSideMenu( bReflash )
{
    if ( bReflash && navSupported() )
    {
        updateDiv( ID_NAV, getHTMLOfNavPaintDiv() );
    }

    enableSideMenu();
    giNowSideMenu = SIDEMENU_PAINT;
}

function clickPaintSideMenu()
{
    updateDiv( ID_NAV, getHTMLOfNavPaintDiv() );
    giNowSideMenu = SIDEMENU_PAINT;
}

function getHTMLOfLinkItem( sClass, sHashTag, sText )
{
    return "<a href='#" + sHashTag+ "' id='" + sHashTag + "_id' class='" + sClass + "'>" + sText + "</a>";
}

function getHTMLOfLinkItemWithUpdateNumber( sClass, sHashTag, sText, iUpdateNumber )
{
    return "<a href='#" + sHashTag+ "' id='" + sHashTag + "_id' class='" + sClass + "'><span class='af-badge' id='BADGE_" + ID_P_NEW + "'></span>" + sText + "</a>";
}

// for those platforms which do not support Nav
function getHTMLOfLinkItemInHeader( sClass, sHashTag, sText )
{
    return "<a href='#" + sHashTag+ "' id='" + sHashTag + "_id' class='" + sClass + "' style='float:right'>" + sText + "</a>";
}

// for footer menu
function getHTMLOfNavbarDiv()
{
    var string = "";
    
    if ( gbFooterShowed )
    {
        if ( giUpdateNumber > 0 )
            string += getHTMLOfLinkItemWithUpdateNumber( "icon new mini", getPaintPageID(), S_NEWEST[giLanguageIndex], giUpdateNumber );
        else
            string += getHTMLOfLinkItem( "icon new mini", getPaintPageID(), S_NEWEST[giLanguageIndex] );
            
        string += getHTMLOfLinkItem( "icon heart mini", getPaintPageID(), S_MARK[giLanguageIndex] );
        string += getHTMLOfLinkItem( "icon tools mini", ID_OPTION, S_OPTION[giLanguageIndex] );
    }
    
    return string;
}

function getHTMLOfNavDiv()
{
    //return getHTMLOfNavFileDiv(); // TEST 20141226

    var string = "";

    string += getHTMLOfListItem( "icon paper mini", getPaintPageID(), S_CANVAS[giLanguageIndex] );
    string += getHTMLOfListItem( "icon tools mini", ID_OPTION, S_OPTION[giLanguageIndex] );
    
    if ( !navSupported() )
    {
        string += getHTMLOfListItem( "icon refresh mini", gsLastDivID, S_BACK[giLanguageIndex] );
    }
    
    return string;
}

function getHTMLOfNavPaintDiv()
{
    var string = "";
    
    string += getHTMLOfListLinkItem( "icon loading", "javascript:clickPenRecordSideMenu();", ID_CLICK_PEN_RECORD_SIDE_MENU, S_RECORD[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon basket", "javascript:clickPenStyleSideMenu();", ID_CLICK_PEN_STYLE_SIDE_MENU, S_STYLE[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon picture", "javascript:clickColorSideMenu();", ID_CLICK_COLOR_SIDE_MENU, S_COLOR[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon camera", "javascript:clickPlaySideMenu();", ID_CLICK_PLAY_SIDE_MENU, S_PLAY[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon folder", "javascript:clickFileSideMenu();", ID_CLICK_FILE_SIDE_MENU, S_FILE[giLanguageIndex] );
    string += getHTMLOfListItem( "icon tools", ID_OPTION, S_OPTION[giLanguageIndex] );

    return string;
}

function getHTMLOfNavPlayDiv()
{
    var string = "";
    
    var sIcon = "";
    
    string += getHTMLOfGoBack();
    
    string += getHTMLOfListLinkItem( "icon camera", "javascript:clickPlay(" + PLAY_STYLE_OBVERSE + ");", ID_CLICK_PLAY_STYLE_OBVERSE, S_OBVERSE[giLanguageIndex] + S_PLAY[giLanguageIndex] );
    //string += getHTMLOfListLinkItem( "icon camera", "javascript:clickPlay(" + PLAY_STYLE_REVERSE + ");", ID_CLICK_PLAY_STYLE_REVERSE, S_REVERSE[giLanguageIndex] + S_PLAY[giLanguageIndex] );
    
    var sText = S_PLAY_SPEED[giLanguageIndex] + " : " + getPlaySpeed();
    //string += getHTMLOfListText( "", sText );
    sIcon = getPlaySpeedUnified() ? "icon check" : "icon target";
    string += getHTMLOfListLinkItem( sIcon, "javascript:clickUnifyPlaySpeed();", ID_CLICK_UNIFY_PLAY_SPEED, S_UNIFY_PLAY_SPEED[giLanguageIndex] + " : " + getPlaySpeed() );
    
    string += getHTMLOfListLinkItem( "icon add", "javascript:clickPlaySpeedUp();", ID_CLICK_PLAY_SPEED_UP, S_SPEED_UP[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon remove", "javascript:clickPlaySpeedDown();", ID_CLICK_PLAY_SPEED_DOWN, S_SPEED_DOWN[giLanguageIndex] );
    
    sIcon = getProcessBarEnabled() ? "icon check" : "icon target";
    string += getHTMLOfListLinkItem( sIcon, "javascript:clickEnableProcessBar();", ID_CLICK_ENABLE_PROCESS_BAR, S_ENABLE_PROCESS_BAR[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon trash", "javascript:clickCutPenHistory();", ID_CLICK_CUT_PEN_HISTORY, S_REMOVE_DRAWING[giLanguageIndex] );
    
    return string;
}

function getHTMLOfNavPenRecordDiv()
{
    var string = "";
    
    string += getHTMLOfGoBack();
    
    var iTouchCount = getTouchCount() - 1;
    var iMotionCount = getMotionCount() - 3;
    var sText = "";
    sText += S_BRUSH_AMOUNT[giLanguageIndex] + " : " + iTouchCount + "<br>";
    sText += S_MOTION_AMOUNT[giLanguageIndex] + " : " + iMotionCount;
    
    string += getHTMLOfListText( "", sText );
    string += getHTMLOfListLinkItem( "icon refresh", "javascript:clickUndo();", ID_CLICK_UNDO, S_UNDO[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon stack", "javascript:clickRedo();", ID_CLICK_REDO, S_REDO[giLanguageIndex] );
    
    

    return string;
}

function getHTMLOfGoBack()
{
    return getHTMLOfListLinkItem( "icon left", "javascript:clickGoBackToPaint();", ID_CLICK_GO_BACK_TO_PAINT, S_GO_BACK[giLanguageIndex] );
}

function getHTMLOfGoBackToPenStyle()
{
    return getHTMLOfListLinkItem( "icon left", "javascript:clickGoBackToPenStyle();", ID_CLICK_GO_BACK_TO_PEN_STYLE, S_GO_BACK[giLanguageIndex] );
}

function getHTMLOfNavPenStyleDiv()
{
    var string = "";
    
    string += getHTMLOfGoBack();
    
    string += getHTMLOfListLinkItem( "icon pencil", "javascript:clickPenStyleLine();", ID_CLICK_PEN_STYLE_LINE, S_LINE[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon clock", "javascript:clickPenStyleCircle();", ID_CLICK_PEN_STYLE_CIRCLE, S_CIRCLE[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon paper", "javascript:clickPenStyleRectangle();", ID_CLICK_PEN_STYLE_RECTANGLE, S_RECTANGLE[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon loading", "javascript:clickPenStyleDot();", ID_CLICK_PEN_STYLE_DOT, S_DOT[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon trash", "javascript:clickPenStyleEraser();", ID_CLICK_PEN_STYLE_ERASER, S_ERASER[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon message", "javascript:clickPenStyleText();", ID_CLICK_PEN_STYLE_TEXT, S_TEXT[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon message", "javascript:clickPenStyleOther();", ID_CLICK_PEN_STYLE_OTHER, S_OTHER[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon picture", "javascript:clickPenStyleImage();", ID_CLICK_PEN_STYLE_IMAGE, S_PICTURE[giLanguageIndex] );
    
    //string += getHTMLOfListLinkItem( "icon picture", "javascript:clickPenStylePicture();", ID_CLICK_PEN_STYLE_PICTURE, S_PICTURE[giLanguageIndex] );

    return string;
}

function getHTMLOfNavPenStyleDemoDiv( iPenStyle )
{
    //saveGlobal();
    abortPlay( false );

    var string = "";
    
    string += getHTMLOfGoBackToPenStyle();
    
    //string += getHTMLOfNewLine( 1 );
    //string += "<div style='text-align:center'>" + "<div style='font-size:" + ( 100 + getPenWidth() * 4 ) + "%; margin: 0px auto;'>" + "●" + "</div></div>";
    string += getHTMLOfCanvas();
    //string += getHTMLOfNewLine( 1 );
    
    if ( iPenStyle == TYPE_TEXT )
    {
        string += getHTMLOfListLinkItem( "icon message", "javascript:clickChangeText();", ID_CLICK_CHANGE_TEXT, S_CHANGE_TEXT[giLanguageIndex] );
    }
    
    var iStyle = getSpecificStyle( iPenStyle );
    var asStyleArray = getSpecificStyleArray( iPenStyle );

    for ( var i = 1; i < asStyleArray.length; i ++ )
    {
        var sIcon = i == iStyle ? "icon check" : "icon target";
        string += getHTMLOfListLinkItem( sIcon, "javascript:clickPenStyleSpecificStyle(" + iPenStyle + ", " + i + ");", ID_CLICK_PEN_STYLE_SPECIFIC_STYLE + i, asStyleArray[i][giLanguageIndex] );
    }

    string += getHTMLOfListLinkItem( "icon add", "javascript:clickPenStyleDemoIncrease(" + iPenStyle + ");", ID_CLICK_PEN_STYLE_DEMO_INCREASE, S_INCREASE[giLanguageIndex] + " : " + getSpecificWidth( iPenStyle ) );
    string += getHTMLOfListLinkItem( "icon remove", "javascript:clickPenStyleDemoDecrease(" + iPenStyle + ");", ID_CLICK_PEN_STYLE_DEMO_DECREASE, S_DECREASE[giLanguageIndex] );

    //restoreGlobal();
    
    return string;
}

function getHTMLOfNavPenStyleImageDiv()
{
    var string = "";
    
    string += getHTMLOfGoBackToPenStyle();
    
    var sText = S_OPEN[giLanguageIndex] + "<br><br><input id='" + ID_IMG_FILE_SELECTOR + "' type='file' value='IMG' ";
    sText += notSupportJsLink() ? "/>" : "onchange='openImage();'/>";

    string += getHTMLOfListText( "icon folder", sText );
    
    for ( var i = 0; i < gImageNowCount; i ++ )
    {
        string += getHTMLOfListLinkItemWithImage( "icon paper", "javascript:clickPenStylePicture(" + i + ");", ID_CLICK_PEN_STYLE_PICTURE + i, gImageName[i], getImageData( i ) );
    }
    
    return string;
}

function getHTMLOfNavPenStyleOtherDiv()
{
    var string = "";
    
    string += getHTMLOfGoBackToPenStyle();
    
    string += getHTMLOfListLinkItem( "icon paper", "javascript:clickClean();", ID_CLICK_CLEAN, S_CLEAN[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon busy", "javascript:clickDelay();", ID_CLICK_DELAY, S_DELAY[giLanguageIndex] + " " + getDelaySecond() + " " + S_SECOND[giLanguageIndex] );

    string += getHTMLOfListLinkItem( "icon add", "javascript:clickDelaySecondIncrease();", ID_CLICK_DELAY_SECOND_INCREASE, S_INCREASE[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon remove", "javascript:clickDelaySecondDecrease();", ID_CLICK_DELAY_SECOND_DECREASE, S_DECREASE[giLanguageIndex] );
    
    return string;
}

function getHTMLOfNavColorDiv()
{
    var string = "";
    
    string += getHTMLOfGoBack();

    string += getHTMLOfListLinkItem( "icon picture", "javascript:clickForeColorSideMenu();", ID_CLICK_FORE_COLOR_SIDE_MENU, S_FOREGROUND[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon picture", "javascript:clickBackColorSideMenu();", ID_CLICK_BACK_COLOR_SIDE_MENU, S_BACKGROUND[giLanguageIndex] );
        
    return string;
}

function getHTMLOfNavColorListDiv( iColorType )
{
    var string = "";
    
    string += getHTMLOfGoBack();
    
    //setRandomColor();
    //setRegularColor();
    
    var sExplanation = iColorType == FOREGROUND ? S_FOREGROUND[giLanguageIndex] : S_BACKGROUND[giLanguageIndex];
    var iColorIndex = iColorType == FOREGROUND ? getForeColorIndex() : getBackColorIndex();
    var sFunction = iColorType == FOREGROUND ? "clickForeColor" : "clickBackColor";
    
    var sPrevID = iColorType == FOREGROUND ? ID_CLICK_FORE_COLOR : ID_CLICK_BACK_COLOR;

    string += getHTMLOfListText( "icon picture", sExplanation );
    
    for ( var i = 0; i < gColors.length + 1; i ++ )
    {
        var sIcon = i == iColorIndex ? "icon check" : "icon target";
        var sJS = "javascript:" + sFunction + "(" + i + ");";
        var sID = sPrevID + i;
        
        if ( i == 0 )
        {
            if ( iColorType == FOREGROUND )
            {
                string += getHTMLOfListLinkItem( sIcon, sJS, sID, i + ":" + S_RANDOM[giLanguageIndex] );
            }
            else
            {
                string += getHTMLOfListLinkItem( sIcon, sJS, sID, i + ":" + S_DEFAULT[giLanguageIndex] );
            }
        }
        else
        {
            string += getHTMLOfListLinkItemWithColor( sIcon, sJS, sID, i + ":" + gColors[i-1], gColors[i-1] );
        }
    }

    return string;
}

function getHTMLOfNavFileDiv()
{
    var string = "";
    
    if ( !gsFileName || gsFileName == "" ) 
    {
        gsFileName = getDefaultImageFileName();
    }
    
    string += getHTMLOfGoBack();
    string += getHTMLOfListLinkItem( "icon new", "javascript:clickNewFile();", ID_CLICK_NEW_FILE, S_NEW[giLanguageIndex] );
    //string += getHTMLOfListLinkItem( "icon target", "javascript:clickOpenFile();", S_OPEN[giLanguageIndex] );
    string += getHTMLOfListLinkItem( "icon new", "javascript:clickChangeFileName();", ID_CLICK_CHANGE_FILE_NAME, S_CHANGE_FILE_NAME[giLanguageIndex] );
    
    string += getHTMLOfListLinkDownloadItem( IMAGE_TYPE_PNG, "icon picture", S_SAVE_DRAWING[giLanguageIndex] );
    string += getHTMLOfListLinkDownloadItem( IMAGE_TYPE_BMP, "icon camera", S_SAVE_ANIMATION[giLanguageIndex] );

    var sText = S_OPEN[giLanguageIndex] + "<br><br><input id='" + ID_FILE_SELECTOR + "' type='file' value='IMG' ";
    sText += notSupportJsLink() ? "/>" : "onchange='file_viewer_load();'/>";
    string += getHTMLOfListText( "icon folder", sText );

    return string;
}

function getHTMLOfOptionDiv()
{
    abortPlay( false );
    //restorePenHistory();

    var string = "";

    // display
    string += getHTMLOfListText( "icon tag", S_DISPLAY[giLanguageIndex] );
    string += "<p></p>";
    string += getHTMLOfListItem( "icon settings", ID_STYLE, S_STYLE[giLanguageIndex] );
    string += getHTMLOfListItem( "icon settings", ID_LANGUAGE, S_LANGUAGE[giLanguageIndex] );
    string += getHTMLOfListItem( "icon settings", ID_FONT_SIZE, S_FONT_SIZE[giLanguageIndex] );

    string += "<br>";

    if ( !notSupportStored() )
    {
        // recovery
        string += getHTMLOfListText( "icon tag", S_RECOVERY[giLanguageIndex] );
        string += "<p></p>";
        string += getHTMLOfListLinkItem( "icon settings", "javascript:onClickBackToDefault();", ID_CLICK_GO_BACK_TO_DEFAULT, S_BACK_TO_DEFAULT_SETTING[giLanguageIndex] );
        string += "<br>";
    }
    
   
    //if ( giPlatform == PLATFORM_BROWSER )
    {
        // about
        string += getHTMLOfListText( "icon tag", S_ABOUT[giLanguageIndex] );
        string += "<p></p>";
        string += getHTMLOfListItem( "icon info", ID_ABOUT_APP, S_ABOUT_APP[giLanguageIndex] );
    
        string += getHTMLOfListItem( "icon info", ID_ABOUT_AUTHOR, S_ABOUT_AUTHOR[giLanguageIndex] );
        //string += getHTMLOfListItem( "icon info", ID_RELATED_LINKS, S_RELATED_LINKS[giLanguageIndex] );
        string += "<br>";
    }

    return string;
}

function getHTMLOfSameLine( sLeftText, sRightText )
{
    return "<strong><p style='text-align:left;font-size:" + ( getFontRatio() * 3 / 4 ) + "%'>" + sLeftText + "<span style='float:right;'>" + sRightText + "</span></p></strong>";
}

function getHTMLOfAppDiv()
{
    var string = "";

    //string += "<br>";
    
    string += getHTMLOfCanvas(); 

    for ( var i = 0; i < 1/*S_RELATED_LINKS_ARRAY.length*/; i ++ )
    {
        string += getHTMLOfListLinkItem( "icon info", "javascript:goRelatedLinkURL(" + i + ");", ID_CLICK_RELATED_LINK + i, S_RELATED_LINKS_ARRAY[i][giLanguageIndex] );
    }

    return string;
}

function getHTMLOfAuthorDiv()
{
    var string = "";

    //string += "<br>";
    
    string += getHTMLOfCanvas(); 

    string += getHTMLOfListLinkItemWithTitle( "icon mail", "javascript:goEmailOfAuthor();", ID_CLICK_GO_EMAIL_OF_AUTHOR, gsEmailOfAuthor, S_EMAIL_TO_AUTHOR[giLanguageIndex] );

    return string;
}


function getHTMLOfFontSizeDiv()
{
    var string = "";
    var index = 0;

    for ( var i = 0; i <= 10; i ++ )
    {
        var icon = i == getFontSizeIndex() ? "icon check" : "icon target";
        string += getHTMLOfListItem( icon, ID_ITEM + i, "" + ( 100 + i * 10 ) + "%" );
    }

    return string;
}

function setStyle()
{
    var sStyleClass = "ios7"; // default UI style
    var sStyle = S_STYLE_ARRAY[getStyleIndex()].toString();

    if ( sStyle === S_WINDOWS_8.toString() )
    {
        sStyleClass = "win8";
    }
    else if ( sStyle === S_WINDOWS_8_LIGHT.toString() )
    {
        sStyleClass = "win8 light";
    }
    else if ( sStyle === S_ANDROID.toString() )
    {
        sStyleClass = "android";
    }
    else if ( sStyle === S_ANDROID_LIGHT.toString() )
    {
        sStyleClass = "android light";
    }
    else if ( sStyle === S_IOS.toString() )
    {
        sStyleClass = "ios";
    }
    else if ( sStyle === S_IOS_7.toString() )
    {
        sStyleClass = "ios7";
    }
    else if ( sStyle === S_BLACK_BERRY_10.toString() )
    {
        sStyleClass = "bb";
    }
    else if ( sStyle === S_TIZEN.toString() )
    {
        sStyleClass = "tizen";
    }
    
    var eAfui = document.getElementById("afui");
    eAfui.className = sStyleClass;
}

function setLanguage()
{
    giLanguageIndex = getLanguageIndex();   
}

function showFontColor( sColor )
{
    if ( sColor == null || sColor == "" )
        return;

    $("#afui").css("color", sColor );
}

function showBackgroundColor( sColor )
{
    if ( sColor == null || sColor == "" )
        return;

    $("#afui").css("background", sColor );
}

function showBackgroundImage( sBase64 )
{
    if ( sBase64 == null || sBase64 == "" )
        return;

    if ( true )
    {
        $("#afui").css("background", "url(" + sBase64 + ") no-repeat center center fixed" );
        /*
        $("#afui").css("-webkit-background-size", "cover" );
        $("#afui").css("-moz-background-size", "cover" );
        $("#afui").css("-o-background-size", "cover" );
        */
        //$("#afui").css("background-size", "100%" );
    }
    else
    {
        var eAfui = document.getElementById( "afui" );
        eAfui.style.backgroundImage = "url(" + sBase64 + ")";
        eAfui.style.backgroundPosition = "center center";
        eAfui.style.backgroundRepeat="no-repeat";
        eAfui.style.backgroundAttachment="fixed";
        eAfui.style.background.size="cover";
    }
}


function getHTMLOfMainDiv()
{
    var string = "";
    
    string += "<br>";
    
    string += getHTMLOfCanvas(); 
    string += getHTMLOfListItem( "icon picture", getPaintPageID(), S_CANVAS[giLanguageIndex] );
    string += getHTMLOfListItem( "icon tools", ID_OPTION, S_OPTION[giLanguageIndex] );

    return string;
}


function getHTMLOfText( sText, iFontSizeRatio )
{
    return getHTMLOfTextDetail( sText, iFontSizeRatio, "", true );
}

function getHTMLOfTextDetail( sText, iFontSizeRatio, sOtherStyle, bNewLine )
{
    var sHTML = "<p style='font-size:" + iFontSizeRatio + "% ; line-height: 160%;" + sOtherStyle + ";'>";
    
    sHTML += bNewLine ? "<br>" : "";
   
    return sHTML + sText + "</p>";
}

function getHTMLOfCover()
{
    //alert( getScreenHeight() + "x" + getScreenWidth() );
    return getHTMLOfImage( getCurrentCover(), true );
}

function getHTMLOfImage( sImageURL, bBorder )
{
    //alert( sImageURL );
    
    var iMarginLeft = Math.floor( ( 100 - giPicWidthRatio ) / 2 );
    
    // 960 x 540

    var reduceMultiple = 3;//getScreenHeight() > 1023 ? 3 : 4;

    var iMaxHeight = Math.floor( getScreenHeight() / reduceMultiple );

    if ( bBorder )
    {
        return "<div style='margin-left: " + iMarginLeft + "%; margin-top: 5%; margin-bottom: 5%; width:50%; height:" + iMaxHeight + "px; overflow:hidden; border:12px #E0E0E0 double'><img src='" + sImageURL + "' alt='Loading...' style='width:100%; height:100%;' ></div>";
    }

    return "<div style='margin-left: " + iMarginLeft + "%; margin-top: 5%; width:" + giPicWidthRatio + "%; height:" + iMaxHeight + "px;'><img src='" + sImageURL + "' style='width:100%; height:100%;' alt='Loading...'></div>";
}

function getHTMLOfImageCombine( sImageURL1, sImageURL2, iOverlapRatio )
{
    var iMarginLeft = Math.floor( ( 100 - giPicWidthRatio ) / 2 );

    return "<div style='margin-left: " + iMarginLeft + "%; margin-top: 5%; margin-bottom: 5%;'><img src='" + sImageURL1 + "' style='position:absolute; z-index:1; top:1%; width=" + giPicWidthRatio + "%; height:" + ( giPicHeightRatio * 1.5 ) + "%;' alt='Loading...'><img src='" + sImageURL2 + "' style='position:absolute; z-index:2; top:20%; margin-left: " + iOverlapRatio + "%; width=" + giPicWidthRatio + "%; height:" + Math.floor( giPicHeightRatio / 2.5 ) + "%;' alt='Loading...'></div>";
}

function getHTMLOfNewLine( iCount )
{
    var sHTML = "";
    for ( var i = 0; i < iCount; i ++ )
    {
        sHTML += getHTMLOfText( "", getFontRatio() );
    }

    return sHTML;
}

function getContentIndex( sPageID )
{
    var iOrder = -1;

    for ( var i = 0; i < ID_CONTENT_ARRAY.length; i ++ )
    {
        if ( sPageID == ID_CONTENT_ARRAY[i] )
        {
            iOrder = i;
            break;
        }
    }

    if ( iOrder < 0 || iOrder >= gaiNavTitleRelatedIndex.length )
    {
        //alert( " -> " + sPageID + "(" + iOrder + "):" );
        return -1;
    }

    return gaiNavTitleRelatedIndex[iOrder];
}




function getHTMLOfCanvas()
{
    return "<canvas id='c" + giPlayNumber + "' ></canvas>";
};

function getHTMLOfPaintDiv()
{
    abortPlay( true );
    restorePenHistory();
    giNowPlayNumberOfPaint = giPlayNumber;

    var string = "";

    string += getHTMLOfCanvas();
    string += getHTMLOfNewLine( 1 );

    return string;
}

function clickPost( iPostIndex )
{
}

function getPaintPageID()
{
    return ID_PAINT;
}

function isPaintPageID( sDivID )
{
    return sDivID == ID_PAINT;
}

function isPaintPageNow()
{
    return gsNowDivID == ID_PAINT;
}


function getEmailURL( sEmail )
{
    return "mailto:" + sEmail;
}

function getHTMLOfStyleDiv()
{
    var iCount = S_STYLE_ARRAY.length;
    var abSelected = getSelectArrayByID( ID_STYLE );
    
    var string = "";

    for ( var i = 1; i < iCount; i ++ )
    {
        if ( shouldStyleSkipped( i ) )
        {
            continue;
        }
    
        var sIcon = abSelected[i] ? "icon check" : "icon target";
        string += getHTMLOfListLinkItem( sIcon, "javascript:clickStyle(" + i + ");",
        ID_CLICK_STYLE + i, S_STYLE_ARRAY[i][giLanguageIndex] );
    }
    
    return string;
}

function getHTMLOfLanguageDiv()
{
    var iCount = S_LANGUAGE_ARRAY.length;
    var abSelected = getSelectArrayByID( ID_LANGUAGE );
    
    var string = "";

    for ( var i = 0; i < iCount; i ++ )
    {
        var sIcon = abSelected[i] ? "icon check" : "icon target";
        string += getHTMLOfListLinkItem( sIcon, "javascript:clickLanguage(" + i + ");", ID_CLICK_LANGUAGE + i, S_LANGUAGE_ARRAY[i][giLanguageIndex] );
    }

    return string;
}

function getHTMLOfFontSizeDiv()
{
    var iCount = 10;
    
    var string = "";

    for ( var i = 0; i < iCount; i ++ )
    {
        var sIcon = i == getFontSizeIndex() ? "icon check" : "icon target";
        var sText = "" + ( 100 + i * 10 ) + "%";
        string += getHTMLOfListLinkItem( sIcon, "javascript:clickFontSize(" + i + ");", ID_CLICK_FONT_SIZE + i, sText );
    }
    
    return string;
}


function setBadge( sDivID, iNumber )
{
    $.ui.updateBadge( "#BADGE_" + sDivID, "" + iNumber, 'tr', 'red');
}







function getIcon( sID )
{
    var sDefault = notSupportExternalIcon() ? "✸" : "appbar.settings";
    var iOffset = notSupportExternalIcon() ? 2 : 1;
    var asIconArray = ID_CLICK_ALL_ARRAY;
    var sIcon = sDefault;
    var i;
    
    for ( i = 0; i < asIconArray.length; i += 3 )
    {
        if ( sID == asIconArray[i] )
        {
            sIcon = asIconArray[i+iOffset];
        }
    }
    
    if ( sIcon == sDefault && sID )
    {
        var sChecked = notSupportExternalIcon() ? "■" : "appbar.checkmark.thick";
        var sUnchecked = notSupportExternalIcon() ? "□" : "appbar.checkmark.thick.unchecked";
        var sFrontID = "";
        sIcon = sUnchecked;
    
        var iTargetIndex = 0;
    
        if ( sID.indexOf( ID_CLICK_PEN_STYLE_SPECIFIC_STYLE ) == 0 )
        {
            iTargetIndex = getSpecificStyle( gPenStyle );
            sFrontID = ID_CLICK_PEN_STYLE_SPECIFIC_STYLE;
        }
        else if ( sID.indexOf( ID_CLICK_FORE_COLOR ) == 0 )
        {
            iTargetIndex = getForeColorIndex();
            sFrontID = ID_CLICK_FORE_COLOR;
        }
        else if ( sID.indexOf( ID_CLICK_BACK_COLOR ) == 0 )
        {
            iTargetIndex = getBackColorIndex();
            sFrontID = ID_CLICK_BACK_COLOR;
        }
        else if ( sID.indexOf( ID_CLICK_STYLE ) == 0 )
        {
            iTargetIndex = getStyleIndex();
            sFrontID = ID_CLICK_STYLE;
        }
        else if ( sID.indexOf( ID_CLICK_LANGUAGE ) == 0 )
        {
            iTargetIndex = getLanguageIndex();
            sFrontID = ID_CLICK_LANGUAGE;
        }
        else if ( sID.indexOf( ID_CLICK_FONT_SIZE ) == 0 )
        {
            iTargetIndex = getFontSizeIndex();
            sFrontID = ID_CLICK_FONT_SIZE;
        }
        else if ( sID.indexOf( ID_CLICK_PEN_STYLE_PICTURE ) == 0 )
        {
            sIcon = "";
        }
        else if ( sID.indexOf( ID_CLICK_RELATED_LINK ) == 0 )
        {
            sIcon = notSupportExternalIcon() ? "❈" : "appbar.link";
        }
        else if ( sID == ID_CLICK_ENABLE_PROCESS_BAR )
        {
            sIcon = getProcessBarEnabled() ? sChecked : sUnchecked;
        }
        else if ( sID == ID_CLICK_UNIFY_PLAY_SPEED )
        {
            sIcon = getPlaySpeedUnified() ? sChecked : sUnchecked;
        }
        else
        {
            sIcon = sDefault;
        }
        
        if ( sID == sFrontID + iTargetIndex )
        {
            sIcon = sChecked;
        }
    }
    
    return notSupportExternalIcon() ? sIcon + "&nbsp;&nbsp;" : sIcon;
}



function getIconURL( sID )
{
    var sDir = isDarkThemeNow() ? "dark/" : "light/";

    return "img/icon/" + sDir + getIcon( sID ) + ".png";
}

function isFullScreenWidth( sID )
{
    return sID.indexOf( ID_CLICK_STYLE ) == 0 ||  
           sID.indexOf( ID_CLICK_LANGUAGE ) == 0 ||
           sID.indexOf( ID_CLICK_FONT_SIZE ) == 0 ||
           sID.indexOf( ID_CLICK_RELATED_LINK ) == 0 ||
           sID == getPaintPageID() ||
           sID == ID_OPTION ||
           sID == ID_STYLE ||
           sID == ID_LANGUAGE ||
           sID == ID_FONT_SIZE ||
           sID == ID_ABOUT_APP ||
           sID == ID_ABOUT_AUTHOR ||
           sID == ID_RELATED_LINKS ||
           sID == ID_CLICK_GO_BACK_TO_DEFAULT;
}

function isDarkThemeNow()
{
    var iStyleIndex = getStyleIndex();
    var asStyle = S_STYLE_ARRAY[iStyleIndex];
    
    return asStyle == S_ANDROID ||
           asStyle == S_WINDOWS_8 ||
           asStyle == S_TIZEN;
}

// --------------

/*
cordova create hello com.example.hello HelloWorld
cordova plugin add org.apache.cordova.inappbrowser
*/



