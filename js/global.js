
"use strict";

//<access origin="http://127.0.0.1*" />


// 繁 英 簡 日 韓
// [giLanguageIndex]
var ZH = 1; // 繁中
var EN = 2; // 英文
var CN = 3; // 簡中
var JA = 4; // 日文
var KO = 5; // 韓文
var PT = 6; // 葡萄牙文 português
var ES = 7; // 西班牙文 español
var HI = 8; // 印度文 हिन्दी
var AR = 9; // 阿拉伯文 العربية‎ 
var RU = 10; // 俄文 русский язык
var FR = 11; // 法文 le français 
var TH = 12; // 泰文 อักษรไทย
var DE = 13; // 德文 Deutsch
var IT = 14; // 義大利文 Italiano
var giLanguageIndex = EN; // default language
var gSupportLanguageCount = 5; // UI .
var gLocalLanguageIndex = -1; // get the platform local index by Phonegap API


var PLATFORM_WP = 1;
var PLATFORM_ANDROID = 2;
var PLATFORM_IOS = 3;
var PLATFORM_FIREFOXOS = 5;
var PLATFORM_CHROMEOS = 6;
var PLATFORM_WINDOWS_8 = 7;
var PLATFORM_TIZEN = 8;
var PLATFORM_UBUNTU_TOUCH = 9;
var PLATFORM_BROWSER = 10;
var giPlatform = PLATFORM_TIZEN; // default platform

var B_ON_DEVICE = true;

// ----- div ID -----

var ID_HEADER = "header";
var ID_CONTENT = "content";
var ID_FOOTER = "footer";
var ID_NAV = "nav";
var ID_NAVBAR = "navbar";

var ID_MAIN = "main";
var ID_MENU = "menuwithnav1"; // for windows 8 and windows 8 light only
var ID_OPTION = "option1";
var ID_PAINT = "paint1";

var ID_DISPLAY = "display";
var ID_STYLE = "style";
var ID_BACKGROUND_IMAGE = "backgroundImage";
var ID_LANGUAGE = "language";
var ID_FONT_SIZE = "fontsize";
var ID_RECOVERY = "recovery";
var ID_ABOUT = "about";
var ID_ABOUT_APP = "aboutApp";
var ID_ABOUT_AUTHOR = "aboutAuthor";
var ID_RELATED_LINKS = "relatedLinks";
var ID_ADVANCE = "advance1";

var ID_TEST = "test";

var ID_DELETE_BACKGROUND_IMAGE = "delete_background_image";

// ------- for Chrome APP ------

// for header button
var ID_CLICK_UNDO = "ID_CLICK_UNDO";
var ID_CLICK_MENU = "ID_CLICK_MENU";
var ID_CLICK_PLAY = "ID_CLICK_PLAY";
var ID_CLICK_PAUSE = "ID_CLICK_PAUSE";
var ID_CLICK_CONTINUE = "ID_CLICK_CONTINUE";
var ID_CLICK_CLEAN = "ID_CLICK_CLEAN";

// for side menu 
var ID_CLICK_PEN_RECORD_SIDE_MENU = "ID_CLICK_PEN_RECORD_SIDE_MENU";
var ID_CLICK_PEN_STYLE_SIDE_MENU = "ID_CLICK_PEN_STYLE_SIDE_MENU";
var ID_CLICK_COLOR_SIDE_MENU = "ID_CLICK_COLOR_SIDE_MENU";
var ID_CLICK_PLAY_SIDE_MENU = "ID_CLICK_PLAY_SIDE_MENU";
var ID_CLICK_FILE_SIDE_MENU = "ID_CLICK_FILE_SIDE_MENU";
var ID_CLICK_GO_BACK_TO_PAINT = "ID_CLICK_GO_BACK_TO_PAINT";
var ID_CLICK_GO_BACK_TO_PEN_STYLE = "ID_CLICK_GO_BACK_TO_PEN_STYLE";
var ID_CLICK_FORE_COLOR_SIDE_MENU = "ID_CLICK_FORE_COLOR_SIDE_MENU";
var ID_CLICK_BACK_COLOR_SIDE_MENU = "ID_CLICK_BACK_COLOR_SIDE_MENU";

// for play
var ID_CLICK_PLAY_STYLE_OBVERSE = "ID_CLICK_PLAY_STYLE_OBVERSE";
var ID_CLICK_PLAY_STYLE_REVERSE = "ID_CLICK_PLAY_STYLE_REVERSE";
var ID_CLICK_UNIFY_PLAY_SPEED = "ID_CLICK_UNIFY_PLAY_SPEED";
var ID_CLICK_PLAY_SPEED_UP = "ID_CLICK_PLAY_SPEED_UP";
var ID_CLICK_PLAY_SPEED_DOWN = "ID_CLICK_PLAY_SPEED_DOWN";
var ID_CLICK_ENABLE_PROCESS_BAR = "ID_CLICK_ENABLE_PROCESS_BAR";
var ID_CLICK_CUT_PEN_HISTORY = "ID_CLICK_CUT_PEN_HISTORY";

var ID_CLICK_REDO = "ID_CLICK_REDO";


// for pen style
var ID_CLICK_PEN_STYLE_LINE = "ID_CLICK_PEN_STYLE_LINE";
var ID_CLICK_PEN_STYLE_CIRCLE = "ID_CLICK_PEN_STYLE_CIRCLE";
var ID_CLICK_PEN_STYLE_RECTANGLE = "ID_CLICK_PEN_STYLE_RECTANGLE";
var ID_CLICK_PEN_STYLE_DOT = "ID_CLICK_PEN_STYLE_DOT";
var ID_CLICK_PEN_STYLE_ERASER = "ID_CLICK_PEN_STYLE_ERASER";
var ID_CLICK_PEN_STYLE_TEXT = "ID_CLICK_PEN_STYLE_TEXT";
var ID_CLICK_PEN_STYLE_OTHER = "ID_CLICK_PEN_STYLE_OTHER";
var ID_CLICK_PEN_STYLE_IMAGE = "ID_CLICK_PEN_STYLE_IMAGE";

// for specific option
var ID_CLICK_CHANGE_TEXT = "ID_CLICK_CHANGE_TEXT";
var ID_CLICK_PEN_STYLE_DEMO_INCREASE = "ID_CLICK_PEN_STYLE_DEMO_INCREASE";
var ID_CLICK_PEN_STYLE_DEMO_DECREASE = "ID_CLICK_PEN_STYLE_DEMO_DECREASE";
var ID_CLICK_DELAY = "ID_CLICK_DELAY";
var ID_CLICK_DELAY_SECOND_INCREASE = "ID_CLICK_DELAY_SECOND_INCREASE";
var ID_CLICK_DELAY_SECOND_DECREASE = "ID_CLICK_DELAY_SECOND_DECREASE";
var ID_CLICK_NEW_FILE = "ID_CLICK_NEW_FILE";
var ID_CLICK_CHANGE_FILE_NAME = "ID_CLICK_CHANGE_FILE_NAME";
var ID_CLICK_GO_EMAIL_OF_AUTHOR = "ID_CLICK_GO_EMAIL_OF_AUTHOR";
var ID_CLICK_GO_BACK_TO_DEFAULT = "ID_CLICK_GO_BACK_TO_DEFAULT";

var ID_CLICK_PEN_STYLE_SPECIFIC_STYLE = "ID_CLICK_PEN_STYLE_SPECIFIC_STYLE";
var ID_CLICK_PEN_STYLE_PICTURE = "ID_CLICK_PEN_STYLE_PICTURE";
var ID_CLICK_FORE_COLOR = "ID_CLICK_FORE_COLOR";
var ID_CLICK_BACK_COLOR = "ID_CLICK_BACK_COLOR";
var ID_CLICK_RELATED_LINK = "ID_CLICK_RELATED_LINK";
var ID_CLICK_STYLE = "ID_CLICK_STYLE";
var ID_CLICK_LANGUAGE = "ID_CLICK_LANGUAGE";
var ID_CLICK_FONT_SIZE = "ID_CLICK_FONT_SIZE";
var ID_CLICK_CUT_EDIT = "ID_CLICK_CUT_EDIT";
var ID_CLICK_IMG_FILE_PICKER = "ID_CLICK_IMG_FILE_PICKER";
var ID_CLICK_IMG_STUFF_FILE_PICKER = "ID_CLICK_IMG_STUFF_FILE_PICKER";

var ID_IMG_FILE_SELECTOR = "ID_IMG_FILE_SELECTOR";
var ID_IMG_STUFF_FILE_SELECTOR = "ID_IMG_STUFF_FILE_SELECTOR";

var ID_INPUT_TEXT = "ID_INPUT_TEXT";
var ID_DOWNLOAD_ANIMATION_LINK = "ID_DOWNLOAD_ANIMATION_LINK";
var ID_DOWNLOAD_DRAWING_LINK = "ID_DOWNLOAD_DRAWING_LINK";

var ID_CLICK_EDIT_CONFIRM = "ID_CLICK_EDIT_CONFIRM";
var ID_CLICK_PREV_ADVANCE_PAGE = "ID_CLICK_PREV_ADVANCE_PAGE";
var ID_CLICK_NEXT_ADVANCE_PAGE = "ID_CLICK_NEXT_ADVANCE_PAGE";
var ID_CLICK_BEGIN_CUT = "ID_CLICK_BEGIN_CUT";
var ID_CLICK_END_CUT = "ID_CLICK_END_CUT";

var ID_CLICK_ALL_ARRAY = new Array( ID_CLICK_UNDO, "appbar.layout.collapse.left.variant", "↻", ID_CLICK_MENU, "appbar.lines.horizontal.4", "▤", ID_CLICK_PLAY, "appbar.tv", "►", ID_CLICK_PAUSE, "appbar.control.pause", "■", ID_CLICK_CONTINUE, "appbar.control.play", "►", ID_CLICK_CLEAN, "appbar.clipboard.variant", "❒", ID_CLICK_PEN_RECORD_SIDE_MENU, "appbar.film", "₪", ID_CLICK_PEN_STYLE_SIDE_MENU, "appbar.edit.box", "✎", ID_CLICK_COLOR_SIDE_MENU, "appbar.crop", "▩", ID_CLICK_PLAY_SIDE_MENU, "appbar.camera", "►", ID_CLICK_FILE_SIDE_MENU, "appbar.cabinet.variant", "✇", ID_CLICK_GO_BACK_TO_PAINT, "appbar.arrow.left", "⇦", ID_CLICK_GO_BACK_TO_PEN_STYLE, "appbar.arrow.left", "⇦", 
ID_CLICK_FORE_COLOR_SIDE_MENU, "appbar.layer.arrange.solid.sendbackward", "❏", ID_CLICK_BACK_COLOR_SIDE_MENU, "appbar.layer.arrange.solid.bringforward", "❐", ID_CLICK_PLAY_STYLE_OBVERSE, "appbar.timer.forward", "►", ID_CLICK_PLAY_STYLE_REVERSE, "appbar.timer.rewind", "◄", ID_CLICK_PLAY_SPEED_UP, "appbar.add", "+", ID_CLICK_PLAY_SPEED_DOWN, "appbar.minus", "-", ID_CLICK_CUT_PEN_HISTORY, "appbar.scissor", "✁", ID_CLICK_REDO, "appbar.layout.collapse.right", "↺", 
ID_CLICK_PEN_STYLE_LINE, "appbar.draw.marker", "✐", ID_CLICK_PEN_STYLE_CIRCLE, "appbar.cd", "●", ID_CLICK_PEN_STYLE_RECTANGLE, "appbar.fullscreen.box", "■", ID_CLICK_PEN_STYLE_DOT, "appbar.draw.paintbrush", "❄", ID_CLICK_PEN_STYLE_ERASER, "appbar.clean", "◕", ID_CLICK_PEN_STYLE_TEXT, "appbar.message.smiley", "✑", ID_CLICK_PEN_STYLE_OTHER, "appbar.code.xml", "ஐ", ID_CLICK_PEN_STYLE_IMAGE, "appbar.image", "❖", 
ID_CLICK_CHANGE_TEXT, "appbar.edit.box", "✎", ID_CLICK_PEN_STYLE_DEMO_INCREASE, "appbar.edit.add", "+", ID_CLICK_PEN_STYLE_DEMO_DECREASE, "appbar.edit.minus", "-", ID_CLICK_DELAY, "appbar.crop", "▣", ID_CLICK_DELAY_SECOND_INCREASE, "appbar.add", "+", ID_CLICK_DELAY_SECOND_DECREASE, "appbar.minus", "-", ID_CLICK_NEW_FILE, "appbar.page.bold", "☁", 
ID_CLICK_CHANGE_FILE_NAME, "appbar.clipboard.variant.edit", "✎", ID_CLICK_GO_EMAIL_OF_AUTHOR, "appbar.email", "✉", ID_CLICK_GO_BACK_TO_DEFAULT, "appbar.repeat", "⇄", ID_IMG_FILE_SELECTOR, "appbar.folder.open", "", ID_IMG_STUFF_FILE_SELECTOR, "appbar.folder.open", "", ID_DOWNLOAD_ANIMATION_LINK, "appbar.cabinet.in", "✿", ID_DOWNLOAD_DRAWING_LINK, "appbar.image.snow", "✿", ID_PAINT, "appbar.cabinet.out", "✐", ID_ADVANCE, "appbar.edit.box", "＊", ID_CLICK_EDIT_CONFIRM, "appbar.edit.box", "✐", ID_CLICK_BEGIN_CUT, "appbar.edit.box", "✐", ID_CLICK_END_CUT, "appbar.edit.box", "✐" );

// "☑""☒"


// ----- all keys for local storage -----

// option
var KEY_STYLE_INDEX = "key_style_index_";
var KEY_LANGUAGE_INDEX = "key_language_index_";
var KEY_FONT_SIZE_INDEX = "key_font_size_index_";
var KEY_BACKGROUND_IMAGE = "key_background_image_";

// play
var KEY_PROCESS_BAR_ENABLED = "key_process_bar_enabled_";
var KEY_PLAY_SPEED_UNIFIED = "key_play_speed_unified_";
var KEY_PLAY_SPEED = "key_play_speed_";

// size
var KEY_PEN_WIDTH = "key_pen_width_";
var KEY_RECTANGLE_WIDTH = "key_rectangle_width_";
var KEY_CIRCLE_WIDTH = "key_circle_width_";
var KEY_ERASER_WIDTH = "key_eraser_width_";
var KEY_TEXT_WIDTH = "key_text_width_";
var KEY_IMAGE_STUFF_RATIO = "key_iamge_stuff_ratio_";

// color
var KEY_FORE_COLOR = "key_fore_color_";
var KEY_BACK_COLOR = "key_back_color_";
var KEY_FORE_COLOR_INDEX = "key_fore_color_index_";
var KEY_BACK_COLOR_INDEX = "key_back_color_index_";

// pen style
var KEY_ERASER_STYLE_INDEX = "key_eraser_style_index_";
var KEY_LINE_STYLE_INDEX = "key_line_style_index_";
var KEY_DOT_STYLE_INDEX = "key_dot_style_index_";
var KEY_RECTANGLE_STYLE_INDEX = "key_rectangle_style_index_";
var KEY_CIRCLE_STYLE_INDEX = "key_circle_style_index_";
var KEY_TEXT_STYLE_INDEX = "key_text_style_index_";

// play style
var KEY_PLAY_STYLE_INDEX = "key_play_style_index_";

var KEY_DELAY_SECOND = "key_delay_second_";

var KEY_ALL_ARRAY = new Array( 
// option
KEY_STYLE_INDEX, KEY_LANGUAGE_INDEX, KEY_FONT_SIZE_INDEX, KEY_BACKGROUND_IMAGE, 

// play
KEY_PROCESS_BAR_ENABLED, KEY_PLAY_SPEED_UNIFIED, KEY_PLAY_SPEED, 

// color
KEY_FORE_COLOR, KEY_BACK_COLOR, 
KEY_FORE_COLOR_INDEX, KEY_BACK_COLOR_INDEX, 

// size
KEY_PEN_WIDTH, KEY_RECTANGLE_WIDTH, KEY_CIRCLE_WIDTH, 
KEY_ERASER_WIDTH, KEY_TEXT_WIDTH, KEY_IMAGE_STUFF_RATIO,

// style
KEY_ERASER_STYLE_INDEX, KEY_LINE_STYLE_INDEX, KEY_DOT_STYLE_INDEX, 
KEY_RECTANGLE_STYLE_INDEX, KEY_CIRCLE_STYLE_INDEX, KEY_TEXT_STYLE_INDEX,
KEY_PLAY_STYLE_INDEX, KEY_DELAY_SECOND

);


// -----------------------------

// ------ symbol -------

var WHITE_SPACE = "﹍";
var DIVISION_WORD = "￡";
var DIVISION_WORD_2 = "￥";
var PAGE_DIVISION = "-"; // ex. 1000-34 -> the 34nd page change is PAGE_SEARCH
var DATE_DIVISION = "."; // ex. 2014.9
var LOCATION_DIVISION = "."; // ex. 1.0.1.0
var COLON_WORD = " : ";
var QUESTION_MARK = " ?";
var RIGHT_ARROW = " → ";
var DASHED_RIGHT_ARROW = " ↝ ";
var RIGHT_ARROW_2 = " ➠ ";
var LEFT_BRACKET = "【";
var RIGHT_BRACKET = "】";
var LEFT_BRACKET_2 = "〔";
var RIGHT_BRACKET_2 = "〕";
var LEFT_BRACKET_3 = "﹝";
var RIGHT_BRACKET_3 = "﹞";
var SYMBOL_SQUARE = "■";

var LEFT_QUOTATION_MARK = "『";
var RIGHT_QUOTATION_MARK = "』";

var SYMBOL_CHECKED = "☑";
var SYMBOL_UNCHECKED = "☒";


var TOUCH_GAP = "_"; // the symbol between touches
var MOTION_GAP = "-"; // the symbol between motions
var TOKEN_GAP = " "; //  the symbol between tokens

var BEHIND_INFO_GAP = "︷";
var BEHIND_END_GAP = "︸";
var BEHIND_TOKEN_GAP = "﹋";



var gsLastEncodeTextOfBMP = "////";
var gsLastEncodeTextOfBMP2 = "AAAAA";
var gsFirstEncodeTagOfPenHistory = "AA";//"AA";

// ------ constant -------

var TRUE = "T";
var FALSE = "F";

var INIT_INDEX = -1;
var SWIPE_LEFT = 0;
var SWIPE_RIGHT = 1;

var NOT_FOUND = -1;

var INIT_POS = -1000; // initial position

var UNDO = 0;
var REDO = 1;
var NOWDO = 2;



var TEMP_STORE_BACKTRACK = 1;
var TEMP_STORE_SHOWTRACE = 2;

var HORIZONTAL = 1;
var VERTICAL = 2;



var FOREGROUND = 0;
var BACKGROUND = 1;

var LINE_STYLE_NORMAL = 1;
var LINE_STYLE_CRACK = 2;
var LINE_STYLE_DOTTED = 3;

// for rectangle & circle
var STYLE_SOLID = 1;
var STYLE_UNSOLID = 2;

// for eraser
var ERASER_TYPE_CIRCLE = 1;
var ERASER_TYPE_RECTANGLE = 2;

var CLEAN_STYLE_NORMAL = 1;
var CLEAN_STYLE_2 = 2;
var CLEAN_STYLE_3 = 3;

// svae image file type
var IMAGE_TYPE_BMP = 1;
var IMAGE_TYPE_PNG = 2;

var MAIN_LOGO = 1;
var APP_LOGO = 2;
var AUTHOR_LOGO = 3;

var MIN_LENGTH_OF_PEN_HISTORY = 50;


var TYPE_ADD = 1;
var TYPE_REMOVE = 2;

var MAX_IMAGE_STUFF_KB = 1024; // max file size is 1024 KB

var BASE_FONT_SIZE_RATIO = 70;

var ITEMS_PER_ADVANCE_PAGE = 6;

// ------ flag -------

var gbOnDevice = false; // init by condova or not

var gbHashEnabled = false; // let the back button of browser works

var gbFooterShowed = false;
var gbHeaderShowed = true;

var gDrawLock = false; // allow drawing or not 
var gDrawEnable = true; // draw or just get the draw commend 

var gbMessageShowed = false;
var gbTouchInvalid = false;



// ----- state -------

var DEBUG_MODE = 0;
var RELEASE_MODE = 1;
var giMode = RELEASE_MODE;

var TRANSITION_SLIDE = "slide";
var TRANSITION_SLIDE_LEFT = "slideLeft";
var gsTransition = TRANSITION_SLIDE;

var TYPE_PEN_INVALID = 0;

var TYPE_PEN_LINE = 10;
var TYPE_PEN_RECTANGLE = 11;
var TYPE_PEN_CIRCLE = 12;
var TYPE_PEN_DOT = 13;
var TYPE_PEN_ERASER = 14;
var TYPE_IMAGE = 18;
var TYPE_TEXT = 19;
var TYPE_CLEAN = 20;
var TYPE_GLOBAL_VALUE = 21; 
var TYPE_BUTTON = 22;
var TYPE_CONDITION = 23;
var TYPE_DELAY = 31;
var TYPE_INFO = 32;
var TYPE_IMAGEDATA = 33;
var gPenStyle = TYPE_PEN_LINE; // current pen style

var PLAY_STYLE_OBVERSE = 1; // play in obverse order
var PLAY_STYLE_REVERSE = 2; // play in reverse order
var PLAY_STYLE_DEMO = 3;
var PLAY_STYLE_LOADING = 4;
var PLAY_STYLE_CUT = 5;
var giPlayStyle = PLAY_STYLE_LOADING;

var EDIT_MODE = 1;
var PLAY_MODE = 2;
var PAUSE_MODE = 3;
var END_MODE = 4;
var giCanvasMode = EDIT_MODE;


var SIDEMENU_PAINT = 0;
var SIDEMENU_COLOR = 1;
var SIDEMENU_PLAY = 2;
var SIDEMENU_FILE = 3;
var SIDEMENU_PEN_STYLE = 4;
var SIDEMENU_PEN_RECORD = 5;
//var SIDEMENU_PEN_ERASER = 6;
var SIDEMENU_FORE_COLOR = 7;
var SIDEMENU_BACK_COLOR = 8;
var SIDEMENU_PEN_STYLE_LINE = 9;
var SIDEMENU_PEN_STYLE_TEXT = 10;
var SIDEMENU_PEN_STYLE_RECTANGLE = 11;
var SIDEMENU_PEN_STYLE_CIRCLE = 12;
var SIDEMENU_PEN_STYLE_ERASER = 13;
var SIDEMENU_PEN_STYLE_DOT = 14;
var SIDEMENU_PEN_STYLE_OTHER = 15;
var SIDEMENU_PEN_STYLE_IMAGE = 16;
var giNowSideMenu = SIDEMENU_PAINT;

var PORTRAIT = 1; // height > width
var LANDSCAPE = 2; // width > height

var ICON_HEADER = 1;
var ICON_ITEM = 2;


// ----- global variables -------

// swipe related
var gbSwipeLock = false;
var gbSwipeDown = false;
var giStartTouchX = 10;
var giStartTouchY = 10;

var giDialogIndex = 0; // the dialog should use different id everytime cause the bowser would cache the page has appeared
var gsDialogText = ""; // the message shows on the dialog
var gsPageIDBeforeDialog = "";
var gsButtonIDBeforeDialog = ""; // the button which was triggered the dialog

// gAllListList[giListFirstIndex][giListSecondIndex] is the touched result
var gAllListList;
var giListFirstIndex = -1;
var giListSecondIndex = -1;

// display
var giAlwaysShowMenuIndex = 0;

var gsNowDivID = ""; //ID_P_NEW_RESULT_1;
var gsLastDivID = ""; // for those un-item div
var gsLastUpdateDivID = "";


// for those option allowed select only one color or image
var gsBackgroundImage = null;

var gMergeListsList = null; // for speed up when the sort condition change
//var gSortedListsList = null; // sort the merged result

var gsText = "";
var giCount = 0;
var gasTempColor = new Array(); // temporarily store all the colors in the color div
var gasImageInfo = new Array(); // temporarily store the image info after loading
//var gaiTempPrice = new Array(); // temporarily store the result sum price after searching

var gsEmailOfAuthor = "abc9070410@gmail.com";




// ----- admob -----

var gbAdShowed = false; // false : show AD , true : do not show AD
var gsAndroidCodeOfAD = "ca-app-pub-5587953649122605/6300791896";
var gsIOSCodeOfAD = gsAndroidCodeOfAD;
var gsWPCodeOfAD = "ca-app-pub-5587953649122605/9254258298";


var gsDebug = "";
var gbDebug = false;

// ----- Inneractive -----

var geOptions = {
        TYPE: "Banner",
        REFRESH_RATE: 50,
        APP_ID: "MrQuiz_SingerQuiz_other"
    };
var geInneractiveAD = null;





// Tuya

// ----- canvas ------

var gCanvas = null; //canvas itself
var gContext = null;

var gNowTime = 0; 
var gPreviousTime = -100000; // when touch canvas last time

var gPreviousPhyX = INIT_POS; // touch coordinate x last time 
var gPreviousPhyY = INIT_POS; // touch coordinate y last time 
var gCutEnable = true; // not connect to previous print line

var gColorWidthCount = 10;
var gColorHeightCount = 6;
var gColors = new Array();

var gDrawText = "TEXT"; // the text would be drawing
var gsFileName = "";


var gPenHistory = ""; // current pen history
var gsPenHistoryBackup = "";
var gbPenHistoryBackupSaved = false;
var gPenMotionCount = 0;
var giPenTouchCount = 0;

var gPlayTimers = new Array(); // play record

var DRAWING_MAX_COUNT = 1000; // max count of stored drawing
var gDrawingHistory = new Array( DRAWING_MAX_COUNT );
var gDrawingIndex = -1; // current index for the stored drawing

var gTempShowtraceDrawing; // for show the trace of rectangle, circle or text
var gTempBacktrackDrawing = new Array(); // for backtrack
var giTempBacktrackIndex = 0;

// for temporarily backup
var gTempForeColor;
var gTempPenWidth;
var gTempRectangleWidth;
var gTempCircleWidth;
var gTempEraserWidth;
var gTempTextWidth;
var gTempPlaySpeed;

// max and min coordinates
function ExtremePosData( minX, minY, maxX, maxY )
{
	this.minX = minX;
	this.minY = minY;
	this.maxX = maxX;
	this.maxY = maxY;
}

// image related 
var gImageData = new Array();
var gImageName = new Array();
var gImageWidthRatio = new Array();
var gImageHeightRatio = new Array();
var gImageNowCount = 0; // how many opened images
var giImageTargetIndex = 0;

var gsBmpData = "";
var gsBmpDataURL = "";
var gsPngData = "";
var gsPngDataURL = ""; // for png file with 100% size


var gsTemp = "";

var gaiDelayCleanCount = new Array(); // for touch move smoothly
gaiDelayCleanCount[TYPE_PEN_RECTANGLE] = 0;

var ENABLE = 1;
var DISABLE = 2;

var gasUndoHistory = new Array();
var giUndoIndex = 0;
var gbCanvasInitized = false;

// for the position of drawing
var MIN_X = 0;
var MIN_Y = 1;
var MAX_X = 2;
var MAX_Y = 3;

var POS_X = 0;
var POS_Y = 1;
var POS_WIDTH = 2;
var POS_HEIGHT = 3;

var giAllMotionCount = 0;
var giNowMotionCount = 0;
var giNowMotionIndex = 0;
var PROCESS_BAR_LENGTH = 20;

var giTouchOrder = 0; // record the current touch order for pause/resume
var giPlayNumber = 0; // record the current play number for disable play

var giCutBeginIndex = -1;
var giCutEndIndex = -1;


var giNowPlayNumberOfPaint = 0;
var giLastPenStyle = TYPE_GLOBAL_VALUE;
var giLastTouchOrder = -1;
var gbNowImageLoaded = true;
var gbTotalQueueLoaded = true;
var gbNowStoredDrawingLoaded = true;
var gbTempDrawingLoaded = true;

var giLineDottedCount = 0;
var gbNeedDrawInLineDotted = true;
var giLineDottedCoefficient = 3;

var gsFileDate = ""; // the date which the file 
var giFileWidth = 0;
var giFileHeight = 0;
var gsTempFileData = "";

// 2014.12.8
var giDrawQueueIndex = 0;
var giDrawQueueCount = 0;
var gaiDrawQueueX = new Array();
var gaiDrawQueueY = new Array();
var gaiDrawQueueImageIndex = new Array();
var gaiDrawQueueWidthRatio = new Array();
var gaiDrawQueueHeightRatio = new Array();
var gasDrawQueueText = new Array();
var gaiDrawQueueTextStyle = new Array();
var gasDrawQueueTextColor = new Array();


// 2014.12.9
var gbNewImageDrawingMode = true;
var gbFixedMiniDrawing = true; // show the 'TUYA' logo in the mini drawing icon
var gbDynamicFitSize = true; // dynamically adjust size for any canvas
var gbTempDrawCount = 0;

var gsIndexPath = ""; // for IE and Windows Phone
var gbDivWasChanged = false;

var gStoredItem = {};
var gsFontFamily = "Times New Roman";
var gsTouchStartDivID = "";
var gOpenImageFile = null; // for IOS and Windows Phone 8.1

var IMAGE_TO_CANVAS = 1;
var IMAGE_TO_STUFF = 2;
var giOpenImageType = IMAGE_TO_CANVAS; // for windows phone 8.1
var gbOnFullScreenMenu = false;

var EXECUTION_TYPE_NONE = 1;
var EXECUTION_TYPE_OPEN_IMAGE_TO_CANVAS = 2;
var giExecutionType = EXECUTION_TYPE_NONE;

var gbDebug = false;

// delay the simple touch draw(not swipe), including circle, rectangle, text and image
var giQueueDelayCoefficient = 10;
// delay the simple touch draw(not swipe), including line, dot and eraser
var giTouchDelayCoefficient = 7;

// for advance edit page
var giFirstDrawingInNowPage = -1;
var giTargetEditIndex = 0;
var giBeginCutIndex = 0;
var giEndCutIndex = 0;
var giDrawingResetBeginIndex = 0;
var gbNeedResetDrawingCount = false;
var giTempPrevPenStyle = TYPE_PEN_LINE;
var gbTempQueueTouchEnd = true;
var giTempDrawQueueIndex = -1;
var giTouchNum = 0;
var giTempTouchNum = 0;
var gabNeedCut = new Array();
var gaiTouchIndexForEdit = new Array();

// for save/load dynamic image on IOS
var gRootFS = null;
var gFileEntries = new Array();

var giImageType = IMAGE_TYPE_BMP;


// for parseSingleLanguage() and buildLanguage()

var gsZH = "";
var gsEN = "";
var gsCN = "";
var gsJA = "";
var gsKO = "";
var gsPT = "";
var gsES = "";
var gsHI = "";
var gsAR = "";
var gsRU = "";
var gsFR = "";
var gsTH = "";
var gsDE = "";
var gsIT = "";
var gsLanguage = "";
var gasLanguage = new Array( gsZH, gsEN, gsCN, gsJA, gsKO, gsPT, gsES, gsHI, gsAR, gsRU, gsFR, gsTH, gsDE, gsIT );

