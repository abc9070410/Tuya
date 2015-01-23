


// ---------------------------------------------------

var S_APP_NAME = new Array( '塗鴉', 'Tuya', '涂鸦', 'チュウヤ', 'Tuya', 'Tuya', 'Tuya', 'तुया', 'تويا', 'Туя', 'Tuya', 'Tuya', 'Tuya', 'Tuya' );
var S_PAINT = new Array( '畫筆', 'Paint', '画笔', 'ペイント', '페인트', 'pintar', 'pintar', 'पेंट', 'طلاء', 'краски', 'Peinture', 'สี', 'Farbe', 'Vernice' );
var S_FUNCTION = new Array( '功能', 'Function', '功能', '機能', '기능', 'função', 'función', 'समारोह', 'وظيفة', 'функция', 'fonction', 'ฟังก์ชัน', 'Funktion', 'Funzione' );
var S_FILE = new Array( '檔案', 'File', '档案', 'ファイル', '파일', 'arquivo', 'expediente', 'फ़ाइल', 'ملف', 'файл', 'fichier', 'ไฟล์', 'Datei', 'File' );
var S_COLOR = new Array( '色彩', 'Color', '色彩', '色', '색', 'cor', 'color', 'रंग', 'اللون', 'цвет', 'couleur', 'สี', 'Farbe', 'Colore' );
var S_UNDO = new Array( '復原', 'Undo', '复原', '取り消す', '취소', 'desfazer', 'deshacer', 'नष्ट कर देना', 'فك', 'аннулировать', 'Annuler', 'แก้', 'rückgängig machen', 'Annulla' );
var S_REDO = new Array( '重現', 'Redo', '重现', 'やり直す', '다시 실행', 'refazer', 'rehacer', 'फिर से करना', 'فعل ثانية', 'переделывать', 'Redo', 'ทำซ้ำ', 'wiederholen', 'redo' );
var S_RECORD = new Array( '紀錄', 'Record', '纪录', '記録', '기록', 'registro', 'registro', 'अभिलेख', 'سجل', 'запись', 'Record', 'บันทึก', 'Rekord', 'Record' );
var S_CLEAN = new Array( '清空', 'Clean', '清空', 'クリーン', '깨끗한', 'limpo', 'limpio', 'पाक', 'نظيف', 'чистый', 'propre', 'สะอาด', 'sauber', 'Pulito' );
var S_OBVERSE = new Array( '順序', 'Obverse', '顺序', '表面', '앞면', 'anverso', 'anverso', 'अग्र', 'مواجه', 'лицевой', 'Avers', 'ซึ่งเทียบกัน', 'Vorderseite', 'dritto' );
var S_REVERSE = new Array( '倒序', 'Reverse', '倒序', 'リバース', '역', 'reverso', 'Reverse', 'रिवर्स', 'عكس', 'Обратный', 'Marche arrière', 'ย้อนกลับ', 'Rückwärts', 'Reverse' );
var S_PLAY = new Array( '播放', 'Play', '播放', '遊ぶ', '놀이', 'jogar', 'jugar', 'प्ले', 'لعب', 'играть', 'jouer', 'เล่น', 'spielen', 'Giocare' );
var S_PAUSE = new Array( '暫停', 'Pause', '暂停', '一時停止', '중지', 'pausa', 'pausa', 'ठहराव', 'وقفة', 'пауза', 'Mettre en pause', 'หยุดชั่วคราว', 'Pause', 'Pausa' );
var S_CONTINUE = new Array( '繼續', 'Continue', '继续', '続ける', '계속', 'continuar', 'continuar', 'जारी रखें', 'استمر', 'продолжать', 'continuer', 'ต่อ', 'fortsetzen', 'Continua' );
var S_WIDTH = new Array( '寬度', 'Width', '宽度', '幅', '폭', 'largura', 'ancho', 'चौड़ाई', 'عرض', 'ширина', 'largeur', 'ความกว้าง', 'Breite', 'Larghezza' );
var S_LINE = new Array( '直線', 'Line', '直线', 'ライン', '라인', 'linha', 'línea', 'रेखा', 'خط', 'направление', 'line', 'เส้น', 'Linie', 'Linea' );
var S_DOT = new Array( '點狀', 'Dot', '点状', 'ドット', '점', 'ponto', 'punto', 'डॉट', 'نقطة', 'точка', 'dot', 'จุด', 'Punkt', 'Dot' );
var S_ERASER = new Array( '橡皮', 'Eraser', '橡皮', '消しゴム', '지우개', 'Borracha', 'goma de borrar', 'रबड़', 'ممحاة', 'ластик', 'Eraser', 'ยางลบ', 'Radiergummi', 'Eraser' );
var S_CIRCLE = new Array( '圓形', 'Circle', '圆形', 'サークル', '원', 'círculo', 'círculo', 'गोला', 'دائرة', 'круг', 'cercle', 'วงกลม', 'Kreis', 'Circle' );
var S_RECTANGLE = new Array( '矩形', 'Rectangle', '矩形', '長方形', '구형', 'retângulo', 'rectángulo', 'आयत', 'المستطيل', 'прямоугольник', 'rectangle', 'สี่เหลี่ยมผืนผ้า', 'Rechteck', 'Rettangolo' );
var S_TEXT = new Array( '文字', 'Text', '文字', 'テキスト', '본문', 'texto', 'texto', 'टेक्स्ट', 'نص', 'текст', 'texte', 'ข้อความ', 'Text', 'Testo' );
var S_PICTURE = new Array( '圖片', 'Picture', '图片', '絵', '그림', 'fotografia', 'imagen', 'चित्र', 'صور', 'картина', 'photo', 'ภาพ', 'Bild', 'Picture' );
var S_ENTER_TEXT_FOR_PRINTING = new Array( '輸入欲繪出的文字', 'Enter the text for printing', '输入欲绘出的文字', '印刷用のテキストを入力してください', '인쇄 텍스트를 입력', 'Digite o texto para impressão', 'Introduzca el texto para la impresión', 'मुद्रण के लिए पाठ दर्ज करें', 'أدخل النص للطباعة', 'Введите текст для печати', 'Entrez le texte pour l`impression', 'ป้อนข้อความสำหรับการพิมพ์', 'Geben Sie den Text für den Druck', 'Inserisci il testo per la stampa' );
var S_MESSAGE = new Array( '訊息', 'Message', '讯息', 'メッセージ', '메시지', 'mensagem', 'mensaje', 'संदेश', 'رسالة', 'сообщение', 'Message', 'ข่าวสาร', 'Nachricht', 'Messaggio' );
var S_INFO = new Array( '資訊', 'Info', '资讯', 'インフォ', '정보', 'Informações', 'info', 'जानकारी', 'معلومات', 'информация', 'infos', 'ข้อมูล', 'Info', 'Info' );
var S_INCREASE = new Array( '更粗', 'Increase', '更粗', '増加する', '증가', 'aumentar', 'aumentar', 'वृद्धि', 'زيادة', 'увеличение', 'augmenter', 'เพิ่ม', 'erhöhen', 'Aumentare' );
var S_DECREASE = new Array( '更細', 'Decrease', '更细', '減少', '감소', 'Diminuir', 'disminución', 'घटाएं', 'انخفاض', 'Снижение', 'diminuer', 'ลดลง', ' Ansteigen', 'diminuire' );
var S_CONFIRM = new Array( '確定', 'Confirm', '确定', '確認する', '확인', 'confirmar', 'confirmar', 'पुष्टि करें', 'أكد', 'подтвердить', 'Confirmez', 'ยืนยัน', 'verkleinern', 'Conferma' );
var S_CANCEL = new Array( '取消', 'Cancel', '取消', 'キャンセル', '취소', 'cancelar', 'cancelar', 'रद्द करना', 'إلغاء', 'отменить', 'annuler', 'ยกเลิก', 'bestätigen', 'Annulla' );
var S_SPEED_UP = new Array( '加速', 'Speed Up', '加速', 'スピードアップ', '속도를', 'acelerar', 'acelerar', 'ऊपर स्पीड', 'تسريع', 'Ускорить', 'Speed Up', 'Speed Up', 'stornieren', 'Speed Up' );
var S_SPEED_DOWN = new Array( '減速', 'Speed Down', '减速', 'スピードダウン', '다운 속도', 'Speed Down', 'acelerar abajo', 'नीचे स्पीड', 'سرعة داون', 'Снижение скорости', 'Accélérer vers le bas', 'ความเร็วลง', 'Speed Up', 'Velocità Giù' );
var S_NEW = new Array( '新建', 'New', '新建', '新しい', '새로운', 'novo', 'nuevo', 'नए', 'جديد', 'новый', 'Nouveau', 'ใหม่', 'Geschwindigkeit auf', 'Nuova' );
var S_CHANGE_FILE_NAME = new Array( '改變檔名', 'Change filename', '改变档名', '変更のファイル名', '변경 파일 이름', 'Alterar nome de arquivo', 'Cambio de nombre de archivo', 'बदले फ़ाइल नाम', 'تغيير اسم الملف', 'Изменить имя файла', 'Changer le nom du fichier', 'เปลี่ยนชื่อไฟล์', 'neu', 'Cambia il nome del file' );
var S_OPEN = new Array( '開啟', 'Open', '开启', 'オープン', '열린', 'aberto', 'abierto', 'खुली', 'فتح', 'открыто', 'open', 'เปิด', 'Dateinamen ändern', 'Open' );
var S_SAVE_DRAWING = new Array( '儲存圖畫', 'Save drawing', '储存图画', '保存の描画', '저장 그리기', 'Salvar desenho', 'Guardar dibujo', 'सहेजें ड्राइंग', 'حفظ الرسم', 'Сохранить рисунок', 'Enregistrer le dessin', 'การวาดภาพบันทึก', 'geöffnet', 'Salva disegno' );
var S_SAVE_ANIMATION = new Array( '儲存動畫', 'Save animation', '储存动画', '保存アニメーション', '저장 애니메이션', 'Salvar animação', 'Guardar la animación', 'सहेजें एनीमेशन', 'حفظ الرسوم المتحركة', 'Сохранить анимация', 'Enregistrer animation', 'ภาพเคลื่อนไหวที่บันทึก', 'Zeichnung speichern', 'Salva animazione' );
var S_SUCCESS = new Array( '成功', 'Successfully', '成功', '首尾よく', '성공', 'com sucesso', 'con éxito', 'सफलतापूर्वक', 'بنجاح', 'успешно', 'succès', 'ประสบความสำเร็จ', 'Animation speichern', 'con successo' );
var S_PIC_NOT_GENERATED_YET_MESSAGE = new Array( '圖片尚未生成，請稍後再點擊一次。', 'The Picture is not generated yet. Please click here again later.', '图片尚未生成，请稍后再点击一次。', '画像がまだ生成されていません。後でもう一度こちらをクリックしてください。', '사진이 아직 생성되지 않습니다. 나중에 다시 여기를 클릭하십시오.', 'A imagem não é gerado ainda. Por favor', 'La imagen no se genera. Haga clic aquí de nuevo más tarde.', 'पिक्चर अभी तक तैयार नहीं है। बाद में पुन: यहां क्लिक करें।', 'لم يتم إنشاء صورة حتى الان. الرجاء الضغط هنا مرة أخرى في وقت لاحق.', 'Изображение еще не генерируется. Пожалуйста', 'L`image ne est pas encore généré. Se il vous plaît cliquez ici plus tard.', 'รูปภาพจะไม่สร้างเลย กรุณาคลิกที่นี่อีกครั้งในภายหลัง', 'erfolgreich', 'Il quadro non è ancora generato. Clicca qui più tardi.' );
var S_FILE_LOAD_MESSAGE = new Array( '畫布和之前載入圖片將全部重置洗除，確定要載入檔案 ?', 'Canvas would be initialized. Do you confirm to load the new file ?', '画布和之前载入图片将全部重置洗除，确定要载入档案？', 'キャンバスが初期化されます。あなたは、新しいファイルをロードするために確認していますか？', '캔버스가 초기화 될 것이다. 새 파일을로드 할 수 확인합니까?', ' clique aqui novamente mais tarde.', 'Se inicializan lienzo. ¿Es usted confirme para cargar el nuevo archivo?', 'कैनवस initialized किया जाएगा। आप नई फ़ाइल लोड करने के लिए इस बात की पुष्टि करते हैं?', 'سيتم تهيئة قماش. هل تأكيد لتحميل الملف الجديد؟', ' нажмите здесь снова позже.', 'Toile seraient initialisés. Confirmez-vous pour charger le nouveau fichier?', 'ผ้าใบจะมีการเริ่มต้น คุณยืนยันที่จะโหลดไฟล์ใหม่หรือไม่?', 'Das Bild ist noch nicht erzeugt. Bitte klicken Sie hier später noch einmal.', 'Canvas saranno inizializzate. Sei confermate per caricare il nuovo file' );
var S_FILE_SAVE_BY_RIGHT_CLICK_MESSAGE = new Array( '請右鍵另存下方圖片', 'Please right click to save the following picture.', '请右键另存下方图片', '右下の写真を保存するにはクリックしてください。', '바로 다음 사진을 저장하려면 클릭하십시오.', 'Canvas será inicializado. Você confirma para carregar o novo arquivo?', 'Por favor', 'सही निम्न चित्र को बचाने के लिए क्लिक करें।', 'الرجاء انقر على الحق لحفظ الصورة التالية.', 'Холст будет инициализирован. Вы подтверждаете', 'Se il vous plaît faites un clic droit pour enregistrer l`image ci-dessous.', 'กรุณาคลิ๊กขวาที่จะบันทึกภาพต่อไปนี้', 'Leinen würde initialisiert werden. Sie bestätigen', 'Si prega di fare clic destro per salvare l`immagine seguente.' );
var S_CUT_END_MESSAGE = new Array( '刪除完成，重新播映中', 'Cut done. Play again.', '删除完成，重新播映中', 'カットが行わ。もう一度再生します。', '잘라 다. 다시 재생합니다.', 'Por favor', ' haga clic derecho para guardar la imagen siguiente.', 'कट किया। फिर से खेलो।', 'قطع القيام به. لعب مرة أخرى.', ' чтобы загрузить новый файл?', 'Cut fait. Jouer à nouveau.', 'ตัดทำ เล่นอีกครั้ง', ' um die neue Datei zu laden?', 'Cut fatto. Giocare di nuovo.' );
var S_CUT_END_MESSAGE = new Array( '是否刪除到此處為止 ?', 'Remove drawing until here ?', '是否删除到此处为止？', 'ここまで、描画削除しますか？', '여기까지 그리기 삭제 하시겠습니까?', ' clique com botão direito para salvar a imagem a seguir.', 'Cut hecho. Jugar de nuevo.', 'यहाँ तक ड्राइंग निकालें?', 'إزالة رسم حتى هنا؟', 'Пожалуйста', 'Retirer dessin jusqu`à ici?', 'ลบภาพวาดจนที่นี่?', 'Bitte klicken Sie rechts auf das folgende Bild zu speichern.', 'Rimuovere disegno fino a qui?' );
var S_CUT_BEGIN_MESSAGE = new Array( '是否從此處開始刪除 ?', 'Remove drawing from here ?', '是否从此处开始删除？', 'ここから描画削除しますか？', '여기에서 그리기 삭제 하시겠습니까?', 'Cut feito. Jogar novamente.', 'Retire dibujo hasta aquí?', 'यहाँ से ड्राइंग निकालें?', 'إزالة رسم من هنا؟', ' нажмите правой кнопкой мыши', 'Retirer dessin à partir d`ici?', 'ลบภาพวาดจากที่นี่?', 'Cut gemacht. Spielen Sie es erneut.', 'Rimuovere disegno da qui?' );
var S_CUT_MODE_MESSAGE = new Array( '即將播放紀錄，請在欲刪除之處點擊螢幕', 'Please click screen where you want to remove.', '即将播放纪录，请在欲删除之处点击萤幕', '削除したい画面をクリックしてください。', '제거 할 화면을 클릭하십시오.', 'Remover desenhando até aqui?', 'Retire dibujo de aquí?', 'आप निकालना चाहते हैं', 'الرجاء الضغط الشاشة حيث تريد إزالته.', ' чтобы сохранить следующую картину.', 'Se il vous plaît cliquer sur l`écran où vous voulez supprimer.', 'กรุณาคลิกที่หน้าจอที่คุณต้องการลบ', 'Entfernen Sie zeichnen', 'Si prega di fare clic su schermo in cui si desidera rimuovere.' );
var S_OPEN_FILE_FAIL_MESSAGE = new Array( '開啟檔案發生錯誤!!', 'Open file failed !!', '开启档案发生错误！', 'オープン·ファイルに失敗しました!!', '파일 열기에 실패했습니다!', 'Remover desenho a partir daqui?', 'Por favor', ' जहां स्क्रीन पर क्लिक करें।', 'فشل فتح ملف !!', 'Cut сделано. Играть снова.', 'Ouvrir le fichier n`a pas !!', 'เปิดไฟล์ล้มเหลว !!', ' bis hier?', 'Aprire file non riuscita !!' );
var S_GET_INFO_FAIL_MESSAGE = new Array( '資訊不存在 !!', 'Info is not existed !!', '资讯不存在！', '情報が存在していません！', '정보가 존재하지 않습니다!', 'Por favor', ' haga clic en la pantalla en la que desea eliminar.', 'ओपन फ़ाइल में विफल रहा है !!', 'لا معلومات موجودة !!', 'Удалите рисунок до тех пор', 'Infos ne est pas existé !!', 'ข้อมูลที่ไม่ได้ดำรงอยู่ !!', 'Entfernen Zeichnung von hier?', 'Info non è esistito !!' );
var S_GENERATE_FILE_FAIL_MESSAGE = new Array( '製作檔案發生錯誤!!', 'Generate file failed !!', '制作档案发生错误！', 'ファイルが失敗した生成！', '파일이 실패 생성!', ' clique tela onde você deseja remover.', 'Abrir el archivo no !!', 'जानकारी अस्तित्व में नहीं है !!', 'توليد فشل ملف !!', ' здесь?', 'Générer le fichier n`a pas !!', 'สร้างไฟล์ล้มเหลว !!', 'Bitte klicken Sie Bildschirm', 'Generare file non riuscita !!' );
var S_NEXT_STEP_NOT_EXISTED = new Array( '沒有下一步了', 'Next step is not existed.', '没有下一步了', '次のステップは存在していません。', '다음 단계는 존재하지 않습니다.', 'Abrir arquivo falhou !!', 'Información no existía !!', 'फ़ाइल में विफल रहा है उत्पन्न !!', 'لا موجودة الخطوة التالية.', 'Удалить рисунок из здесь?', 'La prochaine étape ne est pas existé.', 'ขั้นตอนต่อไปจะไม่ได้มีอยู่', ' wo Sie entfernen möchten.', 'Il passo successivo non è esistito.' );
var S_PREV_STEP_NOT_EXISTED = new Array( '沒有上一步了', 'Previous step is not existed.', '没有上一步了', '前のステップが存在していません。', '이전 단계가 존재하지 않습니다.', 'Informações não existiu !!', 'Generar archivo no !!', 'अगले कदम के अस्तित्व में नहीं है।', 'لا موجودة الخطوة السابقة.', 'Пожалуйста', 'Étape précédente ne est pas existé.', 'ขั้นตอนก่อนหน้านี้ไม่ได้มีอยู่', 'Öffnen der Datei fehlgeschlagen !!', 'Fase precedente non è esistito.' );
var S_PLAY_SPEED = new Array( '播放速度', 'Play Speed', '播放速度', 'スピードを再生', '재생 속도', 'Gerar arquivo falhou !!', 'Siguiente paso no se existía.', 'पिछले चरण से ही अस्तित्व में नहीं है।', 'تلعب سرعة', ' нажмите экран', 'Vitesse de lecture', 'เล่นความเร็ว', 'Info nicht bestanden !!', 'Velocità di riproduzione' );
var S_RANDOM = new Array( '隨機', 'Random', '随机', 'ランダム', '닥치는대로의', 'Próximo passo não é existiu.', 'Paso previo no se existía.', 'स्पीड खेलो', 'عشوائية', ' где вы хотите', 'aléatoire', 'สุ่ม', 'Gene Datei fehlgeschlagen !!', 'casuale' );
var S_FOREGROUND = new Array( '前景', 'Foreground', '前景', 'フォアグラウンド', '전경', 'Etapa anterior não é existiu.', 'Play Speed', 'बिना सोचे समझे', 'طليعة', ' чтобы удалить.', 'Premier plan', 'เบื้องหน้า', 'Nächster Schritt ist nicht existierte.', 'In primo piano' );
var S_BACKGROUND = new Array( '背景', 'Background', '背景', '背景', '배경', 'jogar velocidade', 'aleatorio', 'अग्रभूमि', 'خلفية', 'Открыть файл не удалось !!', 'Contexte', 'พื้นหลัง', 'Vorheriger Schritt nicht existierte.', 'Sfondo' );
var S_NONE = new Array( '填充用的', 'Just skipped', '填充用的', 'ちょうどスキップ', '그냥 스킵', 'acaso', 'primer plano', 'पृष्ठभूमि', 'مجرد تخطي', 'Информация не существует !!', 'Juste sauté', 'เพียงแค่ข้าม', 'Wiedergabegeschwindigkeit', 'Proprio saltato' );
var S_NORMAL = new Array( '正常', 'Normal', '正常', 'ノーマル', '표준', 'primeiro plano', 'fondo', 'बस को छोड़ दिया', 'طبيعي', 'Создать файл не удалось !!', 'normal', 'ปกติ', 'zufällig', 'normale' );
var S_CRACK = new Array( '裂痕', 'Crack', '裂痕', '亀裂', '갈라진 금', 'fundo', 'Apenas saltado', 'सामानय', 'صدع', 'Следующий шаг не существовало.', 'Crack', 'รอยแตก', 'Vordergrund', 'Crack' );
var S_DOTTED = new Array( '虛線', 'Dotted', '虚线', '点在', '점이 찍힌', 'apenas pulado', 'normal', 'दरार', 'منقط', 'Предыдущая шаг не существовало.', 'pointillé', 'ด่างดวง', 'Hintergrund', 'punteggiato' );
var S_NORMAL = new Array( '正常', 'Normal', '正常', 'ノーマル', '표준', 'normal', 'grieta', 'छितराया हुआ', 'طبيعي', 'Скорость воспроизведения', 'normal', 'ปกติ', 'nur übersprungen', 'normale' );
var S_DYNAMIC_ORDER = new Array( '動態順序', 'Dynamic order', '动态顺序', 'ダイナミック順', '동적 순서', 'fenda', 'punteado', 'सामानय', 'ترتيب الديناميكي', 'случайный', 'Ordre dynamique', 'การสั่งซื้อสินค้าแบบไดนามิก', 'normal', 'Ordine dinamico' );
var S_DYNAMIC_RANDOM = new Array( '動態亂序', 'Dynamic random', '动态乱序', 'ランダムダイナミック', '임의의 동적', 'pontilhado', 'normal', 'गतिशील आदेश', 'ديناميكية عشوائي', 'передний план', 'Dynamique aléatoire', 'แบบไดนามิกสุ่ม', 'Riss', 'Dynamic Random' );
var S_CHANGE_TEXT = new Array( '改變文字', 'Change text', '改变文字', '変更するテキスト', '텍스트 변경', 'normal', 'para dinámico', 'यादृच्छिक गतिशील', 'تغيير النص', 'фон', 'Changez le texte', 'เปลี่ยนข้อความ', 'gepunktete', 'Cambia il testo' );
var S_SOLID = new Array( '實心', 'Solid', '实心', '固体', '고체', 'ordem dinâmica', 'dinámica aleatoria', 'बदले पाठ', 'صلب', 'Просто пропущено', 'solide', 'ของแข็ง', 'normal', 'solido' );
var S_UNSOLID = new Array( '空心', 'Unsolid', '空心', 'Unsolid', 'Unsolid', 'dynamic Random', 'Cambie el texto', 'ठोस', 'Unsolid', 'нормальный', 'Unsolid', 'Unsolid', 'Dynamische Auftrags', 'Unsolid' );
var S_DELAY = new Array( '延遲', 'Delay', '延迟', '遅延', '지연', 'Alterar texto', 'sólido', 'Unsolid', 'تأخير', 'трещина', 'Delay', 'ความล่าช้า', 'Dynamic Random', 'Delay' );
var S_SECOND = new Array( '秒', 'second', '秒', '第2', '초', 'sólido', 'Unsolid', 'विलंब', 'في المرتبة الثانية', 'пунктирный', 'd`autre part', 'ที่สอง', 'Text ändern', 'secondo' );
var S_OTHER = new Array( '其他', 'Other', '其他', 'その他', '다른', 'Unsolid', 'retraso', 'दूसरा', 'آخر', 'нормальный', 'autre', 'อื่น ๆ', 'solide', 'Altro' );
var S_IT_IS_ALREADY_DELAY = new Array( '已經延遲', 'It is already delay', '已经延迟', 'それは、すでに遅延です', '이미 지연된다', 'atraso', 'segundo', 'अन्य', 'انها تؤخر بالفعل', 'динамического порядка', 'Il est déjà retarder', 'มันเป็นเรื่องที่ล่าช้าอยู่แล้ว', 'unsolid', 'E `già ritardo' );
var S_DEFAULT = new Array( '預設', 'Default', '预设', 'デフォルト', '디폴트 값', 'segundo', 'otro', 'यह पहले से ही देरी है', 'افتراضي', 'Динамический случайных', 'Par défaut', 'ผิดนัด', 'Verzögerung', 'predefinito' );
var S_BRUSH_AMOUNT = new Array( '筆畫總數', 'Brush Amount', '笔画总数', 'ブラシ金額', '브러쉬의 양', 'outro', 'Ya se retrasa', 'चूक', 'فرشاة المكونات', 'Изменить текст', 'Montant Brosse', 'แปรงจํานวนเงิน', 'zweite', 'Brush Importo' );
var S_MOTION_AMOUNT = new Array( '操作總數', 'Motion Amount', '操作总数', 'モーション金額', '모션 금액', 'Ele já está atrasar', 'defecto', 'ब्रश राशि', 'الحركة الكمية', 'твердый', 'Montant de mouvement', 'จํานวนเงินเคลื่อนไหว', 'andere', 'Movimento Importo' );
var S_REMOVE_DRAWING = new Array( '刪除畫筆記錄', 'Remove drawing part', '删除画笔记录', '一部の描画と削除', '일부 그리기 제거', 'omissão', 'cepillo Monto', 'मोशन राशि', 'إزالة رسم جزء', 'Unsolid', 'Retirer dessin partie', 'ลบภาพวาดส่วนหนึ่ง', 'Es ist bereits zu verzögern', 'Rimuovere disegno parte' );
var S_ENABLE_PROCESS_BAR = new Array( '顯示進度條', 'Enable processbar', '显示进度条', 'processbarを有効にする', 'processbar 사용', 'escova Montante', 'movimiento Monto', 'भाग ड्राइंग निकालें', 'تمكين processbar', 'задержка', 'Activer processbar', 'เปิดใช้งาน processbar', 'Default', 'Abilita processbar' );
var S_UNIFY_PLAY_SPEED = new Array( '統一速度', 'Unify speed', '统一速度', 'ユニファイスピード', '통일 속도', 'movimento Montante', 'Retire dibujo parte', 'processbar सक्षम करें', 'سرعة توحيد', 'второй', 'Unifier la vitesse', 'ยูนิฟายความเร็ว', 'Pinsel Betrag', 'Unificare velocità' );
var S_GO_BACK = new Array( '前一頁', 'Go back', '前一页', '戻る', '돌아 가기', 'Remover desenho parte', 'Habilitar processbar', 'एकजुट गति', 'عد', 'другой', 'Retourner', 'กลับไป', 'Bewegungsbetrag', 'Torna indietro' );
var S_NO_IMAGE_MESSAGE = new Array( '請先載入欲顯示之圖形檔案', 'Please load the image file first.', '请先载入欲显示之图形档案', '最初の画像ファイルをロードしてください。', '먼저 이미지 파일을로드 해주세요.', 'Ativar processbar', 'velocidad Unificar', 'वापस जाओ', 'يرجى تحميل ملف الصورة أولا.', 'Уже задержки', 'Se il vous plaît charger le fichier de première image.', 'กรุณาโหลดไฟล์ภาพแรก', 'Entfernen Ziehteil', 'Si prega di caricare il file immagine prima.' );
var S_CREATION_TIME = new Array( '創建日期', 'Creation Time', '创建日期', '作成時間', '생성 시간', 'Unify velocidade', 'volver', 'पहली छवि फ़ाइल को लोड करें।', 'تاريخ إنشاء', 'дефолт', 'Date de création', 'เวลาที่สร้าง', 'aktivieren processbar', 'Tempo del Creato' );
var S_CANVAS = new Array( '畫布', 'Canvas', '画布', 'キャンバス', '캔버스', 'volte', 'Por favor', 'निर्माण का समय', 'قماش', 'Кисть Сумма', 'Toile', 'ผ้าใบ', 'Unify Geschwindigkeit', 'Canvas' );
var S_EXIT_APP = new Array( '離開本程式', 'Exit this APP', '离开本程式', 'このAPPを終了します', '이 응용 프로그램을 종료', 'Por favor coloque o arquivo de imagem em primeiro lugar.', ' cargue el archivo de imagen de primera.', 'कनवास', 'الخروج من هذا APP', 'Движение Сумма', 'Sortez de cette APP', 'ออกจาก app นี้', 'geh zurück', 'Uscire questo APP' );
var S_BACK = new Array( '返回', 'Back', '返回', 'バック', '백', 'Data de Criação', 'Hora de creación', 'इस एपीपी से बाहर निकलें', 'إلى الوراء', 'Удалить рисунок участие', 'Retour', 'กลับ', 'Bitte laden Sie zuerst die Bilddatei.', 'Indietro' );
var S_OPTION = new Array( '選項', 'Option', '选项', 'オプション', '선택권', 'lona', 'lienzo', 'वापस', 'خيار', 'Включить processbar', 'Option', 'ตัวเลือก', 'Erstellungszeit', 'Opzione' );
var S_Q_AND_A = new Array( '問答', 'Q & A', '问答', 'Q＆A', 'Q & A', 'Saia desta APP', 'Salir de esta APP', 'विकल्प', 'Q & A', 'скорость Унификация', 'Q & A', 'Q & A', 'Leinwand', 'Q & A' );
var S_ABOUT = new Array( '關於', 'About', '关于', '約', '약', 'de volta', 'espalda', 'क्यू एंड ए', 'حول', 'возвращаться', 'À propos', 'เกี่ยวกับ', 'Verlassen Sie diese APP', 'A proposito' );
var S_MENU = new Array( '選單', 'Menu', '选单', 'メニュー', '메뉴', 'opção', 'opción', 'तकरीबन', 'قائمة الطعام', 'Пожалуйста', 'Menu', 'เมนู', 'zurück', 'Menu' );
var S_DISPLAY = new Array( '顯示', 'Display', '显示', 'ディスプレイ', '디스플레이', 'Q & A', 'Q & A', 'मीनू', 'عرض', ' загрузите файл изображения в первую очередь.', 'affichage', 'แสดง', 'Option', 'display' );
var S_STYLE = new Array( '風格', 'Style', '风格', 'スタイル', '스타일', 'sobre', 'acerca de', 'प्रदर्शन', 'أسلوب', 'Время создания', 'style', 'สไตล์', 'Fragen und Antworten', 'Style' );
var S_LANGUAGE = new Array( '語言', 'Language', '语言', '言語', '언어', 'menu', 'menú', 'अंदाज', 'لغة', 'холст', 'langue', 'ภาษา', 'über', 'Lingua' );
var S_FONT_SIZE = new Array( '字體大小', 'Font size', '字体大小', 'フォント·サイズ', '글꼴 크기', 'exibição', 'visualización', 'भाषा', 'حجم الخط', 'Выход это приложение', 'Taille de la police', 'ขนาดตัวอักษร', 'Menü', 'Dimensione carattere' );
var S_FONT_COLOR = new Array( '字體顏色', 'Font color', '字体颜色', 'フォントの色', '글꼴 색', 'estilo', 'estilo', 'फ़ॉन्ट आकार', 'لون الخط', 'назад', 'Couleur de la police', 'สีตัวอักษร', 'Anzeige', 'Colore carattere' );
var S_BACKGROUND_COLOR = new Array( '背景顏色', 'Background color', '背景颜色', '背景色', '배경 색상', 'língua', 'idioma', 'फ़ॉन्ट रंग', 'لون الخلفية', 'опция', 'La couleur de fond', 'สีพื้นหลัง', 'Stil', 'Colore di sfondo' );
var S_BACKGROUND_IMAGE = new Array( '背景圖片', 'Background image', '背景图片', '背景画像', '배경 이미지', 'tamanho da fonte', 'tamaño de la fuente', 'पृष्ठभूमि रंग', 'صورة الخلفية', 'Q &', 'Image de fond', 'ภาพพื้นหลัง', 'Sprache', 'Immagine di sfondo' );
var S_RECOVERY = new Array( '清理', 'Recovery', '清理', '回復', '회복', 'cor da fonte', 'Color de fuente', 'पृष्ठभूमि छवि', 'انتعاش', 'о', 'Récupération', 'การฟื้นตัว', 'Schriftgröße', 'Recovery' );
var S_CLEAN_ALL_RECORDS = new Array( '清除所有紀錄', 'Clean all records', '清除所有纪录', 'すべてのレコードを清掃してください', '모든 레코드를 청소', 'A cor do fundo', 'Color de fondo', 'वसूली', 'تنظيف جميع السجلات', 'меню', 'Nettoyez tous les dossiers', 'ทำความสะอาดระเบียนทั้งหมด', 'Schriftfarbe', 'Pulire tutti i record' );
var S_CLEAN_ALL_FAVOURITES = new Array( '清除所有最愛', 'Clean all favourites', '清除所有最爱', 'すべてのお気に入りを清掃してください', '모든 즐겨 찾기를 청소', 'imagem de fundo', 'imagen de fondo', 'सभी रिकॉर्ड साफ', 'تنظيف جميع المفضلة', 'дисплей', 'Nettoyez tous les favoris', 'ทำความสะอาดทุกรายการโปรด', 'Hintergrundfarbe', 'Pulire tutti i preferiti' );
var S_BACK_TO_DEFAULT_SETTING = new Array( '回歸原始設定', 'Back to default setting', '回归原始设定', '戻るデフォルト設定へ', '돌아 가기 기본 설정으로', 'recuperação', 'recuperación', 'सभी पसंदीदा साफ', 'العودة إلى الإعداد الافتراضي', 'стиль', 'Retour au réglage par défaut', 'กลับไปที่ตั้งค่าเริ่มต้น', 'Hintergrundbild', 'Torna alla impostazione di default' );
var S_ARE_YOU_SURE = new Array( '確認要', 'Are you sure to', '确认要', 'あなたがしますか', '당신은 확실하다', 'Limpe todos os registros', 'Limpie todos los registros', 'वापस डिफ़ॉल्ट सेटिंग', 'هل أنت متأكد من ل', 'язык', 'Êtes-vous sûr de vouloir', 'คุณแน่ใจแล้วหรือที่จะ', 'Erholung', 'Sei sicuro di voler' );
var S_CONDITION = new Array( '條件', 'Condition', '条件', '条件', '조건', 'Limpe todos os favoritos', 'Limpie todos los favoritos', 'आप यकीन कर रहे हैं', 'حالة', 'размер шрифта', 'état', 'สภาพ', 'Reinigen Sie alle Rekorde', 'Condizione' );
var S_ABOUT = new Array( '關於', 'About', '关于', '約', '약', 'Voltar para a configuração padrão', 'Volver a la configuración predeterminada', 'कंडीशन', 'حول', 'цвет шрифта', 'À propos', 'เกี่ยวกับ', 'Reinigen Sie alle Favoriten', 'A proposito' );
var S_ABOUT_APP = new Array( '關於程式', 'About APP', '关于程式', 'APPについて', 'APP 소개', 'Tem certeza que deseja', '¿Seguro que', 'तकरीबन', 'حول APP', 'цвет фона', 'À propos de l`APP', 'เกี่ยวกับ APP', 'Zurück zur Standardeinstellung', 'A proposito di APP' );
var S_ABOUT_AUTHOR = new Array( '關於作者', 'About Author', '关于作者', '執筆者について', '저자에 관하여', 'condição', 'condición', 'अनुप्रयोग के बारे में', 'نبذة عن الكاتب', 'фон изображения', 'A propos Auteur', 'เกี่ยวกับผู้เขียน', 'Sind Sie sicher', 'Chi Autore' );
var S_RELATED_LINKS = new Array( '相關鏈結', 'Related Links', '相关链结', '関連リンク', '관련 링크', 'sobre', 'acerca de', 'लेखक के बारे में', 'روابط ذات علاقة', 'восстановление', 'Liens connexes', 'ลิงก์ที่เกี่ยวข้อง', 'Related Links', 'Link correlati' );
var S_YES = new Array( '是', 'Yes', '是', 'はい', '예', 'Sobre APP', 'Acerca de APP', 'संबंधित लिंक', 'نعم', 'Очистите все записи', 'Oui', 'ใช่', 'Zustand', 'Sì' );
var S_NO = new Array( '否', 'No', '否', 'ノー', '아니', 'Sobre o autor', 'sobre el autor', 'हाँ', 'لا', 'Очистите все избранные', 'n', 'ไม่', 'über', 'No' );
var S_SETTING_DONE = new Array( '設置完成', 'Setting Done', '设置完成', '設定が完了', '설정 완료', 'links relacionados', 'Enlaces Relacionados', 'ना', 'وضع .تم', 'Вернуться к установкам по умолчанию', 'Réglage Fait', 'การตั้งค่าเสร็จ', 'Über APP', 'Impostazione Fatto' );
var S_GO_BACK_TO = new Array( '回到', 'Back to ', '回到', '戻る', '위로', 'sim', 'sí', 'सेटिंग डन', 'العودة إلى', 'Вы уверены', 'Retour à', 'กลับไปที่', 'Über den Autor', 'Torna' );
var S_IMAGE_NAME = new Array( '圖檔名稱', 'Image Name', '图档名称', '画像名', '이미지 이름', 'não', 'no', 'वापस करने के लिए', 'اسم الصورة', ' что', 'Nom de l`image', 'ชื่อภาพ', 'Weiterführende Links', 'Nome immagine' );
var S_IMAGE_TYPE = new Array( '圖檔類別', 'Image Type', '图档类别', 'イメージタイプ', '이미지 유형', 'Feito Ambiente', 'ajuste Hecho', 'छवि नाम', 'نوع الصورة', 'состояние', 'Type d`image', 'ประเภทภาพ', 'ja', 'Tipo di immagine' );
var S_IMAGE_SIZE = new Array( '圖檔大小', 'Image Size', '图档大小', '画像サイズ', '이미지 크기', 'Voltar para', 'Volver a', 'छवि का प्रकार', 'حجم الصورة', 'о', 'Taille de l`image', 'ขนาดภาพ', 'keine', 'Dimensione immagine' );
var S_EMAIL_TO_AUTHOR = new Array( '寫信給作者', 'Email to Author', '写信给作者', '著者にメールで知らせる', '작성자에게 메일 보내기', 'Nome da Imagem', 'Nombre de la imagen', 'छवि का आकार', 'ارسل الى الكاتب', 'О APP', 'Envoyer à l`auteur', 'ส่งอีเมล์ไปยังผู้เขียน', 'Einstellung Fertig', 'Email di Autore' );



// ----------------------------------------------------



var S_ZH = new Array( '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文', '繁體中文' );
var S_EN = new Array( 'English', 'English', 'English', 'English', 'English', 'English', 'English', 'English', 'English', 'English', 'English', 'English', 'English' );
var S_CN = new Array( '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文', '简体中文' );
var S_JA = new Array( '日本の', '日本の', '日本の', '日本の', '日本の', '日本の', '日本の', '日本の', '日本の', '日本の', '日本の', '日本の', '日本の' );
var S_KO = new Array( '한국의', '한국의', '한국의', '한국의', '한국의', '한국의', '한국의', '한국의', '한국의', '한국의', '한국의', '한국의', '한국의' );
var S_PT = new Array( 'português', 'português', 'português', 'português', 'português', 'português', 'português', 'português', 'português', 'português', 'português', 'português', 'português' );
var S_ES = new Array( 'español', 'español', 'español', 'español', 'español', 'español', 'español', 'español', 'español', 'español', 'español', 'español', 'español' );
var S_HI = new Array( 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी', 'हिन्दी' );
var S_AR = new Array( 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎', 'العربية‎' );
var S_RU = new Array( 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык', 'русский язык' );
var S_FR = new Array( 'le français', 'le français', 'le français', 'le français', 'le français', 'le français', 'le français', 'le français', 'le français', 'le français', 'le français', 'le français', 'le français' );
var S_TH = new Array( 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย', 'อักษรไทย' );
var S_DE = new Array( 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch', 'Deutsch' );
var S_IT = new Array( 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano', 'Italiano' );
var S_LANGUAGE_ARRAY = new Array( S_ZH, S_EN, S_CN, S_JA, S_KO, S_PT, S_ES, S_HI, S_AR, S_RU, S_FR, S_TH, S_DE, S_IT );

var S_WINDOWS_8 = new Array( 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8', 'Windows 8' );
var S_WINDOWS_8_LIGHT = new Array( 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light', 'Windows 8 light' );
var S_ANDROID = new Array( 'Android', 'Android', 'Android', 'Android', 'Android', 'Android', 'Android', 'Android', 'Android', 'Android', 'Android', 'Android', 'Android' );
var S_ANDROID_LIGHT = new Array( 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light', 'Android light' );
var S_IOS = new Array( 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS', 'IOS' );
var S_IOS_7 = new Array( 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7', 'IOS 7' );
var S_BLACK_BERRY_10 = new Array( 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10', 'BlackBerry 10' );
var S_TIZEN = new Array( 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen', 'Tizen' );
var S_STYLE_ARRAY = new Array( "", S_ANDROID, S_ANDROID_LIGHT, S_WINDOWS_8, S_WINDOWS_8_LIGHT, S_IOS, S_IOS_7, S_BLACK_BERRY_10, S_TIZEN );

var S_GITHUB = new Array( 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub', 'GitHub' );
var S_GOOGLE_PLAY = new Array( 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play', 'Google Play' );
var S_WINDOWS_STORE = new Array( 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store', 'Windows Store' );
var S_FIREFOX_MARKETPLACE = new Array( 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace', 'Firefox Marketplace' );
var S_CHROME_WEB_STORE = new Array( 'Chrome Web Store', 'Chrome Web Store',  'Chrome Web Store', 'Chrome Web Store', 'Chrome Web Store', 'Chrome Web Store',  'Chrome Web Store', 'Chrome Web Store', 'Chrome Web Store', 'Chrome Web Store',  'Chrome Web Store', 'Chrome Web Store', 'Chrome Web Store' );
var S_TIZEN_STORE = new Array( 'Tizen Store', 'Tizen Store',  'Tizen Store', 'Tizen Store', 'Tizen Store', 'Tizen Store',  'Tizen Store', 'Tizen Store', 'Tizen Store', 'Tizen Store',  'Tizen Store', 'Tizen Store', 'Tizen Store' );
var S_UBUNTU_APP_DIRECTORY = new Array( 'Ubuntu Apps Directory', 'Ubuntu Apps Directory',  'Ubuntu Apps Directory', 'Ubuntu Apps Directory', 'Ubuntu Apps Directory', 'Ubuntu Apps Directory',  'Ubuntu Apps Directory', 'Ubuntu Apps Directory', 'Ubuntu Apps Directory', 'Ubuntu Apps Directory',  'Ubuntu Apps Directory', 'Ubuntu Apps Directory', 'Ubuntu Apps Directory' );
var S_RELATED_LINKS_ARRAY = new Array( S_GITHUB, S_GOOGLE_PLAY, S_WINDOWS_STORE,  S_FIREFOX_MARKETPLACE, S_CHROME_WEB_STORE, S_TIZEN_STORE, S_UBUNTU_APP_DIRECTORY );

var S_LINE_STYLE_ARRAY = new Array( S_NONE, S_NORMAL, S_CRACK, S_DOTTED );
var S_RECTANGLE_STYLE_ARRAY = new Array( S_NONE, S_SOLID, S_UNSOLID );
var S_CIRCLE_STYLE_ARRAY = new Array( S_NONE, S_SOLID, S_UNSOLID );
var S_ERASER_STYLE_ARRAY = new Array( S_NONE, S_CIRCLE, S_RECTANGLE );
var S_DOT_STYLE_ARRAY = new Array();
var S_TEXT_STYLE_ARRAY = new Array( S_NONE, S_NORMAL, S_DYNAMIC_ORDER, S_DYNAMIC_RANDOM );

