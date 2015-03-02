"use strict";

function printDebug( message )
{
    //debugMessage.innerHTML += message;
}

function printFinalDebug( message )
{
    //debugMessage.innerHTML = message;
}

function printError( message )
{
    errorMessage.innerHTML += "ERROR: " + message + "<br";
}

function unlockPen()
{
    gDrawLock = false;
}

function lockPen()
{
    gDrawLock = true;
}

function penIsLock()
{
    return gDrawLock;
}

function cleanPenHistory()
{
    for ( var i = 0; i < gPenMotionCount; i ++ )
    {
        clearTimeout( gPlayTimers[i] );
    }
}

function playPenHistoryAnimation( iPlayNumber, iPlayStyle, iBeginOrder, penOrder )
{
    return function()
    {
        initQueue();
        playPenHistory( iPlayNumber, iPlayStyle, iBeginOrder, penOrder );
    }
}

function playPrepared()
{

    lockPen(); 
    setCanvasMode( PLAY_MODE );
    if ( isPaintPageNow() )
    {
        saveGlobal(); 
    }
    
    // for pause/resume
    giAllMotionCount = getMotionCount();
    giNowMotionCount = 0;
    giNowMotionIndex = 0;
}

function playStopped( bNeedShowBackupDrawing )
{
    setCanvasMode( EDIT_MODE );
    restoreGlobal();
    unlockPen();
    
    giDrawQueueIndex = 0;
    giDrawingResetBeginIndex = 0;
    
    if ( bNeedShowBackupDrawing )
    {
        showStoredDrawing( NOWDO ); // show the last drawing before playing
    }

    //alert( "STOPPED" );
}

function isPlayBeginning( iPlayStyle, iBeginOrder, penOrder )
{
    return ( iPlayStyle != PLAY_STYLE_REVERSE && penOrder == iBeginOrder ) || 
           ( iPlayStyle == PLAY_STYLE_REVERSE && penOrder == iBeginOrder );
}

function isPlayEnd( iPlayStyle, iBeginOrder, penOrder )
{
    return ( iPlayStyle != PLAY_STYLE_REVERSE && penOrder == getTouchCount() ) || 
           ( iPlayStyle == PLAY_STYLE_REVERSE && penOrder < 0 );
}

function allowStopPlay( iPlayNumber )
{
    return isNowCanvasMode( PLAY_MODE ) && iPlayNumber == giPlayNumber;
}

function playPenHistory( iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    //giPlayStyle = iPlayStyle;
    
    //log( "PPH:" + iPlayNumber + "," + iPlayStyle + "," + iBeginTouchOrder + "," + iTouchOrder );

    // end check for reverse play
    if ( iTouchOrder < 0 )
    {
        if ( allowStopPlay( iPlayNumber ) )
        {
            playStopped( false );
        }
        return;
    }

    if ( isPlayBeginning( iPlayStyle, iBeginTouchOrder, iTouchOrder ) )
    {
        if ( !isNowCanvasMode( PAUSE_MODE ) )
        {
            if ( iPlayStyle != PLAY_STYLE_DEMO && iPlayStyle != PLAY_STYLE_LOADING )
            {
                replaceNowDrawing();//storeNowDrawing(); // backup the current drawing before playing
            }
            cleanCanvas( CLEAN_STYLE_NORMAL );
        }
        
        playPrepared();
    }

    var penTouchs = gPenHistory.split( TOUCH_GAP );
    giPenTouchCount = penTouchs.length - 1;
    
    if ( giPenTouchCount < iTouchOrder )
    //if ( iPlayNumber != giPlayNumber );
    {
        playStopped( iPlayStyle != PLAY_STYLE_DEMO && iPlayStyle != PLAY_STYLE_LOADING );
        return;
    }
    
    var sTempPenTouch = penTouchs[iTouchOrder];  
    var penMotions = sTempPenTouch.split( MOTION_GAP );
    var iLastMotionOrder = penMotions.length - 1;

    // fix the situation that the last word is MOTION_GAP
    if ( !penMotions[iLastMotionOrder] && iLastMotionOrder > 0 )
    {
        iLastMotionOrder--;
        //log( "-- : " + iLastMotionOrder + ":" + penMotions[iLastMotionOrder] );
    }
    
    var iCurrentPenStyle = getPenStyle( penMotions[iLastMotionOrder] );

    if ( needWaitingPlay( iCurrentPenStyle ) )
    {
        //log( "LMO : " + iLastMotionOrder + " [" + penMotions[iLastMotionOrder] + "] : " + " [" + penMotions[iLastMotionOrder+1] + "] : " + sTempPenTouch );
    }
        
    for ( var j = 0; j <= iLastMotionOrder; j ++ )
    {
        giNowMotionCount ++;
        
        var iOrder = getNext( iPlayStyle, j );
        
        setPlayTimer( penMotions[j].split( TOKEN_GAP ), iPlayNumber, iBeginTouchOrder, iTouchOrder, iLastMotionOrder, iOrder );
    }
    
    
    
    if ( isPlayEnd( iPlayStyle, iBeginTouchOrder, iTouchOrder ) )
    {
        if ( allowStopPlay( iPlayNumber ) )
        {
            //alert( giPenTouchCount ); 
            playStopped( false );
            
            if ( iPlayStyle != PLAY_STYLE_DEMO && iPlayStyle != PLAY_STYLE_LOADING )
            {
                log( "[2]: replace " );
                replaceNowDrawing(); //storeNowDrawing(); // store the drawing in the end of play
            }
        }
    }
    else if ( needWaitingPlay( iCurrentPenStyle ) )
    {
        log( "not PPHA" );
        log( "[33]" + iTouchOrder );
    }
    else
    {    
        log( "[44]" + iTouchOrder + "_" + iCurrentPenStyle  );
        if ( iPlayStyle == PLAY_STYLE_LOADING && giTempPrevPenStyle != TYPE_PEN_INVALID )
        {
            storeNowDrawing(); // rebuild the drawing data for advance edit
        }
        
        var iSpeed = penMotions.length > 3 ? getPlaySpeed() : getPlaySpeed() * giTouchDelayCoefficient;
        //alert( iTouchOrder + ":" + penMotions.length );
        var iNextOrder = getNext( iPlayStyle, iTouchOrder );
        setTimeout( playPenHistoryAnimation( iPlayNumber, iPlayStyle, iBeginTouchOrder, iNextOrder ), iSpeed * penMotions.length + 1 );
        
        giTempPrevPenStyle = iCurrentPenStyle;
    }
}

function getMotionAction( motion )
{
    return shiftMotion( motion, 0, 0 );
}

function changeStyleMotion( motion, iPenStyle, iStyle )
{
    var newMotion;

    var motionTokens = motion.split( TOKEN_GAP );
    
    var penStyle = motionTokens[0];
    
    if ( penStyle != iPenStyle )
    {
        return getMotionAction( motion );
    }

    if ( penStyle == TYPE_PEN_LINE )
    {
        newMotion = drawLine( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), parseInt( motionTokens[3] ), parseInt( motionTokens[4] ), iStyle );
    }
    else if ( penStyle == TYPE_PEN_RECTANGLE )
    {
        newMotion = drawRectangle( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), false, iStyle );
    }
    else if ( penStyle == TYPE_PEN_CIRCLE )
    {
        newMotion = drawCircle( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), false, iStyle );
    }
    else if ( penStyle == TYPE_PEN_ERASER )
    {
        newMotion = drawEraser( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), iStyle );
    }
    else if ( penStyle == TYPE_PEN_ERASER )
    {
        newMotion = drawText( motionTokens[1], parseInt( motionTokens[2] ), parseInt( motionTokens[3] ), iStyle, motionTokens[5] );
    }
    else
    {
        newMotion = getMotionAction( motion );
    }
    
    return newMotion;
}

// (x,y) -> (x+offsetX, y+offsetY)
function shiftMotion( motion, offsetX, offsetY )
{
    var newMotion;

    var motionTokens = motion.split( TOKEN_GAP );
    
    var penStyle = motionTokens[0];
    
    offsetX = parseInt( offsetX, 10 );
    offsetY = parseInt( offsetY, 10 );

    if ( penStyle == TYPE_PEN_LINE )
    {
        newMotion = drawLine( parseInt( motionTokens[1] ) + offsetX, parseInt( motionTokens[2] ) + offsetY, parseInt( motionTokens[3] ) + offsetX, parseInt( motionTokens[4] ) + offsetY, parseInt( motionTokens[5] ) );
    }
    else if ( penStyle == TYPE_PEN_RECTANGLE )
    {
        newMotion = drawRectangle( parseInt( motionTokens[1] ) + offsetX, parseInt( motionTokens[2] ) + offsetY, false, parseInt( motionTokens[3] ) );
    }
    else if ( penStyle == TYPE_PEN_CIRCLE )
    {
        newMotion = drawCircle( parseInt( motionTokens[1] ) + offsetX, parseInt( motionTokens[2] ) + offsetY, false, parseInt( motionTokens[3] ) );
    }
    else if ( penStyle == TYPE_PEN_ERASER )
    {
        newMotion = drawRectangle( parseInt( motionTokens[1] ) + offsetX, parseInt( motionTokens[2] ) + offsetY, parseInt( motionTokens[3] ) );
    }
    else if ( penStyle == TYPE_PEN_DOT )
    {
        newMotion = drawDot( parseInt( motionTokens[1] ) + offsetX, parseInt( motionTokens[2] ) + offsetY );
    }
    else if ( penStyle == TYPE_TEXT )
    {
        newMotion = drawText( motionTokens[1], parseInt( motionTokens[2] ) + offsetX, parseInt( motionTokens[3] ) + offsetY, parseInt( motionTokens[4] ), motionTokens[5] );
    }
    else if ( penStyle == TYPE_IMAGE )
    {
        newMotion = drawImage( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ) + offsetX, parseInt( motionTokens[3] ) + offsetY, parseFloat( motionTokens[4] ), parseFloat( motionTokens[5] ) );
    }
    else if ( penStyle == TYPE_CLEAN )
    {
        newMotion = cleanCanvas( parseInt( motionTokens[1] ) );
    }
    else if ( penStyle == TYPE_DELAY )
    {
        newMotion = delayPlay( parseInt( motionTokens[1] ) );
    }
    else if ( penStyle == TYPE_GLOBAL_VALUE )
    {
        newMotion = setGlobal( motionTokens[1], motionTokens[2], parseInt( motionTokens[3] ), parseInt( motionTokens[4] ), parseInt( motionTokens[5] ), parseInt( motionTokens[6] ), parseInt( motionTokens[7] ), parseInt( motionTokens[8] ) );
    }
    else
    {
        newMotion = motion;
    }

    return newMotion;
}

function resizeMotion( motion, ratio )
{
    var newMotion;

    var motionTokens = motion.split( TOKEN_GAP );
    
    var penStyle = motionTokens[0];

    if ( penStyle == TYPE_PEN_LINE )
    {
        newMotion = drawLine( parseInt( motionTokens[1] ) * ratio, parseInt( motionTokens[2] ) * ratio, parseInt( motionTokens[3] ) * ratio, parseInt( motionTokens[4] ) * ratio, parseInt( motionTokens[5] ) );
    }
    else if ( penStyle == TYPE_PEN_RECTANGLE )
    {
        newMotion = drawRectangle( parseInt( motionTokens[1] ) * ratio, parseInt( motionTokens[2] ) * ratio, false, parseInt( motionTokens[3] ) );
    }
    else if ( penStyle == TYPE_PEN_CIRCLE )
    {
        newMotion = drawCircle( parseInt( motionTokens[1] ) * ratio, parseInt( motionTokens[2] ) * ratio, false, parseInt( motionTokens[3] ) );
    }
    else if ( penStyle == TYPE_PEN_ERASER )
    {
        newMotion = drawEraser( parseInt( motionTokens[1] ) * ratio, parseInt( motionTokens[2] ) * ratio, parseInt( motionTokens[3] ) );
    }
    else if ( penStyle == TYPE_PEN_DOT )
    {
        newMotion = drawDot( parseInt( motionTokens[1] ) * ratio, parseInt( motionTokens[2] ) * ratio );
    }
    else if ( penStyle == TYPE_TEXT )
    {
        newMotion = drawText( motionTokens[1], parseInt( motionTokens[2] ) * ratio, parseInt( motionTokens[3] ) * ratio, parseInt( motionTokens[4] ), motionTokens[5] );
    }
    else if ( penStyle == TYPE_IMAGE )
    {
        newMotion = drawImage( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ) * ratio, parseInt( motionTokens[3] ) * ratio, parseFloat( motionTokens[4] ) * ratio, parseFloat( motionTokens[5] ) * ratio );
    }
    else if ( penStyle == TYPE_CLEAN )
    {
        newMotion = cleanCanvas( parseInt( motionTokens[1] ) );
    }
    else if ( penStyle == TYPE_DELAY )
    {
        newMotion = delayPlay( parseInt( motionTokens[1] ) );
    }
    else if ( penStyle == TYPE_GLOBAL_VALUE )
    {
        newMotion = setGlobal( motionTokens[1], motionTokens[2], parseInt( motionTokens[3] ) * ratio, parseInt( motionTokens[4] ) * ratio, parseInt( motionTokens[5] ) * ratio, parseInt( motionTokens[6] ) * ratio, parseInt( motionTokens[7] ) * ratio, parseInt( motionTokens[8] ) );// / ratio );
    }
    else
    {
        newMotion = motion;
    }

    return newMotion;
}


function respeedMotion( motion, ratio )
{
    var newMotion;

    var motionTokens = motion.split( TOKEN_GAP );
    
    var penStyle = motionTokens[0];

    if ( penStyle == TYPE_GLOBAL_VALUE )
    {
        newMotion = setGlobal( motionTokens[1], motionTokens[2], parseInt( motionTokens[3] ), parseInt( motionTokens[4] ), parseInt( motionTokens[5] ), parseInt( motionTokens[6] ), parseInt( motionTokens[7] ), parseInt( motionTokens[8] ) * ratio );
    }
    else
    {
        newMotion = motion;
    }

    return newMotion;
}

function respeedPenHistory( penHistory, ratio )
{
    //saveGlobal();

    var newPenHistory = "";

    var motions = penHistory.split( MOTION_GAP );

    for ( var i = 0; i < motions.length; i ++ )
    {
        newPenHistory += respeedMotion( motions[i], ratio ) + MOTION_GAP;
    }

    //restoreGlobal();

    return newPenHistory;// + getGlobalMotion() + MOTION_GAP;
}

function shiftPenHistory( penHistory, offsetX, offsetY )
{
    //saveGlobal();

    var newPenHistory = "";

    var touches = penHistory.split( TOUCH_GAP );
    
    for ( var i = 0; i < touches.length; i ++ )
    {
        var motions = touches[i].split( MOTION_GAP );

        for ( var j = 0; j < motions.length; j ++ )
        {
            if ( illegalMotion( motions[j] ) )
            {
                //alert( j + " [" + motions[j] + "]" );
                continue;
            }
            newPenHistory += shiftMotion( motions[j], offsetX, offsetY );// + MOTION_GAP;
        }
        
        if ( i < touches.length - 1 )
        {
            newPenHistory += TOUCH_GAP;
        }
    }

    //restoreGlobal();

    return newPenHistory;
}

function resizePenHistory( penHistory, ratio )
{
    //saveGlobal();

    var newPenHistory = "";
    
    var touches = penHistory.split( TOUCH_GAP );
    
    for ( var i = 0; i < touches.length; i ++ )
    {
    
        var motions = touches[i].split( MOTION_GAP );

        for ( var j = 0; j < motions.length; j ++ )
        {
            if ( illegalMotion( motions[j] ) )
            {
                //alert( j + " [" + motions[j] + "]" );
                continue;
            }
            
            newPenHistory += resizeMotion( motions[j], ratio ); // + MOTION_GAP;

        }
        
        if ( i < touches.length - 1 )
        {
            newPenHistory += TOUCH_GAP;
        }
    }

    //restoreGlobal();

    return newPenHistory;
}

function changePenHistory( penHistory, iPenStyle, ratio, offsetX, offsetY, iStyle )
{
    //saveGlobal();

    var newPenHistory = "";
    
    var touches = penHistory.split( TOUCH_GAP );
    
    for ( var i = 0; i < touches.length; i ++ )
    {
    
        var motions = touches[i].split( MOTION_GAP );

        for ( var j = 0; j < motions.length; j ++ )
        {
            if ( illegalMotion( motions[j] ) )
            {
                //alert( j + " [" + motions[j] + "]" );
                continue;
            }
                        
            if ( ratio )
            {
                newPenHistory += resizeMotion( motions[j], ratio ); // + MOTION_GAP;
            }
            if ( offsetX && offsetY )
            {
                newPenHistory += shiftMotion( motions[j], offsetX, offsetY );
            }
            if ( iStyle )
            {
                newPenHistory += changeStyleMotion( motions[j], iPenStyle, iStyle );
            }
        }
        
        if ( i < touches.length - 1 )
        {
            newPenHistory += TOUCH_GAP;
        }
    }
    
    return newPenHistory;
}

function cutPenHistory( penHistory, iTouchOrderBegin, iTouchOrderEnd )
{
    var iBegin = 0;
    var iEnd = 0;
    
    // first, get the head part
    
    for ( var i = 1; i < iTouchOrderBegin; i ++ )
    {
        iEnd = penHistory.indexOf( TOUCH_GAP, iEnd + 1 );
    }
    
    var sHeadPart = penHistory.substring( 0, iEnd );

    // second, get the tail part
    
    iBegin = iEnd;

    for ( var i = iTouchOrderBegin; i <= iTouchOrderEnd; i ++ )
    {
        iBegin = penHistory.indexOf( TOUCH_GAP, iBegin + 1 );
    }
    
    var sTailPart = penHistory.substring( iBegin, penHistory.length );
    
    return sHeadPart + sTailPart;
}

function resetPenHistory2( penHistory, iNewWidth, iNewHeight, bFitFileSize )
{
    saveGlobal();
    var bDrawEnableBackup = gDrawEnable;
    gDrawEnable = false;

    var aiPos = getPosOfPenHistory( penHistory );
    var iOldX = aiPos[POS_X];
    var iOldY = aiPos[POS_Y];
    var iOldWidth = aiPos[POS_WIDTH];
    var iOldHeight = aiPos[POS_HEIGHT];
    var iBorder = 2;

    if ( bFitFileSize && giFileWidth > 0 && giFileHeight > 0 )
    {
        iOldWidth = giFileWidth;
        iOldHeight = giFileHeight;
    }

    var iRatioCoefficient = 0.9;
    var fWidthRatio = iNewWidth * iRatioCoefficient / iOldWidth;
    var fHeightRatio = iNewHeight * iRatioCoefficient / iOldHeight;
    var fRatio = fWidthRatio > fHeightRatio ? fHeightRatio : fWidthRatio;
    
    if ( !bFitFileSize )
    {
        var iX = ( iNewWidth - iOldWidth * fRatio ) / 2;
        var iY = ( iNewHeight - iOldHeight * fRatio );

        var iFixedX = iX + iBorder;
        var iFixedY = iY - iOldY + iBorder;
        
        //alert( iFixedX + "," + ( iOldWidth * fRatio ) + "," + iNewWidth  + "," + getScreenWidth());
        log( "iOldX:" + iOldX + " iFixedX:" + parseInt( iFixedX, 10 ) );
        log( "iOldWidth:" + ( iOldWidth * fRatio ) + " iNewWidth:" + iNewWidth );
        
        penHistory = shiftPenHistory( penHistory, iFixedX, iFixedY );
    }
    
    penHistory = resizePenHistory( penHistory, fRatio );
    
    //goURL( "http://B" + penHistory );
    
    restoreGlobal();
    
    gDrawEnable = bDrawEnableBackup;
    
    return penHistory;
}

function resetPenHistory( penHistory, x, y, width, height )
{
    var posData = getExtremePosData( penHistory );
    var originalWidth = posData.maxX - posData.minX;
    var originalHeight = posData.maxY - posData.minY;
    var widthRatio = width / originalWidth;
    var heightRatio = height / originalHeight;
    var ratio;
    
    if ( widthRatio * originalHeight < height )
    {
        ratio = widthRatio;
    }
    else
    {
        ratio = heightRatio;
    }

    //gPlaySpeed *= ratio; // 2014.10.30
    
    penHistory = resizePenHistory( penHistory, ratio );
    posData = getExtremePosData( penHistory );

    var offsetX = x - ( posData.minX + posData.maxX ) / 2;
    var offsetY = y - ( posData.minY + posData.maxY ) / 2;

    return shiftPenHistory( penHistory, offsetX, offsetY );
}

function getPenStyle( motion )
{
    return motion ? motion.split( TOKEN_GAP )[0] : TYPE_PEN_INVALID;
}

function setPlayTimer( motionTokens, iPlayNumber, iBeginTouchOrder, iTouchOrder, iLastMotionOrder, order )
{
    var speed = getPlaySpeed();
    
    var penStyle = motionTokens[0];

    if ( !needPlayTrace( penStyle ) )
    {
        showProcessBar( true, iPlayNumber, iTouchOrder, order );
    }
    
    if ( penStyle == TYPE_PEN_LINE )
    {
        setTimeout( drawLineAnimation( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), parseInt( motionTokens[3] ), parseInt( motionTokens[4] ), parseInt( motionTokens[5] ), iPlayNumber, iTouchOrder, order ), speed * order );
    }
    else if ( penStyle == TYPE_PEN_ERASER )
    {
        setTimeout( drawEraserAnimation( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), parseInt( motionTokens[3] ), iPlayNumber, iTouchOrder, order ), speed * order );
    }
    else if ( penStyle == TYPE_PEN_DOT )
    {
        setTimeout( drawDotAnimation( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), iPlayNumber, iTouchOrder, order ), speed * order );
    }
    else if ( needWaitingPlay( penStyle ) )
    {
        issueQueue( motionTokens, iPlayNumber, penStyle, iBeginTouchOrder, iTouchOrder, iLastMotionOrder, order );
    }
    else if ( penStyle == TYPE_CLEAN )
    {
        setTimeout( cleanCanvasAnimation( parseInt( motionTokens[1] ), iPlayNumber, iTouchOrder, order ), speed * order );
    }
    else if ( penStyle == TYPE_DELAY )
    {
        setTimeout( delayPlayAnimation( parseInt( motionTokens[1] ), iPlayNumber, iTouchOrder, order ), speed * order );
    }
    else if ( penStyle == TYPE_GLOBAL_VALUE )
    {

        setTimeout( setGlobalAnimation( motionTokens[1], motionTokens[2], parseInt( motionTokens[3] ), parseInt( motionTokens[4] ), parseInt( motionTokens[5] ), parseInt( motionTokens[6] ), parseInt( motionTokens[7] ), parseInt( motionTokens[8] ), iPlayNumber, iTouchOrder, order ), speed * ( order ) );

        // first step : set the global setting (eg. play speed)
        if ( order == 1 )
        {
            if ( !getPlaySpeedUnified() )
            {
                setPlaySpeed( parseInt( motionTokens[8] ) );
                
                //alert( "NOT UNIFY SPEED : " + getPlaySpeed() );
            }
        }
    }

    giLastPenStyle = penStyle;
    giLastTouchOrder = iTouchOrder;
}

function issueQueue( motionTokens, iPlayNumber, iPenStyle, iBeginTouchOrder, iTouchOrder, iLastMotionOrder, order )
{
    var iEndOrder = getTouchCount();
        
    //if ( ( giPlayStyle != PLAY_STYLE_REVERSE && iBeginTouchOrder == 0 ) ||
    //     ( giPlayStyle == PLAY_STYLE_REVERSE && iBeginTouchOrder == iEndOrder ) )
    if ( motionTokens )
    {
        if ( giDrawQueueCount == 0 )
        {
            showProcessBar( false, iPlayNumber, iTouchOrder, order );

            initQueue();
            storeTempDrawing( TEMP_STORE_SHOWTRACE );
            giDrawQueueIndex = getBeginImageAnimationIndex( giPlayStyle );
            
            log( "BEGIN QUEUE : " + iTouchOrder );
        }
        
        if ( iPenStyle == TYPE_IMAGE )
        {
            addQueueImage( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), parseInt( motionTokens[3] ), parseFloat( motionTokens[4] ), parseFloat( motionTokens[5] ) );
        }
        else if ( iPenStyle == TYPE_TEXT )
        {
            addQueueText( motionTokens[1], parseInt( motionTokens[2] ), parseInt( motionTokens[3] ), parseInt( motionTokens[4] ), motionTokens[5] );
        }
        else if ( iPenStyle == TYPE_PEN_CIRCLE )
        {
            addQueueCircle( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), false, parseInt( motionTokens[3] ) );
        }
        else if ( iPenStyle == TYPE_PEN_RECTANGLE )
        {
            addQueueRectangle( parseInt( motionTokens[1] ), parseInt( motionTokens[2] ), false, parseInt( motionTokens[3] ) );
        }
        
        //log( "SPT : " + iLastMotionOrder + "," + order + "," + iPenStyle );
    }
    
    if ( order <= 1)
    {
        log( "ORDER: " + order );
    }

    if ( iLastMotionOrder == 1 || // only touch, not swipe
         iLastMotionOrder == order )
    {
        if ( giDrawQueueCount > 0 )
        {
            issueDrawQueue( PLAY_MODE, iPlayNumber, giPlayStyle, iPenStyle, iBeginTouchOrder, iTouchOrder );
        }
    }
}

function showProcessBar( bIsAnimation, iPlayNumber, iTouchOrder, order )
{
    if ( !getProcessBarEnabled() )
    {
        return; // do not show the process bar 
    }

    var speed = getPlaySpeed();
    var iTargetMotionCount = giAllMotionCount * giNowMotionIndex / PROCESS_BAR_LENGTH;
    var iMaxX = getScreenWidth() * 0.95;
    var iMaxY = getScreenHeight() * 0.9;
    
    if ( iTargetMotionCount <= giNowMotionCount )
    {   
        var iWidth = iMaxX * ( giNowMotionIndex + 1 ) / PROCESS_BAR_LENGTH + 10;
        var iHeight = 20;
        
        if ( bIsAnimation )
        {
            setTimeout( drawRectangleForceAnimation( 0, iMaxY - 20, iWidth, iHeight, "green", STYLE_SOLID, iPlayNumber, iTouchOrder, order ), speed * order );
        }
        else 
        {
            drawRectangleForce( 0, iMaxY - 20, iWidth, iHeight, "green", STYLE_SOLID );
        }
        
        giNowMotionIndex++;
    }
}

function storeNowDrawingAnimation( iStyle, iPlayNumber, iTouchOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) && isTempDrawingLoaded() )
        {
            storeTempDrawing( iStyle );
        }
    }
}

function setGlobalAnimation( backColor, penColor, penWidth, iRectangleWidth, iCircleWidth, iEraserWidth, iTextWidth, playSpeed, iPlayNumber, iTouchOrder, order )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            setGlobal( backColor, penColor, penWidth, iRectangleWidth, iCircleWidth, iEraserWidth, iTextWidth, playSpeed );
        }
    }
}

function getGlobal( backColor, penColor, penWidth, iRectangleWidth, iCircleWidth, iEraserWidth, iTextWidth, playSpeed )
{
    return "" + TYPE_GLOBAL_VALUE + TOKEN_GAP + getColorHistory( backColor ) + TOKEN_GAP + getColorHistory( penColor ) + TOKEN_GAP + penWidth + TOKEN_GAP + iRectangleWidth + TOKEN_GAP + iCircleWidth + TOKEN_GAP + iEraserWidth + TOKEN_GAP + iTextWidth + TOKEN_GAP + playSpeed + MOTION_GAP;
}

function setGlobal( backColor, penColor, penWidth, iRectangleWidth, iCircleWidth, iEraserWidth, iTextWidth, playSpeed )
{
    //setBackColor( backColor );
    setForeColor( penColor );
    setPenWidth( penWidth );
    setRectangleWidth( iRectangleWidth );
    setCircleWidth( iCircleWidth );
    setEraserWidth( iEraserWidth );
    setTextWidth( iTextWidth );
    
    if ( !getPlaySpeedUnified() )
    {
        setPlaySpeed( playSpeed );
        //alert( "setGlobal : " + getPlaySpeed() );
    }
    
    return getGlobal( backColor, penColor, penWidth, iRectangleWidth, iCircleWidth, iEraserWidth, iTextWidth, playSpeed );
}

function getGlobalMotion()
{
    return setGlobal( getBackColor(), getForeColor(), getPenWidth(), getRectangleWidth(), getCircleWidth(), getEraserWidth(), getTextWidth(), getPlaySpeed() );
}

function saveGlobal()
{
    gTempForeColor = getForeColor();
    gTempPenWidth = getPenWidth();
    gTempRectangleWidth = getRectangleWidth();
    gTempCircleWidth = getCircleWidth();
    gTempEraserWidth = getEraserWidth();
    gTempTextWidth = getTextWidth();
    gTempPlaySpeed = getPlaySpeed();
}

function restoreGlobal()
{
    setForeColor( gTempForeColor );
    setPenWidth( gTempPenWidth );
    setRectangleWidth( gTempRectangleWidth );
    setCircleWidth( gTempCircleWidth );
    setEraserWidth( gTempEraserWidth );
    setTextWidth( gTempTextWidth );
    setPlaySpeed( gTempPlaySpeed );
}

function setPenStyle( penStyle )
{
    gPenStyle = penStyle;
}

function storeTempDrawing( iStyle )
{
    if ( !gCanvas )
        return;

    if ( iStyle == TEMP_STORE_SHOWTRACE )
    {
        gTempShowtraceDrawing = gCanvas.toDataURL();
        
        log( "TSD" );
    }
    else
    {
        gTempShowtraceDrawing = gCanvas.toDataURL();
        gTempBacktrackDrawing[giTempBacktrackIndex++] = gCanvas.toDataURL();
    }
}

function replaceNowDrawing()
{
    if ( gCanvas )
    {
        gDrawingHistory[gDrawingIndex] = gCanvas.toDataURL();
    }
}

function storeNowDrawing()
{
    if ( gCanvas )
    {
        log( "STORE " + gDrawingIndex );
        gDrawingIndex = getNextDrawIndex();
        gDrawingHistory[gDrawingIndex] = gCanvas.toDataURL();
        gaiTouchIndexForEdit[gDrawingIndex] = getTouchCount();
    }
}

function initDrawingHistory()
{
    gDrawingHistory = new Array( DRAWING_MAX_COUNT );
}

// get the last drawing
function getNowDrawing()
{
    return gDrawingHistory[gDrawingIndex];
}

function getPrevDrawIndex()
{
    var tempIndex = gDrawingIndex - 1;
    
    if ( tempIndex < 0 )
    {
        tempIndex = DRAWING_MAX_COUNT - 1;
    }
    
    return tempIndex;
}

function getNextDrawIndex()
{
    var tempIndex = gDrawingIndex + 1;
    
    if ( tempIndex == DRAWING_MAX_COUNT )
    {
        tempIndex = 0;
    }
    
    return tempIndex;
}

function getTempDrawing()
{
    return gTempShowtraceDrawing;
}

function getPrevDrawing()
{
    gDrawingIndex = getPrevDrawIndex();
    return gDrawingHistory[gDrawingIndex];
}

function existDrawing( index )
{
    return gDrawingHistory[index] != null;
}

function getNextDrawing()
{
    gDrawingIndex = getNextDrawIndex();
    return gDrawingHistory[gDrawingIndex];
}


// about DOM


// get a random number ( 0 ~ range ) .
function getRandom( range )
{
    return parseInt( Math.random() * range );
}

function getRandomColor()
{
    var r = getRandom( 220 ) + 20;
    var g = getRandom( 220 ) + 20;
    var b = getRandom( 220 ) + 20;

    return "#" + r.toString( 16 ) + g.toString( 16 ) + b.toString( 16 );
}

// get color by index
function getColor( iAmount, index )
{
    var iBegin = 100;
    var iBase = Math.floor( iAmount / 3 );
    var iMultiple = Math.floor( ( 230 - iBegin ) / iBase );

    var r = iBegin + iMultiple * index;
    var g = iBegin + iMultiple * index;
    var b = iBegin + iMultiple * index;
    
    if ( index < iBase )
    {
        r = iBegin + iMultiple * index;
        g = iBegin;
        b = iBegin;
    }
    else if ( index < iBase * 2 )
    {
        r = iBegin;
        g = iBegin + iMultiple * ( index - iBase );
        b = iBegin;
    }
    else
    {
        r = iBegin;
        g = iBegin;
        b = iBegin + iMultiple * ( index - iBase * 2 );
    }

    return "#" + r.toString( 16 ) + g.toString( 16 ) + b.toString( 16 );
}

// get the max and min coordinates for the drawing
function getExtremePosData( penHistory )
{
    var motions = penHistory.split( MOTION_GAP );
    
    var minX = 10000;
    var maxX = 0;
    var minY = 10000;
    var maxY = 0;

    // find the left-top and right-buttom
    for ( var i = 0; i < motions.length; i ++ )
    {
        var tokens = motions[i].split( TOKEN_GAP );
        var type = parseInt( tokens[0] );

        // find drawing only
        if ( type == TYPE_PEN_LINE )
        {
            var x = parseInt( tokens[1] );
            var y = parseInt( tokens[2] );
            var destX = parseInt( tokens[3] );
            var destY = parseInt( tokens[4] );

            //if ( x != destX && y != destY )
            {
                minX = x < minX ? x : minX;
                maxX = x > maxX ? x : maxX;

                minY = y < minY ? y : minY;
                maxY = y > maxY ? y : maxY;
            }
        }
    }

    return new ExtremePosData( minX, minY, maxX, maxY );
}


function getColorHistory( color )
{
    return color;
}

function encodeText( text )
{
    return encodeURIComponent( text );
}

function decodeText( text )
{
    return decodeURIComponent( text );
}


function getNumberHistory( number )
{
    if ( number == 2 )
    {
        return "21 black white 10 20,10 337 228 333 228,10 343 228 337 228,10 351 228 343 228,10 373 228 351 228,10 390 233 373 228,10 404 242 390 233,10 408 248 404 242,10 410 255 408 248,10 412 263 410 255,10 413 272 412 263,10 413 282 413 272,10 412 292 413 282,10 405 307 412 292,10 396 318 405 307,10 390 325 396 318,10 382 335 390 325,10 373 344 382 335,10 366 352 373 344,10 360 358 366 352,10 353 363 360 358,10 349 365 353 363,10 345 367 349 365,10 341 369 345 367,10 339 371 341 369,10 335 373 339 371,10 333 375 335 373,10 330 377 333 375,10 329 378 330 377,10 328 378 329 378,10 328 379 328 378,10 327 380 328 379,10 328 380 327 380,10 334 380 328 380,10 342 378 334 380,10 352 376 342 378,10 364 373 352 376,10 375 371 364 373,10 386 370 375 371,10 395 370 386 370,10 403 370 395 370,10 409 370 403 370,10 413 370 409 370,10 417 371 413 370,10 420 372 417 371,10 422 372 420 372,10 423 373 422 372,10 424 373 423 373,10 425 373 424 373,_10 104 731 104 731,_";
    }

}

function getLogo( iLogoIndex )
{
    if ( iLogoIndex == MAIN_LOGO )
    {
        return getMainLogo();
    }
    else if ( iLogoIndex == APP_LOGO )
    {
        return getAppLogo();
    }
    else if ( iLogoIndex == AUTHOR_LOGO )
    {
        return getAuthorLogo();
    }
    else
    {
        showAlert( "Error logoIndex : " + iLogoIndex );
    }
}

function getMainLogo()
{    
    return "21 #000000 #e64767 35 73 100 55 85 12-21 #000000 #c09d50 35 73 100 55 85 12-10 73 72 59 65 1-10 80 76 73 72 1-10 85 79 80 76 1-10 93 82 85 79 1-10 102 86 93 82 1-10 109 89 102 86 1-10 116 94 109 89 1-10 121 97 116 94 1-10 125 100 121 97 1-10 132 105 125 100 1-10 136 107 132 105 1-10 139 111 136 107 1-10 141 113 139 111 1-10 143 115 141 113 1-10 143 117 143 115 1-10 146 124 143 117 1-10 150 136 146 124 1-10 150 136 150 136 1_21 #000000 #e768bc 35 73 100 55 85 12-10 70 177 64 175 1-10 78 179 70 177 1-10 83 180 78 179 1-10 91 182 83 180 1-10 97 184 91 182 1-10 101 186 97 184 1-10 107 188 101 186 1-10 111 191 107 188 1-10 113 191 111 191 1-10 115 193 113 191 1-10 117 197 115 193 1-10 118 199 117 197 1-10 118 199 118 199 1_21 #000000 #dd2e46 35 73 100 55 85 12-10 38 301 31 305 1-10 51 294 38 301 1-10 62 289 51 294 1-10 71 283 62 289 1-10 79 278 71 283 1-10 89 273 79 278 1-10 97 269 89 273 1-10 110 263 97 269 1-10 123 258 110 263 1-10 123 258 123 258 1_10 279 57 284 50 1-10 269 69 279 57 1-10 263 78 269 69 1-10 255 87 263 78 1-10 247 96 255 87 1-10 241 102 247 96 1-10 235 109 241 102 1-10 229 115 235 109 1-10 225 119 229 115 1-10 221 123 225 119 1-10 219 125 221 123 1-10 218 127 219 125 1-10 218 127 218 127 1_21 #000000 #b3c346 35 73 100 55 85 12-10 314 61 307 56 1-10 325 67 314 61 1-10 332 71 325 67 1-10 343 77 332 71 1-10 351 81 343 77 1-10 364 88 351 81 1-10 373 94 364 88 1-10 384 101 373 94 1-10 394 105 384 101 1-10 404 111 394 105 1-10 416 119 404 111 1-10 423 123 416 119 1-10 430 128 423 123 1-10 437 133 430 128 1-10 440 137 437 133 1-10 444 141 440 137 1-10 447 145 444 141 1-10 448 147 447 145 1-10 448 149 448 147 1-10 448 149 448 149 1_21 #000000 #298156 35 73 100 55 85 12-10 270 151 259 151 1-10 284 151 270 151 1-10 295 151 284 151 1-10 309 151 295 151 1-10 323 150 309 151 1-10 334 151 323 150 1-10 343 151 334 151 1-10 354 150 343 151 1-10 363 150 354 150 1-10 368 150 363 150 1-10 373 151 368 150 1-10 375 151 373 151 1-10 375 151 375 151 1_21 #000000 #c549bc 35 73 100 55 85 12-10 231 210 217 212 1-10 243 209 231 210 1-10 257 207 243 209 1-10 271 206 257 207 1-10 284 205 271 206 1-10 296 205 284 205 1-10 308 204 296 205 1-10 323 204 308 204 1-10 332 203 323 204 1-10 343 203 332 203 1-10 351 204 343 203 1-10 357 204 351 204 1-10 365 204 357 204 1-10 367 204 365 204 1-10 373 203 367 204 1-10 378 203 373 203 1-10 378 203 378 203 1_21 #000000 #d76746 35 73 100 55 85 12-10 320 198 319 189 1-10 321 209 320 198 1-10 321 214 321 209 1-10 321 226 321 214 1-10 322 235 321 226 1-10 323 246 322 235 1-10 323 251 323 246 1-10 324 260 323 251 1-10 324 269 324 260 1-10 324 275 324 269 1-10 324 283 324 275 1-10 324 288 324 283 1-10 324 293 324 288 1-10 324 295 324 293 1-10 324 295 324 295 1_21 #000000 #31e5eb 35 73 100 55 85 12-10 274 251 285 246 1-10 267 257 274 251 1-10 257 261 267 257 1-10 245 264 257 261 1-10 237 269 245 264 1-10 222 277 237 269 1-10 209 281 222 277 1-10 195 284 209 281 1-10 193 285 195 284 1-10 186 285 193 285 1-10 185 285 186 285 1-10 185 285 185 285 1_21 #000000 #cb8216 35 73 100 55 85 12-10 365 259 360 257 1-10 372 263 365 259 1-10 385 270 372 263 1-10 402 279 385 270 1-10 411 283 402 279 1-10 419 286 411 283 1-10 427 289 419 286 1-10 435 293 427 289 1-10 453 304 435 293 1-10 459 307 453 304 1-10 463 310 459 307 1-10 470 315 463 310 1-10 472 317 470 315 1-10 472 317 472 317 1_21 #000000 #e086ed 35 73 100 55 85 12-10 166 415 154 417 1-10 179 413 166 415 1-10 193 413 179 413 1-10 207 412 193 413 1-10 219 410 207 412 1-10 237 408 219 410 1-10 249 407 237 408 1-10 264 405 249 407 1-10 279 403 264 405 1-10 293 401 279 403 1-10 305 400 293 401 1-10 320 399 305 400 1-10 331 396 320 399 1-10 339 395 331 396 1-10 351 393 339 395 1-10 359 393 351 393 1-10 364 391 359 393 1-10 369 390 364 391 1-10 369 390 369 390 1_21 #000000 #e49495 35 73 100 55 85 12-10 253 351 253 343 1-10 253 362 253 351 1-10 253 371 253 362 1-10 253 382 253 371 1-10 253 393 253 382 1-10 253 404 253 393 1-10 252 413 253 404 1-10 251 425 252 413 1-10 251 434 251 425 1-10 250 443 251 434 1-10 249 451 250 443 1-10 248 457 249 451 1-10 247 466 248 457 1-10 246 468 247 466 1-10 246 468 246 468 1_21 #000000 #915454 35 73 100 55 85 12-10 107 511 95 511 1-10 119 511 107 511 1-10 137 509 119 511 1-10 154 508 137 509 1-10 169 505 154 508 1-10 189 503 169 505 1-10 205 501 189 503 1-10 224 499 205 501 1-10 244 498 224 499 1-10 261 498 244 498 1-10 281 499 261 498 1-10 298 497 281 499 1-10 316 497 298 497 1-10 333 496 316 497 1-10 351 497 333 496 1-10 368 497 351 497 1-10 383 497 368 497 1-10 397 497 383 497 1-10 414 498 397 497 1-10 423 498 414 498 1-10 435 497 423 498 1-10 446 497 435 497 1-10 458 497 446 497 1-10 469 497 458 497 1-10 474 495 469 497 1-10 485 494 474 495 1-10 498 493 485 494 1-10 498 493 498 493 1_21 #000000 #2e2cd9 35 73 100 55 85 12-10 599 113 581 114 1-10 615 110 599 113 1-10 639 107 615 110 1-10 656 104 639 107 1-10 670 101 656 104 1-10 688 98 670 101 1-10 703 96 688 98 1-10 717 94 703 96 1-10 731 93 717 94 1-10 742 91 731 93 1-10 751 91 742 91 1-10 756 91 751 91 1-10 765 91 756 91 1-10 766 91 765 91 1-10 766 91 766 91 1_21 #000000 #bcc71d 35 73 100 55 85 12-10 633 132 641 123 1-10 623 142 633 132 1-10 614 150 623 142 1-10 601 163 614 150 1-10 593 170 601 163 1-10 582 181 593 170 1-10 573 191 582 181 1-10 567 199 573 191 1-10 559 207 567 199 1-10 555 211 559 207 1-10 552 215 555 211 1-10 551 217 552 215 1-10 551 219 551 217 1-10 549 220 551 219 1-10 549 222 549 220 1-10 551 224 549 222 1-10 552 225 551 224 1-10 557 227 552 225 1-10 569 229 557 227 1-10 580 230 569 229 1-10 595 229 580 230 1-10 610 227 595 229 1-10 624 225 610 227 1-10 639 223 624 225 1-10 654 221 639 223 1-10 669 219 654 221 1-10 686 215 669 219 1-10 700 213 686 215 1-10 711 211 700 213 1-10 723 208 711 211 1-10 734 207 723 208 1-10 745 204 734 207 1-10 753 203 745 204 1-10 762 201 753 203 1-10 767 198 762 201 1-10 767 198 767 198 1_21 #000000 #ce6533 35 73 100 55 85 12-10 714 145 715 136 1-10 712 163 714 145 1-10 710 174 712 163 1-10 708 189 710 174 1-10 706 209 708 189 1-10 703 227 706 209 1-10 701 245 703 227 1-10 697 265 701 245 1-10 695 285 697 265 1-10 691 303 695 285 1-10 688 324 691 303 1-10 685 344 688 324 1-10 681 365 685 344 1-10 679 383 681 365 1-10 677 400 679 383 1-10 675 415 677 400 1-10 674 430 675 415 1-10 673 442 674 430 1-10 671 453 673 442 1-10 670 461 671 453 1-10 669 471 670 461 1-10 669 479 669 471 1-10 668 480 669 479 1-10 667 482 668 480 1-10 665 487 667 482 1-10 663 489 665 487 1-10 660 493 663 489 1-10 657 497 660 493 1-10 651 499 657 497 1-10 643 501 651 499 1-10 635 501 643 501 1-10 623 499 635 501 1-10 612 497 623 499 1-10 600 494 612 497 1-10 586 490 600 494 1-10 577 488 586 490 1-10 566 484 577 488 1-10 558 481 566 484 1-10 547 477 558 481 1-10 539 473 547 477 1-10 532 469 539 473 1-10 521 463 532 469 1-10 521 463 521 463 1_21 #000000 #5b2a85 35 73 100 55 85 12-10 649 299 657 287 1-10 643 305 649 299 1-10 633 316 643 305 1-10 623 326 633 316 1-10 612 337 623 326 1-10 596 349 612 337 1-10 583 359 596 349 1-10 571 369 583 359 1-10 555 380 571 369 1-10 540 391 555 380 1-10 529 399 540 391 1-10 517 409 529 399 1-10 507 415 517 409 1-10 499 420 507 415 1-10 492 425 499 420 1-10 491 426 492 425 1-10 491 426 491 426 1_21 #000000 #669b43 35 73 100 55 85 12-10 913 79 925 73 1-10 901 84 913 79 1-10 889 90 901 84 1-10 875 97 889 90 1-10 861 103 875 97 1-10 849 107 861 103 1-10 836 112 849 107 1-10 825 116 836 112 1-10 814 121 825 116 1-10 806 125 814 121 1-10 798 128 806 125 1-10 790 132 798 128 1-10 785 135 790 132 1-10 781 137 785 135 1-10 779 138 781 137 1-10 777 139 779 138 1-10 775 141 777 139 1-10 775 141 775 141 1_21 #000000 #a6e6db 35 73 100 55 85 12-10 837 188 836 177 1-10 837 197 837 188 1-10 837 209 837 197 1-10 837 220 837 209 1-10 837 232 837 220 1-10 837 247 837 232 1-10 836 258 837 247 1-10 835 273 836 258 1-10 835 287 835 273 1-10 834 299 835 287 1-10 834 313 834 299 1-10 834 322 834 313 1-10 834 334 834 322 1-10 835 342 834 334 1-10 835 350 835 342 1-10 837 355 835 350 1-10 838 357 837 355 1-10 839 362 838 357 1-10 839 362 839 362 1_21 #000000 #7fb9e6 35 73 100 55 85 12-10 854 170 839 173 1-10 872 166 854 170 1-10 892 162 872 166 1-10 914 157 892 162 1-10 935 153 914 157 1-10 960 148 935 153 1-10 981 144 960 148 1-10 1001 140 981 144 1-10 1018 137 1001 140 1-10 1036 134 1018 137 1-10 1051 133 1036 134 1-10 1069 131 1051 133 1-10 1083 130 1069 131 1-10 1091 130 1083 130 1-10 1097 130 1091 130 1-10 1103 131 1097 130 1-10 1108 132 1103 131 1-10 1109 133 1108 132 1-10 1111 133 1109 133 1-10 1115 137 1111 133 1-10 1116 138 1115 137 1-10 1118 143 1116 138 1-10 1119 147 1118 143 1-10 1119 153 1119 147 1-10 1117 161 1119 153 1-10 1116 167 1117 161 1-10 1112 175 1116 167 1-10 1108 183 1112 175 1-10 1104 191 1108 183 1-10 1099 199 1104 191 1-10 1094 206 1099 199 1-10 1089 213 1094 206 1-10 1084 219 1089 213 1-10 1081 223 1084 219 1-10 1077 227 1081 223 1-10 1077 227 1077 227 1_21 #000000 #c5e51e 35 73 100 55 85 12-10 922 226 908 230 1-10 939 222 922 226 1-10 957 219 939 222 1-10 971 218 957 219 1-10 986 217 971 218 1-10 1001 215 986 217 1-10 1011 214 1001 215 1-10 1023 213 1011 214 1-10 1031 213 1023 213 1-10 1033 213 1031 213 1-10 1039 214 1033 213 1-10 1039 214 1039 214 1_21 #000000 #86e516 35 73 100 55 85 12-10 887 288 873 291 1-10 903 285 887 288 1-10 919 282 903 285 1-10 934 279 919 282 1-10 952 276 934 279 1-10 969 273 952 276 1-10 984 271 969 273 1-10 999 269 984 271 1-10 1011 268 999 269 1-10 1029 267 1011 268 1-10 1040 265 1029 267 1-10 1049 265 1040 265 1-10 1061 265 1049 265 1-10 1061 265 1061 265 1_21 #000000 #9eeab7 35 73 100 55 85 12-10 927 333 915 335 1-10 941 331 927 333 1-10 956 328 941 331 1-10 970 325 956 328 1-10 984 324 970 325 1-10 995 323 984 324 1-10 1007 322 995 323 1-10 1009 322 1007 322 1-10 1017 323 1009 322 1-10 1026 324 1017 323 1-10 1039 327 1026 324 1-10 1039 327 1039 327 1_21 #000000 #d1949c 35 73 100 55 85 12-10 870 398 853 402 1-10 889 393 870 398 1-10 911 389 889 393 1-10 931 385 911 389 1-10 954 383 931 385 1-10 971 380 954 383 1-10 992 379 971 380 1-10 1009 377 992 379 1-10 1026 377 1009 377 1-10 1041 376 1026 377 1-10 1053 378 1041 376 1-10 1063 379 1053 378 1-10 1072 382 1063 379 1-10 1083 387 1072 382 1-10 1087 389 1083 387 1-10 1095 394 1087 389 1-10 1098 399 1095 394 1-10 1103 409 1098 399 1-10 1105 413 1103 409 1-10 1107 422 1105 413 1-10 1109 433 1107 422 1-10 1109 438 1109 433 1-10 1108 451 1109 438 1-10 1107 459 1108 451 1-10 1105 467 1107 459 1-10 1103 476 1105 467 1-10 1100 485 1103 476 1-10 1096 499 1100 485 1-10 1093 504 1096 499 1-10 1089 513 1093 504 1-10 1085 521 1089 513 1-10 1083 526 1085 521 1-10 1079 534 1083 526 1-10 1077 538 1079 534 1-10 1074 543 1077 538 1-10 1073 545 1074 543 1-10 1068 549 1073 545 1-10 1063 550 1068 549 1-10 1063 550 1063 550 1_21 #000000 #939827 35 73 100 55 85 12-10 756 455 752 447 1-10 759 460 756 455 1-10 761 465 759 460 1-10 775 483 761 465 1-10 787 497 775 483 1-10 793 501 787 497 1-10 793 501 793 501 1_21 #000000 #627b7d 35 73 100 55 85 12-10 871 470 869 461 1-10 873 475 871 470 1-10 874 480 873 475 1-10 876 485 874 480 1-10 877 489 876 485 1-10 879 494 877 489 1-10 881 499 879 494 1-10 882 499 881 499 1-10 883 501 882 499 1-10 884 503 883 501 1-10 885 504 884 503 1-10 885 504 885 504 1_21 #000000 #39d790 35 73 100 55 85 12-10 940 474 939 465 1-10 940 479 940 474 1-10 941 488 940 479 1-10 941 493 941 488 1-10 941 498 941 493 1-10 941 500 941 498 1-10 942 506 941 500 1-10 943 508 942 506 1-10 943 509 943 508 1-10 944 511 943 509 1-10 944 511 944 511 1-_21 #000000 #da15c9 35 73 100 55 85 12-10 1019 458 1017 447 1-10 1020 463 1019 458 1-10 1021 472 1020 463 1-10 1021 478 1021 472 1-10 1022 480 1021 478 1-10 1023 489 1022 480 1-10 1023 494 1023 489 1-10 1023 499 1023 494 1-10 1024 504 1023 499 1-10 1025 509 1024 504 1-10 1025 511 1025 509 1-10 1025 511 1025 511 1-__";
}

function getAppLogo()
{
    return "www.a21 #000000 #31c37f 16 50 47 23 257 12-21 #000000 #e01e5f 16 50 47 23 257 12-10 68 236 65 165 1-10 68 247 68 236 1-10 69 259 68 247 1-10 70 297 69 259 1-10 70 314 70 297 1-10 70 322 70 314 1-10 70 333 70 322 1-10 69 341 70 333 1-10 69 351 69 341 1-10 69 353 69 351 1-10 69 355 69 353 1-10 70 357 69 355 1-10 70 359 70 357 1-10 70 359 70 359 1_21 #000000 #1b721c 16 50 47 23 257 12-10 157 191 163 185 1-10 151 197 157 191 1-10 142 205 151 197 1-10 133 212 142 205 1-10 128 217 133 212 1-10 121 224 128 217 1-10 113 231 121 224 1-10 109 235 113 231 1-10 98 244 109 235 1-10 92 250 98 244 1-10 89 253 92 250 1-10 87 255 89 253 1-10 86 256 87 255 1-10 83 259 86 256 1-10 82 260 83 259 1-10 81 262 82 260 1-10 79 263 81 262 1-10 79 264 79 263 1-10 79 266 79 264 1-10 79 269 79 266 1-10 79 271 79 269 1-10 79 273 79 271 1-10 79 275 79 273 1-10 82 279 79 275 1-10 85 283 82 279 1-10 89 288 85 283 1-10 92 291 89 288 1-10 97 297 92 291 1-10 99 299 97 297 1-10 105 305 99 299 1-10 107 305 105 305 1-10 112 309 107 305 1-10 116 312 112 309 1-10 119 316 116 312 1-10 121 317 119 316 1-10 125 321 121 317 1-10 127 321 125 321 1-10 132 324 127 321 1-10 134 325 132 324 1-10 140 326 134 325 1-10 148 327 140 326 1-10 160 329 148 327 1-10 160 329 160 329 1_21 #000000 #723244 16 50 47 23 257 12-10 215 297 209 298 1-10 221 296 215 297 1-10 230 294 221 296 1-10 238 292 230 294 1-10 246 289 238 292 1-10 248 289 246 289 1-10 253 287 248 289 1-10 261 283 253 287 1-10 263 282 261 283 1-10 267 279 263 282 1-10 271 275 267 279 1-10 272 274 271 275 1-10 276 270 272 274 1-10 279 265 276 270 1-10 281 260 279 265 1-10 283 255 281 260 1-10 283 250 283 255 1-10 282 244 283 250 1-10 280 239 282 244 1-10 275 231 280 239 1-10 269 226 275 231 1-10 259 221 269 226 1-10 247 218 259 221 1-10 238 217 247 218 1-10 229 217 238 217 1-10 227 217 229 217 1-10 219 219 227 217 1-10 214 220 219 219 1-10 209 223 214 220 1-10 200 229 209 223 1-10 196 232 200 229 1-10 190 239 196 232 1-10 185 246 190 239 1-10 183 254 185 246 1-10 181 259 183 254 1-10 179 271 181 259 1-10 179 277 179 271 1-10 179 285 179 277 1-10 180 294 179 285 1-10 181 299 180 294 1-10 185 307 181 299 1-10 189 313 185 307 1-10 192 317 189 313 1-10 196 321 192 317 1-10 200 325 196 321 1-10 205 327 200 325 1-10 210 330 205 327 1-10 217 333 210 330 1-10 223 334 217 333 1-10 231 334 223 334 1-10 239 334 231 334 1-10 247 333 239 334 1-10 252 331 247 333 1-10 265 326 252 331 1-10 273 321 265 326 1-10 285 315 273 321 1-10 285 315 285 315 1_21 #000000 #ef2be5 16 50 47 23 257 12-10 325 242 322 233 1-10 329 252 325 242 1-10 331 254 329 252 1-10 334 263 331 254 1-10 338 271 334 263 1-10 340 275 338 271 1-10 343 280 340 275 1-10 345 285 343 280 1-10 348 290 345 285 1-10 351 295 348 290 1-10 355 298 351 295 1-10 361 303 355 298 1-10 365 307 361 303 1-10 367 308 365 307 1-10 372 311 367 308 1-10 377 313 372 311 1-10 377 313 377 313 1_21 #000000 #166564 16 50 47 23 257 12-10 443 253 449 240 1-10 439 261 443 253 1-10 431 274 439 261 1-10 421 285 431 274 1-10 410 299 421 285 1-10 397 311 410 299 1-10 386 325 397 311 1-10 371 341 386 325 1-10 355 355 371 341 1-10 340 369 355 355 1-10 325 383 340 369 1-10 310 398 325 383 1-10 297 410 310 398 1-10 285 420 297 410 1-10 273 432 285 420 1-10 265 440 273 432 1-10 259 447 265 440 1-10 252 452 259 447 1-10 248 455 252 452 1-10 247 455 248 455 1-10 247 455 247 455 1_21 #000000 #d765ac 16 50 47 23 257 12-10 477 279 477 277 1-10 481 287 477 279 1-10 483 292 481 287 1-10 485 297 483 292 1-10 487 302 485 297 1-10 491 307 487 302 1-10 493 311 491 307 1-10 499 320 493 311 1-10 499 322 499 320 1-10 503 326 499 322 1-10 505 327 503 326 1-10 506 329 505 327 1-10 507 330 506 329 1-10 507 331 507 330 1-10 508 331 507 331 1-10 509 330 508 331 1-10 511 321 509 330 1-10 513 309 511 321 1-10 515 297 513 309 1-10 515 285 515 297 1-10 517 276 515 285 1-10 518 265 517 276 1-10 520 257 518 265 1-10 520 255 520 257 1-10 521 249 520 255 1-10 522 237 521 249 1-10 522 236 522 237 1-10 522 235 522 236 1-10 522 235 522 235 1-10 522 235 522 235 1-10 527 241 522 235 1-10 530 246 527 241 1-10 535 259 530 246 1-10 543 280 535 259 1-10 550 295 543 280 1-10 554 305 550 295 1-10 556 310 554 305 1-10 559 317 556 310 1-10 561 321 559 317 1-10 561 321 561 321 1-10 563 323 561 321 1-10 564 321 563 323 1-10 569 315 564 321 1-10 574 305 569 315 1-10 581 289 574 305 1-10 588 259 581 289 1-10 589 258 588 259 1-10 593 247 589 258 1-10 593 245 593 247 1-10 595 236 593 245 1-10 596 231 595 236 1-10 597 229 596 231 1-10 597 229 597 229 1_21 #000000 #e2503c 16 50 47 23 257 12-10 632 284 635 274 1-10 654 335 632 284 1-10 659 337 654 335 1-10 668 338 659 337 1-10 677 337 668 338 1-10 689 337 677 337 1-10 705 331 689 337 1-10 732 303 705 331 1-10 734 299 732 303 1-10 737 281 734 299 1-10 736 276 737 281 1-10 735 271 736 276 1-10 731 263 735 271 1-10 728 259 731 263 1-10 725 255 728 259 1-10 721 251 725 255 1-10 715 249 721 251 1-10 707 245 715 249 1-10 699 243 707 245 1-10 691 241 699 243 1-10 683 241 691 241 1-10 677 241 683 241 1-10 669 243 677 241 1-10 663 243 669 243 1-10 658 244 663 243 1-10 649 247 658 244 1-10 645 249 649 247 1-10 643 249 645 249 1-10 639 251 643 249 1-10 637 253 639 251 1-10 635 254 637 253 1-10 634 255 635 254 1-10 634 256 634 255 1-10 634 256 634 256 1_21 #000000 #805f4a 16 50 47 23 257 12-10 776 235 776 230 1-10 775 243 776 235 1-10 775 249 775 243 1-10 775 255 775 249 1-10 774 272 775 255 1-10 774 278 774 272 1-10 773 287 774 278 1-10 773 292 773 287 1-10 772 301 773 292 1-10 772 305 772 301 1-10 771 311 772 305 1-10 771 312 771 311 1-10 771 315 771 312 1-10 771 316 771 315 1-10 771 317 771 316 1-10 771 318 771 317 1-10 771 319 771 318 1-10 771 319 771 319 1-10 771 319 771 319 1-10 773 314 771 319 1-10 778 307 773 314 1-10 783 297 778 307 1-10 787 292 783 297 1-10 793 282 787 292 1-10 798 275 793 282 1-10 801 271 798 275 1-10 806 265 801 271 1-10 810 261 806 265 1-10 814 257 810 261 1-10 819 254 814 257 1-10 820 253 819 254 1-10 825 250 820 253 1-10 830 247 825 250 1-10 835 246 830 247 1-10 840 245 835 246 1-10 848 243 840 245 1-10 853 242 848 243 1-10 862 241 853 242 1-10 870 241 862 241 1-10 883 241 870 241 1-10 883 241 883 241 1_21 #000000 #d31449 16 50 47 23 257 12-10 975 142 975 133 1-10 974 151 975 142 1-10 973 162 974 151 1-10 973 171 973 162 1-10 973 181 973 171 1-10 972 189 973 181 1-10 971 201 972 189 1-10 971 210 971 201 1-10 971 222 971 210 1-10 972 231 971 222 1-10 972 239 972 231 1-10 973 259 972 239 1-10 973 271 973 259 1-10 973 276 973 271 1-10 972 281 973 276 1-10 972 291 972 281 1-10 972 295 972 291 1-10 972 301 972 295 1-10 972 303 972 301 1-10 972 307 972 303 1-10 972 308 972 307 1-10 972 309 972 308 1-10 972 309 972 309 1-10 971 304 972 309 1-10 968 297 971 304 1-10 965 291 968 297 1-10 961 283 965 291 1-10 957 276 961 283 1-10 954 272 957 276 1-10 951 268 954 272 1-10 947 263 951 268 1-10 941 257 947 263 1-10 940 257 941 257 1-10 935 253 940 257 1-10 929 251 935 253 1-10 921 249 929 251 1-10 916 248 921 249 1-10 911 247 916 248 1-10 906 247 911 247 1-10 903 247 906 247 1-10 899 249 903 247 1-10 894 253 899 249 1-10 893 254 894 253 1-10 889 258 893 254 1-10 885 263 889 258 1-10 882 270 885 263 1-10 880 275 882 270 1-10 879 281 880 275 1-10 878 289 879 281 1-10 878 298 878 289 1-10 879 303 878 298 1-10 880 312 879 303 1-10 881 317 880 312 1-10 883 323 881 317 1-10 887 327 883 323 1-10 890 331 887 327 1-10 897 336 890 331 1-10 905 339 897 336 1-10 916 341 905 339 1-10 928 339 916 341 1-10 945 335 928 339 1-10 964 327 945 335 1-10 977 323 964 327 1-10 989 318 977 323 1-10 989 318 989 318 1__20 1-21 #000000 #3b5334 16 50 47 23 257 12-10 43 123 45 114 1-10 39 137 43 123 1-10 38 147 39 137 1-10 36 159 38 147 1-10 35 170 36 159 1-10 34 185 35 170 1-10 32 197 34 185 1-10 30 211 32 197 1-10 27 234 30 211 1-10 23 258 27 234 1-10 21 269 23 258 1-10 19 280 21 269 1-10 16 291 19 280 1-10 14 303 16 291 1-10 11 313 14 303 1-10 9 322 11 313 1-10 7 331 9 322 1-10 7 333 7 331 1-10 7 335 7 333 1-10 6 337 7 335 1-10 6 338 6 337 1-10 6 338 6 338 1_21 #000000 #1c52b6 16 50 47 23 257 12-10 61 161 60 151 1-10 63 169 61 161 1-10 64 181 63 169 1-10 65 191 64 181 1-10 67 203 65 191 1-10 69 214 67 203 1-10 71 226 69 214 1-10 73 237 71 226 1-10 75 249 73 237 1-10 77 261 75 249 1-10 78 269 77 261 1-10 79 281 78 269 1-10 79 289 79 281 1-10 80 297 79 289 1-10 80 309 80 297 1-10 80 311 80 309 1-10 79 316 80 311 1-10 79 321 79 316 1-10 79 323 79 321 1-10 79 323 79 323 1_21 #000000 #369dab 16 50 47 23 257 12-10 53 294 39 296 1-10 67 293 53 294 1-10 67 293 67 293 1_21 #000000 #4d3358 16 50 47 23 257 12-10 115 277 115 268 1-10 113 288 115 277 1-10 113 299 113 288 1-10 112 311 113 299 1-10 111 323 112 311 1-10 111 335 111 323 1-10 111 346 111 335 1-10 110 358 111 346 1-10 110 369 110 358 1-10 109 379 110 369 1-10 109 390 109 379 1-10 109 399 109 390 1-10 109 403 109 399 1-10 109 408 109 403 1-10 109 411 109 408 1-10 109 415 109 411 1-10 109 416 109 415 1-10 109 417 109 416 1-10 109 417 109 417 1_21 #000000 #c72bb2 16 50 47 23 257 12-10 125 278 117 281 1-10 130 277 125 278 1-10 135 277 130 277 1-10 141 277 135 277 1-10 143 277 141 277 1-10 152 281 143 277 1-10 159 289 152 281 1-10 162 293 159 289 1-10 163 298 162 293 1-10 163 303 163 298 1-10 161 311 163 303 1-10 159 317 161 311 1-10 157 321 159 317 1-10 155 326 157 321 1-10 151 331 155 326 1-10 148 335 151 331 1-10 144 338 148 335 1-10 139 341 144 338 1-10 138 342 139 341 1-10 136 343 138 342 1-10 134 343 136 343 1-10 132 343 134 343 1-10 132 343 132 343 1_21 #000000 #5e499e 16 50 47 23 257 12-10 185 297 187 285 1-10 185 305 185 297 1-10 184 316 185 305 1-10 183 325 184 316 1-10 183 337 183 325 1-10 183 349 183 337 1-10 184 359 183 349 1-10 183 371 184 359 1-10 184 379 183 371 1-10 184 417 184 379 1-10 184 423 184 417 1-10 184 427 184 423 1-10 184 427 184 427 1-10 184 427 184 427 1_21 #000000 #9bd080 16 50 47 23 257 12-10 206 274 200 275 1-10 214 274 206 274 1-10 227 278 214 274 1-10 239 284 227 278 1-10 247 291 239 284 1-10 251 295 247 291 1-10 253 302 251 295 1-10 255 313 253 302 1-10 251 320 255 313 1-10 248 324 251 320 1-10 237 333 248 324 1-10 226 337 237 333 1-10 221 338 226 337 1-10 215 339 221 338 1-10 209 340 215 339 1-10 204 340 209 340 1-10 203 340 204 340 1-10 203 340 203 340 1_21 #000000 #a29cca 16 50 47 23 257 12-10 369 143 361 144 1-10 378 142 369 143 1-10 387 141 378 142 1-10 395 141 387 141 1-10 404 139 395 141 1-10 413 139 404 139 1-10 421 139 413 139 1-10 427 139 421 139 1-10 432 140 427 139 1-10 437 140 432 140 1-10 439 141 437 140 1-10 444 141 439 141 1-10 446 141 444 141 1-10 448 142 446 141 1-10 448 142 448 142 1_21 #000000 #89e317 16 50 47 23 257 12-10 354 167 355 161 1-10 353 179 354 167 1-10 352 188 353 179 1-10 351 200 352 188 1-10 350 209 351 200 1-10 349 223 350 209 1-10 349 233 349 223 1-10 349 247 349 233 1-10 349 255 349 247 1-10 349 277 349 255 1-10 349 289 349 277 1-10 349 297 349 289 1-10 349 305 349 297 1-10 349 314 349 305 1-10 349 319 349 314 1-10 350 324 349 319 1-10 350 330 350 324 1-10 350 331 350 330 1-10 350 332 350 331 1-10 350 334 350 332 1-10 350 334 350 334 1_21 #000000 #43afe5 16 50 47 23 257 12-10 370 277 365 278 1-10 378 274 370 277 1-10 383 273 378 274 1-10 391 271 383 273 1-10 397 271 391 271 1-10 405 269 397 271 1-10 411 269 405 269 1-10 416 268 411 269 1-10 421 267 416 268 1-10 421 267 421 267 1_21 #000000 #d7ab14 16 50 47 23 257 12-10 444 273 445 264 1-10 444 278 444 273 1-10 443 289 444 278 1-10 442 295 443 289 1-10 441 303 442 295 1-10 440 312 441 303 1-10 440 315 440 312 1-10 439 323 440 315 1-10 439 329 439 323 1-10 439 333 439 329 1-10 439 335 439 333 1-10 439 337 439 335 1-10 439 337 439 337 1-10 439 338 439 337 1-10 439 339 439 338 1-10 439 337 439 339 1-10 442 329 439 337 1-10 446 321 442 329 1-10 449 316 446 321 1-10 453 309 449 316 1-10 458 302 453 309 1-10 461 297 458 302 1-10 464 294 461 297 1-10 465 292 464 294 1-10 469 288 465 292 1-10 473 284 469 288 1-10 474 283 473 284 1-10 475 281 474 283 1-10 479 277 475 281 1-10 501 271 479 277 1-10 501 271 501 271 1_21 #000000 #652631 16 50 47 23 257 12-10 535 278 540 277 1-10 527 281 535 278 1-10 522 283 527 281 1-10 514 287 522 283 1-10 509 290 514 287 1-10 503 295 509 290 1-10 499 299 503 295 1-10 498 301 499 299 1-10 494 305 498 301 1-10 491 309 494 305 1-10 489 314 491 309 1-10 487 318 489 314 1-10 487 323 487 318 1-10 487 325 487 323 1-10 487 331 487 325 1-10 487 333 487 331 1-10 488 335 487 333 1-10 491 339 488 335 1-10 493 341 491 339 1-10 494 341 493 341 1-10 499 343 494 341 1-10 504 344 499 343 1-10 512 342 504 344 1-10 519 337 512 342 1-10 527 330 519 337 1-10 531 326 527 330 1-10 535 319 531 326 1-10 537 314 535 319 1-10 541 305 537 314 1-10 541 303 541 305 1-10 543 298 541 303 1-10 543 296 543 298 1-10 543 295 543 296 1-10 543 295 543 295 1-10 543 294 543 295 1-10 543 295 543 294 1-10 543 296 543 295 1-10 544 301 543 296 1-10 545 306 544 301 1-10 546 314 545 306 1-10 547 316 546 314 1-10 547 318 547 316 1-10 549 323 547 318 1-10 555 335 549 323 1-10 557 336 555 335 1-10 559 337 557 336 1-10 560 338 559 337 1-10 562 339 560 338 1-10 562 339 562 339 1_21 #000000 #6333ed 16 50 47 23 257 12-10 584 289 585 280 1-10 583 297 584 289 1-10 583 306 583 297 1-10 581 315 583 306 1-10 581 323 581 315 1-10 580 329 581 323 1-10 579 334 580 329 1-10 579 339 579 334 1-10 579 345 579 339 1-10 579 347 579 345 1-10 579 348 579 347 1-10 579 350 579 348 1-10 579 351 579 350 1-10 582 346 579 351 1-10 587 335 582 346 1-10 591 327 587 335 1-10 595 318 591 327 1-10 600 307 595 318 1-10 603 303 600 307 1-10 606 295 603 303 1-10 609 290 606 295 1-10 611 285 609 290 1-10 611 283 611 285 1-10 612 282 611 283 1-10 612 281 612 282 1-10 612 281 612 281 1-10 613 281 612 281 1-10 617 284 613 281 1-10 618 285 617 284 1-10 621 293 618 285 1-10 623 298 621 293 1-10 625 303 623 298 1-10 627 309 625 303 1-10 628 317 627 309 1-10 629 319 628 317 1-10 629 324 629 319 1-10 631 329 629 324 1-10 631 331 631 329 1-10 631 333 631 331 1-10 631 335 631 333 1-10 632 337 631 335 1-10 632 337 632 337 1-10 632 338 632 337 1-10 635 333 632 338 1-10 641 324 635 333 1-10 644 316 641 324 1-10 647 308 644 316 1-10 651 299 647 308 1-10 656 289 651 299 1-10 658 284 656 289 1-10 661 279 658 284 1-10 661 277 661 279 1-10 663 272 661 277 1-10 665 271 663 272 1-10 666 269 665 271 1-10 666 269 666 269 1-10 667 269 666 269 1-10 667 269 667 269 1-10 669 269 667 269 1-10 673 273 669 269 1-10 676 277 673 273 1-10 678 283 676 277 1-10 680 293 678 283 1-10 681 299 680 293 1-10 681 304 681 299 1-10 680 315 681 304 1-10 680 317 680 315 1-10 680 325 680 317 1-10 679 327 680 325 1-10 679 333 679 327 1-10 679 338 679 333 1-10 679 340 679 338 1-10 679 342 679 340 1-10 679 343 679 342 1-10 679 343 679 343 1_21 #000000 #b8aa7c 16 50 47 23 257 12-10 731 328 725 327 1-10 736 329 731 328 1-10 741 329 736 329 1-10 743 329 741 329 1-10 748 328 743 329 1-10 753 327 748 328 1-10 755 326 753 327 1-10 759 324 755 326 1-10 761 323 759 324 1-10 766 321 761 323 1-10 767 319 766 321 1-10 769 318 767 319 1-10 771 317 769 318 1-10 773 312 771 317 1-10 774 311 773 312 1-10 775 309 774 311 1-10 775 304 775 309 1-10 774 302 775 304 1-10 771 297 774 302 1-10 765 291 771 297 1-10 764 290 765 291 1-10 756 285 764 290 1-10 751 284 756 285 1-10 745 283 751 284 1-10 740 283 745 283 1-10 735 283 740 283 1-10 729 284 735 283 1-10 725 285 729 284 1-10 719 289 725 285 1-10 715 291 719 289 1-10 712 295 715 291 1-10 709 300 712 295 1-10 706 304 709 300 1-10 704 309 706 304 1-10 703 315 704 309 1-10 702 320 703 315 1-10 702 322 702 320 1-10 703 328 702 322 1-10 705 333 703 328 1-10 707 338 705 333 1-10 710 343 707 338 1-10 713 347 710 343 1-10 718 350 713 347 1-10 725 355 718 350 1-10 729 357 725 355 1-10 737 359 729 357 1-10 742 361 737 359 1-10 750 361 742 361 1-10 759 361 750 361 1-10 767 359 759 361 1-10 779 356 767 359 1-10 786 352 779 356 1-10 795 345 786 352 1-10 805 337 795 345 1-10 815 329 805 337 1-10 815 329 815 329 1_21 #000000 #4e8dc1 16 50 47 23 257 12-10 814 317 813 311 1-10 815 321 814 317 1-10 817 326 815 321 1-10 819 331 817 326 1-10 821 336 819 331 1-10 824 343 821 336 1-10 827 348 824 343 1-10 827 349 827 348 1-10 829 351 827 349 1-10 829 353 829 351 1-10 831 355 829 353 1-10 831 355 831 355 1-10 831 356 831 355 1-10 832 354 831 356 1-10 835 341 832 354 1-10 837 331 835 341 1-10 839 323 837 331 1-10 840 317 839 323 1-10 842 307 840 317 1-10 843 302 842 307 1-10 843 300 843 302 1-10 845 295 843 300 1-10 846 290 845 295 1-10 847 289 846 290 1-10 847 287 847 289 1-10 847 286 847 287 1-10 847 285 847 286 1-10 847 284 847 285 1-10 849 286 847 284 1-10 853 294 849 286 1-10 855 299 853 294 1-10 857 305 855 299 1-10 861 316 857 305 1-10 863 321 861 316 1-10 865 327 863 321 1-10 869 334 865 327 1-10 870 339 869 334 1-10 873 343 870 339 1-10 873 345 873 343 1-10 875 350 873 345 1-10 875 351 875 350 1-10 876 351 875 351 1-10 876 351 876 351 1-10 877 352 876 351 1-10 879 350 877 352 1-10 884 343 879 350 1-10 887 339 884 343 1-10 891 331 887 339 1-10 893 323 891 331 1-10 896 315 893 323 1-10 898 309 896 315 1-10 901 301 898 309 1-10 904 294 901 301 1-10 905 293 904 294 1-10 905 293 905 293 1_21 #000000 #56c82f 16 50 47 23 257 12-10 916 337 917 333 1-10 915 340 916 337 1-10 915 345 915 340 1-10 915 347 915 345 1-10 916 353 915 347 1-10 918 357 916 353 1-10 919 359 918 357 1-10 923 363 919 359 1-10 927 367 923 363 1-10 933 369 927 367 1-10 937 370 933 369 1-10 946 370 937 370 1-10 948 369 946 370 1-10 956 367 948 369 1-10 961 365 956 367 1-10 965 362 961 365 1-10 968 358 965 362 1-10 973 351 968 358 1-10 975 346 973 351 1-10 977 338 975 346 1-10 977 333 977 338 1-10 977 325 977 333 1-10 977 319 977 325 1-10 975 315 977 319 1-10 971 311 975 315 1-10 968 307 971 311 1-10 963 304 968 307 1-10 959 302 963 304 1-10 953 300 959 302 1-10 948 298 953 300 1-10 943 298 948 298 1-10 937 298 943 298 1-10 932 298 937 298 1-10 930 299 932 298 1-10 925 300 930 299 1-10 923 301 925 300 1-10 921 301 923 301 1-10 919 302 921 301 1-10 917 303 919 302 1-10 915 304 917 303 1-10 914 305 915 304 1-10 913 305 914 305 1-10 913 305 913 305 1_21 #000000 #64556a 16 50 47 23 257 12-10 999 298 999 293 1-10 999 303 999 298 1-10 999 309 999 303 1-10 1000 314 999 309 1-10 1000 320 1000 314 1-10 1002 338 1000 320 1-10 1003 343 1002 338 1-10 1003 347 1003 343 1-10 1003 349 1003 347 1-10 1003 350 1003 349 1-10 1003 351 1003 350 1-10 1004 349 1003 351 1-10 1008 341 1004 349 1-10 1011 334 1008 341 1-10 1017 324 1011 334 1-10 1019 319 1017 324 1-10 1024 314 1019 319 1-10 1036 305 1024 314 1-10 1045 301 1036 305 1-10 1051 300 1045 301 1-10 1053 300 1051 300 1-10 1053 300 1053 300 1_21 #000000 #bc6d97 16 50 47 23 257 12-10 1091 206 1092 192 1-10 1090 211 1091 206 1-10 1089 225 1090 211 1-10 1087 233 1089 225 1-10 1083 266 1087 233 1-10 1083 285 1083 266 1-10 1083 297 1083 285 1-10 1083 315 1083 297 1-10 1087 338 1083 315 1-10 1087 340 1087 338 1-10 1088 346 1087 340 1-10 1088 347 1088 346 1-10 1088 347 1088 347 1_21 #000000 #b86d37 16 50 47 23 257 12-10 1139 285 1143 283 1-10 1134 288 1139 285 1-10 1129 290 1134 288 1-10 1124 293 1129 290 1-10 1119 295 1124 293 1-10 1117 297 1119 295 1-10 1113 300 1117 297 1-10 1111 301 1113 300 1-10 1107 303 1111 301 1-10 1107 303 1107 303 1-10 1107 304 1107 303 1-10 1106 304 1107 304 1-10 1106 305 1106 304 1-10 1105 305 1106 305 1-10 1105 305 1105 305 1-10 1105 306 1105 305 1-10 1105 307 1105 306 1-10 1105 309 1105 307 1-10 1107 313 1105 309 1-10 1110 317 1107 313 1-10 1111 319 1110 317 1-10 1116 323 1111 319 1-10 1121 325 1116 323 1-10 1122 327 1121 325 1-10 1127 329 1122 327 1-10 1129 331 1127 329 1-10 1133 333 1129 331 1-10 1135 334 1133 333 1-10 1137 335 1135 334 1-10 1141 337 1137 335 1-10 1143 337 1141 337 1-10 1143 337 1143 337 1_21 #000000 #4f8781 16 50 47 23 257 12-10 642 436 633 438 1-10 651 435 642 436 1-10 667 434 651 435 1-10 679 434 667 434 1-10 688 435 679 434 1-10 696 436 688 435 1-10 710 439 696 436 1-10 720 441 710 439 1-10 729 446 720 441 1-10 731 447 729 446 1-10 734 451 731 447 1-10 735 453 734 451 1-10 735 459 735 453 1-10 733 467 735 459 1-10 729 476 733 467 1-10 722 485 729 476 1-10 714 493 722 485 1-10 703 502 714 493 1-10 693 509 703 502 1-10 684 515 693 509 1-10 676 521 684 515 1-10 667 528 676 521 1-10 663 531 667 528 1-10 659 535 663 531 1-10 655 538 659 535 1-10 654 538 655 538 1-10 654 539 654 538 1-10 653 539 654 539 1-10 654 539 653 539 1-10 662 538 654 539 1-10 667 537 662 538 1-10 676 536 667 537 1-10 685 535 676 536 1-10 693 535 685 535 1-10 699 535 693 535 1-10 704 534 699 535 1-10 712 533 704 534 1-10 717 533 712 533 1-10 723 533 717 533 1-10 728 534 723 533 1-10 737 533 728 534 1-10 739 532 737 533 1-10 741 531 739 532 1-10 741 531 741 531 1_21 #000000 #d33458 16 50 47 23 257 12-10 793 532 791 531 1-10 795 533 793 532 1-10 796 534 795 533 1-10 797 534 796 534 1-10 797 534 797 534 1_21 #000000 #67189a 16 50 47 23 257 12-10 863 447 863 438 1-10 863 455 863 447 1-10 863 457 863 455 1-10 863 466 863 457 1-10 863 475 863 466 1-10 863 480 863 475 1-10 862 485 863 480 1-10 862 494 862 485 1-10 862 499 862 494 1-10 862 513 862 499 1-10 862 521 862 513 1-10 863 526 862 521 1-10 863 529 863 526 1-10 863 534 863 529 1-10 863 539 863 534 1-10 863 541 863 539 1-10 863 548 863 541 1-10 863 548 863 548 1__20 1-21 #000000 #3fe0c2 16 50 47 23 257 12-10 143 120 145 103 1-10 140 137 143 120 1-10 139 149 140 137 1-10 137 160 139 149 1-10 136 185 137 160 1-10 135 197 136 185 1-10 134 212 135 197 1-10 133 227 134 212 1-10 131 255 133 227 1-10 129 269 131 255 1-10 128 281 129 269 1-10 126 304 128 281 1-10 125 316 126 304 1-10 125 325 125 316 1-10 124 337 125 325 1-10 124 342 124 337 1-10 123 360 124 342 1-10 123 365 123 360 1-10 123 371 123 365 1-10 123 379 123 371 1-10 123 381 123 379 1-10 122 386 123 381 1-10 122 391 122 386 1-10 121 395 122 391 1-10 121 396 121 395 1-10 121 396 121 396 1_21 #000000 #e77bda 16 50 47 23 257 12-10 167 292 158 292 1-10 175 291 167 292 1-10 184 291 175 291 1-10 193 291 184 291 1-10 203 291 193 291 1-10 211 291 203 291 1-10 219 290 211 291 1-10 227 289 219 290 1-10 237 289 227 289 1-10 242 289 237 289 1-10 247 288 242 289 1-10 253 287 247 288 1-10 262 285 253 287 1-10 274 283 262 285 1-10 274 283 274 283 1_21 #000000 #b542a7 16 50 47 23 257 12-10 316 134 319 123 1-10 313 145 316 134 1-10 310 159 313 145 1-10 308 169 310 159 1-10 305 186 308 169 1-10 302 200 305 186 1-10 299 214 302 200 1-10 297 229 299 214 1-10 295 245 297 229 1-10 293 259 295 245 1-10 291 277 293 259 1-10 289 292 291 277 1-10 287 307 289 292 1-10 284 321 287 307 1-10 281 335 284 321 1-10 279 346 281 335 1-10 277 357 279 346 1-10 276 367 277 357 1-10 275 375 276 367 1-10 273 385 275 375 1-10 272 390 273 385 1-10 271 395 272 390 1-10 271 401 271 395 1-10 271 401 271 401 1-10 271 401 271 401 1_21 #000000 #da5d8a 16 50 47 23 257 12-10 388 172 379 172 1-10 397 173 388 172 1-10 417 172 397 173 1-10 425 172 417 172 1-10 434 171 425 172 1-10 442 171 434 171 1-10 451 171 442 171 1-10 459 171 451 171 1-10 465 170 459 171 1-10 476 169 465 170 1-10 485 169 476 169 1-10 490 169 485 169 1-10 495 168 490 169 1-10 497 168 495 168 1-10 502 167 497 168 1-10 504 167 502 167 1-10 504 167 504 167 1_21 #000000 #74d47f 16 50 47 23 257 12-10 448 207 451 195 1-10 446 215 448 207 1-10 441 230 446 215 1-10 437 241 441 230 1-10 434 255 437 241 1-10 431 265 434 255 1-10 427 277 431 265 1-10 424 289 427 277 1-10 421 301 424 289 1-10 419 309 421 301 1-10 418 321 419 309 1-10 417 326 418 321 1-10 415 337 417 326 1-10 415 343 415 337 1-10 414 351 415 343 1-10 414 360 414 351 1-10 414 362 414 360 1-10 414 367 414 362 1-10 414 373 414 367 1-10 414 378 414 373 1-10 414 378 414 378 1_21 #000000 #37bcde 16 50 47 23 257 12-10 564 191 565 186 1-10 561 202 564 191 1-10 558 211 561 202 1-10 555 221 558 211 1-10 552 229 555 221 1-10 545 251 552 229 1-10 543 259 545 251 1-10 540 271 543 259 1-10 539 279 540 271 1-10 537 289 539 279 1-10 535 305 537 289 1-10 534 313 535 305 1-10 533 319 534 313 1-10 533 321 533 319 1-10 533 329 533 321 1-10 533 335 533 329 1-10 532 336 533 335 1-10 532 338 532 336 1-10 532 339 532 338 1-10 532 339 532 339 1_21 #000000 #40ec93 16 50 47 23 257 12-10 573 207 571 195 1-10 573 212 573 207 1-10 575 223 573 212 1-10 575 231 575 223 1-10 577 240 575 231 1-10 577 254 577 240 1-10 578 263 577 254 1-10 578 273 578 263 1-10 579 282 578 273 1-10 580 293 579 282 1-10 581 302 580 293 1-10 581 307 581 302 1-10 582 317 581 307 1-10 583 322 582 317 1-10 584 328 583 322 1-10 585 333 584 328 1-10 586 337 585 333 1-10 586 340 586 337 1-10 587 341 586 340 1-10 587 342 587 341 1-10 587 343 587 342 1-10 587 344 587 343 1-10 589 343 587 344 1-10 597 339 589 343 1-10 605 329 597 339 1-10 613 320 605 329 1-10 620 310 613 320 1-10 627 300 620 310 1-10 635 287 627 300 1-10 644 275 635 287 1-10 651 265 644 275 1-10 660 253 651 265 1-10 667 243 660 253 1-10 675 232 667 243 1-10 683 223 675 232 1-10 691 213 683 223 1-10 698 205 691 213 1-10 705 195 698 205 1-10 710 188 705 195 1-10 715 181 710 188 1-10 721 174 715 181 1-10 726 167 721 174 1-10 729 163 726 167 1-10 731 161 729 163 1-10 732 160 731 161 1-10 733 158 732 160 1-10 734 157 733 158 1-10 735 156 734 157 1-10 735 156 735 156 1-10 737 161 735 156 1-10 737 169 737 161 1-10 737 175 737 169 1-10 735 185 737 175 1-10 734 193 735 185 1-10 731 207 734 193 1-10 730 213 731 207 1-10 727 227 730 213 1-10 725 236 727 227 1-10 723 247 725 236 1-10 720 261 723 247 1-10 717 273 720 261 1-10 714 284 717 273 1-10 711 299 714 284 1-10 707 310 711 299 1-10 705 321 707 310 1-10 703 330 705 321 1-10 701 341 703 330 1-10 699 346 701 341 1-10 698 351 699 346 1-10 697 356 698 351 1-10 697 357 697 356 1-10 697 358 697 357 1-10 697 359 697 358 1-10 697 359 697 359 1-10 697 359 697 359 1_21 #000000 #6b1877 16 50 47 23 257 12-10 861 181 865 170 1-10 859 189 861 181 1-10 852 211 859 189 1-10 845 230 852 211 1-10 841 240 845 230 1-10 838 251 841 240 1-10 835 259 838 251 1-10 832 271 835 259 1-10 829 279 832 271 1-10 826 290 829 279 1-10 823 299 826 290 1-10 820 307 823 299 1-10 817 315 820 307 1-10 815 321 817 315 1-10 814 327 815 321 1-10 812 331 814 327 1-10 810 337 812 331 1-10 809 339 810 337 1-10 809 341 809 339 1-10 808 343 809 341 1-10 807 344 808 343 1-10 807 345 807 344 1-10 807 345 807 345 1-10 807 346 807 345 1-10 807 347 807 346 1-10 807 347 807 347 1-10 808 347 807 347 1-10 813 349 808 347 1-10 819 351 813 349 1-10 827 353 819 351 1-10 835 354 827 353 1-10 844 355 835 354 1-10 853 355 844 355 1-10 864 354 853 355 1-10 873 355 864 354 1-10 878 355 873 355 1-10 887 355 878 355 1-10 892 355 887 355 1-10 900 355 892 355 1-10 905 355 900 355 1-10 911 356 905 355 1-10 913 356 911 356 1-10 918 356 913 356 1-10 920 356 918 356 1-10 921 356 920 356 1-10 923 355 921 356 1-10 926 355 923 355 1-10 934 353 926 355 1-10 947 348 934 353 1-10 947 348 947 348 1_21 #000000 #6994d3 16 50 47 23 257 12-10 1044 186 1049 176 1-10 1040 194 1044 186 1-10 1034 205 1040 194 1-10 1029 213 1034 205 1-10 1022 226 1029 213 1-10 1012 245 1022 226 1-10 999 265 1012 245 1-10 995 272 999 265 1-10 990 279 995 272 1-10 987 284 990 279 1-10 983 292 987 284 1-10 981 297 983 292 1-10 979 299 981 297 1-10 979 301 979 299 1-10 978 302 979 301 1-10 978 303 978 302 1-10 978 303 978 303 1-10 980 302 978 303 1-10 991 296 980 302 1-10 999 292 991 296 1-10 1007 289 999 292 1-10 1016 285 1007 289 1-10 1026 279 1016 285 1-10 1035 277 1026 279 1-10 1043 276 1035 277 1-10 1051 275 1043 276 1-10 1057 275 1051 275 1-10 1066 275 1057 275 1-10 1071 277 1066 275 1-10 1079 280 1071 277 1-10 1084 282 1079 280 1-10 1089 284 1084 282 1-10 1093 287 1089 284 1-10 1097 291 1093 287 1-10 1101 298 1097 291 1-10 1104 303 1101 298 1-10 1106 307 1104 303 1-10 1108 316 1106 307 1-10 1109 321 1108 316 1-10 1109 327 1109 321 1-10 1107 336 1109 327 1-10 1105 343 1107 336 1-10 1103 349 1105 343 1-10 1097 356 1103 349 1-10 1090 365 1097 356 1-10 1087 368 1090 365 1-10 1080 373 1087 368 1-10 1073 378 1080 373 1-10 1065 381 1073 378 1-10 1055 385 1065 381 1-10 1046 387 1055 385 1-10 1035 388 1046 387 1-10 1025 387 1035 388 1-10 1014 387 1025 387 1-10 1003 385 1014 387 1-10 994 383 1003 385 1-10 989 381 994 383 1-10 983 379 989 381 1-10 978 377 983 379 1-10 974 373 978 377 1-10 968 367 974 373 1-10 961 356 968 367 1-10 961 356 961 356 1_21 #000000 #a8d18b 16 50 47 23 257 12-10 1067 223 1055 225 1-10 1081 223 1067 223 1-10 1091 222 1081 223 1-10 1100 221 1091 222 1-10 1109 220 1100 221 1-10 1117 219 1109 220 1-10 1132 218 1117 219 1-10 1134 218 1132 218 1-10 1136 218 1134 218 1-10 1137 218 1136 218 1-10 1137 218 1137 218 1-10 1138 218 1137 218 1-10 1138 218 1138 218 1__20 1-21 #000000 #dd7cdf 16 50 47 23 257 12-10 77 112 60 117 1-10 88 109 77 112 1-10 96 106 88 109 1-10 108 103 96 106 1-10 116 100 108 103 1-10 129 96 116 100 1-10 140 93 129 96 1-10 149 91 140 93 1-10 163 89 149 91 1-10 171 87 163 89 1-10 185 85 171 87 1-10 199 84 185 85 1-10 201 84 199 84 1-10 203 83 201 84 1-10 203 83 203 83 1_21 #000000 #9726cf 16 50 47 23 257 12-10 145 160 145 151 1-10 144 169 145 160 1-10 142 180 144 169 1-10 140 191 142 180 1-10 138 199 140 191 1-10 135 211 138 199 1-10 132 223 135 211 1-10 129 235 132 223 1-10 127 246 129 235 1-10 124 258 127 246 1-10 123 269 124 258 1-10 119 280 123 269 1-10 117 289 119 280 1-10 114 300 117 289 1-10 111 308 114 300 1-10 109 316 111 308 1-10 106 323 109 316 1-10 105 329 106 323 1-10 103 334 105 329 1-10 102 335 103 334 1-10 101 337 102 335 1-10 101 339 101 337 1-10 99 341 101 339 1-10 98 342 99 341 1-10 97 343 98 342 1-10 91 344 97 343 1-10 86 344 91 344 1-10 81 343 86 344 1-10 73 341 81 343 1-10 65 337 73 341 1-10 60 335 65 337 1-10 53 330 60 335 1-10 49 327 53 330 1-10 45 323 49 327 1-10 44 322 45 323 1-10 41 318 44 322 1-10 40 318 41 318 1-10 39 316 40 318 1-10 38 315 39 316 1-10 37 313 38 315 1-10 37 313 37 313 1_21 #000000 #c6679b 16 50 47 23 257 12-10 187 274 191 273 1-10 182 276 187 274 1-10 180 277 182 276 1-10 172 284 180 277 1-10 155 311 172 284 1-10 153 318 155 311 1-10 151 323 153 318 1-10 149 337 151 323 1-10 149 339 149 337 1-10 149 347 149 339 1-10 152 355 149 347 1-10 155 357 152 355 1-10 167 357 155 357 1-10 183 349 167 357 1-10 191 341 183 349 1-10 205 325 191 341 1-10 223 294 205 325 1-10 227 281 223 294 1-10 229 273 227 281 1-10 229 273 229 273 1-10 229 272 229 273 1-10 229 273 229 272 1-10 229 278 229 273 1-10 227 283 229 278 1-10 225 298 227 283 1-10 225 303 225 298 1-10 224 321 225 303 1-10 224 323 224 321 1-10 225 337 224 323 1-10 227 345 225 337 1-10 229 349 227 345 1-10 230 351 229 349 1-10 232 352 230 351 1-10 232 352 232 352 1_21 #000000 #5b1d8a 16 50 47 23 257 12-10 257 295 256 284 1-10 257 301 257 295 1-10 258 309 257 301 1-10 259 318 258 309 1-10 259 323 259 318 1-10 260 335 259 323 1-10 261 340 260 335 1-10 262 345 261 340 1-10 263 351 262 345 1-10 264 356 263 351 1-10 265 361 264 356 1-10 265 363 265 361 1-10 266 365 265 363 1-10 266 365 266 365 1-10 266 366 266 365 1-10 270 362 266 366 1-10 277 353 270 362 1-10 282 342 277 353 1-10 285 335 282 342 1-10 289 327 285 335 1-10 293 318 289 327 1-10 296 311 293 318 1-10 298 305 296 311 1-10 300 301 298 305 1-10 302 295 300 301 1-10 304 291 302 295 1-10 304 291 304 291 1_21 #000000 #d6ae23 16 50 47 23 257 12-10 377 308 382 308 1-10 371 309 377 308 1-10 365 309 371 309 1-10 363 309 365 309 1-10 358 311 363 309 1-10 357 311 358 311 1-10 351 314 357 311 1-10 347 317 351 314 1-10 343 321 347 317 1-10 340 325 343 321 1-10 337 333 340 325 1-10 335 337 337 333 1-10 333 343 335 337 1-10 332 349 333 343 1-10 331 357 332 349 1-10 331 362 331 357 1-10 332 367 331 362 1-10 333 373 332 367 1-10 335 377 333 373 1-10 336 379 335 377 1-10 339 383 336 379 1-10 340 385 339 383 1-10 341 386 340 385 1-10 346 389 341 386 1-10 348 389 346 389 1-10 353 389 348 389 1-10 363 387 353 389 1-10 370 383 363 387 1-10 379 375 370 383 1-10 387 363 379 375 1-10 392 356 387 363 1-10 400 343 392 356 1-10 407 331 400 343 1-10 414 317 407 331 1-10 418 309 414 317 1-10 421 301 418 309 1-10 423 296 421 301 1-10 424 295 423 296 1-10 425 293 424 295 1-10 425 292 425 293 1-10 425 291 425 292 1-10 425 292 425 291 1-10 425 300 425 292 1-10 425 305 425 300 1-10 424 315 425 305 1-10 424 320 424 315 1-10 424 329 424 320 1-10 424 337 424 329 1-10 425 342 424 337 1-10 425 347 425 342 1-10 426 353 425 347 1-10 426 355 426 353 1-10 428 360 426 355 1-10 429 361 428 360 1-10 430 363 429 361 1-10 431 365 430 363 1-10 433 366 431 365 1-10 433 366 433 366 1_21 #000000 #2f352f 16 50 47 23 257 12-10 529 287 537 282 1-10 521 291 529 287 1-10 511 298 521 291 1-10 501 303 511 298 1-10 494 307 501 303 1-10 489 310 494 307 1-10 482 314 489 310 1-10 478 317 482 314 1-10 477 317 478 317 1-10 472 321 477 317 1-10 471 321 472 321 1-10 471 322 471 321 1-10 473 323 471 322 1-10 481 326 473 323 1-10 491 328 481 326 1-10 499 329 491 328 1-10 508 331 499 329 1-10 516 331 508 331 1-10 521 332 516 331 1-10 527 334 521 332 1-10 532 335 527 334 1-10 537 337 532 335 1-10 541 339 537 337 1-10 543 340 541 339 1-10 545 341 543 340 1-10 547 343 545 341 1-10 548 344 547 343 1-10 549 346 548 344 1-10 551 347 549 346 1-10 551 349 551 347 1-10 551 351 551 349 1-10 548 355 551 351 1-10 545 359 548 355 1-10 538 363 545 359 1-10 533 366 538 363 1-10 528 367 533 366 1-10 523 367 528 367 1-10 517 367 523 367 1-10 513 367 517 367 1-10 511 367 513 367 1-10 508 367 511 367 1-10 507 366 508 367 1-10 505 365 507 366 1-10 503 363 505 365 1-10 503 363 503 363 1_21 #000000 #8ee4c7 16 50 47 23 257 12-10 642 303 647 303 1-10 634 303 642 303 1-10 623 305 634 303 1-10 614 307 623 305 1-10 606 309 614 307 1-10 598 313 606 309 1-10 591 317 598 313 1-10 585 323 591 317 1-10 581 326 585 323 1-10 577 330 581 326 1-10 575 335 577 330 1-10 573 341 575 335 1-10 571 345 573 341 1-10 570 351 571 345 1-10 570 353 570 351 1-10 571 358 570 353 1-10 571 363 571 358 1-10 572 365 571 363 1-10 575 369 572 365 1-10 577 371 575 369 1-10 581 374 577 371 1-10 586 377 581 374 1-10 593 379 586 377 1-10 599 380 593 379 1-10 604 380 599 380 1-10 609 379 604 380 1-10 618 377 609 379 1-10 626 373 618 377 1-10 631 371 626 373 1-10 640 365 631 371 1-10 645 361 640 365 1-10 649 358 645 361 1-10 649 358 649 358 1_21 #000000 #b8d29b 16 50 47 23 257 12-10 680 303 681 295 1-10 679 309 680 303 1-10 677 322 679 309 1-10 676 330 677 322 1-10 675 336 676 330 1-10 674 344 675 336 1-10 673 354 674 344 1-10 673 359 673 354 1-10 673 361 673 359 1-10 673 366 673 361 1-10 673 368 673 366 1-10 673 370 673 368 1-10 673 373 673 370 1-10 673 373 673 373 1-10 679 363 673 373 1-10 685 357 679 363 1-10 689 350 685 357 1-10 693 345 689 350 1-10 697 341 693 345 1-10 701 337 697 341 1-10 704 334 701 337 1-10 706 333 704 334 1-10 710 329 706 333 1-10 714 327 710 329 1-10 716 325 714 327 1-10 724 322 716 325 1-10 726 321 724 322 1-10 734 319 726 321 1-10 736 319 734 319 1-10 742 318 736 319 1-10 747 317 742 318 1-10 749 317 747 317 1-10 754 317 749 317 1-10 756 317 754 317 1-10 758 317 756 317 1-10 763 316 758 317 1-10 765 316 763 316 1-10 765 316 765 316 1_21 #000000 #b5bd74 16 50 47 23 257 12-10 781 266 775 265 1-10 786 267 781 266 1-10 794 269 786 267 1-10 799 271 794 269 1-10 809 274 799 271 1-10 811 275 809 274 1-10 813 276 811 275 1-10 813 276 813 276 1_21 #000000 #7f17a5 16 50 47 23 257 12-10 803 348 803 346 1-10 803 350 803 348 1-10 803 352 803 350 1-10 803 361 803 352 1-10 802 363 803 361 1-10 802 365 802 363 1-10 801 370 802 365 1-10 801 375 801 370 1-10 801 375 801 375 1_21 #000000 #277497 16 50 47 23 257 12-10 867 320 869 309 1-10 867 325 867 320 1-10 863 341 867 325 1-10 861 349 863 341 1-10 857 372 861 349 1-10 854 385 857 372 1-10 849 408 854 385 1-10 848 420 849 408 1-10 846 432 848 420 1-10 845 455 846 432 1-10 844 461 845 455 1-10 843 471 844 461 1-10 843 473 843 471 1-10 843 476 843 473 1-10 843 476 843 476 1_21 #000000 #d33847 16 50 47 23 257 12-10 885 325 877 328 1-10 894 324 885 325 1-10 906 323 894 324 1-10 915 323 906 323 1-10 924 323 915 323 1-10 929 324 924 323 1-10 937 326 929 324 1-10 943 327 937 326 1-10 947 330 943 327 1-10 949 331 947 330 1-10 953 335 949 331 1-10 955 339 953 335 1-10 955 341 955 339 1-10 955 347 955 341 1-10 952 355 955 347 1-10 947 362 952 355 1-10 941 369 947 362 1-10 933 373 941 369 1-10 925 377 933 373 1-10 914 381 925 377 1-10 906 383 914 381 1-10 901 383 906 383 1-10 892 385 901 383 1-10 887 385 892 385 1-10 878 385 887 385 1-10 873 385 878 385 1-10 871 385 873 385 1-10 869 385 871 385 1-10 867 385 869 385 1-10 867 385 867 385 1-10 867 385 867 385 1_21 #000000 #4fc7bd 16 50 47 23 257 12-10 983 322 973 322 1-10 995 321 983 322 1-10 1003 321 995 321 1-10 1012 320 1003 321 1-10 1021 320 1012 320 1-10 1029 319 1021 320 1-10 1040 319 1029 319 1-10 1045 318 1040 319 1-10 1053 317 1045 318 1-10 1055 317 1053 317 1-10 1057 317 1055 317 1-10 1057 317 1057 317 1_21 #000000 #68d3c3 16 50 47 23 257 12-10 1038 232 1041 224 1-10 1035 241 1038 232 1-10 1031 252 1035 241 1-10 1027 263 1031 252 1-10 1023 277 1027 263 1-10 1021 285 1023 277 1-10 1018 297 1021 285 1-10 1015 308 1018 297 1-10 1013 319 1015 308 1-10 1011 330 1013 319 1-10 1011 339 1011 330 1-10 1011 347 1011 339 1-10 1011 356 1011 347 1-10 1013 365 1011 356 1-10 1013 367 1013 365 1-10 1015 373 1013 367 1-10 1017 378 1015 373 1-10 1019 383 1017 378 1-10 1037 393 1019 383 1-10 1045 392 1037 393 1-10 1054 389 1045 392 1-10 1062 386 1054 389 1-10 1070 382 1062 386 1-10 1080 377 1070 382 1-10 1088 373 1080 377 1-10 1095 368 1088 373 1-10 1103 363 1095 368 1-10 1107 360 1103 363 1-10 1107 360 1107 360 1__20 1-21 #000000 #d15362 16 50 47 23 257 12-10 43 276 39 221 1-10 49 293 43 276 1-10 56 308 49 293 1-10 59 312 56 308 1-10 65 319 59 312 1-10 69 322 65 319 1-10 73 325 69 322 1-10 87 330 73 325 1-10 95 330 87 330 1-10 103 329 95 330 1-10 111 327 103 329 1-10 129 316 111 327 1-10 139 309 129 316 1-10 159 288 139 309 1-10 166 278 159 288 1-10 173 265 166 278 1-10 181 253 173 265 1-10 186 242 181 253 1-10 191 227 186 242 1-10 196 214 191 227 1-10 198 202 196 214 1-10 200 187 198 202 1-10 201 175 200 187 1-10 199 163 201 175 1-10 197 151 199 163 1-10 193 140 197 151 1-10 189 129 193 140 1-10 184 123 189 129 1-10 179 116 184 123 1-10 175 112 179 116 1-10 168 106 175 112 1-10 160 101 168 106 1-10 152 98 160 101 1-10 143 96 152 98 1-10 134 95 143 96 1-10 123 95 134 95 1-10 112 98 123 95 1-10 103 101 112 98 1-10 93 105 103 101 1-10 85 108 93 105 1-10 77 112 85 108 1-10 68 119 77 112 1-10 61 123 68 119 1-10 55 129 61 123 1-10 48 135 55 129 1-10 44 140 48 135 1-10 41 144 44 140 1-10 39 149 41 144 1-10 37 154 39 149 1-10 38 156 37 154 1-10 38 156 38 156 1_21 #000000 #312f35 16 50 47 23 257 12-10 259 123 259 106 1-10 259 141 259 123 1-10 257 150 259 141 1-10 256 173 257 150 1-10 253 194 256 173 1-10 253 208 253 194 1-10 252 217 253 208 1-10 251 229 252 217 1-10 251 238 251 229 1-10 250 246 251 238 1-10 249 255 250 246 1-10 249 260 249 255 1-10 249 265 249 260 1-10 249 271 249 265 1-10 249 276 249 271 1-10 249 278 249 276 1-10 249 283 249 278 1-10 249 283 249 283 1-10 249 285 249 283 1-10 249 287 249 285 1-10 248 289 249 287 1-10 248 291 248 289 1-10 248 291 248 291 1-10 248 291 248 291 1_21 #000000 #532521 16 50 47 23 257 12-10 267 95 253 105 1-10 278 90 267 95 1-10 287 87 278 90 1-10 295 85 287 87 1-10 307 83 295 85 1-10 317 83 307 83 1-10 326 83 317 83 1-10 335 84 326 83 1-10 343 85 335 84 1-10 351 88 343 85 1-10 357 89 351 88 1-10 365 94 357 89 1-10 369 97 365 94 1-10 373 101 369 97 1-10 377 105 373 101 1-10 379 110 377 105 1-10 382 117 379 110 1-10 383 120 382 117 1-10 383 125 383 120 1-10 381 137 383 125 1-10 369 156 381 137 1-10 361 165 369 156 1-10 341 179 361 165 1-10 328 187 341 179 1-10 317 193 328 187 1-10 307 197 317 193 1-10 299 200 307 197 1-10 291 202 299 200 1-10 285 204 291 202 1-10 281 205 285 204 1-10 279 205 281 205 1-10 273 204 279 205 1-10 273 203 273 204 1-10 272 201 273 203 1-10 273 199 272 201 1-10 273 199 273 199 1_21 #000000 #57442a 16 50 47 23 257 12-10 442 103 420 105 1-10 463 102 442 103 1-10 474 101 463 102 1-10 483 101 474 101 1-10 495 100 483 101 1-10 504 99 495 100 1-10 513 100 504 99 1-10 523 100 513 100 1-10 525 100 523 100 1-10 530 101 525 100 1-10 532 101 530 101 1-10 533 101 532 101 1-10 534 101 533 101 1-10 534 101 534 101 1_21 #000000 #7b6ded 16 50 47 23 257 12-10 427 119 427 113 1-10 427 127 427 119 1-10 427 139 427 127 1-10 427 144 427 139 1-10 427 156 427 144 1-10 427 165 427 156 1-10 427 177 427 165 1-10 426 185 427 177 1-10 426 194 426 185 1-10 426 203 426 194 1-10 426 211 426 203 1-10 426 219 426 211 1-10 426 225 426 219 1-10 427 233 426 225 1-10 427 238 427 233 1-10 427 240 427 238 1-10 427 245 427 240 1-10 427 246 427 245 1-10 427 248 427 246 1-10 427 248 427 248 1_21 #000000 #8beaae 16 50 47 23 257 12-10 470 195 461 197 1-10 475 193 470 195 1-10 485 191 475 193 1-10 493 189 485 191 1-10 498 188 493 189 1-10 507 187 498 188 1-10 511 186 507 187 1-10 513 186 511 186 1-10 515 187 513 186 1-10 516 187 515 187 1-10 516 187 516 187 1_21 #000000 #b71cae 16 50 47 23 257 12-10 442 276 433 276 1-10 454 275 442 276 1-10 463 273 454 275 1-10 470 271 463 273 1-10 479 269 470 271 1-10 487 267 479 269 1-10 495 265 487 267 1-10 501 263 495 265 1-10 509 260 501 263 1-10 515 259 509 260 1-10 516 258 515 259 1-10 523 253 516 258 1-10 534 247 523 253 1-10 534 247 534 247 1_21 #000000 #90c5ef 16 50 47 23 257 12-10 589 105 591 100 1-10 587 117 589 105 1-10 586 125 587 117 1-10 585 136 586 125 1-10 584 145 585 136 1-10 584 156 584 145 1-10 583 165 584 156 1-10 583 177 583 165 1-10 582 187 583 177 1-10 582 197 582 187 1-10 581 208 582 197 1-10 581 217 581 208 1-10 582 228 581 217 1-10 582 233 582 228 1-10 583 243 582 233 1-10 583 254 583 243 1-10 583 259 583 254 1-10 584 265 583 259 1-10 584 267 584 265 1-10 584 269 584 267 1-10 584 271 584 269 1-10 584 271 584 271 1-10 584 271 584 271 1_21 #000000 #977d43 16 50 47 23 257 12-10 599 125 596 121 1-10 604 133 599 125 1-10 610 143 604 133 1-10 613 147 610 143 1-10 620 157 613 147 1-10 626 167 620 157 1-10 633 177 626 167 1-10 639 187 633 177 1-10 645 194 639 187 1-10 651 205 645 194 1-10 655 213 651 205 1-10 663 225 655 213 1-10 667 231 663 225 1-10 670 236 667 231 1-10 675 244 670 236 1-10 681 251 675 244 1-10 684 255 681 251 1-10 685 257 684 255 1-10 689 261 685 257 1-10 693 265 689 261 1-10 693 265 693 265 1-10 693 265 693 265 1-10 694 265 693 265 1-10 695 265 694 265 1-10 697 265 695 265 1-10 704 261 697 265 1-10 709 254 704 261 1-10 713 243 709 254 1-10 717 235 713 243 1-10 720 224 717 235 1-10 724 210 720 224 1-10 727 199 724 210 1-10 731 185 727 199 1-10 734 173 731 185 1-10 736 162 734 173 1-10 739 148 736 162 1-10 741 139 739 148 1-10 742 130 741 139 1-10 745 119 742 130 1-10 745 110 745 119 1-10 747 99 745 110 1-10 748 97 747 99 1-10 749 91 748 97 1-10 750 83 749 91 1-10 751 78 750 83 1-10 751 77 751 78 1-10 752 75 751 77 1-10 752 75 752 75 1_21 #000000 #d52b21 16 50 47 23 257 12-10 457 360 466 358 1-10 448 362 457 360 1-10 437 367 448 362 1-10 424 372 437 367 1-10 413 376 424 372 1-10 401 381 413 376 1-10 389 387 401 381 1-10 375 393 389 387 1-10 364 398 375 393 1-10 351 404 364 398 1-10 341 410 351 404 1-10 332 415 341 410 1-10 327 419 332 415 1-10 322 421 327 419 1-10 320 422 322 421 1-10 319 423 320 422 1-10 318 423 319 423 1-10 318 423 318 423 1-10 323 425 318 423 1-10 331 427 323 425 1-10 340 429 331 427 1-10 351 430 340 429 1-10 363 433 351 430 1-10 374 435 363 433 1-10 383 437 374 435 1-10 397 441 383 437 1-10 408 444 397 441 1-10 417 447 408 444 1-10 425 450 417 447 1-10 432 455 425 450 1-10 439 459 432 455 1-10 444 463 439 459 1-10 448 466 444 463 1-10 454 472 448 466 1-10 457 476 454 472 1-10 459 477 457 476 1-10 459 479 459 477 1-10 460 481 459 479 1-10 460 483 460 481 1-10 458 488 460 483 1-10 454 492 458 488 1-10 445 498 454 492 1-10 438 503 445 498 1-10 426 505 438 503 1-10 414 508 426 505 1-10 403 509 414 508 1-10 394 510 403 509 1-10 383 510 394 510 1-10 374 509 383 510 1-10 363 509 374 509 1-10 357 509 363 509 1-10 349 506 357 509 1-10 347 505 349 506 1-10 343 503 347 505 1-10 341 503 343 503 1-10 339 502 341 503 1-10 339 500 339 502 1-10 339 500 339 500 1_21 #000000 #b35e1f 16 50 47 23 257 12-10 491 410 493 405 1-10 488 418 491 410 1-10 485 430 488 418 1-10 485 435 485 430 1-10 484 446 485 435 1-10 484 455 484 446 1-10 485 463 484 455 1-10 486 472 485 463 1-10 488 481 486 472 1-10 491 489 488 481 1-10 495 497 491 489 1-10 498 502 495 497 1-10 504 509 498 502 1-10 507 512 504 509 1-10 512 515 507 512 1-10 517 518 512 515 1-10 522 519 517 518 1-10 527 519 522 519 1-10 536 518 527 519 1-10 545 515 536 518 1-10 552 510 545 515 1-10 563 499 552 510 1-10 570 489 563 499 1-10 579 471 570 489 1-10 583 459 579 471 1-10 587 445 583 459 1-10 591 431 587 445 1-10 591 420 591 431 1-10 591 411 591 420 1-10 589 406 591 411 1-10 587 397 589 406 1-10 583 389 587 397 1-10 579 386 583 389 1-10 575 382 579 386 1-10 567 379 575 382 1-10 555 375 567 379 1-10 547 375 555 375 1-10 539 375 547 375 1-10 530 375 539 375 1-10 521 376 530 375 1-10 512 379 521 376 1-10 504 382 512 379 1-10 497 387 504 382 1-10 495 387 497 387 1-10 493 389 495 387 1-10 492 390 493 389 1-10 491 391 492 390 1-10 490 393 491 391 1-10 490 393 490 393 1_21 #000000 #21ba34 16 50 47 23 257 12-10 610 378 611 369 1-10 608 387 610 378 1-10 607 395 608 387 1-10 606 403 607 395 1-10 605 412 606 403 1-10 605 421 605 412 1-10 605 430 605 421 1-10 605 438 605 430 1-10 605 447 605 438 1-10 607 455 605 447 1-10 608 461 607 455 1-10 610 469 608 461 1-10 613 477 610 469 1-10 615 481 613 477 1-10 618 489 615 481 1-10 621 493 618 489 1-10 624 498 621 493 1-10 628 501 624 498 1-10 633 505 628 501 1-10 637 507 633 505 1-10 643 509 637 507 1-10 648 510 643 509 1-10 653 510 648 510 1-10 659 509 653 510 1-10 667 506 659 509 1-10 671 503 667 506 1-10 679 495 671 503 1-10 685 489 679 495 1-10 691 479 685 489 1-10 695 469 691 479 1-10 699 459 695 469 1-10 702 447 699 459 1-10 705 435 702 447 1-10 707 427 705 435 1-10 708 417 707 427 1-10 709 409 708 417 1-10 709 407 709 409 1-10 709 398 709 407 1-10 709 393 709 398 1-10 709 391 709 393 1-10 709 389 709 391 1-10 708 387 709 389 1-10 708 385 708 387 1-10 708 385 708 385 1-10 708 384 708 385 1-10 708 383 708 384 1-10 708 389 708 383 1-10 708 394 708 389 1-10 708 406 708 394 1-10 709 415 708 406 1-10 709 425 709 415 1-10 710 434 709 425 1-10 710 439 710 434 1-10 711 451 710 439 1-10 711 456 711 451 1-10 712 461 711 456 1-10 713 467 712 461 1-10 713 472 713 467 1-10 713 474 713 472 1-10 714 477 713 474 1-10 714 479 714 477 1-10 714 479 714 479 1-10 714 479 714 479 1_21 #000000 #b1cb71 16 50 47 23 257 12-10 753 369 753 365 1-10 752 377 753 369 1-10 752 392 752 377 1-10 751 406 752 392 1-10 751 415 751 406 1-10 750 426 751 415 1-10 750 434 750 426 1-10 749 445 750 434 1-10 748 457 749 445 1-10 747 466 748 457 1-10 746 477 747 466 1-10 745 483 746 477 1-10 745 492 745 483 1-10 745 497 745 492 1-10 744 503 745 497 1-10 744 505 744 503 1-10 744 506 744 505 1-10 744 507 744 506 1-10 744 507 744 507 1-10 744 508 744 507 1-10 744 509 744 508 1-10 744 509 744 509 1-10 744 509 744 509 1-10 744 509 744 509 1_21 #000000 #55148d 16 50 47 23 257 12-10 777 375 767 377 1-10 783 375 777 375 1-10 789 374 783 375 1-10 797 374 789 374 1-10 803 375 797 374 1-10 811 375 803 375 1-10 817 375 811 375 1-10 825 377 817 375 1-10 829 379 825 377 1-10 835 381 829 379 1-10 846 388 835 381 1-10 850 392 846 388 1-10 851 393 850 392 1-10 855 397 851 393 1-10 859 402 855 397 1-10 861 407 859 402 1-10 861 409 861 407 1-10 862 414 861 409 1-10 861 416 862 414 1-10 859 424 861 416 1-10 854 431 859 424 1-10 848 437 854 431 1-10 839 444 848 437 1-10 829 451 839 444 1-10 817 457 829 451 1-10 807 463 817 457 1-10 796 467 807 463 1-10 783 473 796 467 1-10 775 477 783 473 1-10 768 480 775 477 1-10 763 482 768 480 1-10 761 483 763 482 1-10 759 483 761 483 1-10 758 484 759 483 1-10 757 484 758 484 1-10 757 484 757 484 1-10 756 484 757 484 1-10 757 484 756 484 1-10 759 484 757 484 1-10 767 485 759 484 1-10 775 486 767 485 1-10 783 489 775 486 1-10 789 490 783 489 1-10 797 493 789 490 1-10 803 495 797 493 1-10 813 499 803 495 1-10 819 501 813 499 1-10 827 504 819 501 1-10 831 505 827 504 1-10 836 507 831 505 1-10 838 508 836 507 1-10 843 510 838 508 1-10 845 511 843 510 1-10 851 512 845 511 1-10 853 512 851 512 1-10 855 512 853 512 1-10 855 512 855 512 1_21 #000000 #55d980 16 50 47 23 257 12-10 950 379 959 379 1-10 941 380 950 379 1-10 929 383 941 380 1-10 916 387 929 383 1-10 908 391 916 387 1-10 898 397 908 391 1-10 891 401 898 397 1-10 883 410 891 401 1-10 879 414 883 410 1-10 875 421 879 414 1-10 871 429 875 421 1-10 869 434 871 429 1-10 867 439 869 434 1-10 867 449 867 439 1-10 867 454 867 449 1-10 869 459 867 454 1-10 873 467 869 459 1-10 877 474 873 467 1-10 883 481 877 474 1-10 889 486 883 481 1-10 893 489 889 486 1-10 903 494 893 489 1-10 912 497 903 494 1-10 921 500 912 497 1-10 931 500 921 500 1-10 943 500 931 500 1-10 954 498 943 500 1-10 964 494 954 498 1-10 973 491 964 494 1-10 985 485 973 491 1-10 995 479 985 485 1-10 1004 471 995 479 1-10 1015 463 1004 471 1-10 1015 463 1015 463 1_21 #000000 #572b61 16 50 47 23 257 12-10 1043 363 1032 363 1-10 1051 363 1043 363 1-10 1060 362 1051 363 1-10 1068 361 1060 362 1-10 1076 360 1068 361 1-10 1085 359 1076 360 1-10 1093 358 1085 359 1-10 1095 358 1093 358 1-10 1101 357 1095 358 1-10 1103 357 1101 357 1-10 1105 357 1103 357 1-10 1107 356 1105 357 1-10 1109 356 1107 356 1-10 1109 356 1109 356 1-10 1109 356 1109 356 1_21 #000000 #194bcb 16 50 47 23 257 12-10 1028 395 1028 386 1-10 1028 406 1028 395 1-10 1027 411 1028 406 1-10 1025 423 1027 411 1-10 1023 434 1025 423 1-10 1021 443 1023 434 1-10 1020 451 1021 443 1-10 1019 457 1020 451 1-10 1018 466 1019 457 1-10 1018 474 1018 466 1-10 1018 476 1018 474 1-10 1018 478 1018 476 1-10 1019 480 1018 478 1-10 1019 482 1019 480 1-10 1019 484 1019 482 1-10 1019 485 1019 484 1-10 1019 485 1019 485 1_21 #000000 #b1ec41 16 50 47 23 257 12-10 1058 452 1047 454 1-10 1067 451 1058 452 1-10 1077 448 1067 451 1-10 1085 446 1077 448 1-10 1095 445 1085 446 1-10 1100 443 1095 445 1-10 1105 442 1100 443 1-10 1110 441 1105 442 1-10 1115 439 1110 441 1-10 1117 439 1115 439 1-10 1117 439 1117 439 1-10 1117 439 1117 439 1_21 #000000 #166c50 16 50 47 23 257 12-10 1041 526 1029 527 1-10 1049 525 1041 526 1-10 1055 524 1049 525 1-10 1063 522 1055 524 1-10 1068 521 1063 522 1-10 1074 520 1068 521 1-10 1083 519 1074 520 1-10 1088 518 1083 519 1-10 1097 516 1088 518 1-10 1099 516 1097 516 1-10 1101 515 1099 516 1-10 1107 514 1101 515 1-10 1111 512 1107 514 1-10 1111 512 1111 512 1__20 1-21 #000000 #713029 16 50 47 23 257 12-10 89 202 97 93 1-10 88 217 89 202 1-10 87 228 88 217 1-10 85 239 87 228 1-10 84 255 85 239 1-10 83 265 84 255 1-10 83 275 83 265 1-10 83 285 83 275 1-10 83 299 83 285 1-10 82 307 83 299 1-10 82 313 82 307 1-10 82 315 82 313 1-10 82 317 82 315 1-10 82 319 82 317 1-10 82 319 82 319 1-10 82 319 82 319 1_21 #000000 #5bcb54 16 50 47 23 257 12-10 98 117 97 113 1-10 101 126 98 117 1-10 103 135 101 126 1-10 105 143 103 135 1-10 107 151 105 143 1-10 109 161 107 151 1-10 111 171 109 161 1-10 112 180 111 171 1-10 115 192 112 180 1-10 117 204 115 192 1-10 118 212 117 204 1-10 121 223 118 212 1-10 122 229 121 223 1-10 125 240 122 229 1-10 127 249 125 240 1-10 128 254 127 249 1-10 131 262 128 254 1-10 132 267 131 262 1-10 133 272 132 267 1-10 135 277 133 272 1-10 136 279 135 277 1-10 137 281 136 279 1-10 137 283 137 281 1-10 139 285 137 283 1-10 139 286 139 285 1-10 141 288 139 286 1-10 141 289 141 288 1-10 141 289 141 289 1-10 142 289 141 289 1-10 143 289 142 289 1-10 144 289 143 289 1-10 153 282 144 289 1-10 163 270 153 282 1-10 171 257 163 270 1-10 181 240 171 257 1-10 191 223 181 240 1-10 199 210 191 223 1-10 209 189 199 210 1-10 215 179 209 189 1-10 221 169 215 179 1-10 226 158 221 169 1-10 231 147 226 158 1-10 237 135 231 147 1-10 241 127 237 135 1-10 245 120 241 127 1-10 248 115 245 120 1-10 251 108 248 115 1-10 252 106 251 108 1-10 253 104 252 106 1-10 253 103 253 104 1-10 253 103 253 103 1-10 253 111 253 103 1-10 254 119 253 111 1-10 253 125 254 119 1-10 252 136 253 125 1-10 251 145 252 136 1-10 249 154 251 145 1-10 247 165 249 154 1-10 246 177 247 165 1-10 244 188 246 177 1-10 243 201 244 188 1-10 241 212 243 201 1-10 238 227 241 212 1-10 236 235 238 227 1-10 233 249 236 235 1-10 231 260 233 249 1-10 229 271 231 260 1-10 228 283 229 271 1-10 227 295 228 283 1-10 226 300 227 295 1-10 226 305 226 300 1-10 226 311 226 305 1-10 226 313 226 311 1-10 226 315 226 313 1-10 226 315 226 315 1-10 226 317 226 315 1-10 226 317 226 317 1-10 226 317 226 317 1_21 #000000 #4fd395 16 50 47 23 257 12-10 340 125 326 127 1-10 349 124 340 125 1-10 357 123 349 124 1-10 367 122 357 123 1-10 373 121 367 122 1-10 384 120 373 121 1-10 389 120 384 120 1-10 398 119 389 120 1-10 407 119 398 119 1-10 415 119 407 119 1-10 420 119 415 119 1-10 425 119 420 119 1-10 431 119 425 119 1-10 436 119 431 119 1-10 441 119 436 119 1-10 446 119 441 119 1-10 447 119 446 119 1-10 449 119 447 119 1-10 451 119 449 119 1-10 451 119 451 119 1_21 #000000 #19ccaf 16 50 47 23 257 12-10 397 157 398 148 1-10 396 165 397 157 1-10 395 175 396 165 1-10 394 184 395 175 1-10 392 192 394 184 1-10 391 204 392 192 1-10 389 212 391 204 1-10 387 223 389 212 1-10 385 231 387 223 1-10 384 240 385 231 1-10 382 249 384 240 1-10 381 253 382 249 1-10 379 262 381 253 1-10 379 267 379 262 1-10 377 273 379 267 1-10 377 278 377 273 1-10 375 283 377 278 1-10 374 289 375 283 1-10 374 291 374 289 1-10 373 296 374 291 1-10 371 301 373 296 1-10 371 301 371 301 1_21 #000000 #ba4637 16 50 47 23 257 12-10 325 331 320 330 1-10 333 331 325 331 1-10 339 331 333 331 1-10 347 331 339 331 1-10 357 331 347 331 1-10 365 330 357 331 1-10 371 329 365 330 1-10 379 329 371 329 1-10 385 328 379 329 1-10 390 328 385 328 1-10 396 327 390 328 1-10 401 327 396 327 1-10 410 325 401 327 1-10 415 325 410 325 1-10 421 324 415 325 1-10 425 323 421 324 1-10 425 323 425 323 1_21 #000000 #b0ce19 16 50 47 23 257 12-10 559 119 551 117 1-10 568 120 559 119 1-10 577 121 568 120 1-10 588 121 577 121 1-10 597 121 588 121 1-10 609 121 597 121 1-10 617 120 609 121 1-10 628 120 617 120 1-10 637 120 628 120 1-10 646 120 637 120 1-10 655 119 646 120 1-10 660 119 655 119 1-10 666 119 660 119 1-10 677 120 666 119 1-10 682 120 677 120 1-10 687 120 682 120 1-10 693 121 687 120 1-10 698 122 693 121 1-10 700 122 698 122 1-10 705 122 700 122 1-10 707 122 705 122 1-10 707 122 707 122 1_21 #000000 #3f95ed 16 50 47 23 257 12-10 625 166 626 160 1-10 625 174 625 166 1-10 622 185 625 174 1-10 621 191 622 185 1-10 617 205 621 191 1-10 617 210 617 205 1-10 614 221 617 210 1-10 611 239 614 221 1-10 609 250 611 239 1-10 608 259 609 250 1-10 607 268 608 259 1-10 606 277 607 268 1-10 605 282 606 277 1-10 605 291 605 282 1-10 605 295 605 291 1-10 604 297 605 295 1-10 604 303 604 297 1-10 603 304 604 303 1-10 603 307 603 304 1-10 603 309 603 307 1-10 602 311 603 309 1-10 601 312 602 311 1-10 601 313 601 312 1-10 601 313 601 313 1_21 #000000 #ce8dcd 16 50 47 23 257 12-10 489 443 503 401 1-10 487 447 489 443 1-10 486 449 487 447 1-10 485 451 486 449 1-10 485 453 485 451 1-10 484 455 485 453 1-10 483 457 484 455 1-10 483 457 483 457 1-10 483 459 483 457 1-10 483 459 483 459 1-10 483 460 483 459 1-10 483 461 483 460 1-10 483 461 483 461 1-10 483 462 483 461 1-10 483 463 483 462 1-10 484 464 483 463 1-10 485 465 484 464 1-10 490 467 485 465 1-10 492 468 490 467 1-10 500 470 492 468 1-10 503 471 500 470 1-10 511 471 503 471 1-10 512 471 511 471 1-10 517 471 512 471 1-10 523 471 517 471 1-10 525 471 523 471 1-10 531 471 525 471 1-10 535 470 531 471 1-10 538 470 535 470 1-10 543 469 538 470 1-10 545 469 543 469 1-10 547 469 545 469 1-10 549 468 547 469 1-10 551 468 549 468 1-10 553 468 551 468 1-10 555 467 553 468 1-10 557 467 555 467 1-10 559 467 557 467 1-10 559 467 559 467 1_21 #000000 #1dd8e9 16 50 47 23 257 12-10 601 396 597 393 1-10 601 396 601 396 1_21 #000000 #742b82 16 50 47 23 257 12-10 594 453 595 447 1-10 593 455 594 453 1-10 593 460 593 455 1-10 592 463 593 460 1-10 591 467 592 463 1-10 591 469 591 467 1-10 591 471 591 469 1-10 590 473 591 471 1-10 589 475 590 473 1-10 589 477 589 475 1-10 589 479 589 477 1-10 589 480 589 479 1-10 589 482 589 480 1-10 589 482 589 482 1_21 #000000 #5175b9 16 50 47 23 257 12-10 647 467 647 467 1_21 #000000 #60bba5 16 50 47 23 257 12-10 689 433 697 433 1-10 687 433 689 433 1-10 682 435 687 433 1-10 677 437 682 435 1-10 671 440 677 437 1-10 667 443 671 440 1-10 663 445 667 443 1-10 659 449 663 445 1-10 655 453 659 449 1-10 652 457 655 453 1-10 648 463 652 457 1-10 646 467 648 463 1-10 645 469 646 467 1-10 644 474 645 469 1-10 644 475 644 474 1-10 643 477 644 475 1-10 643 479 643 477 1-10 644 481 643 479 1-10 645 485 644 481 1-10 645 487 645 485 1-10 645 488 645 487 1-10 647 489 645 488 1-10 647 491 647 489 1-10 649 491 647 491 1-10 651 493 649 491 1-10 656 494 651 493 1-10 658 494 656 494 1-10 663 494 658 494 1-10 669 493 663 494 1-10 673 491 669 493 1-10 675 491 673 491 1-10 681 489 675 491 1-10 685 487 681 489 1-10 687 486 685 487 1-10 693 485 687 486 1-10 694 484 693 485 1-10 694 484 694 484 1_21 #000000 #ddefa9 16 50 47 23 257 12-10 771 479 758 482 1-10 776 478 771 479 1-10 778 477 776 478 1-10 783 475 778 477 1-10 787 472 783 475 1-10 789 471 787 472 1-10 793 468 789 471 1-10 799 463 793 468 1-10 801 458 799 463 1-10 806 448 801 458 1-10 806 446 806 448 1-10 807 441 806 446 1-10 807 439 807 441 1-10 806 434 807 439 1-10 805 432 806 434 1-10 805 431 805 432 1-10 801 426 805 431 1-10 797 422 801 426 1-10 792 420 797 422 1-10 787 419 792 420 1-10 781 417 787 419 1-10 779 417 781 417 1-10 773 418 779 417 1-10 768 419 773 418 1-10 763 421 768 419 1-10 759 424 763 421 1-10 755 428 759 424 1-10 749 434 755 428 1-10 747 439 749 434 1-10 743 446 747 439 1-10 741 451 743 446 1-10 739 457 741 451 1-10 739 463 739 457 1-10 738 471 739 463 1-10 738 473 738 471 1-10 739 482 738 473 1-10 740 487 739 482 1-10 741 489 740 487 1-10 745 496 741 489 1-10 746 497 745 496 1-10 747 499 746 497 1-10 751 503 747 499 1-10 753 503 751 503 1-10 761 506 753 503 1-10 766 506 761 506 1-10 771 506 766 506 1-10 779 504 771 506 1-10 785 503 779 504 1-10 792 499 785 503 1-10 796 496 792 499 1-10 801 493 796 496 1-10 808 489 801 493 1-10 810 487 808 489 1-10 810 487 810 487 1_21 #000000 #1a6029 16 50 47 23 257 12-10 837 439 838 431 1-10 836 447 837 439 1-10 835 453 836 447 1-10 834 461 835 453 1-10 833 470 834 461 1-10 832 475 833 470 1-10 831 481 832 475 1-10 830 486 831 481 1-10 829 491 830 486 1-10 829 493 829 491 1-10 829 495 829 493 1-10 829 495 829 495 1-10 829 496 829 495 1-10 833 486 829 496 1-10 837 477 833 486 1-10 841 471 837 477 1-10 845 463 841 471 1-10 849 456 845 463 1-10 852 452 849 456 1-10 855 447 852 452 1-10 859 443 855 447 1-10 863 439 859 443 1-10 864 438 863 439 1-10 865 437 864 438 1-10 867 435 865 437 1-10 869 435 867 435 1-10 871 434 869 435 1-10 873 433 871 434 1-10 875 434 873 433 1-10 876 435 875 434 1-10 878 436 876 435 1-10 879 437 878 436 1-10 883 441 879 437 1-10 885 447 883 441 1-10 886 452 885 447 1-10 887 457 886 452 1-10 887 461 887 457 1-10 887 467 887 461 1-10 887 473 887 467 1-10 886 475 887 473 1-10 886 481 886 475 1-10 885 483 886 481 1-10 885 491 885 483 1-10 885 493 885 491 1-10 885 494 885 493 1-10 886 496 885 494 1-10 886 496 886 496 1_21 #000000 #29ec97 16 50 47 23 257 12-10 963 437 971 433 1-10 955 441 963 437 1-10 945 447 955 441 1-10 939 453 945 447 1-10 933 461 939 453 1-10 930 465 933 461 1-10 925 475 930 465 1-10 924 480 925 475 1-10 924 482 924 480 1-10 924 487 924 482 1-10 925 493 924 487 1-10 926 494 925 493 1-10 928 499 926 494 1-10 933 504 928 499 1-10 937 507 933 504 1-10 946 509 937 507 1-10 954 509 946 509 1-10 963 509 954 509 1-10 967 507 963 509 1-10 976 503 967 507 1-10 989 498 976 503 1-10 989 498 989 498 1_21 #000000 #452699 16 50 47 23 257 12-10 1029 485 1023 485 1-10 1037 483 1029 485 1-10 1045 481 1037 483 1-10 1051 479 1045 481 1-10 1059 477 1051 479 1-10 1063 474 1059 477 1-10 1068 471 1063 474 1-10 1073 469 1068 471 1-10 1075 467 1073 469 1-10 1080 461 1075 467 1-10 1083 458 1080 461 1-10 1084 456 1083 458 1-10 1085 454 1084 456 1-10 1085 452 1085 454 1-10 1085 447 1085 452 1-10 1084 445 1085 447 1-10 1081 439 1084 445 1-10 1078 435 1081 439 1-10 1074 433 1078 435 1-10 1069 431 1074 433 1-10 1060 429 1069 431 1-10 1051 429 1060 429 1-10 1043 431 1051 429 1-10 1033 436 1043 431 1-10 1027 439 1033 436 1-10 1020 443 1027 439 1-10 1011 451 1020 443 1-10 1007 454 1011 451 1-10 1001 460 1007 454 1-10 998 465 1001 460 1-10 997 466 998 465 1-10 995 472 997 466 1-10 995 477 995 472 1-10 995 479 995 477 1-10 999 486 995 479 1-10 1002 491 999 486 1-10 1006 494 1002 491 1-10 1013 500 1006 494 1-10 1017 503 1013 500 1-10 1022 504 1017 503 1-10 1031 507 1022 504 1-10 1039 508 1031 507 1-10 1047 509 1039 508 1-10 1053 509 1047 509 1-10 1058 508 1053 509 1-10 1069 505 1058 508 1-10 1078 503 1069 505 1-10 1090 500 1078 503 1-10 1090 500 1090 500 1-__";
}

function getAuthorLogo()
{
    return "21 #000000 #765ccc 25 11 100 50 100 12-21 #000000 #cb9cdc 25 11 100 50 100 12-10 64 185 65 159 1-10 64 195 64 185 1-10 65 210 64 195 1-10 65 224 65 210 1-10 65 239 65 224 1-10 65 253 65 239 1-10 65 267 65 253 1-10 65 279 65 267 1-10 65 295 65 279 1-10 65 307 65 295 1-10 66 321 65 307 1-10 66 333 66 321 1-10 66 347 66 333 1-10 66 361 66 347 1-10 65 373 66 361 1-10 65 387 65 373 1-10 64 397 65 387 1-10 63 409 64 397 1-10 62 420 63 409 1-10 61 431 62 420 1-10 61 440 61 431 1-10 60 451 61 440 1-10 60 456 60 451 1-10 59 461 60 456 1-10 59 470 59 461 1-10 59 475 59 470 1-10 59 477 59 475 1-10 59 482 59 477 1-10 59 484 59 482 1-10 59 489 59 484 1-10 59 491 59 489 1-10 59 491 59 491 1-10 59 492 59 491 1-10 59 492 59 492 1_21 #000000 #b9a984 25 11 100 50 100 12-10 89 327 79 328 1-10 98 325 89 327 1-10 107 324 98 325 1-10 115 323 107 324 1-10 124 321 115 323 1-10 135 319 124 321 1-10 144 318 135 319 1-10 153 317 144 318 1-10 158 316 153 317 1-10 167 315 158 316 1-10 172 314 167 315 1-10 181 313 172 314 1-10 187 313 181 313 1-10 195 312 187 313 1-10 199 311 195 312 1-10 201 311 199 311 1-10 206 309 201 311 1-10 208 308 206 309 1-10 208 308 208 308 1_21 #000000 #b6c738 25 11 100 50 100 12-10 257 97 257 92 1-10 257 110 257 97 1-10 257 121 257 110 1-10 257 133 257 121 1-10 257 143 257 133 1-10 257 159 257 143 1-10 257 168 257 159 1-10 257 185 257 168 1-10 256 199 257 185 1-10 255 214 256 199 1-10 255 231 255 214 1-10 255 248 255 231 1-10 255 260 255 248 1-10 255 278 255 260 1-10 255 295 255 278 1-10 254 309 255 295 1-10 254 324 254 309 1-10 254 341 254 324 1-10 254 353 254 341 1-10 255 370 254 353 1-10 254 385 255 370 1-10 254 395 254 385 1-10 254 410 254 395 1-10 253 419 254 410 1-10 253 433 253 419 1-10 253 439 253 433 1-10 252 451 253 439 1-10 251 459 252 451 1-10 250 464 251 459 1-10 249 469 250 464 1-10 249 471 249 469 1-10 248 477 249 471 1-10 247 479 248 477 1-10 247 479 247 479 1-10 247 479 247 479 1_21 #000000 #8a98ab 25 11 100 50 100 12-10 326 220 310 213 1-10 331 222 326 220 1-10 339 224 331 222 1-10 345 226 339 224 1-10 353 229 345 226 1-10 360 232 353 229 1-10 365 234 360 232 1-10 370 237 365 234 1-10 371 237 370 237 1-10 377 239 371 237 1-10 378 240 377 239 1-10 380 241 378 240 1-10 381 242 380 241 1-10 384 243 381 242 1-10 385 243 384 243 1-10 387 245 385 243 1-10 387 245 387 245 1_21 #000000 #1e1d92 25 11 100 50 100 12-10 358 336 358 328 1-10 358 344 358 336 1-10 357 350 358 344 1-10 357 361 357 350 1-10 356 370 357 361 1-10 355 379 356 370 1-10 354 387 355 379 1-10 353 396 354 387 1-10 353 407 353 396 1-10 353 413 353 407 1-10 353 421 353 413 1-10 353 431 353 421 1-10 353 435 353 431 1-10 354 441 353 435 1-10 354 445 354 441 1-10 355 451 354 445 1-10 355 453 355 451 1-10 355 455 355 453 1-10 355 457 355 455 1-10 355 463 355 457 1-10 355 465 355 463 1-10 355 467 355 465 1-10 355 467 355 467 1_21 #000000 #e05d29 25 11 100 50 100 12-10 733 164 701 167 1-10 745 162 733 164 1-10 753 161 745 162 1-10 765 161 753 161 1-10 775 161 765 161 1-10 783 159 775 161 1-10 793 159 783 159 1-10 801 159 793 159 1-10 810 158 801 159 1-10 815 158 810 158 1-10 823 158 815 158 1-10 826 158 823 158 1-10 834 157 826 158 1-10 839 157 834 157 1-10 845 156 839 157 1-10 850 155 845 156 1-10 855 155 850 155 1-10 857 154 855 155 1-10 857 154 857 154 1_21 #000000 #254ba4 25 11 100 50 100 12-10 775 205 777 194 1-10 775 211 775 205 1-10 772 225 775 211 1-10 770 235 772 225 1-10 767 246 770 235 1-10 765 257 767 246 1-10 764 269 765 257 1-10 762 281 764 269 1-10 760 303 762 281 1-10 759 318 760 303 1-10 759 326 759 318 1-10 759 338 759 326 1-10 759 347 759 338 1-10 759 359 759 347 1-10 759 368 759 359 1-10 760 379 759 368 1-10 760 388 760 379 1-10 761 397 760 388 1-10 760 408 761 397 1-10 760 414 760 408 1-10 759 422 760 414 1-10 759 428 759 422 1-10 758 433 759 428 1-10 757 441 758 433 1-10 756 447 757 441 1-10 755 448 756 447 1-10 755 450 755 448 1-10 755 452 755 450 1-10 754 457 755 452 1-10 754 457 754 457 1_21 #000000 #d24633 25 11 100 50 100 12-10 701 477 693 477 1-10 711 475 701 477 1-10 726 473 711 475 1-10 737 472 726 473 1-10 749 471 737 472 1-10 761 470 749 471 1-10 773 469 761 470 1-10 785 468 773 469 1-10 795 467 785 468 1-10 806 467 795 467 1-10 815 466 806 467 1-10 826 467 815 466 1-10 834 466 826 467 1-10 842 467 834 466 1-10 851 466 842 467 1-10 859 465 851 466 1-10 867 464 859 465 1-10 873 463 867 464 1-10 873 463 873 463 1_21 #000000 #b25e8d 25 11 100 50 100 12-10 924 341 923 333 1-10 924 349 924 341 1-10 923 359 924 349 1-10 923 368 923 359 1-10 921 380 923 368 1-10 920 391 921 380 1-10 919 401 920 391 1-10 919 412 919 401 1-10 918 421 919 412 1-10 917 432 918 421 1-10 917 437 917 432 1-10 917 446 917 437 1-10 917 451 917 446 1-10 917 457 917 451 1-10 917 458 917 457 1-10 918 460 917 458 1-10 919 462 918 460 1-10 919 464 919 462 1-10 919 465 919 464 1-10 922 461 919 465 1-10 929 448 922 461 1-10 935 437 929 448 1-10 941 423 935 437 1-10 946 409 941 423 1-10 953 396 946 409 1-10 957 385 953 396 1-10 963 373 957 385 1-10 967 365 963 373 1-10 971 354 967 365 1-10 975 347 971 354 1-10 976 345 975 347 1-10 979 340 976 345 1-10 980 338 979 340 1-10 981 337 980 338 1-10 981 337 981 337 1-10 981 336 981 337 1-10 982 336 981 336 1-10 984 337 982 336 1-10 989 345 984 337 1-10 992 350 989 345 1-10 995 365 992 350 1-10 996 370 995 365 1-10 997 385 996 370 1-10 997 393 997 385 1-10 998 451 997 393 1-10 998 456 998 451 1-10 999 461 998 456 1-10 999 467 999 461 1-10 1001 475 999 467 1-10 1001 475 1001 475 1-10 1001 476 1001 475 1-10 1001 477 1001 476 1-10 1001 477 1001 477 1-10 1005 473 1001 477 1-10 1013 463 1005 473 1-10 1019 453 1013 463 1-10 1027 441 1019 453 1-10 1033 431 1027 441 1-10 1043 417 1033 431 1-10 1050 407 1043 417 1-10 1057 398 1050 407 1-10 1062 391 1057 398 1-10 1066 387 1062 391 1-10 1071 381 1066 387 1-10 1073 379 1071 381 1-10 1079 373 1073 379 1-10 1081 373 1079 373 1-10 1082 371 1081 373 1-10 1084 371 1082 371 1-10 1089 372 1084 371 1-10 1095 373 1089 372 1-10 1096 375 1095 373 1-10 1103 385 1096 375 1-10 1106 392 1103 385 1-10 1109 402 1106 392 1-10 1111 411 1109 402 1-10 1113 423 1111 411 1-10 1113 435 1113 423 1-10 1113 443 1113 435 1-10 1113 455 1113 443 1-10 1113 461 1113 455 1-10 1112 469 1113 461 1-10 1111 477 1112 469 1-10 1111 479 1111 477 1-10 1111 481 1111 479 1-10 1111 483 1111 481 1-10 1111 485 1111 483 1-10 1111 485 1111 485 1_21 #000000 #b2d6e9 25 11 100 50 100 12-10 980 194 985 187 1-10 973 203 980 194 1-10 965 213 973 203 1-10 955 225 965 213 1-10 947 236 955 225 1-10 937 246 947 236 1-10 929 256 937 246 1-10 921 265 929 256 1-10 911 275 921 265 1-10 902 282 911 275 1-10 893 289 902 282 1-10 884 297 893 289 1-10 879 299 884 297 1-10 872 303 879 299 1-10 870 304 872 303 1-10 870 304 870 304 1__20 1-21 #000000 #4cbee3 25 11 100 50 100 12-10 131 84 137 77 1-10 125 94 131 84 1-10 119 101 125 94 1-10 111 109 119 101 1-10 102 120 111 109 1-10 93 128 102 120 1-10 85 139 93 128 1-10 77 148 85 139 1-10 67 159 77 148 1-10 59 168 67 159 1-10 51 177 59 168 1-10 42 188 51 177 1-10 35 197 42 188 1-10 29 207 35 197 1-10 21 216 29 207 1-10 14 225 21 216 1-10 9 234 14 225 1-10 9 236 9 234 1-10 5 245 9 236 1-10 5 247 5 245 1-10 5 255 5 247 1-10 5 256 5 255 1-10 6 257 5 256 1-10 14 263 6 257 1-10 16 263 14 263 1-10 25 266 16 263 1-10 30 267 25 266 1-10 39 269 30 267 1-10 47 271 39 269 1-10 56 272 47 271 1-10 65 274 56 272 1-10 70 276 65 274 1-10 79 279 70 276 1-10 87 282 79 279 1-10 95 285 87 282 1-10 103 289 95 285 1-10 108 291 103 289 1-10 115 296 108 291 1-10 119 300 115 296 1-10 125 305 119 300 1-10 129 309 125 305 1-10 133 317 129 309 1-10 136 321 133 317 1-10 137 327 136 321 1-10 139 338 137 327 1-10 139 346 139 338 1-10 137 355 139 346 1-10 133 365 137 355 1-10 127 375 133 365 1-10 121 387 127 375 1-10 115 395 121 387 1-10 106 407 115 395 1-10 98 415 106 407 1-10 92 421 98 415 1-10 84 431 92 421 1-10 78 437 84 431 1-10 73 441 78 437 1-10 69 444 73 441 1-10 63 446 69 444 1-10 62 447 63 446 1-10 60 448 62 447 1-10 58 449 60 448 1-10 57 449 58 449 1-10 56 449 57 449 1-10 55 449 56 449 1-10 55 449 55 449 1_21 #000000 #e33cc3 25 11 100 50 100 12-10 172 295 173 286 1-10 171 300 172 295 1-10 171 309 171 300 1-10 170 318 171 309 1-10 169 327 170 318 1-10 169 335 169 327 1-10 169 341 169 335 1-10 169 350 169 341 1-10 169 361 169 350 1-10 169 367 169 361 1-10 169 376 169 367 1-10 169 385 169 376 1-10 169 390 169 385 1-10 170 395 169 390 1-10 171 401 170 395 1-10 171 406 171 401 1-10 173 411 171 406 1-10 173 413 173 411 1-10 175 415 173 413 1-10 177 419 175 415 1-10 179 421 177 419 1-10 182 425 179 421 1-10 183 425 182 425 1-10 185 426 183 425 1-10 189 427 185 426 1-10 195 426 189 427 1-10 199 424 195 426 1-10 204 421 199 424 1-10 211 415 204 421 1-10 217 408 211 415 1-10 221 401 217 408 1-10 225 393 221 401 1-10 231 383 225 393 1-10 234 375 231 383 1-10 238 365 234 375 1-10 241 357 238 365 1-10 245 349 241 357 1-10 248 337 245 349 1-10 251 329 248 337 1-10 253 321 251 329 1-10 255 312 253 321 1-10 257 298 255 312 1-10 258 297 257 298 1-10 258 296 258 297 1-10 258 295 258 296 1-10 258 296 258 295 1-10 257 301 258 296 1-10 257 310 257 301 1-10 257 327 257 310 1-10 257 339 257 327 1-10 255 359 257 339 1-10 254 379 255 359 1-10 254 387 254 379 1-10 253 397 254 387 1-10 253 408 253 397 1-10 253 410 253 408 1-10 253 413 253 410 1-10 253 415 253 413 1-10 253 415 253 415 1_21 #000000 #5720b5 25 11 100 50 100 12-10 323 319 325 299 1-10 322 327 323 319 1-10 321 336 322 327 1-10 315 404 321 336 1-10 315 406 315 404 1-10 315 412 315 406 1-10 315 416 315 412 1-10 315 417 315 416 1-10 315 417 315 417 1-10 320 407 315 417 1-10 325 399 320 407 1-10 329 389 325 399 1-10 332 385 329 389 1-10 337 374 332 385 1-10 342 366 337 374 1-10 347 359 342 366 1-10 351 351 347 359 1-10 354 347 351 351 1-10 355 345 354 347 1-10 359 341 355 345 1-10 360 340 359 341 1-10 365 337 360 340 1-10 366 335 365 337 1-10 371 333 366 335 1-10 372 331 371 333 1-10 377 330 372 331 1-10 379 329 377 330 1-10 381 329 379 329 1-10 381 329 381 329 1_21 #000000 #c66fb7 25 11 100 50 100 12-10 398 323 397 317 1-10 401 331 398 323 1-10 402 336 401 331 1-10 405 345 402 336 1-10 407 350 405 345 1-10 410 361 407 350 1-10 412 367 410 361 1-10 415 374 412 367 1-10 419 383 415 374 1-10 420 387 419 383 1-10 423 393 420 387 1-10 425 401 423 393 1-10 427 405 425 401 1-10 429 410 427 405 1-10 430 411 429 410 1-10 431 413 430 411 1-10 431 415 431 413 1-10 432 415 431 415 1-10 433 416 432 415 1-10 433 417 433 416 1-10 433 416 433 417 1-10 437 412 433 416 1-10 442 402 437 412 1-10 446 395 442 402 1-10 450 383 446 395 1-10 453 372 450 383 1-10 457 363 453 372 1-10 461 352 457 363 1-10 464 343 461 352 1-10 467 335 464 343 1-10 469 327 467 335 1-10 471 323 469 327 1-10 471 321 471 323 1-10 473 315 471 321 1-10 473 313 473 315 1-10 474 308 473 313 1-10 475 307 474 308 1-10 475 305 475 307 1-10 475 304 475 305 1-10 475 304 475 304 1_21 #000000 #a6bbc7 25 11 100 50 100 12-10 527 387 519 387 1-10 533 387 527 387 1-10 541 387 533 387 1-10 549 387 541 387 1-10 551 387 549 387 1-10 559 386 551 387 1-10 565 385 559 386 1-10 570 385 565 385 1-10 572 385 570 385 1-10 578 383 572 385 1-10 583 381 578 383 1-10 588 380 583 381 1-10 589 379 588 380 1-10 594 376 589 379 1-10 598 373 594 376 1-10 599 372 598 373 1-10 603 367 599 372 1-10 605 362 603 367 1-10 608 354 605 362 1-10 609 349 608 354 1-10 610 344 609 349 1-10 609 338 610 344 1-10 607 330 609 338 1-10 606 325 607 330 1-10 603 321 606 325 1-10 598 314 603 321 1-10 594 310 598 314 1-10 587 305 594 310 1-10 583 301 587 305 1-10 578 299 583 301 1-10 573 297 578 299 1-10 564 296 573 297 1-10 559 296 564 296 1-10 553 298 559 296 1-10 545 302 553 298 1-10 541 305 545 302 1-10 537 308 541 305 1-10 531 315 537 308 1-10 527 322 531 315 1-10 525 327 527 322 1-10 521 335 525 327 1-10 520 343 521 335 1-10 519 349 520 343 1-10 519 360 519 349 1-10 520 368 519 360 1-10 521 376 520 368 1-10 522 385 521 376 1-10 524 390 522 385 1-10 527 397 524 390 1-10 531 405 527 397 1-10 533 410 531 405 1-10 536 414 533 410 1-10 539 417 536 414 1-10 544 421 539 417 1-10 549 423 544 421 1-10 553 424 549 423 1-10 559 425 553 424 1-10 564 425 559 425 1-10 569 424 564 425 1-10 578 422 569 424 1-10 586 420 578 422 1-10 595 417 586 420 1-10 603 413 595 417 1-10 607 410 603 413 1-10 607 410 607 410 1_21 #000000 #e87066 25 11 100 50 100 12-10 641 335 637 330 1-10 643 339 641 335 1-10 646 343 643 339 1-10 649 347 646 343 1-10 651 352 649 347 1-10 654 357 651 352 1-10 659 364 654 357 1-10 659 366 659 364 1-10 662 371 659 366 1-10 667 378 662 371 1-10 669 382 667 378 1-10 672 387 669 382 1-10 675 391 672 387 1-10 676 393 675 391 1-10 680 396 676 393 1-10 681 398 680 396 1-10 684 401 681 398 1-10 685 403 684 401 1-10 685 403 685 403 1-10 687 405 685 403 1-10 688 406 687 405 1-10 689 407 688 406 1-10 689 408 689 407 1-10 691 409 689 408 1-10 691 409 691 409 1_21 #000000 #9b3fae 25 11 100 50 100 12-10 745 337 749 329 1-10 741 345 745 337 1-10 737 353 741 345 1-10 731 363 737 353 1-10 727 370 731 363 1-10 721 380 727 370 1-10 715 389 721 380 1-10 711 397 715 389 1-10 703 407 711 397 1-10 697 417 703 407 1-10 687 429 697 417 1-10 680 438 687 429 1-10 672 447 680 438 1-10 664 457 672 447 1-10 655 465 664 457 1-10 646 473 655 465 1-10 639 479 646 473 1-10 633 484 639 479 1-10 628 487 633 484 1-10 623 489 628 487 1-10 618 492 623 489 1-10 613 494 618 492 1-10 609 497 613 494 1-10 603 499 609 497 1-10 599 500 603 499 1-10 593 502 599 500 1-10 591 502 593 502 1-10 586 503 591 502 1-10 586 503 586 503 1_21 #000000 #3c3539 25 11 100 50 100 12-10 783 361 786 353 1-10 781 365 783 361 1-10 779 373 781 365 1-10 776 381 779 373 1-10 775 386 776 381 1-10 774 391 775 386 1-10 773 397 774 391 1-10 773 402 773 397 1-10 775 407 773 402 1-10 777 412 775 407 1-10 779 416 777 412 1-10 782 421 779 416 1-10 785 425 782 421 1-10 789 427 785 425 1-10 794 430 789 427 1-10 799 432 794 430 1-10 807 434 799 432 1-10 813 434 807 434 1-10 818 433 813 434 1-10 823 432 818 433 1-10 831 429 823 432 1-10 836 427 831 429 1-10 843 422 836 427 1-10 847 418 843 422 1-10 853 411 847 418 1-10 856 407 853 411 1-10 860 399 856 407 1-10 861 394 860 399 1-10 863 389 861 394 1-10 863 383 863 389 1-10 863 378 863 383 1-10 862 375 863 378 1-10 861 370 862 375 1-10 857 365 861 370 1-10 854 361 857 365 1-10 847 355 854 361 1-10 843 353 847 355 1-10 835 348 843 353 1-10 827 345 835 348 1-10 822 343 827 345 1-10 817 343 822 343 1-10 812 341 817 343 1-10 807 341 812 341 1-10 801 341 807 341 1-10 799 341 801 341 1-10 797 341 799 341 1-10 795 342 797 341 1-10 793 342 795 342 1-10 793 342 793 342 1-10 792 342 793 342 1-10 792 342 792 342 1_21 #000000 #67d78b 25 11 100 50 100 12-10 903 318 902 309 1-10 903 320 903 318 1-10 904 328 903 320 1-10 904 337 904 328 1-10 905 342 904 337 1-10 905 347 905 342 1-10 905 356 905 347 1-10 905 365 905 356 1-10 905 367 905 365 1-10 904 376 905 367 1-10 903 385 904 376 1-10 903 390 903 385 1-10 903 393 903 390 1-10 903 398 903 393 1-10 903 400 903 398 1-10 902 405 903 400 1-10 902 406 902 405 1-10 902 408 902 406 1-10 902 409 902 408 1-10 902 409 902 409 1-10 902 410 902 409 1-10 902 409 902 410 1-10 903 407 902 409 1-10 903 402 903 407 1-10 904 401 903 402 1-10 908 393 904 401 1-10 911 388 908 393 1-10 914 383 911 388 1-10 917 379 914 383 1-10 923 373 917 379 1-10 929 367 923 373 1-10 933 364 929 367 1-10 940 359 933 364 1-10 941 358 940 359 1-10 949 354 941 358 1-10 951 353 949 354 1-10 953 353 951 353 1-10 957 351 953 353 1-10 959 350 957 351 1-10 961 349 959 350 1-10 963 349 961 349 1-10 964 349 963 349 1-10 965 349 964 349 1-10 967 348 965 349 1-10 968 348 967 348 1-10 973 347 968 348 1-10 973 347 973 347 1_21 #000000 #8986e1 25 11 100 50 100 12-10 1021 189 1020 187 1-10 1022 204 1021 189 1-10 1022 209 1022 204 1-10 1022 223 1022 209 1-10 1022 231 1022 223 1-10 1022 240 1022 231 1-10 1021 255 1022 240 1-10 1021 263 1021 255 1-10 1021 277 1021 263 1-10 1020 286 1021 277 1-10 1020 298 1020 286 1-10 1019 309 1020 298 1-10 1019 321 1019 309 1-10 1019 329 1019 321 1-10 1021 343 1019 329 1-10 1021 349 1021 343 1-10 1022 363 1021 349 1-10 1023 369 1022 363 1-10 1023 380 1023 369 1-10 1023 389 1023 380 1-10 1023 393 1023 389 1-10 1023 402 1023 393 1-10 1023 407 1023 402 1-10 1023 410 1023 407 1-10 1023 411 1023 410 1-10 1023 413 1023 411 1-10 1022 419 1023 413 1-10 1022 421 1022 419 1-10 1022 423 1022 421 1-10 1022 423 1022 423 1-10 1022 423 1022 423 1_21 #000000 #7f1d32 25 11 100 50 100 12-10 1085 323 1088 318 1-10 1082 327 1085 323 1-10 1081 328 1082 327 1-10 1074 333 1081 328 1-10 1070 337 1074 333 1-10 1067 341 1070 337 1-10 1062 345 1067 341 1-10 1058 348 1062 345 1-10 1053 351 1058 348 1-10 1049 353 1053 351 1-10 1047 354 1049 353 1-10 1043 357 1047 354 1-10 1041 357 1043 357 1-10 1039 359 1041 357 1-10 1037 360 1039 359 1-10 1036 361 1037 360 1-10 1035 362 1036 361 1-10 1034 363 1035 362 1-10 1033 363 1034 363 1-10 1033 363 1033 363 1-10 1034 365 1033 363 1-10 1037 369 1034 365 1-10 1038 371 1037 369 1-10 1043 377 1038 371 1-10 1050 386 1043 377 1-10 1055 392 1050 386 1-10 1061 398 1055 392 1-10 1068 407 1061 398 1-10 1075 415 1068 407 1-10 1084 423 1075 415 1-10 1089 426 1084 423 1-10 1094 431 1089 426 1-10 1099 434 1094 431 1-10 1099 434 1099 434 1-10 1101 435 1099 434 1-10 1101 435 1101 435 1__20 1-21 #000000 #a92c7a 25 11 100 50 100 12-10 111 80 111 75 1-10 110 89 111 80 1-10 109 94 110 89 1-10 109 102 109 94 1-10 108 113 109 102 1-10 107 119 108 113 1-10 106 131 107 119 1-10 105 143 106 131 1-10 103 155 105 143 1-10 102 166 103 155 1-10 101 183 102 166 1-10 99 192 101 183 1-10 99 207 99 192 1-10 98 218 99 207 1-10 98 233 98 218 1-10 97 247 98 233 1-10 97 258 97 247 1-10 99 275 97 258 1-10 99 281 99 275 1-10 100 296 99 281 1-10 100 301 100 296 1-10 101 319 100 301 1-10 101 324 101 319 1-10 102 339 101 324 1-10 102 344 102 339 1-10 101 357 102 344 1-10 101 366 101 357 1-10 100 375 101 366 1-10 99 386 100 375 1-10 99 391 99 386 1-10 97 401 99 391 1-10 97 409 97 401 1-10 97 415 97 409 1-10 97 420 97 415 1-10 97 429 97 420 1-10 97 431 97 429 1-10 97 437 97 431 1-10 98 441 97 437 1-10 99 446 98 441 1-10 99 447 99 446 1-10 99 447 99 447 1-10 99 447 99 447 1_21 #000000 #9475ce 25 11 100 50 100 12-10 163 190 162 188 1-10 168 197 163 190 1-10 169 198 168 197 1-10 174 205 169 198 1-10 177 210 174 205 1-10 181 213 177 210 1-10 184 217 181 213 1-10 188 222 184 217 1-10 193 229 188 222 1-10 193 231 193 229 1-10 197 234 193 231 1-10 198 236 197 234 1-10 201 240 198 236 1-10 204 245 201 240 1-10 204 245 204 245 1_21 #000000 #14d435 25 11 100 50 100 12-10 192 369 193 323 1-10 191 381 192 369 1-10 189 389 191 381 1-10 188 395 189 389 1-10 186 417 188 395 1-10 186 427 186 417 1-10 186 430 186 427 1-10 187 433 186 430 1-10 188 437 187 433 1-10 189 439 188 437 1-10 189 439 189 439 1_21 #000000 #698730 25 11 100 50 100 12-10 264 321 264 312 1-10 265 327 264 321 1-10 265 338 265 327 1-10 266 347 265 338 1-10 269 384 266 347 1-10 273 410 269 384 1-10 275 418 273 410 1-10 277 426 275 418 1-10 280 434 277 426 1-10 281 435 280 434 1-10 283 440 281 435 1-10 283 441 283 440 1-10 284 443 283 441 1-10 285 444 284 443 1-10 285 445 285 444 1-10 289 441 285 445 1-10 294 434 289 441 1-10 299 427 294 434 1-10 303 416 299 427 1-10 306 409 303 416 1-10 311 397 306 409 1-10 314 389 311 397 1-10 317 377 314 389 1-10 321 369 317 377 1-10 323 363 321 369 1-10 327 353 323 363 1-10 329 347 327 353 1-10 330 343 329 347 1-10 331 337 330 343 1-10 332 336 331 337 1-10 333 334 332 336 1-10 333 331 333 334 1-10 333 330 333 331 1-10 333 328 333 330 1-10 333 327 333 328 1-10 333 327 333 327 1_21 #000000 #637fa9 25 11 100 50 100 12-10 403 407 395 407 1-10 411 407 403 407 1-10 417 407 411 407 1-10 422 407 417 407 1-10 427 406 422 407 1-10 432 405 427 406 1-10 437 405 432 405 1-10 439 405 437 405 1-10 444 403 439 405 1-10 449 403 444 403 1-10 451 403 449 403 1-10 456 401 451 403 1-10 457 400 456 401 1-10 459 399 457 400 1-10 463 396 459 399 1-10 465 395 463 396 1-10 468 390 465 395 1-10 471 387 468 390 1-10 473 381 471 387 1-10 475 376 473 381 1-10 475 371 475 376 1-10 475 363 475 371 1-10 474 357 475 363 1-10 472 349 474 357 1-10 469 342 472 349 1-10 465 337 469 342 1-10 460 331 465 337 1-10 454 324 460 331 1-10 450 321 454 324 1-10 445 318 450 321 1-10 441 315 445 318 1-10 435 314 441 315 1-10 427 313 435 314 1-10 421 313 427 313 1-10 416 315 421 313 1-10 411 317 416 315 1-10 402 323 411 317 1-10 398 327 402 323 1-10 392 334 398 327 1-10 388 342 392 334 1-10 385 350 388 342 1-10 381 361 385 350 1-10 380 370 381 361 1-10 379 381 380 370 1-10 379 390 379 381 1-10 379 399 379 390 1-10 381 408 379 399 1-10 383 416 381 408 1-10 386 424 383 416 1-10 389 432 386 424 1-10 392 437 389 432 1-10 397 443 392 437 1-10 401 447 397 443 1-10 407 453 401 447 1-10 413 459 407 453 1-10 417 461 413 459 1-10 422 463 417 461 1-10 427 465 422 463 1-10 433 465 427 465 1-10 441 465 433 465 1-10 451 464 441 465 1-10 459 461 451 464 1-10 470 457 459 461 1-10 479 454 470 457 1-10 489 449 479 454 1-10 497 445 489 449 1-10 508 440 497 445 1-10 520 435 508 440 1-10 520 435 520 435 1_21 #000000 #48cbe9 25 11 100 50 100 12-10 718 255 712 249 1-10 725 259 718 255 1-10 730 261 725 259 1-10 735 264 730 261 1-10 743 268 735 264 1-10 751 273 743 268 1-10 755 276 751 273 1-10 759 279 755 276 1-10 764 282 759 279 1-10 769 285 764 282 1-10 773 288 769 285 1-10 774 289 773 288 1-10 776 290 774 289 1-10 780 294 776 290 1-10 781 295 780 294 1-10 783 296 781 295 1-10 783 296 783 296 1_21 #000000 #7b502b 25 11 100 50 100 12-10 763 379 764 371 1-10 763 385 763 379 1-10 761 389 763 385 1-10 761 395 761 389 1-10 760 400 761 395 1-10 759 409 760 400 1-10 758 411 759 409 1-10 756 419 758 411 1-10 755 425 756 419 1-10 754 433 755 425 1-10 753 435 754 433 1-10 753 440 753 435 1-10 751 446 753 440 1-10 751 448 751 446 1-10 751 450 751 448 1-10 751 451 751 450 1-10 751 451 751 451 1_21 #000000 #9faebb 25 11 100 50 100 12-10 851 365 852 356 1-10 850 369 851 365 1-10 849 375 850 369 1-10 848 387 849 375 1-10 847 391 848 387 1-10 846 402 847 391 1-10 845 411 846 402 1-10 845 413 845 411 1-10 843 421 845 413 1-10 843 430 843 421 1-10 843 432 843 430 1-10 843 434 843 432 1-10 843 436 843 434 1-10 843 438 843 436 1-10 843 439 843 438 1-10 843 439 843 439 1-10 843 439 843 439 1-10 848 432 843 439 1-10 853 425 848 432 1-10 859 415 853 425 1-10 864 409 859 415 1-10 870 399 864 409 1-10 877 390 870 399 1-10 881 386 877 390 1-10 888 378 881 386 1-10 892 374 888 378 1-10 897 367 892 374 1-10 899 366 897 367 1-10 903 363 899 366 1-10 907 360 903 363 1-10 907 359 907 360 1-10 909 358 907 359 1-10 911 357 909 358 1-10 913 357 911 357 1-10 915 357 913 357 1-10 917 357 915 357 1-10 923 359 917 357 1-10 927 362 923 359 1-10 930 366 927 362 1-10 933 370 930 366 1-10 935 375 933 370 1-10 939 382 935 375 1-10 939 387 939 382 1-10 941 393 939 387 1-10 941 402 941 393 1-10 942 411 941 402 1-10 943 415 942 411 1-10 943 424 943 415 1-10 943 430 943 424 1-10 944 435 943 430 1-10 944 440 944 435 1-10 945 445 944 440 1-10 945 447 945 445 1-10 945 449 945 447 1-10 946 451 945 449 1-10 946 453 946 451 1-10 947 455 946 453 1-10 947 455 947 455 1__20 1-21 #000000 #cae163 25 11 100 50 100 12-10 59 111 50 113 1-10 67 109 59 111 1-10 76 107 67 109 1-10 85 106 76 107 1-10 99 103 85 106 1-10 107 103 99 103 1-10 119 101 107 103 1-10 128 100 119 101 1-10 142 99 128 100 1-10 151 97 142 99 1-10 162 96 151 97 1-10 171 95 162 96 1-10 185 94 171 95 1-10 197 93 185 94 1-10 209 91 197 93 1-10 217 89 209 91 1-10 231 88 217 89 1-10 241 87 231 88 1-10 252 86 241 87 1-10 260 84 252 86 1-10 269 83 260 84 1-10 277 81 269 83 1-10 283 79 277 81 1-10 288 78 283 79 1-10 296 76 288 78 1-10 298 75 296 76 1-10 303 75 298 75 1-10 305 74 303 75 1-10 307 74 305 74 1-10 309 73 307 74 1-10 311 73 309 73 1-10 311 73 311 73 1_21 #000000 #b8e925 25 11 100 50 100 12-10 182 131 181 123 1-10 182 140 182 131 1-10 182 152 182 140 1-10 182 164 182 152 1-10 181 173 182 164 1-10 180 187 181 173 1-10 179 200 180 187 1-10 178 214 179 200 1-10 176 229 178 214 1-10 175 245 176 229 1-10 175 261 175 245 1-10 174 277 175 261 1-10 175 294 174 277 1-10 175 305 175 294 1-10 176 320 175 305 1-10 177 333 176 320 1-10 178 347 177 333 1-10 179 361 178 347 1-10 179 370 179 361 1-10 180 385 179 370 1-10 181 393 180 385 1-10 181 405 181 393 1-10 181 414 181 405 1-10 181 423 181 414 1-10 181 431 181 423 1-10 181 437 181 431 1-10 181 441 181 437 1-10 180 447 181 441 1-10 180 451 180 447 1-10 180 452 180 451 1-10 179 453 180 452 1-10 179 455 179 453 1-10 179 456 179 455 1-10 179 456 179 456 1_21 #000000 #bfe78b 25 11 100 50 100 12-10 348 359 351 363 1-10 347 357 348 359 1-10 343 353 347 357 1-10 339 349 343 353 1-10 330 343 339 349 1-10 325 340 330 343 1-10 316 336 325 340 1-10 313 336 316 336 1-10 300 336 313 336 1-10 289 338 300 336 1-10 274 346 289 338 1-10 268 351 274 346 1-10 257 364 268 351 1-10 250 376 257 364 1-10 246 389 250 376 1-10 244 407 246 389 1-10 245 411 244 407 1-10 247 425 245 411 1-10 252 435 247 425 1-10 259 447 252 435 1-10 263 451 259 447 1-10 267 454 263 451 1-10 271 457 267 454 1-10 290 461 271 457 1-10 295 459 290 461 1-10 322 443 295 459 1-10 331 435 322 443 1-10 339 426 331 435 1-10 345 416 339 426 1-10 351 406 345 416 1-10 357 395 351 406 1-10 363 383 357 395 1-10 367 375 363 383 1-10 372 365 367 375 1-10 374 360 372 365 1-10 377 352 374 360 1-10 377 347 377 352 1-10 378 345 377 347 1-10 378 343 378 345 1-10 378 341 378 343 1-10 378 340 378 341 1-10 378 341 378 340 1-10 376 350 378 341 1-10 374 361 376 350 1-10 373 367 374 361 1-10 373 379 373 367 1-10 373 390 373 379 1-10 373 399 373 390 1-10 373 410 373 399 1-10 373 415 373 410 1-10 375 427 373 415 1-10 375 432 375 427 1-10 377 440 375 432 1-10 379 445 377 440 1-10 380 451 379 445 1-10 381 453 380 451 1-10 383 457 381 453 1-10 384 459 383 457 1-10 385 460 384 459 1-10 386 461 385 460 1-10 387 463 386 461 1-10 389 464 387 463 1-10 395 464 389 464 1-10 395 464 395 464 1_21 #000000 #263d81 25 11 100 50 100 12-10 417 267 404 260 1-10 422 269 417 267 1-10 430 271 422 269 1-10 435 273 430 271 1-10 440 275 435 273 1-10 445 276 440 275 1-10 453 278 445 276 1-10 456 279 453 278 1-10 461 280 456 279 1-10 466 281 461 280 1-10 468 282 466 281 1-10 470 282 468 282 1-10 470 282 470 282 1_21 #000000 #ab9135 25 11 100 50 100 12-10 448 366 449 357 1-10 448 371 448 366 1-10 447 377 448 371 1-10 445 386 447 377 1-10 445 391 445 386 1-10 443 400 445 391 1-10 442 409 443 400 1-10 441 413 442 409 1-10 441 421 441 413 1-10 441 430 441 421 1-10 441 432 441 430 1-10 441 437 441 432 1-10 441 439 441 437 1-10 441 445 441 439 1-10 441 447 441 445 1-10 441 452 441 447 1-10 441 453 441 452 1-10 442 454 441 453 1-10 442 455 442 454 1-10 442 455 442 455 1_21 #000000 #99ac83 25 11 100 50 100 12-10 523 343 523 337 1-10 524 351 523 343 1-10 525 356 524 351 1-10 525 365 525 356 1-10 526 370 525 365 1-10 528 379 526 370 1-10 529 387 528 379 1-10 531 393 529 387 1-10 533 401 531 393 1-10 534 410 533 401 1-10 535 415 534 410 1-10 537 421 535 415 1-10 539 429 537 421 1-10 540 434 539 429 1-10 541 436 540 434 1-10 543 441 541 436 1-10 543 443 543 441 1-10 545 448 543 443 1-10 546 448 545 448 1-10 546 449 546 448 1-10 547 449 546 449 1-10 548 447 547 449 1-10 553 441 548 447 1-10 555 435 553 441 1-10 559 425 555 435 1-10 561 417 559 425 1-10 563 408 561 417 1-10 565 395 563 408 1-10 567 387 565 395 1-10 569 378 567 387 1-10 572 369 569 378 1-10 574 361 572 369 1-10 576 353 574 361 1-10 577 347 576 353 1-10 579 342 577 347 1-10 580 337 579 342 1-10 580 335 580 337 1-10 581 333 580 335 1-10 581 331 581 333 1-10 581 329 581 331 1-10 581 329 581 329 1-10 582 330 581 329 1-10 585 338 582 330 1-10 587 343 585 338 1-10 588 349 587 343 1-10 589 361 588 349 1-10 591 366 589 361 1-10 593 374 591 366 1-10 595 385 593 374 1-10 597 390 595 385 1-10 599 399 597 390 1-10 601 409 599 399 1-10 603 417 601 409 1-10 605 425 603 417 1-10 606 430 605 425 1-10 607 435 606 430 1-10 609 439 607 435 1-10 610 441 609 439 1-10 611 443 610 441 1-10 611 445 611 443 1-10 612 447 611 445 1-10 613 447 612 447 1-10 614 446 613 447 1-10 621 440 614 446 1-10 627 433 621 440 1-10 632 426 627 433 1-10 639 413 632 426 1-10 643 406 639 413 1-10 647 395 643 406 1-10 651 386 647 395 1-10 655 375 651 386 1-10 657 367 655 375 1-10 659 362 657 367 1-10 661 354 659 362 1-10 663 349 661 354 1-10 663 344 663 349 1-10 664 342 663 344 1-10 664 342 664 342 1_21 #000000 #38b8b7 25 11 100 50 100 12-10 795 344 799 347 1-10 790 341 795 344 1-10 785 339 790 341 1-10 780 337 785 339 1-10 775 336 780 337 1-10 769 335 775 336 1-10 764 335 769 335 1-10 759 335 764 335 1-10 753 335 759 335 1-10 747 336 753 335 1-10 739 339 747 336 1-10 734 341 739 339 1-10 729 345 734 341 1-10 724 351 729 345 1-10 720 354 724 351 1-10 715 361 720 354 1-10 713 366 715 361 1-10 709 373 713 366 1-10 707 381 709 373 1-10 707 387 707 381 1-10 706 393 707 387 1-10 707 401 706 393 1-10 708 410 707 401 1-10 709 415 708 410 1-10 711 420 709 415 1-10 714 425 711 420 1-10 717 431 714 425 1-10 720 435 717 431 1-10 725 438 720 435 1-10 729 441 725 438 1-10 735 444 729 441 1-10 740 445 735 444 1-10 748 445 740 445 1-10 753 445 748 445 1-10 762 443 753 445 1-10 770 440 762 443 1-10 778 435 770 440 1-10 785 429 778 435 1-10 792 424 785 429 1-10 798 417 792 424 1-10 803 410 798 417 1-10 806 405 803 410 1-10 810 397 806 405 1-10 814 390 810 397 1-10 817 383 814 390 1-10 820 378 817 383 1-10 822 373 820 378 1-10 824 367 822 373 1-10 826 362 824 367 1-10 827 360 826 362 1-10 828 355 827 360 1-10 829 353 828 355 1-10 829 352 829 353 1-10 829 351 829 352 1-10 829 351 829 351 1-10 829 351 829 351 1-10 829 357 829 351 1-10 828 365 829 357 1-10 827 373 828 365 1-10 827 382 827 373 1-10 826 391 827 382 1-10 826 399 826 391 1-10 826 408 826 399 1-10 826 416 826 408 1-10 826 425 826 416 1-10 827 430 826 425 1-10 827 435 827 430 1-10 828 440 827 435 1-10 829 445 828 440 1-10 830 447 829 445 1-10 832 452 830 447 1-10 833 453 832 452 1-10 835 455 833 453 1-10 836 455 835 455 1-10 845 457 836 455 1-10 853 456 845 457 1-10 861 452 853 456 1-10 869 447 861 452 1-10 881 441 869 447 1-10 881 441 881 441 1_21 #000000 #2098bb 25 11 100 50 100 12-10 907 365 907 356 1-10 906 370 907 365 1-10 904 379 906 370 1-10 903 387 904 379 1-10 901 396 903 387 1-10 899 405 901 396 1-10 897 413 899 405 1-10 896 418 897 413 1-10 895 427 896 418 1-10 894 432 895 427 1-10 893 433 894 432 1-10 893 435 893 433 1-10 893 437 893 435 1-10 893 439 893 437 1-10 893 440 893 439 1-10 896 436 893 440 1-10 901 429 896 436 1-10 908 417 901 429 1-10 913 409 908 417 1-10 918 399 913 409 1-10 923 391 918 399 1-10 927 384 923 391 1-10 933 373 927 384 1-10 935 369 933 373 1-10 939 361 935 369 1-10 941 355 939 361 1-10 944 351 941 355 1-10 947 346 944 351 1-10 947 345 947 346 1-10 949 343 947 345 1-10 949 342 949 343 1-10 950 341 949 342 1-10 951 341 950 341 1-10 955 343 951 341 1-10 959 347 955 343 1-10 962 352 959 347 1-10 965 360 962 352 1-10 969 368 965 360 1-10 971 376 969 368 1-10 974 387 971 376 1-10 976 395 974 387 1-10 978 407 976 395 1-10 979 413 978 407 1-10 981 425 979 413 1-10 983 433 981 425 1-10 983 439 983 433 1-10 984 447 983 439 1-10 985 453 984 447 1-10 985 455 985 453 1-10 986 457 985 455 1-10 986 459 986 457 1-10 987 461 986 459 1-10 988 463 987 461 1-10 989 463 988 463 1-10 989 463 989 463 1__20 1-21 #000000 #ea8e2d 25 11 100 50 100 12-10 45 98 39 82 1-10 47 103 45 98 1-10 50 115 47 103 1-10 52 120 50 115 1-10 57 130 52 120 1-10 59 139 57 130 1-10 63 147 59 139 1-10 66 158 63 147 1-10 70 165 66 158 1-10 76 181 70 165 1-10 78 186 76 181 1-10 81 191 78 186 1-10 84 199 81 191 1-10 85 200 84 199 1-10 87 205 85 200 1-10 87 207 87 205 1-10 88 207 87 207 1-10 89 208 88 207 1-10 89 209 89 208 1-10 89 209 89 209 1-10 90 209 89 209 1-10 90 209 90 209 1_21 #000000 #51bc2c 25 11 100 50 100 12-10 164 91 163 82 1-10 165 96 164 91 1-10 166 104 165 96 1-10 169 115 166 104 1-10 169 121 169 115 1-10 171 129 169 121 1-10 173 141 171 129 1-10 174 146 173 141 1-10 176 154 174 146 1-10 177 163 176 154 1-10 178 167 177 163 1-10 179 173 178 167 1-10 180 179 179 173 1-10 182 184 180 179 1-10 182 185 182 184 1-10 183 187 182 185 1-10 183 189 183 187 1-10 184 191 183 189 1-10 185 191 184 191 1-10 185 192 185 191 1-10 185 192 185 192 1-10 185 192 185 192 1_21 #000000 #928cda 25 11 100 50 100 12-10 307 77 307 71 1-10 307 85 307 77 1-10 305 97 307 85 1-10 305 102 305 97 1-10 303 114 305 102 1-10 303 119 303 114 1-10 301 128 303 119 1-10 301 137 301 128 1-10 300 142 301 137 1-10 299 148 300 142 1-10 299 156 299 148 1-10 299 161 299 156 1-10 299 164 299 161 1-10 299 166 299 164 1-10 299 168 299 166 1-10 299 169 299 168 1-10 299 170 299 169 1-10 299 171 299 170 1-10 299 171 299 171 1_21 #000000 #d984e1 25 11 100 50 100 12-10 467 76 468 67 1-10 464 87 467 76 1-10 461 97 464 87 1-10 458 106 461 97 1-10 455 119 458 106 1-10 453 125 455 119 1-10 450 136 453 125 1-10 447 143 450 136 1-10 445 149 447 143 1-10 442 159 445 149 1-10 441 161 442 159 1-10 439 169 441 161 1-10 438 171 439 169 1-10 437 177 438 171 1-10 435 181 437 177 1-10 433 187 435 181 1-10 433 187 433 187 1_21 #000000 #c23b35 25 11 100 50 100 12-10 51 290 51 281 1-10 52 298 51 290 1-10 52 301 52 298 1-10 53 312 52 301 1-10 54 320 53 312 1-10 55 328 54 320 1-10 55 337 55 328 1-10 55 345 55 337 1-10 57 356 55 345 1-10 57 365 57 356 1-10 58 374 57 365 1-10 59 385 58 374 1-10 59 394 59 385 1-10 59 403 59 394 1-10 59 414 59 403 1-10 60 425 59 414 1-10 60 433 60 425 1-10 61 442 60 433 1-10 61 451 61 442 1-10 62 459 61 451 1-10 63 467 62 459 1-10 63 473 63 467 1-10 64 481 63 473 1-10 65 483 64 481 1-10 65 489 65 483 1-10 66 494 65 489 1-10 66 497 66 494 1-10 67 501 66 497 1-10 67 502 67 501 1-10 68 504 67 502 1-10 68 505 68 504 1-10 69 507 68 505 1-10 69 508 69 507 1-10 69 509 69 508 1-10 69 510 69 509 1-10 69 512 69 510 1-10 69 513 69 512 1-10 69 513 69 513 1-10 69 514 69 513 1-10 70 516 69 514 1-10 71 518 70 516 1-10 71 520 71 518 1-10 72 521 71 520 1-10 73 522 72 521 1-10 73 522 73 522 1-10 75 523 73 522 1-10 77 525 75 523 1-10 81 526 77 525 1-10 86 528 81 526 1-10 95 529 86 528 1-10 99 529 95 529 1-10 108 529 99 529 1-10 117 529 108 529 1-10 125 529 117 529 1-10 134 529 125 529 1-10 145 529 134 529 1-10 154 529 145 529 1-10 163 529 154 529 1-10 172 529 163 529 1-10 184 529 172 529 1-10 195 529 184 529 1-10 207 529 195 529 1-10 215 529 207 529 1-10 229 528 215 529 1-10 238 527 229 528 1-10 250 526 238 527 1-10 259 525 250 526 1-10 271 523 259 525 1-10 283 521 271 523 1-10 292 519 283 521 1-10 303 519 292 519 1-10 314 517 303 519 1-10 323 516 314 517 1-10 332 515 323 516 1-10 341 514 332 515 1-10 349 513 341 514 1-10 357 511 349 513 1-10 363 511 357 511 1-10 371 509 363 511 1-10 377 508 371 509 1-10 382 506 377 508 1-10 390 505 382 506 1-10 395 503 390 505 1-10 399 502 395 503 1-10 405 500 399 502 1-10 411 499 405 500 1-10 413 499 411 499 1-10 418 499 413 499 1-10 419 498 418 499 1-10 421 498 419 498 1-10 423 497 421 498 1-10 425 497 423 497 1-10 427 496 425 497 1-10 430 495 427 496 1-10 431 495 430 495 1-10 433 494 431 495 1-10 435 493 433 494 1-10 437 492 435 493 1-10 439 491 437 492 1-10 442 487 439 491 1-10 445 483 442 487 1-10 447 478 445 483 1-10 450 473 447 478 1-10 452 468 450 473 1-10 455 460 452 468 1-10 459 452 455 460 1-10 461 444 459 452 1-10 464 435 461 444 1-10 466 427 464 435 1-10 468 419 466 427 1-10 470 411 468 419 1-10 471 401 470 411 1-10 473 392 471 401 1-10 475 383 473 392 1-10 477 371 475 383 1-10 478 365 477 371 1-10 479 353 478 365 1-10 481 344 479 353 1-10 483 335 481 344 1-10 485 327 483 335 1-10 485 318 485 327 1-10 486 310 485 318 1-10 487 304 486 310 1-10 487 296 487 304 1-10 487 291 487 296 1-10 487 283 487 291 1-10 487 281 487 283 1-10 487 275 487 281 1-10 487 273 487 275 1-10 487 268 487 273 1-10 487 266 487 268 1-10 487 264 487 266 1-10 487 262 487 264 1-10 487 261 487 262 1-10 487 261 487 261 1-10 487 261 487 261 1_21 #000000 #b7a93a 25 11 100 50 100 12-10 99 313 100 301 1-10 99 319 99 313 1-10 99 324 99 319 1-10 98 332 99 324 1-10 98 341 98 332 1-10 98 347 98 341 1-10 97 352 98 347 1-10 97 360 97 352 1-10 97 362 97 360 1-10 97 368 97 362 1-10 97 370 97 368 1-10 97 375 97 370 1-10 97 377 97 375 1-10 98 379 97 377 1-10 98 381 98 379 1-10 99 383 98 381 1-10 99 383 99 383 1-10 99 384 99 383 1-10 99 385 99 384 1-10 99 385 99 385 1-10 99 386 99 385 1-10 99 387 99 386 1-10 99 387 99 387 1-10 101 388 99 387 1-10 103 388 101 388 1-10 109 389 103 388 1-10 115 389 109 389 1-10 123 388 115 389 1-10 128 387 123 388 1-10 137 387 128 387 1-10 145 385 137 387 1-10 151 385 145 385 1-10 156 384 151 385 1-10 164 383 156 384 1-10 169 382 164 383 1-10 175 381 169 382 1-10 183 379 175 381 1-10 189 379 183 379 1-10 195 378 189 379 1-10 199 377 195 378 1-10 205 376 199 377 1-10 206 376 205 376 1-10 208 375 206 376 1-10 210 375 208 375 1-10 211 374 210 375 1-10 213 373 211 374 1-10 214 372 213 373 1-10 216 370 214 372 1-10 217 369 216 370 1-10 219 364 217 369 1-10 220 362 219 364 1-10 221 357 220 362 1-10 222 352 221 357 1-10 223 350 222 352 1-10 223 344 223 350 1-10 223 339 223 344 1-10 223 330 223 339 1-10 223 325 223 330 1-10 223 323 223 325 1-10 223 315 223 323 1-10 223 310 223 315 1-10 223 305 223 310 1-10 223 303 223 305 1-10 223 301 223 303 1-10 223 300 223 301 1-10 223 299 223 300 1-10 223 299 223 299 1-10 223 298 223 299 1-10 223 297 223 298 1-10 221 297 223 297 1-10 219 297 221 297 1-10 214 298 219 297 1-10 209 299 214 298 1-10 201 300 209 299 1-10 195 301 201 300 1-10 188 303 195 301 1-10 183 305 188 303 1-10 175 307 183 305 1-10 169 309 175 307 1-10 161 311 169 309 1-10 152 312 161 311 1-10 147 313 152 312 1-10 141 313 147 313 1-10 136 313 141 313 1-10 134 313 136 313 1-10 132 314 134 313 1-10 130 314 132 314 1-10 128 314 130 314 1-10 126 314 128 314 1-10 125 314 126 314 1-10 125 314 125 314 1_21 #000000 #2bb24c 25 11 100 50 100 12-10 298 291 299 282 1-10 298 296 298 291 1-10 297 305 298 296 1-10 297 309 297 305 1-10 297 317 297 309 1-10 297 320 297 317 1-10 296 328 297 320 1-10 295 333 296 328 1-10 295 339 295 333 1-10 295 344 295 339 1-10 295 349 295 344 1-10 295 351 295 349 1-10 295 353 295 351 1-10 295 353 295 353 1-10 295 354 295 353 1-10 295 355 295 354 1-10 295 355 295 355 1-10 295 356 295 355 1-10 295 357 295 356 1-10 295 357 295 357 1-10 295 358 295 357 1-10 295 359 295 358 1-10 297 359 295 359 1-10 303 361 297 359 1-10 305 361 303 361 1-10 313 361 305 361 1-10 319 361 313 361 1-10 324 361 319 361 1-10 330 361 324 361 1-10 335 360 330 361 1-10 344 360 335 360 1-10 349 360 344 360 1-10 355 359 349 360 1-10 363 359 355 359 1-10 368 359 363 359 1-10 373 358 368 359 1-10 375 358 373 358 1-10 381 357 375 358 1-10 383 357 381 357 1-10 387 356 383 357 1-10 389 356 387 356 1-10 391 355 389 356 1-10 393 355 391 355 1-10 395 354 393 355 1-10 397 353 395 354 1-10 399 351 397 353 1-10 401 350 399 351 1-10 402 349 401 350 1-10 406 345 402 349 1-10 407 343 406 345 1-10 408 342 407 343 1-10 409 340 408 342 1-10 411 338 409 340 1-10 412 333 411 338 1-10 413 331 412 333 1-10 413 326 413 331 1-10 414 324 413 326 1-10 414 319 414 324 1-10 415 313 414 319 1-10 415 305 415 313 1-10 415 303 415 305 1-10 415 298 415 303 1-10 415 293 415 298 1-10 415 287 415 293 1-10 415 285 415 287 1-10 414 280 415 285 1-10 414 278 414 280 1-10 413 276 414 278 1-10 413 275 413 276 1-10 413 273 413 275 1-10 413 272 413 273 1-10 412 271 413 272 1-10 412 270 412 271 1-10 411 270 412 270 1-10 411 269 411 270 1-10 411 269 411 269 1-10 409 269 411 269 1-10 407 269 409 269 1-10 405 268 407 269 1-10 403 268 405 268 1-10 399 269 403 268 1-10 397 269 399 269 1-10 392 270 397 269 1-10 390 270 392 270 1-10 381 271 390 270 1-10 376 273 381 271 1-10 371 275 376 273 1-10 365 275 371 275 1-10 357 277 365 275 1-10 352 278 357 277 1-10 347 279 352 278 1-10 339 281 347 279 1-10 333 281 339 281 1-10 328 281 333 281 1-10 323 282 328 281 1-10 310 283 323 282 1-10 305 283 310 283 1-10 301 283 305 283 1-10 296 283 301 283 1-10 295 283 296 283 1-10 295 283 295 283 1_21 #000000 #7ccfae 25 11 100 50 100 12-10 165 471 153 472 1-10 173 471 165 471 1-10 179 469 173 471 1-10 236 465 179 469 1-10 245 465 236 465 1-10 250 465 245 465 1-10 259 464 250 465 1-10 295 459 259 464 1-10 303 457 295 459 1-10 313 456 303 457 1-10 319 455 313 456 1-10 321 455 319 455 1-10 326 454 321 455 1-10 327 454 326 454 1-10 329 453 327 454 1-10 331 453 329 453 1-10 332 453 331 453 1-10 333 453 332 453 1-10 333 453 333 453 1-10 333 453 333 453 1-10 333 453 333 453 1_21 #000000 #31684d 25 11 100 50 100 12-10 563 417 555 421 1-10 565 416 563 417 1-10 567 415 565 416 1-10 572 411 567 415 1-10 573 409 572 411 1-10 576 405 573 409 1-10 577 403 576 405 1-10 578 401 577 403 1-10 579 400 578 401 1-10 581 395 579 400 1-10 584 390 581 395 1-10 587 381 584 390 1-10 587 380 587 381 1-10 591 369 587 380 1-10 594 361 591 369 1-10 596 357 594 361 1-10 601 345 596 357 1-10 603 337 601 345 1-10 607 329 603 337 1-10 611 318 607 329 1-10 613 313 611 318 1-10 619 303 613 313 1-10 623 293 619 303 1-10 627 285 623 293 1-10 632 275 627 285 1-10 639 266 632 275 1-10 644 259 639 266 1-10 650 249 644 259 1-10 655 242 650 249 1-10 663 231 655 242 1-10 667 224 663 231 1-10 674 214 667 224 1-10 682 205 674 214 1-10 689 199 682 205 1-10 697 191 689 199 1-10 705 183 697 191 1-10 712 177 705 183 1-10 721 170 712 177 1-10 731 163 721 170 1-10 740 157 731 163 1-10 748 152 740 157 1-10 758 145 748 152 1-10 768 139 758 145 1-10 777 135 768 139 1-10 787 131 777 135 1-10 795 127 787 131 1-10 803 123 795 127 1-10 817 117 803 123 1-10 822 115 817 117 1-10 833 112 822 115 1-10 841 109 833 112 1-10 850 107 841 109 1-10 861 104 850 107 1-10 869 102 861 104 1-10 879 99 869 102 1-10 887 97 879 99 1-10 895 95 887 97 1-10 904 94 895 95 1-10 913 93 904 94 1-10 918 92 913 93 1-10 927 91 918 92 1-10 933 91 927 91 1-10 941 91 933 91 1-10 949 92 941 91 1-10 954 93 949 92 1-10 959 93 954 93 1-10 964 95 959 93 1-10 969 96 964 95 1-10 977 99 969 96 1-10 982 101 977 99 1-10 987 103 982 101 1-10 992 105 987 103 1-10 997 108 992 105 1-10 1001 111 997 108 1-10 1005 115 1001 111 1-10 1011 120 1005 115 1-10 1013 121 1011 120 1-10 1020 127 1013 121 1-10 1023 130 1020 127 1-10 1027 134 1023 130 1-10 1031 139 1027 134 1-10 1037 145 1031 139 1-10 1040 149 1037 145 1-10 1044 153 1040 149 1-10 1049 161 1044 153 1-10 1051 165 1049 161 1-10 1055 169 1051 165 1-10 1057 175 1055 169 1-10 1061 183 1057 175 1-10 1063 188 1061 183 1-10 1065 193 1063 188 1-10 1069 201 1065 193 1-10 1070 207 1069 201 1-10 1073 215 1070 207 1-10 1074 221 1073 215 1-10 1076 230 1074 221 1-10 1077 235 1076 230 1-10 1077 243 1077 235 1-10 1078 252 1077 243 1-10 1079 257 1078 252 1-10 1079 263 1079 257 1-10 1079 272 1079 263 1-10 1079 277 1079 272 1-10 1079 283 1079 277 1-10 1079 292 1079 283 1-10 1078 297 1079 292 1-10 1077 306 1078 297 1-10 1076 315 1077 306 1-10 1075 320 1076 315 1-10 1073 325 1075 320 1-10 1069 336 1073 325 1-10 1067 343 1069 336 1-10 1065 348 1067 343 1-10 1061 356 1065 348 1-10 1059 361 1061 356 1-10 1055 369 1059 361 1-10 1050 375 1055 369 1-10 1045 383 1050 375 1-10 1041 390 1045 383 1-10 1037 394 1041 390 1-10 1034 399 1037 394 1-10 1028 405 1034 399 1-10 1024 410 1028 405 1-10 1021 414 1024 410 1-10 1017 417 1021 414 1-10 1013 420 1017 417 1-10 1005 425 1013 420 1-10 1001 427 1005 425 1-10 997 430 1001 427 1-10 992 433 997 430 1-10 984 437 992 433 1-10 979 439 984 437 1-10 975 441 979 439 1-10 967 443 975 441 1-10 961 445 967 443 1-10 953 447 961 445 1-10 948 447 953 447 1-10 939 448 948 447 1-10 934 449 939 448 1-10 926 449 934 449 1-10 917 449 926 449 1-10 912 450 917 449 1-10 907 450 912 450 1-10 897 450 907 450 1-10 892 450 897 450 1-10 883 450 892 450 1-10 875 450 883 450 1-10 867 450 875 450 1-10 861 449 867 450 1-10 852 449 861 449 1-10 844 448 852 449 1-10 839 448 844 448 1-10 827 447 839 448 1-10 821 447 827 447 1-10 813 447 821 447 1-10 805 447 813 447 1-10 795 446 805 447 1-10 787 445 795 446 1-10 777 445 787 445 1-10 769 444 777 445 1-10 761 444 769 444 1-10 753 443 761 444 1-10 745 442 753 443 1-10 733 441 745 442 1-10 728 439 733 441 1-10 719 439 728 439 1-10 710 438 719 439 1-10 702 436 710 438 1-10 691 435 702 436 1-10 685 434 691 435 1-10 677 433 685 434 1-10 669 431 677 433 1-10 663 431 669 431 1-10 652 429 663 431 1-10 644 428 652 429 1-10 639 428 644 428 1-10 630 427 639 428 1-10 625 427 630 427 1-10 619 426 625 427 1-10 611 427 619 426 1-10 602 426 611 427 1-10 597 427 602 426 1-10 591 427 597 427 1-10 586 426 591 427 1-10 581 426 586 426 1-10 575 427 581 426 1-10 573 426 575 427 1-10 568 426 573 426 1-10 563 425 568 426 1-10 561 424 563 425 1-10 556 422 561 424 1-10 555 421 556 422 1-10 555 421 555 421 1_21 #000000 #dce49c 25 11 100 50 100 12-10 757 232 757 224 1-10 757 240 757 232 1-10 757 249 757 240 1-10 757 255 757 249 1-10 756 263 757 255 1-10 755 274 756 263 1-10 755 276 755 274 1-10 753 288 755 276 1-10 753 299 753 288 1-10 752 305 753 299 1-10 750 316 752 305 1-10 750 324 750 316 1-10 749 333 750 324 1-10 749 342 749 333 1-10 748 347 749 342 1-10 747 356 748 347 1-10 747 365 747 356 1-10 747 367 747 365 1-10 747 372 747 367 1-10 747 374 747 372 1-10 747 376 747 374 1-10 747 378 747 376 1-10 747 380 747 378 1-10 747 381 747 380 1-10 747 381 747 381 1_21 #000000 #903a22 25 11 100 50 100 12-10 791 307 782 309 1-10 795 305 791 307 1-10 801 303 795 305 1-10 808 300 801 303 1-10 813 298 808 300 1-10 819 297 813 298 1-10 823 295 819 297 1-10 828 293 823 295 1-10 833 291 828 293 1-10 838 290 833 291 1-10 843 288 838 290 1-10 848 285 843 288 1-10 855 282 848 285 1-10 861 279 855 282 1-10 867 273 861 279 1-10 876 265 867 273 1-10 876 265 876 265 1_21 #000000 #2f5b21 25 11 100 50 100 12-10 899 167 900 158 1-10 899 172 899 167 1-10 897 184 899 172 1-10 896 190 897 184 1-10 895 201 896 190 1-10 894 210 895 201 1-10 893 221 894 210 1-10 893 232 893 221 1-10 892 241 893 232 1-10 891 253 892 241 1-10 890 265 891 253 1-10 889 276 890 265 1-10 889 284 889 276 1-10 889 296 889 284 1-10 889 302 889 296 1-10 889 314 889 302 1-10 888 322 889 314 1-10 888 328 888 322 1-10 888 339 888 328 1-10 887 345 888 339 1-10 887 350 887 345 1-10 887 359 887 350 1-10 886 365 887 359 1-10 886 366 886 365 1-10 885 368 886 366 1-10 885 370 885 368 1-10 885 373 885 370 1-10 884 374 885 373 1-10 884 375 884 374 1-10 884 375 884 375 1_21 #000000 #636324 25 11 100 50 100 12-10 954 219 952 218 1-10 955 220 954 219 1-10 957 221 955 220 1-10 959 222 957 221 1-10 963 225 959 222 1-10 965 226 963 225 1-10 967 227 965 226 1-10 971 230 967 227 1-10 971 231 971 230 1-10 973 231 971 231 1-10 975 233 973 231 1-10 976 233 975 233 1-10 978 234 976 233 1-10 979 235 978 234 1-10 980 236 979 235 1-10 980 236 980 236 1_21 #000000 #ed8843 25 11 100 50 100 12-10 965 309 967 300 1-10 965 315 965 309 1-10 963 320 965 315 1-10 963 322 963 320 1-10 962 330 963 322 1-10 961 335 962 330 1-10 961 340 961 335 1-10 960 342 961 340 1-10 959 347 960 342 1-10 959 349 959 347 1-10 959 351 959 349 1-10 959 356 959 351 1-10 959 361 959 356 1-10 959 363 959 361 1-10 959 365 959 363 1-10 959 367 959 365 1-10 959 369 959 367 1-10 959 371 959 369 1-10 959 376 959 371 1-10 959 377 959 376 1-10 959 379 959 377 1-10 959 379 959 379 1-__";
}

function getLineDemo()
{
    return getDefaultGlobal() + "-10 33 61 31 61 1-10 38 63 33 61 1-10 43 65 38 63 1-10 49 67 43 65 1-10 53 68 49 67 1-10 58 69 53 68 1-10 63 71 58 69 1-10 68 73 63 71 1-10 86 81 68 73 1-10 88 81 86 81 1-10 92 83 88 81 1-10 96 85 92 83 1-10 97 87 96 85 1-10 103 89 97 87 1-10 103 90 103 89 1-10 104 91 103 90 1-10 105 91 104 91 1-10 105 92 105 91 1-10 105 93 105 92 1-10 105 93 105 93 1-10 101 99 105 93 1-10 95 103 101 99 1-10 87 107 95 103 1-10 78 111 87 107 1-10 73 113 78 111 1-10 63 117 73 113 1-10 58 119 63 117 1-10 48 123 58 119 1-10 45 124 48 123 1-10 39 126 45 124 1-10 26 131 39 126 1-10 19 134 26 131 1-10 17 135 19 134 1-10 16 136 17 135 1-10 15 137 16 136 1-10 15 137 15 137 1-10 15 137 15 137 1-10 13 139 15 137 1-10 13 140 13 139 1-10 21 148 13 140 1-10 23 149 21 148 1-10 24 150 23 149 1-10 29 153 24 150 1-10 34 155 29 153 1-10 38 157 34 155 1-10 43 159 38 157 1-10 48 161 43 159 1-10 52 164 48 161 1-10 54 165 52 164 1-10 59 167 54 165 1-10 64 169 59 167 1-10 66 170 64 169 1-10 68 171 66 170 1-10 69 172 68 171 1-10 74 174 69 172 1-10 76 175 74 174 1-10 77 175 76 175 1-10 79 177 77 175 1-10 81 177 79 177 1-10 83 178 81 177 1-10 85 179 83 178 1-10 86 179 85 179 1-10 88 180 86 179 1-10 90 181 88 180 1-10 91 181 90 181 1-__";
}

function getCircleDemo()
{
    return getDefaultGlobal() + "-12 28 85-12 32 67-12 45 55-12 47 54-12 64 50-12 80 56-12 92 69-12 96 81-12 92 99-12 81 108-12 67 111-12 52 107-12 45 103-12 39 97-12 37 93-__";
}

function getRectangleDemo()
{
    return getDefaultGlobal() + "-11 38 95-11 39 89-11 50 71-11 71 61-11 91 63-11 107 74-11 111 90-11 105 104-11 94 112-11 79 114-11 62 110-11 46 100-11 40 93-11 37 83-____";
}

function getTextDemo()
{
    var sText = gDrawText;
    
    return getDefaultGlobal() + "-19 " + sText + " 33 98 100 #5b4296-19 " + sText + " 37 76 100 #5b4296-19 " + sText + " 61 61 100 #5b4296-19 " + sText + " 81 61 100 #5b4296-19 " + sText + " 102 68 100 #5b4296-19 " + sText + " 117 80 100 #5b4296-19 " + sText + " 124 97 100 #5b4296-19 " + sText + " 126 115 100 #5b4296-19 " + sText + " 119 124 100 #5b4296-19 " + sText + " 109 130 100 #5b4296-19 " + sText + " 91 132 100 #5b4296-19 " + sText + " 76 127 100 #5b4296-19 " + sText + " 61 116 100 #5b4296-19 " + sText + " 54 109 100 #5b4296-19 " + sText + " 49 99 100 #5b4296-19 " + sText + " 49 94 100 #5b4296-__";
}

function getDotDemo()
{
    return getDefaultGlobal() + "-13 83 69-13 77 69-13 75 69-13 70 71-13 69 71-13 67 72-13 62 74-13 60 75-13 55 76-13 53 77-13 51 77-13 49 78-13 47 79-13 45 80-13 44 81-13 43 82-13 41 83-13 41 84-13 39 85-13 39 86-13 38 87-13 38 88-13 37 89-13 37 90-13 37 91-13 37 93-13 37 94-13 36 96-13 36 98-13 37 100-13 37 102-13 39 103-13 40 105-13 41 106-13 43 107-13 45 108-13 47 109-13 52 110-13 55 111-13 59 111-13 62 112-13 67 112-13 69 112-13 75 112-13 77 112-13 81 112-13 83 112-13 85 112-13 87 112-13 89 112-13 95 113-13 96 113-13 98 113-13 99 113-13 101 114-13 103 115-13 105 115-13 107 116-13 109 117-13 111 119-13 112 119-13 113 120-13 113 121-13 115 122-13 115 122-13 115 123-13 116 123-13 116 123-13 117 123-13 117 124-13 117 126-13 117 127-13 117 127-13 117 128-13 117 130-13 117 132-13 115 133-13 114 135-13 113 136-13 109 139-13 107 141-13 103 143-13 101 143-13 96 145-13 94 146-13 92 147-13 90 147-13 85 149-13 83 149-13 81 150-13 79 151-13 75 151-13 73 151-13 71 151-13 69 152-13 67 152-13 65 153-13 63 153-13 61 153-13 59 153-13 57 153-13 55 153-13 53 153-13 51 153-13 50 153-13 49 153-13 48 152-13 47 152-13 47 152-13 46 152-13 46 152-__";
}

function getEraserDemo()
{   
    return getDefaultGlobal() + "-10 64 129 48 135 2-10 69 126 64 129 2-10 77 121 69 126 2-10 82 119 77 121 2-10 86 116 82 119 2-10 88 115 86 116 2-10 90 114 88 115 2-10 91 113 90 114 2-10 94 109 91 113 2-10 95 107 94 109 2-10 95 105 95 107 2-10 95 103 95 105 2-10 95 101 95 103 2-10 92 95 95 101 2-10 89 91 92 95 2-10 81 86 89 91 2-10 74 81 81 86 2-10 65 77 74 81 2-10 57 74 65 77 2-10 49 71 57 74 2-10 44 70 49 71 2-10 39 68 44 70 2-10 30 66 39 68 2-10 22 64 30 66 2-10 20 64 22 64 2-10 19 63 20 64 2-10 17 63 19 63 2-10 16 63 17 63 2-10 15 63 16 63 2-10 15 63 15 63 2-10 15 61 15 63 2-10 20 53 15 61 2-10 27 47 20 53 2___" + getDefaultGlobal() + "-14 32 81 1-14 27 87 1-14 19 95 1-14 12 103 1-14 7 109 1-14 7 110 1-14 7 112 1-14 7 113 1-14 15 108 1-14 24 99 1-14 37 89 1-14 49 78 1-14 59 71 1-14 66 67 1-14 70 63 1-14 71 62 1-14 72 62 1-14 73 62 1-14 73 62 1-14 73 71 1-14 69 82 1-14 62 95 1-14 55 103 1-14 49 114 1-14 45 121 1-14 44 123 1-14 42 127 1-14 42 128 1-14 47 127 1-14 68 116 1-14 83 106 1-14 97 95 1-14 107 89 1-14 115 83 1-14 119 81 1-14 121 80 1-14 122 80 1-14 123 85 1-14 119 102 1-14 107 120 1-14 95 137 1-14 82 153 1-14 71 167 1-14 60 181 1-14 53 191 1-14 51 195 1-14 49 200 1-14 49 201 1-___";
}

function getSpecificDemo( iPenStyle )
{
    if ( iPenStyle == TYPE_PEN_LINE )
    {
        return getLineDemo();
    }
    else if ( iPenStyle == TYPE_PEN_DOT )
    {
        return getDotDemo();
    }
    else if ( iPenStyle == TYPE_TEXT )
    {
        return getTextDemo();
    }
    else if ( iPenStyle == TYPE_PEN_RECTANGLE )
    {
        return getRectangleDemo();
    }
    else if ( iPenStyle == TYPE_PEN_CIRCLE )
    {
        return getCircleDemo();
    }
    else if ( iPenStyle == TYPE_PEN_ERASER )
    {
        return getEraserDemo();
    }
    
    return null;
}

function isQueueTotalDone( iPlayStyle, iMode )
{
    var iCount = giDrawQueueCount - 1;
    
    return ( ( iPlayStyle != PLAY_STYLE_REVERSE && giDrawQueueIndex == iCount) ||
             ( iPlayStyle == PLAY_STYLE_REVERSE && giDrawQueueIndex == 0 ) );
}

function getNext( iPlayStyle, iOrder )
{
    return iPlayStyle != PLAY_STYLE_REVERSE ? iOrder + 1 : iOrder - 1;
}

function getBeginImageAnimationIndex( iPlayStyle )
{
    return iPlayStyle != PLAY_STYLE_REVERSE ? 0 : giDrawQueueCount - 1;
}



