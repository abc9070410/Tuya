"use strict";

function draw( phyX, phyY )
{
    var sSinglePenHistory = "";
    
    if ( gbTempDrawCount++ > 1000000 )
    {
        gbTempDrawCount = 0;
    }

    if ( gPenStyle == TYPE_PEN_LINE )
    {
        var previousPhyX = gPreviousPhyX != INIT_POS ? gPreviousPhyX : phyX;
        var previousPhyY = gPreviousPhyY != INIT_POS ? gPreviousPhyY : phyY;
        sSinglePenHistory = drawLine( phyX, phyY, previousPhyX, previousPhyY, getLineStyle() );
    }
    else if ( gPenStyle == TYPE_PEN_ERASER )
    {
        sSinglePenHistory = drawEraser( phyX, phyY, getEraserStyle() ); // 2
    }
    else if ( gPenStyle == TYPE_PEN_DOT )
    {
        sSinglePenHistory = drawDot( phyX, phyY ); // 2
    }
    else if ( needWaitingPlay( gPenStyle )  )
    {
        if ( gCutEnable || // only touch, not swipe 
             gbTempDrawCount % 20 == 1 )
        {
            if ( giDrawQueueCount == 0 )
            {
                storeTempDrawing( TEMP_STORE_SHOWTRACE );
            }

            if ( gPenStyle == TYPE_IMAGE )
            {
                if ( gImageNowCount == 0 )
                    return;
            
                var iImageIndex = giImageTargetIndex;
                var iWidthRatio = gImageWidthRatio[iImageIndex];
                var iHeightRatio = gImageHeightRatio[iImageIndex];
                
                // only resize for image stuff, not for drawing image (*.png)
                if ( giPlayStyle != PLAY_STYLE_DEMO && giPlayStyle != PLAY_STYLE_LOADING )
                {
                    iWidthRatio *= getSpecificWidth( TYPE_IMAGE ) / 100;
                    iHeightRatio *= getSpecificWidth( TYPE_IMAGE ) / 100;
                }
                
                sSinglePenHistory = addQueueImage( iImageIndex, phyX, phyY, iWidthRatio, iHeightRatio );
            }
            else if ( gPenStyle == TYPE_TEXT )
            {
                sSinglePenHistory = addQueueText( gDrawText, phyX, phyY, getTextStyle(), getForeColor() ); // 5
            }
            else if ( gPenStyle == TYPE_PEN_CIRCLE )
            {
                sSinglePenHistory = addQueueCircle( phyX, phyY, false, getCircleStyle() );
            }
            else if ( gPenStyle == TYPE_PEN_RECTANGLE )
            {
                sSinglePenHistory = addQueueRectangle( phyX, phyY, false, getRectangleStyle() );
            }
            issueDrawQueue( EDIT_MODE, giPlayNumber, giPlayStyle, gPenStyle, 0, 0 );
        }
        else
        {
            showAlert( "NO IMAGE !!" );
        }
    }
    else
    {
        showAlert( "ERROR PENSTYLE: " + gPenStyle );
    }
    
    recordPenHistory( sSinglePenHistory );   
}

function drawLineAnimation( sourceX, sourceY, destinationX, destinationY, iLineStyle, iPlayNumber, iTouchOrder, iOrder )
{
    
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            drawLine( sourceX, sourceY, destinationX, destinationY, iLineStyle );
        }
    }
}

function cleanCanvasByColor( sColor )
{
    gContext.save();
    gContext.fillStyle = sColor;
    gContext.beginPath();
    gContext.rect( 0, 0, gCanvas.width, gCanvas.height );
    gContext.closePath();
    gContext.fill();
    gContext.restore();
}

function delayPlay( iSecond )
{
    var sSingleDelay = "" + TYPE_DELAY + TOKEN_GAP + iSecond + MOTION_GAP;
    var sTotalDelay = "";

    var iCountForOneSecond = 1000 / getPlaySpeed();
    
    for ( var i = 0; i < iSecond * iCountForOneSecond; i ++ )
        sTotalDelay += sSingleDelay;
        
    return sTotalDelay;
}

function delayPlayAnimation( iSecond, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            delayPlay( iSecond );
        }
    }
}

function cleanCanvas( iStyle )
{
    cleanCanvasByColor( getBackColor() );
    
    setBackground();
    
    return "" + TYPE_CLEAN + TOKEN_GAP + iStyle + MOTION_GAP;
}

function cleanCanvasAnimation( iStyle, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            cleanCanvas( iStyle );
        }
    }
}

// draw line by connectting source and destination
function drawLine( sourceX, sourceY, destinationX, destinationY, iLineStyle )
{
    if ( gDrawEnable )
    {
        if ( iLineStyle == LINE_STYLE_NORMAL )
        {
            drawCircleInLine( sourceX, sourceY ); // let it smooth
        }
        
        if ( iLineStyle == LINE_STYLE_DOTTED )
        {
            giLineDottedCount++;
            
            if ( gbNeedDrawInLineDotted )
            {
                if ( giLineDottedCount >= giLineDottedCoefficient )
                {
                    gbNeedDrawInLineDotted = false;
                    giLineDottedCount = 0;
                }
            }
            else
            {
                if ( giLineDottedCount < giLineDottedCoefficient )
                {
                    return;
                }
                else
                {
                    gbNeedDrawInLineDotted = true;
                    giLineDottedCount = 0;
                }
            }
        }
        
        
        gContext.save();
        gContext.beginPath();  
        gContext.lineWidth = getPenWidth();
        gContext.moveTo( sourceX, sourceY); // start position
        gContext.lineTo( destinationX, destinationY ); // end position
        gContext.strokeStyle = getForeColor();
        gContext.closePath(); 
        gContext.stroke(); // connect it from source to destination
        gContext.restore();
    }
    
    return "" + TYPE_PEN_LINE + TOKEN_GAP + sourceX + TOKEN_GAP + sourceY + TOKEN_GAP + destinationX + TOKEN_GAP + destinationY + TOKEN_GAP + iLineStyle + MOTION_GAP;
}

function drawRectangleAnimation( x, y, bIsEraser, iStyle, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            drawRectangle( x, y, bIsEraser, iStyle );
        }
    }
}

function drawRectangle( x, y, bIsEraser, iStyle )
{
    if ( gDrawEnable && bIsEraser )
    { 
        var iWidth = bIsEraser ? getEraserWidth() : getRectangleWidth();
        var sColor = bIsEraser ? getBackColor() : getForeColor();
        
        if ( bIsEraser )
        {
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y, iWidth, iWidth );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
        }
    }
    
    var sPenType = bIsEraser ? TYPE_PEN_ERASER : TYPE_PEN_RECTANGLE;

    return "" + sPenType + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + MOTION_GAP;
}

function addQueueRectangle( x, y, bIsEraser, iStyle )
{
    gaiDrawQueueX[giDrawQueueCount] = x;
    gaiDrawQueueY[giDrawQueueCount] = y;
    gaiDrawQueueTextStyle[giDrawQueueCount] = iStyle;
    giDrawQueueCount++;
    
    return "" + TYPE_PEN_RECTANGLE + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + MOTION_GAP;
}

function drawQueueRectangleAnimation( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    return function()
    {
         drawQueueRectangle( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
    }
}

function drawQueueRectangle( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    if ( gDrawEnable )
    { 
        if ( gbTotalQueueLoaded )
        {
            gbTotalQueueLoaded = false;
        }
        
        var x = gaiDrawQueueX[giDrawQueueIndex];
        var y = gaiDrawQueueY[giDrawQueueIndex];
        var iStyle = gaiDrawQueueTextStyle[giDrawQueueIndex];
        var bIsEraser = false;
        
        var iWidth = bIsEraser ? getEraserWidth() : getRectangleWidth();
        var sColor = bIsEraser ? getBackColor() : getForeColor();
        
        //iWidth = 60;
        
        if ( bIsEraser || iStyle == STYLE_SOLID )
        {
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y, iWidth, iWidth );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
        }
        else
        {
            var iBorder = getBorderWidth();
            var iHeight = iWidth;
            
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y, iWidth, iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
            
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y + iHeight - iBorder, iWidth, iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
            
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y + iBorder, iBorder, iHeight - iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
            
            gContext.save();
            gContext.beginPath();
            gContext.rect( x + iWidth - iBorder, y, iBorder, iHeight - iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
        }
        
        issueNextQueue( iMode, iPlayNumber, iPlayStyle, TYPE_PEN_RECTANGLE, iBeginTouchOrder, iTouchOrder );
    }
    
    return "" + TYPE_PEN_RECTANGLE + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + MOTION_GAP;
}

function drawRectangleForceAnimation( x, y, iWidth, iHeight, sColor, iStyle, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            drawRectangleForce( x, y, iWidth, iHeight, sColor, iStyle );
        }
    }
}

function drawRectangleForce( x, y, iWidth, iHeight, sColor, iStyle )
{
    if ( gDrawEnable )
    { 
        if ( iStyle == STYLE_SOLID )
        {
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y, iWidth, iHeight );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
        }
        else
        {
            var iBorder = getBorderWidth();

            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y, iWidth, iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
            
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y + iHeight - iBorder, iWidth, iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
            
            gContext.save();
            gContext.beginPath();
            gContext.rect( x, y + iBorder, iBorder, iHeight - iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
            
            gContext.save();
            gContext.beginPath();
            gContext.rect( x + iWidth - iBorder, y, iBorder, iHeight - iBorder );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
        }
        

    }
    
    return "" + TYPE_PEN_RECTANGLE + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + MOTION_GAP;
}

function drawCircleAnimation( x, y, bIsEraser, iStyle, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            drawCircle( x, y, bIsEraser, iStyle );
        }
    }
}

function drawCircle( x, y, bIsEraser, iStyle )
{
    if ( gDrawEnable && bIsEraser )
    {
        var iWidth = bIsEraser ? getEraserWidth() : getCircleWidth();
        var sColor = bIsEraser ? getBackColor() : getForeColor();
    
        if ( bIsEraser )
        {
            gContext.save();
            gContext.beginPath();
            gContext.arc( x, y, iWidth / 2, 0, Math.PI * 2, true );
            gContext.closePath();
            gContext.fillStyle = sColor; 
            gContext.fill();
            gContext.restore();
        }
    }

    var sPenType = bIsEraser ? TYPE_PEN_ERASER : TYPE_PEN_CIRCLE;
    
    return "" + sPenType + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + MOTION_GAP;
} 

function addQueueCircle( x, y, bIsEraser, iStyle )
{
    gaiDrawQueueX[giDrawQueueCount] = x;
    gaiDrawQueueY[giDrawQueueCount] = y;
    gaiDrawQueueTextStyle[giDrawQueueCount] = iStyle;
    giDrawQueueCount++;
    
    return "" + TYPE_PEN_CIRCLE + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + MOTION_GAP; 
}

function drawQueueCircleAnimation( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    return function()
    {
        drawQueueCircle( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder );
    }
}

function drawQueueCircle( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    if ( gDrawEnable )
    {
        if ( gbTotalQueueLoaded )
        {
            gbTotalQueueLoaded = false;
        }    

        var x = gaiDrawQueueX[giDrawQueueIndex];
        var y = gaiDrawQueueY[giDrawQueueIndex];
        var iStyle = gaiDrawQueueTextStyle[giDrawQueueIndex];
        var bIsEraser = false;
    
        var iWidth = bIsEraser ? getEraserWidth() : getCircleWidth();
        var sColor = bIsEraser ? getBackColor() : getForeColor();
        
        gContext.save();
        gContext.beginPath();
        gContext.arc( x, y, iWidth / 2, 0, Math.PI * 2, true );
        gContext.closePath();
        gContext.fillStyle = sColor;
        gContext.fill();
        gContext.restore();
        
        if ( !bIsEraser && iStyle == STYLE_UNSOLID )
        {
            sColor = getBackColor();
            var iBorder = getBorderWidth();
            iWidth -= iBorder * 2;
            
            gContext.save();
            gContext.beginPath();
            gContext.arc( x, y, iWidth / 2, 0, Math.PI * 2, true );
            gContext.closePath();
            gContext.fillStyle = sColor;
            gContext.fill();
            gContext.restore();
        }
        
        issueNextQueue( iMode, iPlayNumber, iPlayStyle, TYPE_PEN_CIRCLE, iBeginTouchOrder, iTouchOrder );
    }

    return "" + TYPE_PEN_CIRCLE + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + MOTION_GAP;
}

function drawEraser( x, y, iStyle )
{
    if ( iStyle == ERASER_TYPE_RECTANGLE )
    {
        return drawRectangle( x, y, true, ERASER_TYPE_RECTANGLE );
    }
    else
    {
        return drawCircle( x, y, true, ERASER_TYPE_CIRCLE );
    }
}

function drawEraserAnimation( x, y, iStyle, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            drawEraser( x, y, iStyle );
        }
    }
}

function drawCircleInLine( x, y )
{
    if ( gDrawEnable )
    {
        gContext.save();
        gContext.beginPath();
        gContext.arc( x, y, getPenWidth() / 2, 0, Math.PI * 2, true ); // 畫出圓形
        gContext.closePath();
        gContext.fillStyle = getForeColor();
        gContext.fill();
        gContext.restore();
    }
} 

function drawDotAnimation( x, y, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            drawDot( x, y );
        }
    }
}

function drawDot( x, y )
{

    if ( gDrawEnable )
    {
        gContext.save();

        var range = getPenWidth() * 2;

        for ( var i = 0; i < 10; i ++ )
        {
            var newX = x - range + getRandom( range );
            var newY = y - range + getRandom( range );

            gContext.beginPath();
            gContext.arc( newX, newY, 1, 0, Math.PI * 2, true ); // 畫出圓形
            gContext.closePath();
            gContext.fillStyle = getForeColor();
            gContext.fill();
        }
        
        gContext.restore();
    }

    return "" + TYPE_PEN_DOT + TOKEN_GAP + x + TOKEN_GAP + y + MOTION_GAP;
} 

function drawTextAnimation( text, x, y, iStyle, fontColor, iPlayNumber, iTouchOrder, order )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )
        {
            drawText( text, x, y, iStyle, fontColor );
        }
    }
}

function drawText( text, x, y, iStyle, fontColor )
{
    if ( gDrawEnable )
    {
        gContext.save();
        var fontSize = 10;
        var iTextWidth = getTextWidth();

        gContext.fillStyle = fontColor;
        gContext.font = "" + fontSize + 'px ' + gsFontFamily;
        gContext.textBaseline = "middle";
        gContext.textAlign = "center";

        var metrics = gContext.measureText( decodeText( text ) ); 
        var sizeRatio = iTextWidth / metrics.width;
        var newFontSize = fontSize * sizeRatio;

        gContext.font = "" + newFontSize + 'px ' + gsFontFamily;
        gContext.fillText( decodeText( text ), x, y );
        gContext.restore();
    }
    
    return "" + TYPE_TEXT + TOKEN_GAP + text + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + TOKEN_GAP + fontColor + MOTION_GAP;
}

function addQueueText( text, x, y, iStyle, fontColor )
{
    gasDrawQueueText[giDrawQueueCount] = text;
    gaiDrawQueueX[giDrawQueueCount] = x;
    gaiDrawQueueY[giDrawQueueCount] = y;
    gaiDrawQueueTextStyle[giDrawQueueCount] = iStyle;
    gasDrawQueueTextColor[giDrawQueueCount] = fontColor;
    giDrawQueueCount++;
    
    return "" + TYPE_TEXT + TOKEN_GAP + text + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + TOKEN_GAP + fontColor + MOTION_GAP;    
}

function drawQueueTextAnimation( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    return function()
    {
        drawQueueText( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder );
    }
}

function drawQueueText( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    if ( gDrawEnable )
    {
        if ( gbTotalQueueLoaded )
        {
            gbTotalQueueLoaded = false;
        }
    
        gContext.save();
        var fontSize = 10;
        var iTextWidth = getTextWidth();
        
        
        
        var text = gasDrawQueueText[giDrawQueueIndex];
        var x = gaiDrawQueueX[giDrawQueueIndex];
        var y = gaiDrawQueueY[giDrawQueueIndex];
        var iStyle = gaiDrawQueueTextStyle[giDrawQueueIndex];
        var fontColor = gasDrawQueueTextColor[giDrawQueueIndex];
        
        log( "Q:" + giDrawQueueIndex + "," + giDrawQueueCount + "," + text + "," + x + "," + y + "," + iStyle + "," + fontColor );

        gContext.fillStyle = fontColor;
        gContext.font = "" + fontSize + 'px ' + gsFontFamily;
        gContext.textBaseline = "middle";
        gContext.textAlign = "center";

        var metrics = gContext.measureText( decodeText( text ) ); 
        var sizeRatio = iTextWidth / metrics.width;
        var newFontSize = fontSize * sizeRatio;

        gContext.font = "" + newFontSize + 'px ' + gsFontFamily;
        gContext.fillText( decodeText( text ), x, y );
        gContext.restore();
        
        issueNextQueue( iMode, iPlayNumber, iPlayStyle, TYPE_TEXT, iBeginTouchOrder, iTouchOrder );
    }

    return "" + TYPE_TEXT + TOKEN_GAP + text + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + iStyle + TOKEN_GAP + fontColor + MOTION_GAP;
}

function drawImageAnimation( iImageIndex, x, y, widthRatio, heightRatio, iPlayNumber, iTouchOrder, iOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )//&& isTempDrawingLoaded() ) 
        {
            drawImage( iImageIndex, x, y, widthRatio, heightRatio );
        }
    }
}

function drawImage( iImageIndex, x, y, widthRatio, heightRatio )
{
    /*
    if ( gDrawEnable )
    {
        var imageData = getImageData( iImageIndex );
        var imageObj = new Image();
        
        imageObj.onload = function() {
            
            var fCanvasWidthRatio = 1;//gCanvas.width / this.width;
            var fCanvasHeightRatio = 1;//gCanvas.height / this.height;
            var width = this.width * widthRatio * fCanvasWidthRatio;
            var height = this.height * heightRatio * fCanvasHeightRatio;
            
            x *= fCanvasWidthRatio;
            y *= fCanvasHeightRatio;

            gContext.drawImage( imageObj, x - width / 2, y - height / 2, width, height );
        };

        imageObj.src = imageData;
    }
    */
    return "" + TYPE_IMAGE + TOKEN_GAP + iImageIndex + TOKEN_GAP + x + TOKEN_GAP + y + TOKEN_GAP + widthRatio + TOKEN_GAP + heightRatio + MOTION_GAP;
}

function drawQueueImageAnimation( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    return function()
    {
        drawQueueImage( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder );
    }
}

function drawQueueImage( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder )
{
    log( "drawQueueImage:" + iMode + ":" + giDrawQueueCount );

    if ( gDrawEnable )
    {
        if ( gbTotalQueueLoaded )
        {
            gbTotalQueueLoaded = false;
        }
        
        var iImageIndex = gaiDrawQueueImageIndex[giDrawQueueIndex];
        var x = gaiDrawQueueX[giDrawQueueIndex];
        var y = gaiDrawQueueY[giDrawQueueIndex];
        var widthRatio = gaiDrawQueueWidthRatio[giDrawQueueIndex];
        var heightRatio = gaiDrawQueueHeightRatio[giDrawQueueIndex];
        
        var imageData = getImageData( iImageIndex );
        var imageObj = new Image();
        
        imageObj.onload = function() {
            var fCanvasWidthRatio = 1;//gCanvas.width / this.width;
            var fCanvasHeightRatio = 1;//gCanvas.height / this.height;
            var width = this.width * widthRatio * fCanvasWidthRatio;
            var height = this.height * heightRatio * fCanvasHeightRatio;
            
            x *= fCanvasWidthRatio;
            y *= fCanvasHeightRatio;

            gContext.drawImage( imageObj, x - width / 2, y - height / 2, width, height );

            issueNextQueue( iMode, iPlayNumber, iPlayStyle, TYPE_IMAGE, iBeginTouchOrder, iTouchOrder );
        };

        imageObj.src = imageData;
    }
}

function issueNextQueue( iMode, iPlayNumber, iPlayStyle, iPenStyle, iBeginTouchOrder, iTouchOrder )
{
    if ( !isQueueTotalDone( iPlayStyle, iMode ) )
    {
        log( "Y" + giDrawQueueIndex );
        
        var iDelayTime = iMode == EDIT_MODE ? 0 : getPlaySpeed() * 10;
        setTimeout( showNewStoredDrawingAnimation( iMode, iPlayNumber, iPlayStyle, iPenStyle, iBeginTouchOrder, iTouchOrder ), iDelayTime );
    }
    else
    {
        gbTotalQueueLoaded = true;

        log( "TOTAL_DONE" + giDrawQueueCount + ":" + giDrawQueueIndex );

        if ( iMode == PLAY_MODE )
        {
            log( "[55]" + iTouchOrder );
            if ( iPlayStyle == PLAY_STYLE_LOADING )
            {
                //storeNowDrawing(); // rebuild the drawing data for advance edit
            }
            
            var iNextOrder = getNext( iPlayStyle, iTouchOrder );
            setTimeout( playPenHistoryAnimation( iPlayNumber, iPlayStyle, iBeginTouchOrder, iNextOrder ), getPlaySpeed() );
        }
        else
        {
            log( "[5]" + giTouchNum );
        
            if ( giTouchNum != giTempTouchNum )
            {
                log( "[5.1]" + gDrawingIndex );
                storeNowDrawing(); 
                giTempTouchNum = giTouchNum;
            }
            else
            {
                replaceNowDrawing(); // avoid taking the wrong screenshot when touch end
            }
        }
    }
}

function showNewStoredDrawingAnimation( iMode, iPlayNumber, iPlayStyle, iPenStyle, iBeginTouchOrder, iTouchOrder )
{
    return function()
    {
        var bPlayAllowed = true;
        
        bPlayAllowed = playAllowed( iPlayNumber, iTouchOrder );
        
        log( "Allow : " + bPlayAllowed + "," + giPlayNumber + "," + iPlayNumber + "," + iTouchOrder + "," + giCanvasMode );
        
        if ( iMode == EDIT_MODE || bPlayAllowed )
        {
            showNewTempDrawing( iMode, iPlayNumber, iPlayStyle, iPenStyle, iBeginTouchOrder, iTouchOrder );
        }
    }
}

function showNewTempDrawing( iMode, iPlayNumber, iPlayStyle, iPenStyle, iBeginTouchOrder, iTouchOrder )
{
    gbTempDrawingLoaded = false;
            
    var imageObj = new Image();
    
    log( "NTD" + giDrawQueueIndex );

    imageObj.onload = function() {
        log( "NTD DONE" );
        gContext.drawImage( imageObj, 0, 0 );
        gbTempDrawingLoaded = true;
        
        if ( iPenStyle == TYPE_TEXT )
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
    };
    imageObj.src = getTempDrawing();

    giDrawQueueIndex = getNext( iPlayStyle, giDrawQueueIndex );
    log( "N" + giDrawQueueIndex );
    
    if ( iPenStyle == TYPE_IMAGE )
    {
        drawQueueImage( iMode, iPlayNumber, iPlayStyle, iBeginTouchOrder, iTouchOrder );
    }
}            
            
function showStoredDrawingAnimation( iStyle, iPlayNumber, iTouchOrder )
{
    return function()
    {
        if ( playAllowed( iPlayNumber, iTouchOrder ) )// && isTempDrawingLoaded() )
        {
            showTempDrawing( iStyle );
        }
    }
}

function showTempDrawing( iStyle )
{
    gbTempDrawingLoaded = false;
    var imageObj = new Image();

    imageObj.onload = function() {
        gContext.drawImage( imageObj, 0, 0 );
        gbTempDrawingLoaded = true;
    };
    
    imageObj.src = getTempDrawing();
    
    //showProcessBar( false, 0, 0, 0 );
}

function isRightCanvasSize( iWidth, iHeight )
{
    return iWidth == gCanvas.width && iHeight == gCanvas.height;
}

function showStoredDrawing( type )
{
    gbNowStoredDrawingLoaded = false;

    var imageObj = new Image();

    imageObj.onload = function() {
        // avoid the image shows on the demo page
        if ( isRightCanvasSize( imageObj.width, imageObj.height ) )
        {
            if ( type != REDO )
            {
                cleanCanvas( CLEAN_STYLE_NORMAL );
            }
            gContext.drawImage( imageObj, 0, 0 );
        }
        gbNowStoredDrawingLoaded = true;
    };
    
    if ( type == UNDO )
    {
        imageObj.src = getPrevDrawing();
        
    }
    else if ( type == REDO )
    {
        imageObj.src = getNextDrawing();
    }
    else if ( type == NOWDO )
    {
        imageObj.src = getNowDrawing();
    }
}


function waitingPlay( motionTokens )
{
    var penStyle = motionTokens[0];

}