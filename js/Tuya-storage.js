

// ----------------------------------------------------------

// convert current canvas to image data
function changeToImage()
{
    try {
    
    var dataURL = gCanvas.toDataURL();
    var canvasData = readWholeCanvasData(gCanvas);
    
    var strData = createBMP( canvasData );
    
    //saveFile( strData );
    
    dataURL = makeDataURI(createBMP( canvasData ), "image/bmp");
    
    //makeImageObject(makeDataURI(dataURL, "image/bmp"));
    
    //saveFile(makeDataURI(strImgData, strDownloadMime));
    
    //var beginIndex = dataURL.indexOf( MOTION_GAP ) + 1;
    
    //var decode = decode64( dataURL.substring( beginIndex, dataURL.length ) );
    //var encode = encode64( decode );

    // set canvasImg image src to dataURL
    // so it can be saved as an image
    document.getElementById( "canvasImg" ).src = dataURL;
    }
    catch ( err )
    {
        printError( err.stack );
    }
}



// (BMP or PNG)
function showStoredImage( iImageType ) 
{    
    var ratio = iImageType == IMAGE_TYPE_BMP ? 0.1 : 1;
    
    var imageObj = new Image();
    imageObj.onload = function() {
        var width = imageObj.width * ratio;
        var height = imageObj.height * ratio;
        gContext.drawImage( imageObj, 0, 0, width, height );

        if ( iImageType == IMAGE_TYPE_BMP ) // dynamic image, animation
        {
            var canvasData = readCanvasData( gCanvas, width, height );
            var strData = createBMP( canvasData );
            gsBmpData = strData;
            gsBmpDataURL = makeDataURI( strData, "image/bmp" );
        }
        else // static image
        {
            gsPngDataURL = gCanvas.toDataURL("image/png");
            
            var iBegin = gsPngDataURL.indexOf( "," ) + 1;
            gsPngData = gsPngDataURL.substring( iBegin, gsPngDataURL.length );
        }
        
        showStoredDrawing( NOWDO ); // delete the mini drawing
        //this.href = dataURL;
        
        //var ref = window.open(dataURL, '_blank', 'location=yes');
        //ref.addEventListener('loadstart', function() { showAlert(event.url); });
        //window.open( dataURL, '_system' );
        
        //saveFile(dataURL);
        //document.getElementById( "canvasImg" ).src = dataURL;
    };
    
    storeNowDrawing();
    imageObj.src = getNowDrawing();
}


// generates a <img> object containing the imagedata
var makeImageObject = function(strSource) {
    var oImgElement = document.createElement("img");
    oImgElement.src = strSource;
    return oImgElement;
}

function makeDataURI( strData, strMime ) 
{
    return "data:" + strMime + ";base64," + strData;
}

// sends the generated file to the client
var saveFile = function(strData) {
    document.location.href = strData;
}

// ok, we're good
var readWholeCanvasData = function(oCanvas) {
    var iWidth = parseInt(oCanvas.width);
    var iHeight = parseInt(oCanvas.height);
    return oCanvas.getContext("2d").getImageData(0,0,iWidth,iHeight);
}

var readCanvasData = function(oCanvas, width, height) {
    return oCanvas.getContext("2d").getImageData(0,0,width,height);
}

function decodeBase64( sEncodeData )
{
    return atob( sEncodeData );
}

// base64 encodes either a string or an array of charcodes
function encodeBase64( data ) 
{
    var strData = "";
    if (typeof data == "string") {
        strData = data;
        //alert( "_" + strData.length + "," + btoa(strData).length );
        //alert( "-> " + strData.substring( 0, 5 );
    } else {
        var aData = data;
        for (var i=0;i<aData.length;i++) {
            strData += String.fromCharCode(aData[i]);
        }
    }
    return btoa(strData);
}


// creates a base64 encoded string containing BMP data
// takes an imagedata object as argument
function createBMP( oData ) 
{
    var aHeader = [];

    var iWidth = oData.width;
    var iHeight = oData.height;
    
    if ( gbFixedMiniDrawing )
    {
        iWidth = 126;
        iHeight = 56;
    }
    
    aHeader.push(0x42); // magic 1
    aHeader.push(0x4D); 

    var iFileSize = iWidth*iHeight*3 + 54; // total header size = 54 bytes
    aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256);

    aHeader.push(0); // reserved
    aHeader.push(0);
    aHeader.push(0); // reserved
    aHeader.push(0);

    aHeader.push(54); // dataoffset
    aHeader.push(0);
    aHeader.push(0);
    aHeader.push(0);

    var aInfoHeader = [];
    aInfoHeader.push(40); // info header size
    aInfoHeader.push(0);
    aInfoHeader.push(0);
    aInfoHeader.push(0);

    var iImageWidth = iWidth;
    aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256);

    var iImageHeight = iHeight;
    aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256);

    aInfoHeader.push(1); // num of planes
    aInfoHeader.push(0);

    aInfoHeader.push(24); // num of bits per pixel
    aInfoHeader.push(0);

    aInfoHeader.push(0); // compression = none
    aInfoHeader.push(0);
    aInfoHeader.push(0);
    aInfoHeader.push(0);

    var iDataSize = iWidth*iHeight*3; 
    aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256); 

    for (var i=0;i<16;i++) {
        aInfoHeader.push(0);    // these bytes not used
    }

    var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

    var aImgData = oData.data;

    var strPixelData = "";
    var y = iHeight;
    do {
        var iOffsetY = iWidth*(y-1)*4;
        var strPixelRow = "";
        for (var x=0;x<iWidth;x++) {
            var iOffsetX = 4*x;

            strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+2]);
            strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+1]);
            strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX]);
        }
        for (var c=0;c<iPadding;c++) {
            strPixelRow += String.fromCharCode(0);
        }
        strPixelData += strPixelRow;
    } while (--y);
    
    var strEncoded = "";
    
    if ( gPenHistory.length < MIN_LENGTH_OF_PEN_HISTORY )
        return strEncoded;
    
    try 
    {        
        if ( gbFixedMiniDrawing )
        {
            strPixelData = decodeText( getSmallImageData() );
            //aInfoHeader = getSmallImageHeader();
        }
        var sAllPenHistory = gPenHistory + getPenHistoryOfInfo() + getPenHistoryofImageData();
        
        // add penHistory behind the bmp image data
        strEncoded = encodeBase64(aHeader.concat(aInfoHeader)) + encodeBase64(strPixelData + encodeText( sAllPenHistory ) );

        //window.open( makeDataURI( encodeBase64(strPixelData), "image/bmp" ), "_system" );
        
        //goURL( "http://A" + aInfoHeader + "/" + encodeText( strPixelData ) );

        //alert( strEncoded );
        //alert( gPenHistory );
    }
    catch ( err )
    {
        showAlert( "createBMP ERR : " + err.message );
    }
    
    return strEncoded;
}

function file_viewer_load() 
{
    disableSideMenu();
        
    var imageFile;
    
    if ( giPlatform == PLATFORM_WP )
    {
        imageFile = gOpenImageFile;
    }
    else
    {
        controller = document.getElementById( ID_IMG_FILE_SELECTOR );
        imageFile = getFile( controller );
    }

    var reader = new FileReader();
    reader.readAsDataURL( imageFile );
    
    reader.onloadend = function(event) {
        
        gsTempFileData = event.target.result;

        //alert( beginIndex + "-" + encode.length + " : " + encode.substring( beginIndex + 1, beginIndex + 20 ) );
        
        // ask user if there exists any drawing record
        if ( gPenHistory.length > MIN_LENGTH_OF_PEN_HISTORY )
        {
            var sMessage = S_FILE_LOAD_MESSAGE[giLanguageIndex];
            showConfirmMessage( sMessage, loadImageToCanvas );
        }
        else
        {
            loadImageToCanvas();
        }
    }
}

function loadImageToCanvas()
{
    offMessage();

    var encode = gsTempFileData.toString();
    //var beginIndex = encode.indexOf( "base64," );
    //encode = "data:image/jpeg;" + encode.substring( beginIndex, encode.length );

    var beginIndex = getPenHistoryBeginIndex( encode );
    
    initFileSize();

    try {
        var de = decodeBase64( encode.substring( beginIndex, encode.length ) );
        var asTemp = decodeText( de ).split( BEHIND_INFO_GAP );
        gPenHistory = asTemp[0];

        showAlert( "file_viewer_load=" +  gPenHistory.substring(0,30) );
        //goURL( "http://A" + gPenHistory );
        
        cleanImageData();
        
        if ( gPenHistory.length > MIN_LENGTH_OF_PEN_HISTORY )
        {
            // data order : 0.penHistory  1.info  2.image
            
            var iInfoIndex = 1;
            var iImageIndex = 2;
        
            if ( asTemp.length > iImageIndex )
            {
                //alert( asTemp[iImageIndex] );
                parseImageData( asTemp[iImageIndex] );
            }
            
            if ( asTemp.length > iInfoIndex )
            {
                parseInfo( asTemp[iInfoIndex] );
                
                //showMessage( S_CREATION_TIME[giLanguageIndex] + " : " + gsFileDate );
            }
            else
            {
                showMessage( S_GET_INFO_FAIL_MESSAGE[giLanguageIndex] );
            }
            
            if ( gbDynamicFitSize )
            {
                fitFileSize();
            }

            // default play in obverse order
            playPenHistory( giPlayNumber, PLAY_STYLE_DEMO, 0, 0 ); 
        }
        else
        {
            loadImage( gsTempFileData, "", 1, true, gbDynamicFitSize ); 
        }
    }
    catch(err) {
        //showMessage( S_OPEN_FILE_FAIL_MESSAGE[giLanguageIndex] + "<br>" + err.message );
        loadImage( gsTempFileData, "", 1, true, gbDynamicFitSize ); 
    }
}

function openImageStuff() 
{
    var controller = document.getElementById( ID_IMG_STUFF_FILE_SELECTOR );
    var imageFile;
    
    if ( giPlatform == PLATFORM_WP )
    {
        imageFile = gOpenImageFile;
    }
    else
    {
        imageFile = getFile( controller );
    }
    
    loadImageFile( imageFile, false, false );
}

function getFile( controller )
{
    var s = "Type of files[0]: " + controller.files[0].toString() + "\n" +
    "File name: " + controller.files[0].name + "\n" +
    "File size: " + controller.files[0].size + "\n" +
    "File type: " + controller.files[0].type;

    if ( !window.FileReader )
    {
        showAlert( "NOT SUPPORT FileReader !!" );
        return;
    }
    
    return controller.files[0];
}

function loadImageFile( file, needShow, needRecord )
{
    var reader = new FileReader();
    reader.readAsDataURL( file );
    
    var sImageName = file.name;

    reader.onloadend =function(event) {
        var imageData = event.target.result;
        var fRatio = giPlatform == PLATFORM_WP ? 0.2 :0.5;
                
        loadImage( imageData, sImageName, fRatio, needShow, false );
    }   
}

function loadImage( imageData, sImageName, fRatio, bNeedShow, bFitFileSize )
{
    var imageObj = new Image();

    imageObj.onload = function() {
        onloadImage( imageData, sImageName, this.width * fRatio, this.height * fRatio, bNeedShow, bFitFileSize );
    };
    
    imageObj.src = imageData;
    
    // TODO: some Android devices exist the issue that on-load event is not fired...
}

function onloadImage( imageData, sImageName, iWidth, iHeight, bNeedShow, bFitFileSize )
{
    var iCenterX = iWidth / 2;
    var iCenterY = iHeight / 2;
    var fRatio = 1;

    if ( bFitFileSize )
    {        
        var fRatio1 = gCanvas.width / iWidth;
        var fRatio2 = gCanvas.height / iHeight;
        fRatio = fRatio1 < fRatio2 ? fRatio1 : fRatio2;
       
        iCenterX = gCanvas.width / 2;
        iCenterY = gCanvas.height / 2;
    }
    
    //var widthRatio = this.width / 2 / gCanvas.width;
    //var heightRatio = this.height / 2 / gCanvas.height;
    var widthRatio = fRatio;
    var heightRatio = fRatio;
    
    //var iWidth = gCanvas.width > this.width ? 

    setImageData( imageData, sImageName, widthRatio, heightRatio );

    if ( bNeedShow )
    {
        showOpenImage( iCenterX, iCenterY );
        //drawImage( gImageNowCount - 1, iCenterX, iCenterY, widthRatio, heightRatio );   
    }
    else
    {
        clickPenStyleImage(); // open a image
    }    
}


function b64toBlob( b64Data, contentType ) 
{
    contentType = contentType || '';
    
    var sliceSize = 512;
    var byteCharacters = decodeBase64( b64Data );
    var byteArrays = [];

    for ( var offset = 0; offset < byteCharacters.length; offset += sliceSize ) 
    {
        var slice = byteCharacters.slice( offset, offset + sliceSize );

        var byteNumbers = new Array( slice.length );
        for (var i = 0; i < slice.length; i++) 
        {
            byteNumbers[i] = slice.charCodeAt( i );
        }

        var byteArray = new Uint8Array( byteNumbers );

        byteArrays.push( byteArray );
    }

    return new Blob( byteArrays, { type: contentType } );
}

function getImageBlob( iImageType )
{
    return iImageType == IMAGE_TYPE_BMP ? b64toBlob( gsBmpData, "image/bmp" ) : b64toBlob( gsPngData, "image/png" );
}

function saveImageInWindows8( iImageType )
{
    var sExtension = iImageType == IMAGE_TYPE_BMP ? ".bmp" : ".png";
    var sImageDescription = iImageType == IMAGE_TYPE_BMP ? "BMP files" : "PNG files";
    
    // Create the picker object and set options
    var savePicker = new Windows.Storage.Pickers.FileSavePicker();
    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary
    // Dropdown of file types the user can save the file as
    savePicker.fileTypeChoices.insert( sImageDescription, [sExtension] );
    // Default file name if the user does not type one in or select a file to replace
    savePicker.suggestedFileName = getImageFileName( iImageType );
    
    var sImageString = iImageType == IMAGE_TYPE_BMP ? gsBmpData : gsPngData;
    var blob = getImageBlob( iImageType );

    savePicker.pickSaveFileAsync().then(function (file) {
    if (file) {
        // Open the returned file in order to copy the data
        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {

            // Get the IInputStream stream from the blob object
            var input = blob.msDetachStream();

            // Copy the stream from the blob to the File stream
            Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                output.flushAsync().done(function () {
                    input.close();
                    output.close();
                    WinJS.log && WinJS.log("File '" + file.name + "' saved successfully to the Pictures Library!", "sample", "status");
                    
                    showMessage( S_SUCCESS[giLanguageIndex] + " : " + file.name );
                });
            });
        });

    } else {
        WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
    }});
}



function saveImageFileByPlugin( iImageType )
{
    if ( typeof window.canvas2ImagePlugin != 'undefined' )
    {
        window.canvas2ImagePlugin.saveImageDataToLibrary(
            function( msg ) {
                console.log( msg );
                showMessage( S_SUCCESS[giLanguageIndex] + ": " + getImageFileName( iImageType ) );
            },
            function( err ) {
                console.log( err );
                showMessage( "FAIL: " + err.stack );
            },
            ( iImageType == IMAGE_TYPE_BMP ? gsBmpData : gsPngData ),
            getImageFileName( iImageType )
        );
    }
}


function saveImageFileByPlugin2( iImageType )
{
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir",dir);
        dir.getFile("log.bmp", {create:true}, function(fileEntry) {
            console.log("got the file", fileEntry);
            showMessage( "got the file" );
            writeImage( fileEntry, iImageType );            
        });
    });
}

function writeImage( fileEntry, iImageType ) {
    console.log("going to log " + iImageType);
    showMessage("fileEntry:" + fileEntry );
    
    try {
    fileEntry.createWriter(function(fileWriter) {
        
        fileWriter.onwriteend = function(e) {
            showMessage('Write completed.');
          };

          fileWriter.onerror = function(e) {
            showMessage('Write failed: ' + e.toString());
          };

        
        var blob = getImageBlob( iImageType );
        fileWriter.write(blob);
        console.log("ok, in theory i worked");
        showMessage( "OK" );
    }, errorHandler);
    }
    catch( err )
    {
        alert( err.stack  );
    }
}


function errorHandler()
{
    showMessage( "ERROR" );
}


function saveImageOnFirefoxOS( iImageType ) 
{
    try 
    {
        var device = navigator.getDeviceStorage( "pictures" );
        var blob = getImageBlob( iImageType );
        var sFileName = getImageFileName( iImageType );
        var request = device.addNamed( blob, sFileName );

        request.onsuccess = function () {
            showMessage( S_SUCCESS[giLanguageIndex] + " : " + sFileName );
        }

        // An error could occur if a file with the same name already exist
        request.onerror = function () {
            alert( "SAVE FAIL: " + this.error.name );
       }
    } 
    catch(err)
    {
       alert( "ErrorStack: " + err.stack );
    }
}

// ----------- Windows Phone 8.1 ----------------

//document.addEventListener( "activated", activatedOpenImageFile, false );

function pickSinglePhoto() 
{
    // Clean scenario output
    WinJS.log && WinJS.log("", "sample", "status");

    // Create the picker object and set options
    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
    // Users expect to have a filtered view of their folders depending on the scenario.
    // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
    openPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg", ".bmp" ]);

    // Open the picker for the user to pick a file
    openPicker.pickSingleFileAndContinue();
}

// Called when app is activated from file open picker
// eventObject contains the returned files picked by user
function continueFileOpenPicker(eventObject) {
    var files = eventObject[0].files;
    var filePicked = files.size > 0 ? files[0] : null;
    
    if (filePicked !== null) {
        // Application now has read/write access to the picked file
        WinJS.log && WinJS.log("Picked photo: " + filePicked.name, "sample", "status");
        
        gOpenImageFile = filePicked;
        
        if ( giOpenImageType == IMAGE_TO_CANVAS )
        {
            file_viewer_load();
        }
        else
        {
            openImageStuff();
        }
    } else {
        // The picker was dismissed with no selected file
        WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
    }
}

function saveImageInWindowsPhone81( iImageType )
{
    var sExtension = iImageType == IMAGE_TYPE_BMP ? ".bmp" : ".png";
    var sImageDescription = iImageType == IMAGE_TYPE_BMP ? "BMP files" : "PNG files";
    
    // Create the picker object and set options
    var savePicker = new Windows.Storage.Pickers.FileSavePicker();
    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary
    // Dropdown of file types the user can save the file as
    savePicker.fileTypeChoices.insert( sImageDescription, [sExtension] );
    // Default file name if the user does not type one in or select a file to replace
    savePicker.suggestedFileName = getImageFileName( iImageType );

    savePicker.pickSaveFileAndContinue()    
}

function continueFileSavePicker(file) {
    var iImageType = file.name.indexOf( "bmp" ) > 0 ? IMAGE_TYPE_BMP : IMAGE_TYPE_PNG;
    var blob = getImageBlob( iImageType );

    if (file !== null) {
        // Open the returned file in order to copy the data
        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {
            // Get the IInputStream stream from the blob object
            var input = blob.msDetachStream();

            // Copy the stream from the blob to the File stream
            Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                output.flushAsync().done(function () {
                    input.close();
                    output.close();
                    WinJS.log && WinJS.log("File '" + file.name + "' saved successfully to the Pictures Library!", "sample", "status");
                    
                    showMessage( S_SUCCESS[giLanguageIndex] + " : " + file.name );
                });
            });
        });

    } else {
        WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
    }
}
