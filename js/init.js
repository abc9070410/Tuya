﻿var webRoot = "./";$.ui.autoLaunch = false; //By default, it is set to true and you're app will run right away.  We set it to false to show a splashscreen/* This function runs when the body is loaded.*/var webRoot = "./";// $.os.android=true;$.ui.openLinksNewTab = false;$.ui.splitview=false;var alreadyInitialized = false; // ensure calling init() only one timevar init = function () {        //navigator.splashscreen.show();               if ( alreadyInitialized )            return;                /*        window.setTimeout(function () {            $.ui.splitview = false;            $.ui.launch();        }, 1500);//We wait 1.5 seconds to call $.ui.launch after DOMContentLoaded fires        */                //$.ui.showLoading=true;        $.ui.blockPageScroll();                // 2014.10.22        //$.ui.disableNativeScrolling();        //$.ui.topClickScroll();                        initSetting();        initUI();        $.ui.backButtonText = S_BACK[giLanguageIndex];// We override the back button text to always say "Back"        //showBackgroundImage( "bg_sunrise.jpg" );        //alert( getNumber( "04" ) );        //log( getClosestStationIDs( 1022, 1202, CAR_KINGBUS ) );                $.ui.splitview = false;        $.ui.launch();                initData();                backupIndexPath();                    };//if ( !navSupported() )document.addEventListener("DOMContentLoaded", init, false);$.ui.ready(function () {    //This function will get executed when $.ui.launch has completed    $.ui.removeFooterMenu(); // disable navbar (footer) menu    $.ui.slideSideMenu = false;        //$.feat.nativeTouchScroll=false; //Disable native scrolling globally            if ( !navSupported() )        ;//$.ui.toggleHeaderMenu(false); //force hide            //bindSwipeEvent();    bindTouchEvent();});window.addEventListener("hashchange", onHashChange, false);function onHashChange(){    var hash = location.hash;    //alert( "id = " + hash  );;    if ( true || !isLock() )    {        changeHash( hash.substring( 1, hash.length ) );    }    else    {        showAlert( "Loading..." );    }        if ( giPlatform == PLATFORM_WP )//|| giPlatform == PLATFORM_WINDOWS_8 )    {        restoreIndexPath();    }}// --------------GWAI-----------------document.addEventListener('deviceready', onDeviceReady, false);function onDeviceReady(){    gbOnReady = true;        document.addEventListener("offline", onOffline, false);    document.addEventListener("online", onOnline, false);    document.addEventListener("backbutton", onBackKeyDown, false);    //setPlatform();}function setPlatform(){    var sPlatform = device.platform;        if ( sPlatform.indexOf( "Win" ) >= 0 )    {        giPlatform = PLATFORM_WP;    }    else if ( sPlatform.indexOf( "ndroid" ) >= 0 )    {        giPlatform = PLATFORM_ANDROID;    }    else if ( sPlatform.indexOf( "iOS" ) >= 0 )    {        giPlatform = PLATFORM_IOS;    }    else if ( sPlatform.indexOf( "lackBerry" ) >= 0 )    {        giPlatform = PLATFORM_BLACKBERRY;    }    else if ( sPlatform.indexOf( "irefox" ) >= 0 )    {        giPlatform = PLATFORM_FIREFOXOS;    }    else if ( sPlatform.indexOf( "izen" ) >= 0 )    {        giPlatform = PLATFORM_TIZEN;    }    else    {        giPlatform = PLATFORM_ANDROID;    }        //alert( "Platform: " + sPlatform + " -> " + giPlatform );}function supportAdmobAD(){    return ( giPlatform == PLATFORM_ANDROID ||         giPlatform == PLATFORM_WP ||         giPlatform == PLATFORM_IOS );}function destroyAD(){    if ( !supportAdmobAD() )        return;            if ( window.plugins && window.plugins.AdMob )     {        var am = window.plugins.AdMob;        am.destroyBannerView(            undefined,            function() {},            function() {}        );    }}function getInneractiveAD( sAppID ){    if ( giPlatform != PLATFORM_FIREFOXOS )        return null;    var eOptions = {        TYPE: "Banner",        REFRESH_RATE: 50,        APP_ID: sAppID    };        return Inneractive.createAd( eOptions );}function showInneractiveAD( sDivID ){    if ( giPlatform == PLATFORM_FIREFOXOS )    {        geInneractiveAD.placement( "bottom", "left" );        geInneractiveAD.addTo( document.getElementById( sDivID ) );    }}function showAD(){    if ( !supportAdmobAD() )        return;            if ( window.plugins && window.plugins.AdMob )     {    	var admob_ios_key = gsIOSCodeOfAD;    	var admob_android_key = gsAndroidCodeOfAD;        var admob_wp_key = gsWPCodeOfAD;        var adId = admob_android_key;                if ( giPlatform == PLATFORM_WP )        {            adId = admob_wp_key;        }        else if ( giPlatform == PLATFORM_IOS )        {            adId = admob_ios_key;        }                var am = window.plugins.AdMob;            am.createBannerView(             {            'publisherId': adId,            'adSize': am.AD_SIZE.BANNER,            'bannerAtTop': false            },             function() {        	    am.requestAd(        		    { 'isTesting':false },             		function(){            			am.showAd( true );            		},             		function(){ alert('failed to request ad'); }            	);            },             function(){ alert('failed to create banner view'); }        );    } else {      alert('AdMob plugin not available/ready.');    }}function onOffline() {    gbOnline = false;}function onOnline() {    gbOnline = true;        //alert( "ON LINE" );}function onBackKeyDown(){    var sMessage = S_ARE_YOU_SURE[giLanguageIndex] + S_EXIT_APP[giLanguageIndex].toLowerCase() + QUESTION_MARK;            showConfirmMessage( sMessage, exitThisApp );}function exitThisApp(){    offMessage();        if ( navigator.app )    {        navigator.app.exitApp();    }    else    {        log( "Do not support navigator.app !!" );    }}function bindTouchEvent(){    var iTouchY = 0;    var iTouchX = 0;    var iTriggerLength = 100;        $(document).bind( "touchstart",         function(e) {            if(e.originalEvent)                e = e.originalEvent;            iTouchX = Math.floor( e.touches[0].pageX );            iTouchY = Math.floor( e.touches[0].pageY );                        touchStartEvent( iTouchX, iTouchY );        }    );        $(document).bind( "touchmove",         function(e) {            if(e.originalEvent)                e = e.originalEvent;            iTouchX = Math.floor( e.touches[0].pageX );            iTouchY = Math.floor( e.touches[0].pageY );                        touchMoveEvent( iTouchX, iTouchY );        }    );        $(document).bind( "touchend",         function(e) {            touchEndEvent( iTouchX, iTouchY );        }    );}function bindSwipeEvent(){    $(document).bind( "swipeLeft",         function()        {            gbSwipeLock = true;            gbSwipeDown = false;            gbSwipeLock = false;        }    );        $(document).bind( "swipeRight",         function()        {            gbSwipeLock = true;            gbSwipeDown = false;            gbSwipeLock = false;        }    );        $(document).bind( "swipeDown",         function()        {            gbSwipeDown = true;        }    );}// -- Tuya --function mousemove( pageX, pageY ){    var phyX = pageX;     var phyY = pageY;        if ( gPreviousPhyX != INIT_POS )    {            if ( inCanvas( pageX, pageY ) )        {            // connect to the previous dot            draw( phyX, phyY );        }            }        gPreviousPhyX = phyX;    gPreviousPhyY = phyY;    gPreviousTime = gNowTime;}// ----------- for chrome --------------function handleClickEventListener( iType ){    var e;    var sClick = "click";        // ------- header button -------        if ( e = document.getElementById( ID_CLICK_UNDO ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickUndo );        }        else        {            e.removeEventListener( sClick, clickUndo );        }    }    if ( e = document.getElementById( ID_CLICK_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickMenu );        }        else        {            e.removeEventListener( sClick, clickMenu );        }            }    if ( e = document.getElementById( ID_CLICK_PLAY ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPlayDefault );        }        else        {            e.removeEventListener( sClick, clickPlayDefault );        }    }    if ( e = document.getElementById( ID_CLICK_PAUSE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPause );        }        else        {            e.removeEventListener( sClick, clickPause );        }    }    if ( e = document.getElementById( ID_CLICK_CONTINUE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickContinueDefault );        }        else        {            e.removeEventListener( sClick, clickContinueDefault );        }    }    if ( e = document.getElementById( ID_CLICK_CLEAN ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickClean );        }        else        {            e.removeEventListener( sClick, clickClean );        }    }        // ------- side menu button -------        if ( e = document.getElementById( ID_CLICK_PEN_RECORD_SIDE_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenRecordSideMenu );        }        else        {            e.removeEventListener( sClick, clickPenRecordSideMenu );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_SIDE_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleSideMenu );        }        else        {            e.removeEventListener( sClick, clickPenStyleSideMenu );        }    }    if ( e = document.getElementById( ID_CLICK_COLOR_SIDE_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickColorSideMenu );        }        else        {            e.removeEventListener( sClick, clickColorSideMenu );        }    }    if ( e = document.getElementById( ID_CLICK_PLAY_SIDE_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPlaySideMenu );        }        else        {            e.removeEventListener( sClick, clickPlaySideMenu );        }    }    if ( e = document.getElementById( ID_CLICK_FILE_SIDE_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickFileSideMenu );        }        else        {            e.removeEventListener( sClick, clickFileSideMenu );        }    }    if ( e = document.getElementById( ID_CLICK_GO_BACK_TO_PAINT ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickGoBackToPaint );        }        else        {            e.removeEventListener( sClick, clickGoBackToPaint );        }    }    if ( e = document.getElementById( ID_CLICK_GO_BACK_TO_PEN_STYLE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickGoBackToPenStyle );        }        else        {            e.removeEventListener( sClick, clickGoBackToPenStyle );        }    }    if ( e = document.getElementById( ID_CLICK_FORE_COLOR_SIDE_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickForeColorSideMenu );        }        else        {            e.removeEventListener( sClick, clickForeColorSideMenu );        }    }    if ( e = document.getElementById( ID_CLICK_BACK_COLOR_SIDE_MENU ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickBackColorSideMenu );        }        else        {            e.removeEventListener( sClick, clickBackColorSideMenu );        }    }            // ------- play related button -------        if ( e = document.getElementById( ID_CLICK_PLAY_STYLE_OBVERSE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPlayObverse );        }        else        {            e.removeEventListener( sClick, clickPlayObverse );        }    }    if ( e = document.getElementById( ID_CLICK_PLAY_STYLE_REVERSE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPlayReverse );        }        else        {            e.removeEventListener( sClick, clickPlayReverse );        }    }    if ( e = document.getElementById( ID_CLICK_PLAY_SPEED_UP ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPlaySpeedUp );        }        else        {            e.removeEventListener( sClick, clickPlaySpeedUp );        }    }    if ( e = document.getElementById( ID_CLICK_PLAY_SPEED_DOWN ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPlaySpeedDown );        }        else        {            e.removeEventListener( sClick, clickPlaySpeedDown );        }    }    if ( e = document.getElementById( ID_CLICK_ENABLE_PROCESS_BAR ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickEnableProcessBar );        }        else        {            e.removeEventListener( sClick, clickEnableProcessBar );        }    }    if ( e = document.getElementById( ID_CLICK_UNIFY_PLAY_SPEED ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickUnifyPlaySpeed );        }        else        {            e.removeEventListener( sClick, clickUnifyPlaySpeed );        }    }    if ( e = document.getElementById( ID_CLICK_CUT_PEN_HISTORY ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickCutPenHistory );        }        else        {            e.removeEventListener( sClick, clickCutPenHistory );        }    }            // ------- draw related button -------        if ( e = document.getElementById( ID_CLICK_PEN_STYLE_LINE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleLine );        }        else        {            e.removeEventListener( sClick, clickPenStyleLine );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_CIRCLE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleCircle );        }        else        {            e.removeEventListener( sClick, clickPenStyleCircle );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_RECTANGLE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleRectangle );        }        else        {            e.removeEventListener( sClick, clickPenStyleRectangle );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_DOT ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleDot );        }        else        {            e.removeEventListener( sClick, clickPenStyleDot );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_ERASER ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleEraser );        }        else        {            e.removeEventListener( sClick, clickPenStyleEraser );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_TEXT ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleText );        }        else        {            e.removeEventListener( sClick, clickPenStyleText );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_OTHER ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleOther );        }        else        {            e.removeEventListener( sClick, clickPenStyleOther );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_IMAGE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleImage );        }        else        {            e.removeEventListener( sClick, clickPenStyleImage );        }    }                // ------- other button -------        if ( e = document.getElementById( ID_CLICK_CHANGE_TEXT ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickChangeText );        }        else        {            e.removeEventListener( sClick, clickChangeText );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_DEMO_INCREASE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleDemoIncreaseDefault );        }        else        {            e.removeEventListener( sClick, clickPenStyleDemoIncreaseDefault );        }    }    if ( e = document.getElementById( ID_CLICK_PEN_STYLE_DEMO_DECREASE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickPenStyleDemoDecreaseDefault );        }        else        {            e.removeEventListener( sClick, clickPenStyleDemoDecreaseDefault );        }    }    if ( e = document.getElementById( ID_CLICK_DELAY ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickDelay );        }        else        {            e.removeEventListener( sClick, clickDelay );        }    }    if ( e = document.getElementById( ID_CLICK_DELAY_SECOND_INCREASE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickDelaySecondIncrease );        }        else        {            e.removeEventListener( sClick, clickDelaySecondIncrease );        }    }    if ( e = document.getElementById( ID_CLICK_DELAY_SECOND_DECREASE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickDelaySecondDecrease );        }        else        {            e.removeEventListener( sClick, clickDelaySecondDecrease );        }    }    if ( e = document.getElementById( ID_CLICK_NEW_FILE ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickNewFile );        }        else        {            e.removeEventListener( sClick, clickNewFile );        }    }    if ( e = document.getElementById( ID_CLICK_CHANGE_FILE_NAME ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, clickChangeFileName );        }        else        {            e.removeEventListener( sClick, clickChangeFileName );        }    }    if ( e = document.getElementById( ID_CLICK_GO_EMAIL_OF_AUTHOR ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, goEmailOfAuthor );        }        else        {            e.removeEventListener( sClick, goEmailOfAuthor );        }    }    if ( e = document.getElementById( ID_CLICK_GO_BACK_TO_DEFAULT ) )    {        if ( iType == TYPE_ADD )        {            e.addEventListener( sClick, onClickBackToDefault );        }        else        {            e.removeEventListener( sClick, onClickBackToDefault );        }    }            // ------- index button -------        var count = gColors.length;        for ( var i = 0; i < count; i ++ )    {        if ( e = document.getElementById( ID_CLICK_PEN_STYLE_SPECIFIC_STYLE + i ) )        {            e.iArgument = i;                        if ( iType == TYPE_ADD )            {                    e.addEventListener( sClick, clickPenStyleSpecificStyleEvent, false );            }            else            {                e.removeEventListener( sClick, clickPenStyleSpecificStyleEvent, false );            }        }        if ( e = document.getElementById( ID_CLICK_PEN_STYLE_PICTURE + i ) )        {            e.iArgument = i;                    if ( iType == TYPE_ADD )            {                e.addEventListener( sClick, clickPenStylePictureEvent, false );            }            else            {                e.removeEventListener( sClick, clickPenStylePictureEvent, false );            }        }                        if ( e = document.getElementById( ID_CLICK_FORE_COLOR + i ) )        {            e.iArgument = i;                        if ( iType == TYPE_ADD )            {                //if ( i == 11 ) alert( "add " + e1.iArgument );                e.addEventListener( sClick, clickForeColorEvent, false );;                //e.addEventListener( sClick, function() { clickForeColor( ii ); } );            }            else            {                //if ( i == 11 ) alert( "remove " + e1.iArgument );                e.removeEventListener( sClick, clickForeColorEvent, false );            }        }                if ( e = document.getElementById( ID_CLICK_BACK_COLOR + i ) )        {            e.iArgument = i;                        if ( iType == TYPE_ADD )            {                e.addEventListener( sClick, clickBackColorEvent, false );            }            else            {                e.removeEventListener( sClick, clickBackColorEvent, false );            }        }        // option button                 if ( e = document.getElementById( ID_CLICK_STYLE + i ) )        {            e.iArgument = i;                        if ( iType == TYPE_ADD )            {                e.addEventListener( sClick, clickStyleEvent, false );            }            else            {                e.removeEventListener( sClick, clickStyleEvent, false );            }        }        if ( e = document.getElementById( ID_CLICK_RELATED_LINK + i ) )        {            e.iArgument = i;                        if ( iType == TYPE_ADD )            {                e.addEventListener( sClick, goRelatedLinkURLEvent, false );            }            else            {                e.removeEventListener( sClick, goRelatedLinkURLEvent, false );            }        }        if ( e = document.getElementById( ID_CLICK_LANGUAGE + i ) )        {            e.iArgument = i;                        if ( iType == TYPE_ADD )            {                e.addEventListener( sClick, clickLanguageEvent, false );            }            else            {                e.removeEventListener( sClick, clickLanguageEvent, false );            }        }        if ( e = document.getElementById( ID_CLICK_FONT_SIZE + i ) )        {            e.iArgument = i;                        if ( iType == TYPE_ADD )            {                e.addEventListener( sClick, clickFontSizeEvent, false );            }            else            {                e.removeEventListener( sClick, clickFontSizeEvent, false );            }        }    }}