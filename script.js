// Loading Screen Handler
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.querySelector('.workspace-container');

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        mainContent.style.display = 'block';
        
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000); 
});

const appContainer = document.getElementById('app-container');
const logoutBtn = document.getElementById('logout-btn');
const currentUsernameDisplay = document.getElementById('current-username-display');

const sidebarEl = document.getElementById('sidebar'); 
const sidebarOverlay = document.querySelector('.sidebar-overlay');

const myPageList = document.getElementById('my-page-list');
const sharedPageList = document.getElementById('shared-page-list');
const addPageBtn = document.getElementById('add-page-btn');
const deletePageBtn = document.getElementById('delete-page-btn');
const sharePageBtn = document.getElementById('share-page-btn');
const noteTitle = document.getElementById('note-title');
const editorCanvas = document.getElementById('editor-canvas');
const drawingCanvas = document.getElementById('drawing-canvas');

const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const strikethroughBtn = document.getElementById('strikethrough-btn');
const highlightBtn = document.getElementById('highlight-btn');
const highlightColorPicker = document.getElementById('highlight-color-picker');
const fontSizeSelect = document.getElementById('font-size-select');
const latexBtn = document.getElementById('latex-btn');
const bulletBtn = document.getElementById('bullet-btn');
const numberedListBtn = document.getElementById('numbered-list-btn');
const checkboxBtn = document.getElementById('checkbox-btn');
const dividerBtn = document.getElementById('divider-btn');
const headingBtn = document.getElementById('heading-btn');
const codeBtn = document.getElementById('code-btn');
const textColorPicker = document.getElementById('text-color-picker');
const stickyNoteBtn = document.getElementById('sticky-note-btn'); 
const pomodoroSettingsBtn = document.getElementById('pomodoro-settings-btn');

const alignLeftBtn = document.getElementById('align-left-btn');
const alignCenterBtn = document.getElementById('align-center-btn');
const alignRightBtn = document.getElementById('align-right-btn');
const fontFamilySelect = document.getElementById('font-family-select');

const writeBtn = document.getElementById('write-btn');
const drawBtn = document.getElementById('draw-btn');
const eraseBtn = document.getElementById('erase-btn');
const clearDrawBtn = document.getElementById('clear-draw-btn');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');

const imageBtn = document.getElementById('image-btn');
const imageUpload = document.getElementById('image-upload');
const pdfBtn = document.getElementById('pdf-btn');
const pdfUpload = document.getElementById('pdf-upload');
const tableBtn = document.getElementById('table-btn');
const calendarBtn = document.getElementById('calendar-btn');
const insertWeatherBtn = document.getElementById('insert-weather-btn'); 
const summarizeTextBtn = document.getElementById('summarize-text-btn');
const generateParagraphBtn = document.getElementById('generate-paragraph-btn'); 
const translateTextBtn = document.getElementById('translate-text-btn'); 

const modeIndicator = document.getElementById('mode-indicator');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const searchNotesInput = document.getElementById('search-notes');
const lastSavedEl = document.getElementById('last-saved');

const textToolsGroup = document.getElementById('text-tools');
const blockToolsGroup = document.getElementById('block-tools');
const drawingToolsGroup = document.getElementById('drawing-tools');
const insertToolsGroup = document.getElementById('insert-tools');
const aiToolsGroup = document.getElementById('ai-tools'); 

const shareModalOverlay = document.getElementById('share-modal-overlay');
const shareModalPageTitle = document.getElementById('share-modal-page-title');
const closeShareModalBtn = document.getElementById('close-share-modal-btn');
const shareForm = document.getElementById('share-form');
const shareUsernameInput = document.getElementById('share-username-input');
const shareAccessTypeSelect = document.getElementById('share-access-type-select');
const confirmShareBtn = document.getElementById('confirm-share-btn');
const shareErrorMessage = document.getElementById('share-error-message');
const currentSharesList = document.getElementById('current-shares-list');
const noSharesMessage = document.getElementById('no-shares-message');

const toggleHeaderBtn = document.getElementById('toggle-header-btn');
const headerBottom = document.querySelector('.header-bottom');

toggleHeaderBtn.addEventListener('click', () => {
    headerBottom.classList.toggle('show');
    toggleHeaderBtn.classList.toggle('active');
});

let db;
const DB_NAME = 'ListIt';
const DB_VERSION = 1; 
const USERS_STORE = 'users';
const PAGES_STORE = 'pages';
const SHARES_STORE = 'shares'; 

let currentUser = null;
let currentPageId = null;
let currentPageData = null; 
let currentPageAccessLevel = 'view';
let pages = []; 
let isDrawing = false;
let ctx;
let currentMode = 'write'; 
let autosaveTimeout;
let currentHeadingLevel = 0;
let currentSelectionRange = null; 

const STICKY_NOTE_COLORS = ['#fff7b0', '#d4fcb0', '#b0f0fc', '#fcc0b0', '#e0b0fc'];
const COMMON_LANGUAGES = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
    'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean', 'zh-CN': 'Chinese (Simplified)',
    'ar': 'Arabic', 'hi': 'Hindi', 'bn': 'Bengali'
};
const PRISM_LANGUAGES = {
    'javascript': 'JavaScript', 'python': 'Python', 'java': 'Java', 'cpp': 'C++', 'c': 'C',
    'csharp': 'C#', 'php': 'PHP', 'ruby': 'Ruby', 'go': 'Go', 'rust': 'Rust',
    'html': 'HTML', 'css': 'CSS', 'sql': 'SQL', 'json': 'JSON', 'xml': 'XML',
    'bash': 'Bash', 'powershell': 'PowerShell', 'yaml': 'YAML', 'markdown': 'Markdown',
    'markup': 'Markup (HTML/XML/SVG)',
    'clike': 'C-like', 
};
const DEFAULT_FONT_FAMILY = "Roboto, sans-serif";

let pomodoroInterval;
let defaultPomodoroDuration = 25 * 60; // Default 25 minutes in seconds
let timeLeft = defaultPomodoroDuration;
let isRunning = false;

function updatePomodoroDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('pomodoro-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startPomodoro() {
    if (!isRunning) {
        isRunning = true;
        document.getElementById('pomodoro-start').style.display = 'none';
        document.getElementById('pomodoro-pause').style.display = 'inline-block';
        
        pomodoroInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updatePomodoroDisplay();
            } else {
                clearInterval(pomodoroInterval);
                isRunning = false;
                document.getElementById('pomodoro-start').style.display = 'inline-block';
                document.getElementById('pomodoro-pause').style.display = 'none';
                new Audio('notification.mp3').play().catch(() => {});
            }
        }, 1000);
    }
}

function pausePomodoro() {
    if (isRunning) {
        clearInterval(pomodoroInterval);
        isRunning = false;
        document.getElementById('pomodoro-start').style.display = 'inline-block';
        document.getElementById('pomodoro-pause').style.display = 'none';
    }
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    isRunning = false;
    timeLeft = defaultPomodoroDuration; 
    updatePomodoroDisplay();
    document.getElementById('pomodoro-start').style.display = 'inline-block';
    document.getElementById('pomodoro-pause').style.display = 'none';
}
function showPomodoroSettingsModal() {
    if (isRunning) {
        showNotification("Please pause or reset the current timer before changing settings.", "warning");
        return;
    }

    const currentMinutes = Math.floor(defaultPomodoroDuration / 60);

    const settingsForm = document.createElement('form');
    settingsForm.innerHTML = `
        <div class="form-group">
            <label for="pomodoro-duration-input">Set Timer Duration (minutes):</label>
            <input type="number" id="pomodoro-duration-input" min="1" max="120" value="${currentMinutes}" required 
                   style="background-color: var(--bg-primary); color: var(--text-primary);">
        </div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color);">
            Save Settings
        </button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>
    `;

    const { modalOverlay, modal } = createModal('Pomodoro Timer Settings', settingsForm);
    const modalContent = modal.querySelector('.modal-content');
    const durationInput = settingsForm.querySelector('#pomodoro-duration-input');

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newDurationMinutes = parseInt(durationInput.value);

        if (isNaN(newDurationMinutes) || newDurationMinutes < 1 || newDurationMinutes > 120) {
            showErrorInModal(modalContent, "Please enter a valid duration between 1 and 120 minutes.");
            return;
        }

        defaultPomodoroDuration = newDurationMinutes * 60; 
        localStorage.setItem('listITPomodoroDuration', defaultPomodoroDuration); 

        resetPomodoro();

        showNotification(`Timer duration set to ${newDurationMinutes} minutes.`, "success");
        document.body.removeChild(modalOverlay);
    });
}


document.getElementById('pomodoro-start').addEventListener('click', startPomodoro);
document.getElementById('pomodoro-pause').addEventListener('click', pausePomodoro);
document.getElementById('pomodoro-reset').addEventListener('click', resetPomodoro);

function init() {
    const savedDuration = localStorage.getItem('listITPomodoroDuration');
    if (savedDuration) {
        defaultPomodoroDuration = parseInt(savedDuration, 10);
        timeLeft = defaultPomodoroDuration; 
    }
    updatePomodoroDisplay();
    initTheme();
    initIndexedDB(function() {
        const loggedInUser = localStorage.getItem('listITUser');
        if (loggedInUser) {
            currentUser = loggedInUser;
            if(appContainer) appContainer.classList.remove('hidden'); 
            if(currentUsernameDisplay) currentUsernameDisplay.textContent = currentUser;
            loadUserPages();
            setTimeout(resizeCanvas, 100); 
            setupEventListeners();
            setupCanvas();
            checkScreenSizeForSidebar(); 
            initCanvasStyle();
        } else {
            window.location.href = 'login.html';
        }
    });
}

function initIndexedDB(callback) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => console.error('Error opening database:', event.target.error);
    request.onsuccess = (event) => {
        db = event.target.result;
        if (callback) callback();
    };
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(USERS_STORE)) {
            db.createObjectStore(USERS_STORE, { keyPath: 'username' });
        }
        if (!db.objectStoreNames.contains(PAGES_STORE)) {
            const pagesStore = db.createObjectStore(PAGES_STORE, { keyPath: 'id', autoIncrement: true });
            pagesStore.createIndex('owner', 'owner', { unique: false });
        }
        if (!db.objectStoreNames.contains(SHARES_STORE)) {
            const sharesStore = db.createObjectStore(SHARES_STORE, { keyPath: 'shareId', autoIncrement: true });
            sharesStore.createIndex('pageId_sharedWithUser', ['pageId', 'sharedWithUser'], { unique: true });
            sharesStore.createIndex('sharedWithUser', 'sharedWithUser', { unique: false });
            sharesStore.createIndex('pageId', 'pageId', { unique: false });
        }
    };
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeSelect = document.getElementById('theme-select');
    
    document.body.classList.remove('dark-mode', 'nature-theme', 'ocean-theme', 'sunset-theme', 'floral-theme', 'space-theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme !== 'light') {
        document.body.classList.add(`${savedTheme}-theme`);
    }
    
    if (themeSelect) themeSelect.value = savedTheme;
    
    updateModeIndicatorStyle();
}

function changeTheme(theme) {
    document.body.classList.remove('dark-mode', 'nature-theme', 'ocean-theme', 'sunset-theme', 'floral-theme', 'space-theme');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme !== 'light') {
        document.body.classList.add(`${theme}-theme`);
    }
    
    localStorage.setItem('theme', theme);
    updateModeIndicatorStyle();
}

function updateModeIndicatorStyle() {
    if (!modeIndicator) return;
    modeIndicator.classList.remove('write-active', 'draw-active');
    if (currentMode === 'write') {
        modeIndicator.textContent = 'Mode: Write';
        modeIndicator.classList.add('write-active');
    } else {
        modeIndicator.textContent = 'Mode: Draw';
        modeIndicator.classList.add('draw-active');
    }
}

function initCanvasStyle() {
    const savedStyle = localStorage.getItem('canvasStyle') || 'plain';
    const savedColor = localStorage.getItem('canvasColor') || '#ffffff'; 
    const canvasContainer = document.querySelector('.canvas-container');
    if (!canvasContainer) return;
    
    canvasContainer.classList.remove('grid', 'dots', 'lines', 'checkered', 'graph');
    
    if (savedStyle !== 'plain') {
        canvasContainer.classList.add(savedStyle);
    }
    
    canvasContainer.style.backgroundColor = savedColor; 
    
    const canvasStyleSelect = document.getElementById('canvas-style-select');
    if(canvasStyleSelect) canvasStyleSelect.value = savedStyle;
    
    const canvasColorPicker = document.getElementById('canvas-color-picker');
    if(canvasColorPicker) canvasColorPicker.value = savedColor;
}

function changeCanvasStyle(style) {
    const canvasContainer = document.querySelector('.canvas-container');
    const canvasColorPicker = document.getElementById('canvas-color-picker');
    if (!canvasContainer || !canvasColorPicker) return;

    const currentColor = canvasColorPicker.value;
    
    canvasContainer.classList.remove('grid', 'dots', 'lines', 'checkered', 'graph');
    
    if (style !== 'plain') {
        canvasContainer.classList.add(style);
    }
    
    canvasContainer.style.backgroundColor = currentColor;
    localStorage.setItem('canvasStyle', style);
}

function changeCanvasColor(color) {
    const canvasContainer = document.querySelector('.canvas-container');
    if (!canvasContainer) return;
    canvasContainer.style.backgroundColor = color;
    localStorage.setItem('canvasColor', color);
}

function setupEventListeners() {
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    if (addPageBtn) addPageBtn.addEventListener('click', createNewPage);
    if (deletePageBtn) deletePageBtn.addEventListener('click', deletePage);
    if (sharePageBtn) sharePageBtn.addEventListener('click', openShareModal);

    if (noteTitle) {
        noteTitle.addEventListener('input', () => scheduleSave());
        noteTitle.addEventListener('blur', updatePageTitleAndSave); 
    }
    if (editorCanvas) {
        editorCanvas.addEventListener('input', () => { scheduleSave(); updateWordCountAndReadingTime(); });
        editorCanvas.addEventListener('mouseup', saveSelection);
        editorCanvas.addEventListener('keyup', saveSelection);
        editorCanvas.addEventListener('focus', saveSelection);
        editorCanvas.addEventListener('click', handleEditorClickForDelete);
        editorCanvas.addEventListener('focusin', (e) => {
            const deletable = e.target.closest('.deletable-element');
            if (deletable) deletable.classList.add('focused');
        });
        editorCanvas.addEventListener('focusout', (e) => {
            const deletable = e.target.closest('.deletable-element');
            if (deletable) setTimeout(() => { 
                if (document.activeElement !== deletable && !deletable.contains(document.activeElement)) {
                    deletable.classList.remove('focused');
                    if (deletable.classList.contains('sticky-note')) {
                        const toolbar = deletable.querySelector('.sticky-note-toolbar');
                        if (toolbar) toolbar.style.display = 'none';
                    }
                }
            }, 100);
        });
    }

    if (boldBtn) boldBtn.addEventListener('click', () => { formatText('bold'); });
    if (italicBtn) italicBtn.addEventListener('click', () => { formatText('italic'); });
    if (underlineBtn) underlineBtn.addEventListener('click', () => { formatText('underline'); });
    if (strikethroughBtn) strikethroughBtn.addEventListener('click', () => { formatText('strikeThrough'); });
    if (headingBtn) headingBtn.addEventListener('click', applyNextHeading);
    if (codeBtn) codeBtn.addEventListener('click', formatCodeBlock);
    if (textColorPicker) textColorPicker.addEventListener('input', () => {
        if (currentPageAccessLevel === 'view') return;
        if (currentMode !== 'write') enableWriteMode();
        restoreSelection();
        document.execCommand('foreColor', false, textColorPicker.value);
        if (editorCanvas) editorCanvas.focus();
        saveSelection();
        scheduleSave();
    });
    if (highlightBtn) highlightBtn.addEventListener('click', toggleHighlight);
    if (fontSizeSelect) fontSizeSelect.addEventListener('change', (e) => applyFontSize(e.target.value));
    if (latexBtn) latexBtn.addEventListener('click', insertLatexEquationModal); 
    if (bulletBtn) bulletBtn.addEventListener('click', () => formatText('insertUnorderedList'));
    if (numberedListBtn) numberedListBtn.addEventListener('click', () => formatText('insertOrderedList'));
    if (checkboxBtn) checkboxBtn.addEventListener('click', insertCheckbox);
    if (dividerBtn) dividerBtn.addEventListener('click', insertDivider);
    if (stickyNoteBtn) stickyNoteBtn.addEventListener('click', insertStickyNote);
    
    if (alignLeftBtn) alignLeftBtn.addEventListener('click', () => { formatText('justifyLeft'); });
    if (alignCenterBtn) alignCenterBtn.addEventListener('click', () => { formatText('justifyCenter'); });
    if (alignRightBtn) alignRightBtn.addEventListener('click', () => { formatText('justifyRight'); });
    if (fontFamilySelect) fontFamilySelect.addEventListener('change', (e) => applyFontFamily(e.target.value));

    if (writeBtn) writeBtn.addEventListener('click', enableWriteMode);
    if (drawBtn) drawBtn.addEventListener('click', enableDrawMode);
    if (eraseBtn) eraseBtn.addEventListener('click', enableErasing);
    if (clearDrawBtn) clearDrawBtn.addEventListener('click', clearCanvas);

    if (drawingCanvas) {
        drawingCanvas.addEventListener('mousedown', startDrawing);
        drawingCanvas.addEventListener('mousemove', draw);
        drawingCanvas.addEventListener('mouseup', stopDrawing);
        drawingCanvas.addEventListener('mouseout', stopDrawing);
        drawingCanvas.addEventListener('touchstart', (e) => { 
            if (e.touches.length === 1) { e.preventDefault(); startDrawing(e.touches[0]); }
        }, { passive: false });
        drawingCanvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) { e.preventDefault(); draw(e.touches[0]); }
        }, { passive: false });
        drawingCanvas.addEventListener('touchend', (e) => { 
            if (e.touches.length === 0) { stopDrawing(); }
        });
    }
    
    if (imageBtn && imageUpload) imageBtn.addEventListener('click', () => imageUpload.click());
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
    if (pdfBtn && pdfUpload) pdfBtn.addEventListener('click', () => pdfUpload.click());
    if (pdfUpload) pdfUpload.addEventListener('change', handlePdfUpload);
    if (tableBtn) tableBtn.addEventListener('click', insertTable);
    if (calendarBtn) calendarBtn.addEventListener('click', insertCalendar);
    if (insertWeatherBtn) insertWeatherBtn.addEventListener('click', showInsertWeatherModal); 
    if (pomodoroSettingsBtn) pomodoroSettingsBtn.addEventListener('click', showPomodoroSettingsModal);
    
    if (summarizeTextBtn) summarizeTextBtn.addEventListener('click', handleSummarizeText);
    if (generateParagraphBtn) generateParagraphBtn.addEventListener('click', insertAIGeneratedParagraph); 
    if (translateTextBtn) translateTextBtn.addEventListener('click', showTranslateTextModal); 

    if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPageAsPdf);
    if (searchNotesInput) searchNotesInput.addEventListener('input', (e) => {
        e.stopPropagation(); 
        const searchTerm = e.target.value.trim();
        loadUserPages(searchTerm); 
    });
    
    if (closeShareModalBtn && shareModalOverlay) closeShareModalBtn.addEventListener('click', () => shareModalOverlay.classList.add('hidden'));
    if (shareForm) shareForm.addEventListener('submit', handleShareFormSubmit);
    if (currentSharesList) currentSharesList.addEventListener('click', handleUnshareClick);
    
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) themeSelect.addEventListener('change', (e) => {
        changeTheme(e.target.value);
    });
    const canvasTemplateSelect = document.getElementById('canvas-template-select');
    if (canvasTemplateSelect) {
        canvasTemplateSelect.addEventListener('change', (e) => {
            handleCanvasTemplate(e.target.value);
        });
    }

    const canvasStyleSelect = document.getElementById('canvas-style-select');
    if (canvasStyleSelect) canvasStyleSelect.addEventListener('change', (e) => {
        changeCanvasStyle(e.target.value);
    });

    const canvasColorPicker = document.getElementById('canvas-color-picker');
    if (canvasColorPicker) canvasColorPicker.addEventListener('input', (e) => {
        changeCanvasColor(e.target.value);
    });

    const usernameDisplayBtn = document.getElementById('username-display-btn');
    const userDropdownContent = document.querySelector('.user-dropdown-content');

    if(usernameDisplayBtn && userDropdownContent) {
        usernameDisplayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownContent.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (userDropdownContent && !userDropdownContent.contains(e.target) && usernameDisplayBtn && !usernameDisplayBtn.contains(e.target)) {
                userDropdownContent.classList.remove('show');
            }
        });

        if(userDropdownContent) {
            userDropdownContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
}

function updateFormattingButtonStates() {
    if (currentMode === 'write' && editorCanvas) {
        if (boldBtn) boldBtn.classList.toggle('active', document.queryCommandState('bold'));
        if (italicBtn) italicBtn.classList.toggle('active', document.queryCommandState('italic'));
        if (underlineBtn) underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
        if (strikethroughBtn) strikethroughBtn.classList.toggle('active', document.queryCommandState('strikeThrough'));
        
        if (alignLeftBtn) alignLeftBtn.classList.toggle('active', document.queryCommandState('justifyLeft'));
        if (alignCenterBtn) alignCenterBtn.classList.toggle('active', document.queryCommandState('justifyCenter'));
        if (alignRightBtn) alignRightBtn.classList.toggle('active', document.queryCommandState('justifyRight'));
        
        if (fontFamilySelect && (editorCanvas.contains(document.activeElement) || document.activeElement === editorCanvas)) {
            let effectiveFont = DEFAULT_FONT_FAMILY; 
            if (currentSelectionRange) {
                let node = currentSelectionRange.commonAncestorContainer;
                if (node.nodeType === Node.TEXT_NODE) {
                    node = node.parentNode;
                }

                while (node && node !== editorCanvas && node !== document.body) {
                    let nodeFontFamily = '';
                    if (node.nodeType === Node.ELEMENT_NODE) { 
                        if (node.style && node.style.fontFamily) { 
                            nodeFontFamily = node.style.fontFamily;
                        } else if (node.getAttribute && node.getAttribute('face')) { 
                            nodeFontFamily = node.getAttribute('face');
                        }
                       
                    }
                    
                    if (nodeFontFamily) {
                        const primaryNodeFont = nodeFontFamily.split(',')[0].trim().replace(/['"]/g, '').toLowerCase();
                        const matchingOption = Array.from(fontFamilySelect.options).find(opt => {
                            const optPrimaryFont = opt.value.split(',')[0].trim().replace(/['"]/g, '').toLowerCase();
                            return opt.value.toLowerCase() === nodeFontFamily.toLowerCase() || optPrimaryFont === primaryNodeFont;
                        });

                        if (matchingOption) {
                            effectiveFont = matchingOption.value;
                            break; 
                        }
                    }
                    if (!node.parentNode || node.parentNode === document) break; 
                    node = node.parentNode;
                }
            }
            
            if (effectiveFont === DEFAULT_FONT_FAMILY) { 
                let cmdValue = document.queryCommandValue('fontName');
                if (cmdValue) {
                    cmdValue = cmdValue.replace(/['"]/g, ''); 
                    const primaryCmdFont = cmdValue.split(',')[0].trim().toLowerCase();
                    const matchingOption = Array.from(fontFamilySelect.options).find(opt => {
                         const optPrimaryFont = opt.value.split(',')[0].trim().replace(/['"]/g, '').toLowerCase();
                         return opt.value.toLowerCase() === cmdValue.toLowerCase() || optPrimaryFont === primaryCmdFont;
                    });
                     if (matchingOption) {
                         effectiveFont = matchingOption.value;
                     } else if (['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'].includes(primaryCmdFont)) {
                        const genericOption = Array.from(fontFamilySelect.options).find(opt => opt.value.toLowerCase() === primaryCmdFont);
                        if (genericOption) effectiveFont = genericOption.value;
                        else effectiveFont = DEFAULT_FONT_FAMILY;
                     }
                }
            }
            fontFamilySelect.value = effectiveFont;
        } else if (fontFamilySelect) {
            fontFamilySelect.value = DEFAULT_FONT_FAMILY; 
        }
    }
}

function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorCanvas && editorCanvas.contains(range.commonAncestorContainer)) {
            currentSelectionRange = range.cloneRange();
            updateFormattingButtonStates();
        } else {
            currentSelectionRange = null;
        }
    } else {
        currentSelectionRange = null;
    }
}

function restoreSelection() {
    if (currentSelectionRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(currentSelectionRange);
    }
}

function setupCanvas() {
    if (!drawingCanvas || !colorPicker || !brushSize) return;
    ctx = drawingCanvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.imageSmoothingEnabled = false; 
    
    const container = document.querySelector('.canvas-container');
    if (container) {
        drawingCanvas.width = container.clientWidth;
        drawingCanvas.height = container.clientHeight;
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
    
    colorPicker.addEventListener('input', () => {
        if (!ctx) return;
        ctx.globalCompositeOperation = 'source-over'; 
        ctx.strokeStyle = colorPicker.value;
    });
    
    brushSize.addEventListener('input', () => {
        if (!ctx) return;
        ctx.lineWidth = brushSize.value;
    });
    
    resizeCanvas();
}

function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    if (!container || !drawingCanvas || !ctx) return; 
    
    clearTimeout(window.resizeCanvasTimeout);
    window.resizeCanvasTimeout = setTimeout(() => {
        const currentDrawingData = drawingCanvas.toDataURL('image/png', 1.0);
        
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = containerWidth;
        tempCanvas.height = containerHeight;
        
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.lineJoin = 'round';
        tempCtx.lineCap = 'round';
        
        if (currentDrawingData !== 'data:,') {
            const img = new Image();
            img.onload = () => {
                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.drawImage(img, 0, 0, containerWidth, containerHeight);
                
                drawingCanvas.width = containerWidth;
                drawingCanvas.height = containerHeight;
                ctx.imageSmoothingEnabled = false;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.strokeStyle = colorPicker.value;
                ctx.lineWidth = brushSize.value;
                
                ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                ctx.drawImage(tempCanvas, 0, 0);
                
                if (eraseBtn && eraseBtn.classList.contains('active')) {
                    ctx.globalCompositeOperation = 'destination-out';
                } else {
                    ctx.globalCompositeOperation = 'source-over';
                }
            };
            img.src = currentDrawingData;
        } else {
            drawingCanvas.width = containerWidth;
            drawingCanvas.height = containerHeight;
            ctx.imageSmoothingEnabled = false;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = brushSize.value;
            
            ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            
            if (eraseBtn && eraseBtn.classList.contains('active')) {
                ctx.globalCompositeOperation = 'destination-out';
            } else {
                ctx.globalCompositeOperation = 'source-over';
            }
        }
    }, 100);
}

function enableWriteMode() {
    if (currentPageAccessLevel === 'view') return;
    currentMode = 'write';
    if(writeBtn) writeBtn.classList.add('active');
    if(drawBtn) drawBtn.classList.remove('active');
    if(eraseBtn) eraseBtn.classList.remove('active'); 
    if(drawingCanvas) drawingCanvas.style.pointerEvents = 'none';
    if(editorCanvas) {
        editorCanvas.contentEditable = "true"; 
        editorCanvas.focus();
    }
    updateModeIndicatorStyle();
    if(textToolsGroup) textToolsGroup.style.display = 'flex'; 
    if(blockToolsGroup) blockToolsGroup.style.display = 'flex';
    if(drawingToolsGroup) drawingToolsGroup.style.display = 'none';
    if(aiToolsGroup) aiToolsGroup.style.display = 'flex'; 
    if(ctx) ctx.globalCompositeOperation = 'source-over'; 
    updateFormattingButtonStates();
}

function enableDrawMode() {
    if (currentPageAccessLevel === 'view') return;
    currentMode = 'draw';
    if(drawBtn) drawBtn.classList.add('active');
    if(writeBtn) writeBtn.classList.remove('active');
    if(eraseBtn) eraseBtn.classList.remove('active'); 
    if(drawingCanvas) drawingCanvas.style.pointerEvents = 'auto';
    if(editorCanvas) editorCanvas.contentEditable = "false"; 
    updateModeIndicatorStyle();
    if(textToolsGroup) textToolsGroup.style.display = 'none';
    if(blockToolsGroup) blockToolsGroup.style.display = 'none';
    if(drawingToolsGroup) drawingToolsGroup.style.display = 'flex'; 
    if(aiToolsGroup) aiToolsGroup.style.display = 'none'; 
    if(ctx) {
        ctx.globalCompositeOperation = 'source-over'; 
        if(colorPicker) ctx.strokeStyle = colorPicker.value; 
    }
}

function enableErasing() {
    if (!eraseBtn || !ctx || !colorPicker) return;
    if (currentMode === 'draw' && currentPageAccessLevel !== 'view') {
        eraseBtn.classList.toggle('active');
        if (eraseBtn.classList.contains('active')) {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = colorPicker.value;
        }
    } else if (currentMode !== 'draw' && currentPageAccessLevel !== 'view') {
        enableDrawMode();
        eraseBtn.classList.add('active');
        ctx.globalCompositeOperation = 'destination-out';
    }
}

function formatText(command, value = null) {
    if (currentPageAccessLevel === 'view' || !editorCanvas) return;
    if (currentMode !== 'write') enableWriteMode(); 
    
    restoreSelection();
    document.execCommand(command, false, value);
    
    editorCanvas.focus();
    saveSelection(); 
    scheduleSave();
}

function applyFontFamily(fontName) {
    if (currentPageAccessLevel === 'view' || !editorCanvas) return;
    if (currentMode !== 'write') enableWriteMode();
    
    restoreSelection(); 
    document.execCommand('fontName', false, fontName); 
    
    editorCanvas.focus(); 
    saveSelection(); 
    scheduleSave();
}
function applyNextHeading() {
    if (currentPageAccessLevel === 'view' || !headingBtn) return;
    if (currentMode !== 'write') enableWriteMode();
    currentHeadingLevel = (currentHeadingLevel + 1) % 4; 
    let formatTag = 'p'; let buttonText = 'Paragraph'; 
    headingBtn.innerHTML = `<i class="fas fa-heading"></i> <span>Paragraph</span>`; 
    switch (currentHeadingLevel) {
        case 0: formatTag = 'p'; buttonText = 'Paragraph'; break;
        case 1: formatTag = 'h1'; buttonText = 'Heading 1'; break;
        case 2: formatTag = 'h2'; buttonText = 'Heading 2'; break;
        case 3: formatTag = 'h3'; buttonText = 'Heading 3'; break;
    }
    restoreSelection();
    document.execCommand('formatBlock', false, `<${formatTag}>`);
    headingBtn.innerHTML = `<i class="fas fa-heading"></i> <span>${buttonText}</span>`; 
    headingBtn.title = `Format as ${buttonText}`;
    editorCanvas.focus();
    saveSelection();
    scheduleSave();
}

function applyFontSize(sizeValue) { 
    if (currentPageAccessLevel === 'view' || !editorCanvas) return; 
    if (currentMode !== 'write') enableWriteMode();
    
    restoreSelection();
    document.execCommand('fontSize', false, sizeValue);
    
    editorCanvas.focus();
    saveSelection();
    scheduleSave();
}

function formatCodeBlock() {
    if (currentPageAccessLevel === 'view' || !editorCanvas) return;
    if (currentMode !== 'write') enableWriteMode();

    let langOptionsHTML = '';
    for (const langCode in PRISM_LANGUAGES) {
        langOptionsHTML += `<option value="${langCode}">${PRISM_LANGUAGES[langCode]}</option>`;
    }

    const codeFormatForm = document.createElement('form');
    codeFormatForm.innerHTML = `
        <div class="form-group">
            <label for="code-format-language-select">Select Language:</label>
            <select id="code-format-language-select" style="background-color: var(--bg-primary); color: var(--text-primary);">
                ${langOptionsHTML}
            </select>
        </div>
        <div class="form-group">
            <label for="code-format-input">Paste Code:</label>
            <textarea id="code-format-input" placeholder="Paste your code here..." style="min-height: 150px; background-color: var(--bg-primary); color: var(--text-primary); font-family: 'Courier New', monospace;"></textarea>
        </div>
        <div id="code-format-preview-container" style="margin-top: 10px; display: none;">
             <label>Preview:</label>
             <div id="code-format-preview" style="background: #2d3748; border-radius: 5px; padding: 10px; max-height: 200px; overflow: auto;">
                {/* Preview will be rendered here by Prism */}
             </div>
        </div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color); margin-top: 15px;">
            <i class="fas fa-magic"></i> Format & Insert
        </button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>
    `;

    const { modalOverlay, modal } = createModal('Format Code Block', codeFormatForm);
    const modalContent = modal.querySelector('.modal-content');
    const codeInputArea = codeFormatForm.querySelector('#code-format-input');
    const languageSelectEl = codeFormatForm.querySelector('#code-format-language-select');
    const previewContainer = codeFormatForm.querySelector('#code-format-preview-container');
    const previewArea = codeFormatForm.querySelector('#code-format-preview');

    function updateCodePreview() {
        const codeToPreview = codeInputArea.value;
        const selectedLang = languageSelectEl.value;

        if (codeToPreview.trim() && selectedLang && window.Prism) {
            const escapedCode = codeToPreview
                .replace(/&/g, "&")
                .replace(/</g, "<")
                .replace(/>/g, ">");

            previewArea.innerHTML = `<pre><code class="language-${selectedLang}">${escapedCode}</code></pre>`;
            Prism.highlightElement(previewArea.querySelector('code')); 
            previewContainer.style.display = 'block';
        } else {
            previewContainer.style.display = 'none';
        }
    }

    codeInputArea.addEventListener('input', updateCodePreview);
    languageSelectEl.addEventListener('change', updateCodePreview);
    updateCodePreview(); 

    codeFormatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawCode = codeInputArea.value;
            const language = languageSelectEl.value;

            if (!rawCode.trim()) {
                showErrorInModal(modalContent, 'Please paste some code.');
                return;
            }
            if (!language) {
                showErrorInModal(modalContent, 'Please select a language.');
                return;
            }

            const escapedCode = rawCode
                .replace(/&/g, "&")
                .replace(/</g, "<")
                .replace(/>/g, ">");

            let highlightedHtml;
            if (Prism.languages[language]) {
                highlightedHtml = Prism.highlight(escapedCode, Prism.languages[language], language);
            } else {
                console.warn(`Prism language '${language}' not loaded. Inserting as plain text.`);
                highlightedHtml = escapedCode;
            }
            
            const deletableWrapper = document.createElement('div');
            deletableWrapper.className = 'deletable-element';
            deletableWrapper.innerHTML = `<pre class="language-${language}"><code class="language-${language}">${highlightedHtml}</code></pre>`;
            
            restoreSelection(); 
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
            
                editorCanvas.appendChild(deletableWrapper);
                const pAfter = document.createElement('p');
                pAfter.innerHTML = '<br>'; 
                editorCanvas.appendChild(pAfter);
                
                const newRange = document.createRange();
                newRange.setStart(pAfter, 0);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            } else {
                let range = selection.getRangeAt(0);
                range.deleteContents(); 

                range.insertNode(deletableWrapper);

                const pAfter = document.createElement('p');
                pAfter.innerHTML = '<br>'; 

                if (deletableWrapper.parentNode) {
                    deletableWrapper.parentNode.insertBefore(pAfter, deletableWrapper.nextSibling);
                } else { 
                    (editorCanvas || document.body).appendChild(pAfter);
                }

                const newRange = document.createRange();
                newRange.setStart(pAfter, 0); 
                newRange.collapse(true);       

                selection.removeAllRanges();   
                selection.addRange(newRange);  
            }

            editorCanvas.focus(); 
            makeElementsDeletable(); 
            scheduleSave();
            document.body.removeChild(modalOverlay);
            showNotification("Formatted code block inserted!", "success");
        });

}

function handleCheckboxChange(event) { 
    const checkbox = event.target;
    const label = checkbox.nextElementSibling; 
    if (label && label.tagName === 'LABEL') { 
        if (checkbox.checked) {
            label.classList.add('strikethrough');
            label.style.color = 'var(--text-secondary)'; 
        } else {
            label.classList.remove('strikethrough');
            label.style.color = 'var(--text-primary)'; 
        }
    }
    scheduleSave();
}

function insertCheckbox() { 
    if (currentPageAccessLevel === 'view' || !editorCanvas) return;
    if (currentMode !== 'write') enableWriteMode();
    
    restoreSelection();
    const selection = window.getSelection();
    let text = '';
    
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        text = range.toString();
        range.deleteContents(); 
    }
    
    const container = document.createElement('div');
    container.className = 'checkbox-container'; 
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', handleCheckboxChange);
    
    const label = document.createElement('label'); 
    label.contentEditable = "true"; 
    label.textContent = text || 'Checkbox item';
    label.style.color = 'var(--text-primary)'; 
    
    container.appendChild(checkbox);
    container.appendChild(label);
    
    insertNodeAtCursor(container); 
    
    label.focus();
    const newRange = document.createRange();
    newRange.selectNodeContents(label); 
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    saveSelection();
    scheduleSave();
}

function insertLatexEquationModal() {
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    
    const latexForm = document.createElement('form');
    latexForm.innerHTML = `
        <div class="form-group">
            <label for="latex-input">Enter LaTeX Equation (without $ symbols):</label>
            <input type="text" id="latex-input" value="E = mc^2" style="background-color: var(--bg-primary); color: var(--text-primary);">
        </div>
        <label for="latex-input">Preview:</label>
        <div id="latex-preview-area">Preview will appear here.</div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color); margin-top: 10px;">Add Equation</button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>
    `;
    const { modalOverlay } = createModal('Add LaTeX Equation', latexForm);

    const latexInput = latexForm.querySelector('#latex-input');
    const latexPreviewArea = latexForm.querySelector('#latex-preview-area');

    function updateLatexPreview() {
        if (!window.MathJax || !MathJax.typesetPromise) {
            latexPreviewArea.textContent = "MathJax not loaded. Cannot preview.";
            return;
        }
        const equation = latexInput.value.trim();
        if (equation) {
            latexPreviewArea.innerHTML = `\\(${equation}\\)`; 
            MathJax.typesetPromise([latexPreviewArea]).catch((err) => {
                latexPreviewArea.textContent = 'Error rendering LaTeX preview.';
                console.error('MathJax preview error:', err);
            });
        } else {
            latexPreviewArea.innerHTML = '<em>Preview will appear here.</em>';
        }
    }

    latexInput.addEventListener('input', updateLatexPreview);
    updateLatexPreview(); 

    latexForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const equation = latexInput.value.trim();
        if (!equation) return showErrorInModal(latexForm.closest('.modal-content'), 'Equation cannot be empty.');

        const eqnDiv = document.createElement('div');
        eqnDiv.className = 'latex-equation';
        eqnDiv.innerHTML = `\\(${equation}\\)`; 
        eqnDiv.contentEditable = "false"; 
        
        const wrapper = document.createElement('div'); 
        wrapper.className = 'deletable-wrapper deletable-element'; 
        wrapper.appendChild(eqnDiv);
        
        insertNodeAtCursor(wrapper);
        makeElementsDeletable(); 
        
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([eqnDiv]).catch((err) => console.error('MathJax typeset error:', err));
        }
        scheduleSave();
        document.body.removeChild(modalOverlay);
    });
}

function insertDivider() { 
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    
    restoreSelection(); 
    document.execCommand('insertHorizontalRule', false, null);

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const p = document.createElement('p');
        const br = document.createElement('br');
        p.appendChild(br);

        range.collapse(false); 
        range.insertNode(p);
        
        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    
    editorCanvas.focus();
    saveSelection();
    scheduleSave();
}

function insertStickyNote() {
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    const stickyDiv = document.createElement('div');
    stickyDiv.className = 'sticky-note deletable-element'; 
    stickyDiv.contentEditable = 'true'; 
    stickyDiv.innerHTML = '<p>Your note...</p>';
    
    const currentThemeClass = Array.from(document.body.classList).find(cls => cls.endsWith('-theme') || cls === 'dark-mode') || 'light';
    const themeName = currentThemeClass.replace('-theme', '');

    stickyDiv.style.backgroundColor = `var(--sticky-note-bg-${themeName}, var(--sticky-note-bg-light))`;
    stickyDiv.style.borderColor = `var(--sticky-note-border-${themeName}, var(--sticky-note-border-light))`;
    stickyDiv.style.color = `var(--sticky-note-text-${themeName}, var(--sticky-note-text-light))`;

    addStickyNoteToolbar(stickyDiv); 
    insertNodeAtCursor(stickyDiv, true); 
    
    const firstP = stickyDiv.querySelector('p');
    if (firstP) {
        firstP.focus();
        restoreSelection();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(firstP);
        range.collapse(false); 
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        stickyDiv.focus(); 
    }
    saveSelection();
    scheduleSave();
}

function addStickyNoteToolbar(stickyNoteElement) {
    if (stickyNoteElement.querySelector('.sticky-note-toolbar')) return; 

    const toolbar = document.createElement('div');
    toolbar.className = 'sticky-note-toolbar';
    
    const colorPalette = document.createElement('div');
    colorPalette.className = 'sticky-color-palette';
    STICKY_NOTE_COLORS.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'sticky-color-option';
        colorOption.style.backgroundColor = color;
        colorOption.addEventListener('click', (e) => {
            e.stopPropagation();
            stickyNoteElement.style.backgroundColor = color;
            scheduleSave();
        });
        colorPalette.appendChild(colorOption);
    });
    toolbar.appendChild(colorPalette);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-element-btn'; 
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.title = 'Delete Sticky Note';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stickyNoteElement.remove();
        scheduleSave();
    });
    toolbar.appendChild(deleteBtn);
    stickyNoteElement.appendChild(toolbar); 
}

function startDrawing(e) {
    if (currentPageAccessLevel === 'view' || currentMode !== 'draw' || !drawingCanvas || !ctx) return;
    
    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    const scaleX = drawingCanvas.width / rect.width;
    const scaleY = drawingCanvas.height / rect.height;
    
    const x = ((e.clientX || e.pageX) - rect.left) * scaleX;
    const y = ((e.clientY || e.pageY) - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle;
    if (ctx.globalCompositeOperation !== 'destination-out') { 
        ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2, true);
        ctx.fill();
    }
    
    ctx.beginPath(); 
    ctx.moveTo(x, y);
}

function draw(e) { 
    if (currentPageAccessLevel === 'view' || !isDrawing || currentMode !== 'draw' || !drawingCanvas || !ctx) return; 
    
    const rect = drawingCanvas.getBoundingClientRect();
    const scaleX = drawingCanvas.width / rect.width;
    const scaleY = drawingCanvas.height / rect.height;
    
    const x = ((e.clientX || e.pageX) - rect.left) * scaleX;
    const y = ((e.clientY || e.pageY) - rect.top) * scaleY;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x, y);
}

function stopDrawing() { 
    if (isDrawing && ctx) { 
        ctx.closePath(); 
        isDrawing = false;
        if (currentPageId && currentPageAccessLevel !== 'view') scheduleSave(); 
    } 
}

function wrapAndInsertDeletable(element, className = 'deletable-wrapper') {
    if (currentPageAccessLevel === 'view') return;
    const wrapper = document.createElement('div');
    wrapper.className = `${className} deletable-element`; 
    wrapper.appendChild(element);
    if (element.contentEditable !== undefined && element.tagName !== "P" && !element.classList.contains('sticky-note')) { 
        element.contentEditable = false; 
    }

    insertNodeAtCursor(wrapper);
    makeElementsDeletable(); 
    scheduleSave();
}

function handleImageUpload(e) { 
    if (currentPageAccessLevel === 'view') return;
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result; 
        img.style.maxWidth = '100%'; 
        img.style.height = 'auto';
        wrapAndInsertDeletable(img); 
    };
    reader.readAsDataURL(file); e.target.value = ''; 
}

function handlePdfUpload(e) { 
    if (currentPageAccessLevel === 'view') return;
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const embed = document.createElement('embed');
        embed.src = event.target.result; embed.type = 'application/pdf';
        embed.style.width = '100%'; embed.style.minHeight = '400px'; embed.style.height = '50vh';
        wrapAndInsertDeletable(embed);
    };
    reader.readAsDataURL(file); e.target.value = '';
}



function insertTable() { 
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    const tableForm = document.createElement('form');
    tableForm.innerHTML = `
        <div class="form-group"><label for="table-rows">Rows:</label><input type="number" id="table-rows" min="1" max="20" value="3" style="background-color: var(--bg-primary); color: var(--text-primary);"></div>
        <div class="form-group"><label for="table-cols">Cols:</label><input type="number" id="table-cols" min="1" max="10" value="3" style="background-color: var(--bg-primary); color: var(--text-primary);"></div>
        <div class="form-group" style="display: flex; align-items: center;"><input type="checkbox" id="table-header" checked style="width: auto; margin-right: 10px;"><label for="table-header" style="margin-bottom: 0;">Header Row</label></div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color);">Create Table</button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>`;
    const { modalOverlay } = createModal('Insert Table', tableForm);
    tableForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const rows = parseInt(tableForm.querySelector('#table-rows').value);
        const cols = parseInt(tableForm.querySelector('#table-cols').value);
        const includeHeader = tableForm.querySelector('#table-header').checked;
        if (isNaN(rows) || rows < 1) return showErrorInModal(tableForm.closest('.modal-content'), 'Valid number of rows required.');
        if (isNaN(cols) || cols < 1) return showErrorInModal(tableForm.closest('.modal-content'), 'Valid number of columns required.');
        
        let tableHTML = '<div class="table-container"><table contenteditable="false">'; 
        if (includeHeader) {
            tableHTML += '<thead><tr>';
            for (let i = 0; i < cols; i++) tableHTML += '<th contenteditable="true">Header</th>';
            tableHTML += '</tr></thead>';
        }
        tableHTML += '<tbody>';
        for (let i = 0; i < (includeHeader ? rows -1 : rows) ; i++) { 
            tableHTML += '<tr>';
            for (let j = 0; j < cols; j++) tableHTML += '<td contenteditable="true">Cell</td>';
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table></div>';
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHTML;
        const tableContainerElement = tempDiv.firstChild;
        
        insertNodeAtCursor(tableContainerElement); 
        makeElementsDeletable();
        scheduleSave();
        document.body.removeChild(modalOverlay);
    });
}

function insertCalendar() { 
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    const calendarForm = document.createElement('form');
    calendarForm.innerHTML = `
        <div class="form-group">
            <label for="calendar-type">Type:</label>
            <select id="calendar-type" style="background-color: var(--bg-primary); color: var(--text-primary);">
                <option value="">-- Select Type --</option>
                <option value="daily">Daily Planner</option>
                <option value="monthly">Monthly Calendar</option>
                <option value="yearly">Yearly Overview</option>
            </select>
        </div>
        <div id="dynamic-calendar-fields"></div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color);">Insert Calendar</button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>`;
    const { modalOverlay } = createModal('Insert Calendar', calendarForm);
    const typeSelect = calendarForm.querySelector('#calendar-type');
    const dynamicFields = calendarForm.querySelector('#dynamic-calendar-fields');
    typeSelect.addEventListener('change', () => {
        dynamicFields.innerHTML = ''; const selectedType = typeSelect.value; const today = new Date().toISOString().split('T')[0];
        if (selectedType === 'daily') { dynamicFields.innerHTML = `<div class="form-group"><label for="calendar-date">Date:</label><input type="date" id="calendar-date" value="${today}" style="background-color: var(--bg-primary); color: var(--text-primary);"></div>`; }
        else if (selectedType === 'monthly' || selectedType === 'yearly') {
            const currentYear = new Date().getFullYear(); const currentMonth = new Date().getMonth(); let monthOptions = '';
            if (selectedType === 'monthly') { const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; monthOptions = months.map((m, i) => `<option value="${i}" ${i === currentMonth ? 'selected' : ''}>${m}</option>`).join(''); }
            dynamicFields.innerHTML = `${selectedType === 'monthly' ? `<div class="form-group"><label for="calendar-month">Month:</label><select id="calendar-month" style="background-color: var(--bg-primary); color: var(--text-primary);">${monthOptions}</select></div>` : ''}<div class="form-group"><label for="calendar-year">Year:</label><input type="number" id="calendar-year" min="1900" max="2100" value="${currentYear}" style="background-color: var(--bg-primary); color: var(--text-primary);"></div>`;
        }
    });
    calendarForm.addEventListener('submit', (ev) => {
        ev.preventDefault(); const type = typeSelect.value; if (!type) return showErrorInModal(calendarForm.closest('.modal-content'), 'Please select a calendar type.');
        let calendarHTML = '';
        try {
            if (type === 'daily') { const dateInput = calendarForm.querySelector('#calendar-date'); if (!dateInput.value) return showErrorInModal(calendarForm.closest('.modal-content'), 'Please select a date.'); const selectedDate = new Date(dateInput.value + 'T00:00:00'); calendarHTML = generateDailyCalendar(selectedDate); }
            else if (type === 'monthly') { const year = parseInt(calendarForm.querySelector('#calendar-year').value); const month = parseInt(calendarForm.querySelector('#calendar-month').value); if (isNaN(year)) return showErrorInModal(calendarForm.closest('.modal-content'), 'Valid year required.'); calendarHTML = generateMonthlyCalendar(year, month); }
            else if (type === 'yearly') { const year = parseInt(calendarForm.querySelector('#calendar-year').value); if (isNaN(year)) return showErrorInModal(calendarForm.closest('.modal-content'), 'Valid year required.'); calendarHTML = generateYearlyCalendar(year); }
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = calendarHTML;
            const calendarElement = tempDiv.firstChild; 
            insertNodeAtCursor(calendarElement);
            makeElementsDeletable();
            scheduleSave(); document.body.removeChild(modalOverlay);
        } catch (err) { showErrorInModal(calendarForm.closest('.modal-content'), 'Error generating calendar: ' + err.message); }
    });
}

function makeElementsDeletable() {
    if (!editorCanvas) return;
    editorCanvas.querySelectorAll('img, embed, audio, .table-container, .calendar, .sticky-note, .latex-equation, .weather-info, .ai-generated-paragraph, .ai-generated-image-container').forEach(el => {
        let targetElementForButton = el;

        if ((el.tagName === 'IMG' || el.tagName === 'EMBED' || el.tagName === 'AUDIO' || el.classList.contains('latex-equation')) && !el.closest('.deletable-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'deletable-wrapper deletable-element'; // Add deletable-element to wrapper
            if (el.parentNode) { 
                el.parentNode.insertBefore(wrapper, el);
                wrapper.appendChild(el);
            } else { 
                editorCanvas.appendChild(wrapper);
                wrapper.appendChild(el);
            }
            targetElementForButton = wrapper;
        } 
        else if (el.closest('.deletable-wrapper')) { 
            targetElementForButton = el.closest('.deletable-wrapper');
            targetElementForButton.classList.add('deletable-element');
        } 
        else if (el.classList.contains('table-container') || el.classList.contains('calendar') || 
                   el.classList.contains('sticky-note') || el.classList.contains('weather-info') || 
                   el.classList.contains('ai-generated-paragraph') || el.classList.contains('ai-generated-image-container')) {
            el.classList.add('deletable-element');
            targetElementForButton = el; 
        }

        if (targetElementForButton && targetElementForButton.classList.contains('deletable-element')) {
            if (targetElementForButton.classList.contains('sticky-note')) {
                if (!targetElementForButton.querySelector('.sticky-note-toolbar')) {
                    addStickyNoteToolbar(targetElementForButton);
                }
            } else { 
                if (!targetElementForButton.querySelector('.delete-element-btn')) {
                    addDeleteButtonToElement(targetElementForButton);
                }
            }
        }
    });
}

function addDeleteButtonToElement(element) { 
    if (element.querySelector('.delete-element-btn') || element.classList.contains('sticky-note')) return; 
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-element-btn';
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>'; 
    deleteBtn.title = 'Delete Element';
    deleteBtn.contentEditable = 'false'; 
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        element.remove();
        scheduleSave();
    });
    element.style.position = 'relative'; 
    element.appendChild(deleteBtn);
}

function handleEditorClickForDelete(e) {
    if (!editorCanvas) return;
    editorCanvas.querySelectorAll('.sticky-note .sticky-note-toolbar').forEach(tb => tb.style.display = 'none');
    editorCanvas.querySelectorAll('.deletable-element.focused').forEach(el => {
        if (el !== e.target.closest('.deletable-element')) {
            el.classList.remove('focused');
        }
    });

    const clickedDeletable = e.target.closest('.deletable-element');
    if (clickedDeletable) {
        clickedDeletable.classList.add('focused'); 
        if (clickedDeletable.classList.contains('sticky-note')) {
            const toolbar = clickedDeletable.querySelector('.sticky-note-toolbar');
            if (toolbar) toolbar.style.display = 'flex';
        }
    }
    saveSelection(); 
}

function createModal(title, contentElement, onCloseCallback) { 
    const modalOverlay = document.createElement('div'); modalOverlay.className = 'modal-overlay';
    const modal = document.createElement('div'); modal.className = 'modal-container';
    const modalHeader = document.createElement('div'); modalHeader.className = 'modal-header';
    const modalTitle = document.createElement('h3'); modalTitle.textContent = title;
    const closeButton = document.createElement('button'); closeButton.innerHTML = '&times;'; closeButton.className = 'close-button';
    closeButton.onclick = () => { document.body.removeChild(modalOverlay); if (onCloseCallback) onCloseCallback(); };
    modalHeader.appendChild(modalTitle); modalHeader.appendChild(closeButton);
    const modalContent = document.createElement('div'); modalContent.className = 'modal-content'; modalContent.appendChild(contentElement);
    modal.appendChild(modalHeader); modal.appendChild(modalContent);
    modalOverlay.appendChild(modal); 
    document.body.appendChild(modalOverlay); 
    const firstFocusable = modal.querySelector('input, select, button, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
    return { modalOverlay, modal };
}

function showErrorInModal(formElementOrModalContent, message, autoHide = true, type = 'error') {
    let errorEl;
    if (formElementOrModalContent) {
        errorEl = formElementOrModalContent.querySelector('.error-alert');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            errorEl.style.backgroundColor = type === 'error' ? '#f8d7da' : (type === 'warning' ? '#fff3cd' : '#d1ecf1');
            errorEl.style.color = type === 'error' ? '#721c24' : (type === 'warning' ? '#856404' : '#0c5460');
            errorEl.style.borderColor = type === 'error' ? '#f5c6cb' : (type === 'warning' ? '#ffeeba' : '#bee5eb');
            
            if (autoHide) {
                setTimeout(() => { errorEl.classList.add('hidden'); errorEl.textContent = ''; }, 5000);
            }
        } else {
            alert(message); 
        }
    } else {
        alert(message); 
    }
}

function generateDailyCalendar(date) { 
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate(); const month = date.getMonth(); const year = date.getFullYear(); const dayOfWeek = date.getDay();
    return `<div class="calendar daily-calendar" contenteditable="false"><h3>Daily - ${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}, ${year}</h3><table><thead><tr><th>Time</th><th>Event/Task</th></tr></thead><tbody>${Array.from({length: 12}, (_, i) => { const hour = i + 8; return `<tr><td>${hour % 12 || 12}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}</td><td contenteditable="true"></td></tr>`; }).join('')}</tbody></table></div>`;
}

function generateMonthlyCalendar(year, month) { 
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; const firstDayOfMonth = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
    let daysHTML = ''; let dayCounter = 1;
    for (let i = 0; i < 6; i++) { daysHTML += '<tr>'; for (let j = 0; j < 7; j++) { if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) daysHTML += '<td></td>'; else daysHTML += `<td contenteditable="true">${dayCounter++}</td>`; } daysHTML += '</tr>'; if (dayCounter > daysInMonth) break; }
    return `<div class="calendar monthly-calendar" contenteditable="false"><h3>${monthNames[month]} ${year}</h3><table><thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody>${daysHTML}</tbody></table></div>`;
}

function generateYearlyCalendar(year) { 
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; let monthsGridHTML = '';
    for (let m = 0; m < 12; m++) {
        const firstDayOfMonth = new Date(year, m, 1).getDay(); const daysInMonth = new Date(year, m + 1, 0).getDate(); let daysHTML = ''; let dayCounter = 1;
        for (let i = 0; i < 6; i++) { daysHTML += '<tr>'; for (let j = 0; j < 7; j++) { if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) daysHTML += '<td></td>'; else daysHTML += `<td>${dayCounter++}</td>`; } daysHTML += '</tr>'; if (dayCounter > daysInMonth) break; }
        monthsGridHTML += `<div class="month-container"><h4>${monthNames[m]}</h4><table class="mini-calendar"><thead><tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr></thead><tbody>${daysHTML}</tbody></table></div>`;
    }
    return `<div class="calendar yearly-calendar" contenteditable="false"><h3>Year ${year}</h3><div class="months-grid">${monthsGridHTML}</div></div>`;
}

function insertNodeAtCursor(node, addLineBreakAfter = true) {
    if (!editorCanvas) return;
    if (currentMode !== 'write') enableWriteMode();
    editorCanvas.focus(); 
    restoreSelection(); 
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        range.deleteContents(); 

        let container = range.commonAncestorContainer;

        while (container && container !== editorCanvas && (container.contentEditable === 'false' || container.contentEditable === 'inherit')) {
            container = container.parentNode;
        }
  
        if (container && container !== editorCanvas && container.contentEditable !== 'true') {
            if (container.parentNode) {
                container.parentNode.insertBefore(node, container.nextSibling);
            } else { 
                editorCanvas.appendChild(node); 
            }
        } else { 
            range.insertNode(node);
        }

        range = document.createRange();
        range.setStartAfter(node);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);

        if (addLineBreakAfter) {
            const p = document.createElement('p');
            const br = document.createElement('br');
            p.appendChild(br);
            range.insertNode(p); 
            range.setStart(p, 0); 
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        editorCanvas.focus(); 
    } else { 
        
        editorCanvas.appendChild(node);
        if (addLineBreakAfter) {
            const p = document.createElement('p');
            p.appendChild(document.createElement('br'));
            editorCanvas.appendChild(p);
           
            const newRange = document.createRange();
            newRange.setStart(p,0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
        editorCanvas.focus();
    }
    makeElementsDeletable(); 
    scheduleSave();
}

function insertHTMLAtCursor(html) {
    if (!editorCanvas) return;
    if (currentMode !== 'write') enableWriteMode();
    editorCanvas.focus(); 
    restoreSelection(); 

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let parentElement = range.commonAncestorContainer;
        if (parentElement.nodeType === Node.TEXT_NODE) {
            parentElement = parentElement.parentNode;
        }

       
        while (parentElement !== editorCanvas && parentElement.contentEditable !== 'true') {
            if (parentElement.parentNode && parentElement.parentNode !== document) { 
                parentElement = parentElement.parentNode;
            } else { 
                break; 
            }
        }
        
        document.execCommand('insertHTML', false, html);
    } else { 
       
        editorCanvas.innerHTML += html; 
       
        const allChildren = Array.from(editorCanvas.childNodes);
        const lastChild = allChildren[allChildren.length - 1];
        if(lastChild){
            const newRange = document.createRange();
            try {
                newRange.selectNodeContents(lastChild);
                newRange.collapse(false);
                selection.removeAllRanges();
                selection.addRange(newRange);
            } catch (e) { console.warn("Could not set range after fallback HTML insertion", e); }
        }
    }
    makeElementsDeletable(); 
    scheduleSave();
}

function downloadPageAsPdf() {
    if (!noteTitle || !editorCanvas) return;
    const loadingIndicator = document.createElement('div');
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '50%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translate(-50%, -50%)';
    loadingIndicator.style.background = 'rgba(0,0,0,0.7)';
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.padding = '20px';
    loadingIndicator.style.borderRadius = '10px';
    loadingIndicator.style.zIndex = '9999';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    document.body.appendChild(loadingIndicator);
    
    try {
        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-export-container';
        pdfContainer.style.width = '100%'; 
        pdfContainer.style.padding = '20px';
        pdfContainer.style.backgroundColor = 'var(--canvas-plain-bg, white)'; 
        pdfContainer.style.color = 'var(--text-primary, black)'; 
        pdfContainer.style.position = 'relative'; 
   
        const currentThemeClass = Array.from(document.body.classList).find(cls => cls.endsWith('-theme') || cls === 'dark-mode');
        if (currentThemeClass) {
            pdfContainer.classList.add(currentThemeClass);
        }
        
        const titleElement = document.createElement('h5');
       
        titleElement.textContent = "Downloaded from ListIt.com"; 
        titleElement.style.borderBottom = '1px solid var(--border-color, #ddd)';
        titleElement.style.paddingBottom = '10px';
        titleElement.style.marginBottom = '20px';
        titleElement.style.textAlign = 'center';
        titleElement.style.color = 'inherit'; 
        pdfContainer.appendChild(titleElement);
        
        const contentWrapper = document.createElement('div');
        contentWrapper.style.position = 'relative';
        contentWrapper.style.minHeight = '500px'; 
        
        const clonedEditor = editorCanvas.cloneNode(true);
        clonedEditor.id = "pdf-editor-canvas-clone";
        clonedEditor.style.minHeight = 'auto';
        clonedEditor.style.color = 'inherit';
        clonedEditor.style.position = 'relative';
        clonedEditor.style.zIndex = '2'; 
        clonedEditor.style.backgroundColor = 'transparent'; 
        clonedEditor.querySelectorAll('[contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
        contentWrapper.appendChild(clonedEditor);
        
        if (drawingCanvas && drawingCanvas.toDataURL) {
            const canvasImage = drawingCanvas.toDataURL('image/png');
            if (canvasImage && canvasImage !== 'data:,') {
                const drawingImgElement = new Image();
                drawingImgElement.src = canvasImage;
                
                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'absolute';
                imgContainer.style.top = '0';
                imgContainer.style.left = '0';
                imgContainer.style.width = '100%';
                imgContainer.style.height = '100%';
                imgContainer.style.zIndex = '1'; 
                
                drawingImgElement.style.width = '100%';
                drawingImgElement.style.height = '100%';
                drawingImgElement.style.objectFit = 'contain'; 
                
                imgContainer.appendChild(drawingImgElement);
                contentWrapper.insertBefore(imgContainer, clonedEditor);
            }
        }
        
        pdfContainer.appendChild(contentWrapper);
        document.body.appendChild(pdfContainer); 
        
        const opt = {
            margin: [15, 15, 15, 15], // mm
            filename: `${(noteTitle.value || 'Untitled Note').replace(/[^\w\s.-]/gi, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                allowTaint: true, 
                backgroundColor: getComputedStyle(pdfContainer).backgroundColor, 
                onclone: (clonedDoc) => {
                 
                    if (window.MathJax && MathJax.typesetPromise) {
                        return MathJax.typesetPromise(Array.from(clonedDoc.querySelectorAll('.latex-equation')));
                    }
                    return Promise.resolve();
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        setTimeout(() => { 
            html2pdf()
                .from(pdfContainer)
                .set(opt)
                .save()
                .then(() => {
                    document.body.removeChild(pdfContainer);
                    document.body.removeChild(loadingIndicator);
                })
                .catch(err => {
                    console.error("PDF generation error:", err);
                    document.body.removeChild(pdfContainer);
                    document.body.removeChild(loadingIndicator);
                    alert("Error generating PDF. Please try again. Check console for details.");
                });
        }, 1000); 
    } catch (err) {
        console.error("Error in PDF setup:", err);
        if (document.body.contains(loadingIndicator)) document.body.removeChild(loadingIndicator);
        alert("Error preparing PDF. Please try again. Check console for details.");
    }
}

function handleLogout() {
    currentUser = null; 
    localStorage.removeItem('listITUser');
    localStorage.removeItem('listITLastPageId');
    currentPageId = null; currentPageData = null; pages = [];
    clearEditor(); 
    window.location.href = 'login.html';
    if (myPageList) myPageList.innerHTML = ''; 
    if (sharedPageList) sharedPageList.innerHTML = '';
}

async function loadUserPages(searchTerm = '') {
    if (!db || !currentUser) return;
    pages = []; 

    const ownedPagesPromise = new Promise((resolve, reject) => {
        const transaction = db.transaction([PAGES_STORE], 'readonly');
        const store = transaction.objectStore(PAGES_STORE);
        const ownerIndex = store.index('owner');
        const request = ownerIndex.getAll(currentUser);
        request.onsuccess = () => resolve(request.result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        request.onerror = (e) => reject(`Error fetching owned pages: ${e.target.error}`);
    });

    const sharedPagesPromise = new Promise((resolve, reject) => {
        const transaction = db.transaction([SHARES_STORE, PAGES_STORE], 'readonly');
        const sharesStore = transaction.objectStore(SHARES_STORE);
        const pagesStoreRO = transaction.objectStore(PAGES_STORE); 
        const sharedWithIndex = sharesStore.index('sharedWithUser');
        const sharesRequest = sharedWithIndex.getAll(currentUser);
        
        sharesRequest.onsuccess = async () => {
            const shares = sharesRequest.result;
            const pageDetailsPromises = shares.map(share => {
                return new Promise((resolvePage, rejectPage) => {
                    const pageRequest = pagesStoreRO.get(share.pageId);
                    pageRequest.onsuccess = () => {
                        if (pageRequest.result) {
                            resolvePage({...pageRequest.result, accessType: share.accessType, sharedByUser: share.sharedByUser });
                        } else {
                            resolvePage(null); 
                        }
                    };
                    pageRequest.onerror = (e) => rejectPage(`Error fetching page ID ${share.pageId}: ${e.target.error}`);
                });
            });
            try {
                const results = await Promise.all(pageDetailsPromises);
                resolve(results.filter(p => p !== null).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            } catch (error) {
                reject(error);
            }
        };
        sharesRequest.onerror = (e) => reject(`Error fetching shares: ${e.target.error}`);
    });

    try {
        const [owned, shared] = await Promise.all([ownedPagesPromise, sharedPagesPromise]);
        pages = [...owned, ...shared.map(s => ({...s}))]; 
        renderPageList(searchTerm, owned, shared);
        
        if (!searchTerm) {
            const lastPageIdStr = localStorage.getItem('listITLastPageId');
            let pageToLoad = null;
            if (lastPageIdStr) {
                const lastPageId = parseInt(lastPageIdStr);
                pageToLoad = pages.find(p => p.id === lastPageId);
            }

            if (!pageToLoad && pages.length > 0) {
                const allSortedPages = [...owned, ...shared].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                if (allSortedPages.length > 0) pageToLoad = allSortedPages[0];
            }

            if (pageToLoad) {
                loadPage(pageToLoad.id);
            } else if (owned.length === 0 && shared.length === 0) {
                createNewPage(); 
            } else if (!currentPageId && owned.length > 0) {
                loadPage(owned[0].id);
            } else if (!currentPageId && shared.length > 0) {
                loadPage(shared[0].id);
            }
        }
    } catch (error) {
        console.error("Error loading user pages:", error);
    
    }
}

function renderPageList(searchTerm = '', ownedPages, sharedPagesData) {
    if (!myPageList || !sharedPageList) return;
    myPageList.innerHTML = '';
    sharedPageList.innerHTML = '';

    const filterAndRender = (listElement, pageArray, isSharedList) => {
        let filtered = pageArray.filter(page => 
            (page.title && page.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (page.owner && page.owner.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (page.content && typeof page.content === 'string' && page.content.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (isSharedList && page.sharedByUser && page.sharedByUser.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        filtered.forEach(page => {
            const li = document.createElement('li');
            li.textContent = page.title || 'Untitled Note';
            if (isSharedList) {
                li.innerHTML += `<small style="display:block; opacity:0.7;"> (from ${page.sharedByUser || 'Unknown'} - ${page.accessType})</small>`;
            }
            li.dataset.id = page.id;
            if (currentPageId === page.id) li.classList.add('active');
            li.addEventListener('click', () => {
                if (currentPageId && currentPageAccessLevel !== 'view') scheduleSave(true); 
                loadPage(page.id);
            });
            listElement.appendChild(li);
        });
        if (filtered.length === 0 && searchTerm) {
            const li = document.createElement('li');
            li.textContent = "No matching pages found.";
            li.style.cursor = "default"; li.style.opacity = "0.7";
            listElement.appendChild(li);
        } else if (pageArray.length === 0 && !searchTerm) {
            const li = document.createElement('li');
            li.textContent = isSharedList ? "No pages shared with you." : "No pages created yet.";
            li.style.cursor = "default"; li.style.opacity = "0.7";
            listElement.appendChild(li);
        }
    };

    filterAndRender(myPageList, ownedPages, false);
    filterAndRender(sharedPageList, sharedPagesData, true);
}

function createNewPage() {
    if (!db) return alert('Database not ready');
    const newPageData = { 
        owner: currentUser, 
        title: 'Untitled Note', 
        content: '<p><br></p>', 
        drawingData: '', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };
    const transaction = db.transaction([PAGES_STORE], 'readwrite');
    const request = transaction.objectStore(PAGES_STORE).add(newPageData);
    request.onsuccess = (event) => {
        const newId = event.target.result;
        clearEditor(); 
        loadUserPages().then(() => { 
            loadPage(newId); 
        });
    };
    request.onerror = () => alert('Error creating new page');
}

async function loadPage(pageId) {
    if (!db || !noteTitle || !editorCanvas) return;
    const transaction = db.transaction([PAGES_STORE, SHARES_STORE], 'readonly');
    const pageRequest = transaction.objectStore(PAGES_STORE).get(pageId);

    pageRequest.onsuccess = async (event) => {
        const page = event.target.result;
        if (page) {
            currentPageId = page.id;
            currentPageData = {...page}; 
            localStorage.setItem('listITLastPageId', currentPageId); 

            noteTitle.value = page.title;
            editorCanvas.innerHTML = page.content || '<p><br></p>'; 
            if (fontFamilySelect) fontFamilySelect.value = DEFAULT_FONT_FAMILY; 
            makeElementsDeletable(); 
            
            if (ctx && drawingCanvas) {
                ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            }
            
            if (page.drawingData) {
                const img = new Image();
                img.onload = () => {
                    if (ctx && drawingCanvas) {
                        const container = document.querySelector('.canvas-container');
                        if (container) { 
                            drawingCanvas.width = container.clientWidth;
                            drawingCanvas.height = container.clientHeight;
                        }
                        ctx.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height);
                    }
                };
                img.onerror = () => console.error("Failed to load drawing data image.");
                img.src = page.drawingData;
            }
            updateLastSaved(new Date(page.updatedAt));

            const shareRequest = transaction.objectStore(SHARES_STORE).index('pageId_sharedWithUser').get([pageId, currentUser]); 
            shareRequest.onsuccess = (shareEvent) => {
                const userShare = shareEvent.target.result;
                currentPageAccessLevel = userShare ? userShare.accessType : (page.owner === currentUser ? 'owner' : 'view');
                applyAccessRestrictions(currentPageAccessLevel);
                updatePageListActiveState();
                enableWriteMode(); 
                updateFormattingButtonStates(); 
            };
            shareRequest.onerror = () => {
                console.error("Error fetching share info for page " + pageId);
                currentPageAccessLevel = page.owner === currentUser ? 'owner' : 'view';
                applyAccessRestrictions(currentPageAccessLevel);
                updatePageListActiveState();
                enableWriteMode();
                updateFormattingButtonStates();
            };
        } else {
            console.warn("Page with ID " + pageId + " not found. Loading first available page or creating new.");
            localStorage.removeItem('listITLastPageId'); 
            loadUserPages(); 
        }
    };
    pageRequest.onerror = () => alert('Error loading page.');
    updateWordCountAndReadingTime();
}

function updatePageListActiveState() {
    if (myPageList) {
        Array.from(myPageList.children).forEach(li => {
            li.classList.toggle('active', parseInt(li.dataset.id) === currentPageId);
        });
    }
    if (sharedPageList) {
        Array.from(sharedPageList.children).forEach(li => {
            li.classList.toggle('active', parseInt(li.dataset.id) === currentPageId);
        });
    }
}

function applyAccessRestrictions(level) {
    const isViewOnly = (level === 'view');
    const isOwner = (level === 'owner');

    if (editorCanvas) editorCanvas.contentEditable = isViewOnly ? "false" : "true";
    if (noteTitle) noteTitle.disabled = isViewOnly;

    const allToolbarInteractiveElements = document.querySelectorAll(
        '.toolbar button, .toolbar select, .toolbar input[type="color"], .toolbar input[type="range"]'
    );
    allToolbarInteractiveElements.forEach(el => {
        el.disabled = isViewOnly && el.id !== 'download-pdf-btn' && el.id !== 'text-to-speech-btn' && el.id !== 'voice-select';
    });
    
    if (writeBtn) writeBtn.disabled = isViewOnly;
    if (drawBtn) drawBtn.disabled = isViewOnly;
    if (eraseBtn) eraseBtn.disabled = isViewOnly; 
    if (clearDrawBtn) clearDrawBtn.disabled = isViewOnly;

    if (deletePageBtn) deletePageBtn.style.display = isOwner ? 'inline-flex' : 'none';
    if (sharePageBtn) sharePageBtn.style.display = isOwner ? 'inline-flex' : 'none';

    if (isViewOnly) {
        if (drawingCanvas) drawingCanvas.style.pointerEvents = 'none';
        if (currentMode === 'draw' && writeBtn) enableWriteMode(); 
        if (aiToolsGroup) aiToolsGroup.style.display = 'none'; 
        if (textToolsGroup) { /* Disable specific text tools if needed */ }
        if (blockToolsGroup) { /* Disable specific block tools */ }
        if (insertToolsGroup) { /* Disable specific insert tools */ }
    } else {
        if (drawingCanvas) drawingCanvas.style.pointerEvents = (currentMode === 'draw') ? 'auto' : 'none';
        if (aiToolsGroup) aiToolsGroup.style.display = (currentMode === 'write') ? 'flex' : 'none';
    }

    updateModeIndicatorStyle();
    if (editorCanvas) {
        editorCanvas.querySelectorAll('.delete-element-btn').forEach(btn => btn.style.display = isViewOnly ? 'none' : '');
        editorCanvas.querySelectorAll('.sticky-note-toolbar').forEach(toolbar => {
            toolbar.style.display = isViewOnly ? 'none' : (toolbar.closest('.sticky-note.focused') ? 'flex': 'none');
        });
    }
}

function scheduleSave(forceSave = false) {
    if (currentPageAccessLevel === 'view' || !currentPageId) return; 
    clearTimeout(autosaveTimeout);
    if (forceSave) {
        savePage();
    } else { 
        if (lastSavedEl) lastSavedEl.textContent = 'Saving...'; 
        autosaveTimeout = setTimeout(savePage, 1500); 
    }
}

function updatePageTitleAndSave() {
    if (!currentPageId || currentPageAccessLevel === 'view' || !noteTitle) return;
    const pageInPagesArray = pages.find(p => p.id === currentPageId);
    if (pageInPagesArray && pageInPagesArray.title !== noteTitle.value) {
        scheduleSave(); 
        const listItem = document.querySelector(`.page-list li[data-id="${currentPageId}"]`);
        if (listItem) {
            const smallElement = listItem.querySelector('small');
            listItem.textContent = noteTitle.value || 'Untitled Note';
            if (smallElement) listItem.appendChild(smallElement);
        }
    } else if (!pageInPagesArray) { 
        scheduleSave();
    }
}

function savePage() {
    if (!currentPageId || currentPageAccessLevel === 'view' || !db || !noteTitle || !editorCanvas) return;
    
    const pageData = {
        id: currentPageId,
        title: noteTitle.value,
        content: editorCanvas.innerHTML,
        owner: currentPageData.owner, 
        updatedAt: new Date().toISOString(), 
        createdAt: currentPageData.createdAt, 
        drawingData: currentPageData.drawingData 
    };

    if (currentMode === 'draw' && drawingCanvas) {
        pageData.drawingData = drawingCanvas.toDataURL('image/png', 1.0);
    } else if (currentPageData && typeof currentPageData.drawingData !== 'undefined') {
        pageData.drawingData = currentPageData.drawingData; 
    } else {
        pageData.drawingData = ''; 
    }

    const transaction = db.transaction([PAGES_STORE], 'readwrite');
    const store = transaction.objectStore(PAGES_STORE);
    store.put(pageData);

    transaction.oncomplete = () => {
        updateLastSaved(new Date(pageData.updatedAt));
        const pageIndex = pages.findIndex(p => p.id === currentPageId);
        if (pageIndex > -1) {
            pages[pageIndex] = {...pages[pageIndex], ...pageData};
        }
        currentPageData = {...currentPageData, ...pageData}; 
    };
    transaction.onerror = () => {
        if(lastSavedEl) lastSavedEl.textContent = 'Save Failed!';
    }
}

function updateLastSaved(timestamp) { 
    if (!lastSavedEl) return;
    if (!timestamp) { lastSavedEl.textContent = ''; return; }
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) { 
            lastSavedEl.textContent = 'Last saved: Invalid Date'; return;
        }
        lastSavedEl.textContent = `Last Saved: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
        lastSavedEl.textContent = 'Last saved: Error';
    }
}

async function deletePage() {
    if (!currentPageId || currentPageAccessLevel !== 'owner' || !db) {
        alert("You can only delete pages you own."); return;
    }
    const ownedPagesCount = pages.filter(p => p.owner === currentUser).length;
    if (ownedPagesCount <= 1 && !confirm('This is your last owned note. Delete it to create a new blank note?')) return;
    else if (ownedPagesCount > 1 && !confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;

    const pageIdToDelete = currentPageId; 
    const transaction = db.transaction([PAGES_STORE, SHARES_STORE], 'readwrite');
    const pagesStore = transaction.objectStore(PAGES_STORE);
    const sharesStore = transaction.objectStore(SHARES_STORE);

    pagesStore.delete(pageIdToDelete).onerror = () => alert('Error deleting page data.');
    const sharesIndex = sharesStore.index('pageId');
    const sharesCursorRequest = sharesIndex.openCursor(IDBKeyRange.only(pageIdToDelete));
    sharesCursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) { sharesStore.delete(cursor.primaryKey); cursor.continue(); }
    };
    sharesCursorRequest.onerror = () => console.error('Error removing shares for deleted page.');
    transaction.oncomplete = () => {
        pages = pages.filter(p => p.id !== pageIdToDelete);
        currentPageId = null; currentPageData = null;
        clearEditor(); 
        localStorage.removeItem('listITLastPageId'); 
        loadUserPages(); 
    };
    transaction.onerror = (e) => alert('Failed to complete page deletion.');
}

function clearEditor() {
    if (noteTitle) noteTitle.value = ''; 
    if (editorCanvas) editorCanvas.innerHTML = '<p><br></p>'; 
    clearCanvas(false); 
    if (lastSavedEl) lastSavedEl.textContent = '';
    if (fontFamilySelect) fontFamilySelect.value = DEFAULT_FONT_FAMILY;
    updateFormattingButtonStates();
    updateWordCountAndReadingTime();
}

function clearCanvas(saveAfterClearing = true) {
    if (currentPageAccessLevel === 'view' || !ctx || !drawingCanvas) return;
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    if (saveAfterClearing && currentPageId) {
        if(currentPageData) currentPageData.drawingData = ''; 
        scheduleSave();
    }
}

async function openShareModal() {
    if (!currentPageId || !currentPageData || !db) { 
        alert("Please load a page first."); return;
    }
    if (currentPageAccessLevel !== 'owner') { 
         alert("Only the page owner can manage sharing settings."); return;
    }
    if (!shareModalPageTitle || !shareUsernameInput || !shareAccessTypeSelect || !shareErrorMessage || !shareModalOverlay) {
        console.error("Share modal elements not found"); return;
    }
    shareModalPageTitle.textContent = currentPageData.title || 'Untitled Note';
    shareUsernameInput.value = '';
    shareAccessTypeSelect.value = 'view';
    shareErrorMessage.classList.add('hidden'); shareErrorMessage.textContent = ''; 
    if (shareForm) shareForm.style.display = 'block'; 
    await populateCurrentSharesList(currentPageId);
    shareModalOverlay.classList.remove('hidden');
    shareUsernameInput.focus(); 
}

async function populateCurrentSharesList(pageId) {
    if(!currentSharesList || !noSharesMessage || !db) return;
    currentSharesList.innerHTML = ''; 
    noSharesMessage.classList.add('hidden');

    const transaction = db.transaction([SHARES_STORE], 'readonly');
    const sharesStore = transaction.objectStore(SHARES_STORE);
    const pageIdIndex = sharesStore.index('pageId');
    const request = pageIdIndex.getAll(pageId);

    request.onsuccess = () => {
        const shares = request.result;
        if (shares.length === 0) {
            noSharesMessage.classList.remove('hidden'); return;
        }
        shares.forEach(share => {
            const li = document.createElement('li');
            let unshareButtonHTML = `<button class="unshare-btn" data-share-id="${share.shareId}" title="Remove share with ${share.sharedWithUser}"><i class="fas fa-user-minus"></i> <span>Remove</span></button>`;
            li.innerHTML = `<span>${share.sharedWithUser} (${share.accessType})</span> ${unshareButtonHTML}`;
            currentSharesList.appendChild(li);
        });
    };
    request.onerror = () => {
        currentSharesList.innerHTML = '<li>Error loading shares list.</li>';
        noSharesMessage.classList.add('hidden'); 
    }
}

async function handleShareFormSubmit(event) {
    event.preventDefault();
    if (!currentPageId || !db || !shareUsernameInput || !shareAccessTypeSelect || !shareErrorMessage) return;
    if (currentPageAccessLevel !== 'owner') { 
        showErrorInModal(shareForm.closest('.modal-content'), "Only the page owner can share."); return;
    }
    shareErrorMessage.classList.add('hidden'); 
    const targetUsername = shareUsernameInput.value.trim();
    const accessType = shareAccessTypeSelect.value;
    if (!targetUsername) { showErrorInModal(shareForm.closest('.modal-content'), "Username required."); return; }
    if (targetUsername === currentUser) { showErrorInModal(shareForm.closest('.modal-content'), "Cannot share with yourself."); return; }

    const userExists = await new Promise(resolve => {
        const tx = db.transaction(USERS_STORE, 'readonly');
        const req = tx.objectStore(USERS_STORE).get(targetUsername);
        req.onsuccess = () => resolve(!!req.result); req.onerror = () => resolve(false); 
    });
    if (!userExists) { showErrorInModal(shareForm.closest('.modal-content'), `User "${targetUsername}" not found.`); return; }
    
    const existingShare = await new Promise(resolve => {
        const tx = db.transaction(SHARES_STORE, 'readonly');
        const idx = tx.objectStore(SHARES_STORE).index('pageId_sharedWithUser');
        const req = idx.get([currentPageId, targetUsername]);
        req.onsuccess = () => resolve(req.result); req.onerror = () => resolve(null); 
    });
    if (existingShare) { showErrorInModal(shareForm.closest('.modal-content'), `Already shared with ${targetUsername}. Remove existing share to change permissions.`, false); return; }

    const shareData = { pageId: currentPageId, sharedByUser: currentUser, sharedWithUser: targetUsername, accessType: accessType };
    const transaction = db.transaction([SHARES_STORE], 'readwrite');
    const request = transaction.objectStore(SHARES_STORE).add(shareData);
    request.onsuccess = () => { shareUsernameInput.value = ''; populateCurrentSharesList(currentPageId); };
    request.onerror = (e) => {
        let msg = "Failed to share: unexpected error.";
        if (e.target.error.name === 'ConstraintError') msg = `Already shared with ${targetUsername}.`;
        showErrorInModal(shareForm.closest('.modal-content'), msg, false);
    };
}

async function handleUnshareClick(event) {
    if (!db) return;
    const button = event.target.closest('.unshare-btn');
    if (button) {
        if (currentPageAccessLevel !== 'owner') { 
            showErrorInModal(button.closest('.modal-content'), "Only page owner can remove shares."); return;
        }
        const shareId = parseInt(button.dataset.shareId);
        if (isNaN(shareId)) { console.error("Invalid shareId:", button.dataset.shareId); return; }
        if (!confirm("Remove this share?")) return;

        const transaction = db.transaction([SHARES_STORE], 'readwrite');
        const request = transaction.objectStore(SHARES_STORE).delete(shareId);
        request.onsuccess = () => populateCurrentSharesList(currentPageId); 
        request.onerror = () => showErrorInModal(button.closest('.modal-content'), "Failed to remove share.");
    }
}

function showInsertWeatherModal() {
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();

    const weatherForm = document.createElement('form');
    weatherForm.innerHTML = `
        <div class="form-group">
            <label for="weather-city-input">Enter City Name:</label>
            <input type="text" id="weather-city-input" placeholder="e.g., London, New York, Tokyo" required style="background-color: var(--bg-primary); color: var(--text-primary);">
        </div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color);">Get Weather</button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>
    `;
    const { modalOverlay, modal } = createModal('Insert Weather Information', weatherForm);
    const modalContentElement = modal.querySelector('.modal-content');

    weatherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = weatherForm.querySelector('#weather-city-input').value.trim();
        if (!city) return showErrorInModal(modalContentElement, 'City name cannot be empty.');
        
        const submitButton = weatherForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching Weather...';

        try {
            const weatherUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
            const response = await fetch(weatherUrl);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`wttr.in error response for ${city}:`, errorText);
                throw new Error(`HTTP error! Status: ${response.status} for city "${city}". Is the city name correct?`);
            }
            const weatherData = await response.json();
            
            if (weatherData.current_condition && weatherData.current_condition.length > 0) {
                const current = weatherData.current_condition[0];
                const todayWeather = weatherData.weather && weatherData.weather.length > 0 ? weatherData.weather[0] : null;
                const nearestArea = weatherData.nearest_area && weatherData.nearest_area.length > 0 ? weatherData.nearest_area[0] : null;
                const displayCity = nearestArea ? `${nearestArea.areaName[0].value}, ${nearestArea.country[0].value}` : city;

             
                let weatherHtmlString = `<h4>Weather in ${displayCity}</h4>`;
                weatherHtmlString += `<p><strong>Condition:</strong> ${current.weatherDesc[0].value}</p>`;
                weatherHtmlString += `<p><strong>Temperature:</strong> ${current.temp_C}°C (${current.temp_F}°F)</p>`;
                weatherHtmlString += `<p><strong>Feels Like:</strong> ${current.FeelsLikeC}°C (${current.FeelsLikeF}°F)</p>`;
                weatherHtmlString += `<p><strong>Wind:</strong> ${current.windspeedKmph} km/h (${current.winddir16Point})</p>`;
                weatherHtmlString += `<p><strong>Humidity:</strong> ${current.humidity}%</p>`;
                weatherHtmlString += `<p><strong>Pressure:</strong> ${current.pressure} hPa</p>`;

                if (current.precipMM && parseFloat(current.precipMM) > 0) {
                    weatherHtmlString += `<p><strong>Precipitation:</strong> ${current.precipMM} mm</p>`;
                } else {
                    weatherHtmlString += `<p><strong>Precipitation:</strong> None</p>`;
                }

                if (current.visibility) {
                    weatherHtmlString += `<p><strong>Visibility:</strong> ${current.visibility} km</p>`;
                }
                
                if (current.uvIndex) {
                    weatherHtmlString += `<p><strong>UV Index:</strong> ${current.uvIndex}</p>`;
                }

                if (todayWeather) {
                    if (todayWeather.astronomy && todayWeather.astronomy.length > 0) {
                        const astronomy = todayWeather.astronomy[0];
                        weatherHtmlString += `<p><strong>Sunrise:</strong> ${astronomy.sunrise} | <strong>Sunset:</strong> ${astronomy.sunset}</p>`;
                        if (astronomy.moon_phase) {
                            weatherHtmlString += `<p><strong>Moon Phase:</strong> ${astronomy.moon_phase}</p>`;
                        }
                    }
                    weatherHtmlString += `<p><strong>Temp Range (Today):</strong> ${todayWeather.mintempC}°C to ${todayWeather.maxtempC}°C</p>`;
                }
                
                weatherHtmlString += `<p><small><em>Observation Time: ${current.observation_time} (Source: wttr.in)</em></small></p>`;

               
                restoreSelection(); 
                insertHTMLAtCursor(weatherHtmlString); 


                document.body.removeChild(modalOverlay);
            } else {
                console.warn("No current_condition data found for city:", city, weatherData);
                throw new Error('No current weather data found for the specified city. Please check the name.');
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            showErrorInModal(modalContentElement, `Could not fetch weather: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Get Weather';
        }
    });
}

function showGenerateParagraphModal() {
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    const paragraphForm = document.createElement('form');
    paragraphForm.innerHTML = `
        <div class="form-group"><label for="ai-paragraph-prompt">Prompt:</label><input type="text" id="ai-paragraph-prompt" placeholder="e.g., importance of learning" required style="background-color: var(--bg-primary); color: var(--text-primary);"></div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color);">Generate</button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>`;
    const { modalOverlay } = createModal('Generate Paragraph (Gemini AI)', paragraphForm);
    const GEMINI_API_KEY = "AIzaSyA881IcI8OsvAWJNZRE6nQIotqZGw07Bc0"; 
    if (GEMINI_API_KEY.includes("YOUR") || GEMINI_API_KEY.length < 30) {
        showErrorInModal(paragraphForm.closest('.modal-content'), "Invalid Gemini API key."); return;
    }
    paragraphForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = paragraphForm.querySelector('#ai-paragraph-prompt').value.trim();
        if (!prompt) return showErrorInModal(paragraphForm.closest('.modal-content'), 'Prompt empty.');
        const btn = paragraphForm.querySelector('button[type="submit"]');
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ contents: [{ parts: [{ text: `Generate a short paragraph on: "${prompt}". Use simple markdown.` }] }] })
            });
            const data = await res.json();
            if (!res.ok || !data.candidates || !data.candidates[0].content.parts[0].text) {
                throw new Error(data.error ? data.error.message : 'AI error or empty response.');
            }
            let text = data.candidates[0].content.parts[0].text.replace(/```[\w\s]*\n?/g, '').replace(/```\n?/g, '').trim();
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\r\n|\r|\n/g, '<br>');
            const html = `<div class="ai-generated-paragraph deletable-element"><p>${text}</p><small>Generated by Gemini AI</small></div>`;
            restoreSelection(); insertHTMLAtCursor(html); scheduleSave();
            document.body.removeChild(modalOverlay);
        } catch (err) { showErrorInModal(paragraphForm.closest('.modal-content'), `Generation failed: ${err.message}`);
        } finally { btn.disabled = false; btn.innerHTML = 'Generate'; }
    });
}

async function insertAIGeneratedParagraph() {
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    showGenerateParagraphModal(); 
}


function showTranslateTextModal() {
    if (currentPageAccessLevel === 'view') return;
    if (currentMode !== 'write') enableWriteMode();
    saveSelection(); 
    const selectedText = currentSelectionRange ? currentSelectionRange.toString().trim() : "";
    if (!selectedText) { alert("Select text to translate."); return; }

    let langOpts = Object.entries(COMMON_LANGUAGES).map(([c, n]) => `<option value="${c}">${n} (${c})</option>`).join('');
    const form = document.createElement('form');
    form.innerHTML = `
        <div class="form-group"><label>Selected:</label><textarea readonly style="min-height:60px; background-color: var(--bg-tertiary);">${selectedText}</textarea></div>
        <div class="form-group"><label for="tsl">Source Lang:</label><select id="tsl" required style="background-color: var(--bg-primary);">${langOpts}</select></div>
        <div class="form-group"><label for="ttl">Target Lang:</label><select id="ttl" required style="background-color: var(--bg-primary);">${langOpts}</select></div>
        <button type="submit" style="background-color: var(--accent-color); color: var(--button-text-color);">Translate</button>
        <div class="error-alert hidden" style="margin-top:10px;"></div>`;
    const { modalOverlay } = createModal('Translate Text (AI)', form);
    
    let detectedLang = 'en';
    if (selectedText.match(/[\u0400-\u04FF]/)) detectedLang = 'ru'; 
    else if (selectedText.match(/[\u00E0-\u00FC]/)) detectedLang = 'es'; 
    form.querySelector('#tsl').value = detectedLang;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tLang = form.querySelector('#ttl').value;
        const sLang = form.querySelector('#tsl').value;
        if (!tLang || !sLang || sLang === tLang) { showErrorInModal(form.closest('.modal-content'), 'Valid distinct languages required.'); return; }
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(selectedText)}&langpair=${sLang}|${tLang}`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            if (data.responseData && data.responseData.translatedText && !data.responseData.translatedText.toUpperCase().includes("NO QUERY")) {
                restoreSelection(); document.execCommand('insertText', false, data.responseData.translatedText);
                scheduleSave(); document.body.removeChild(modalOverlay);
            } else throw new Error(data.responseDetails || 'Translation failed.');
        } catch (err) { showErrorInModal(form.closest('.modal-content'), `Translate error: ${err.message}`);
        } finally { btn.disabled = false; btn.textContent = 'Translate'; }
    });
}

function toggleHighlight() {
    if (currentPageAccessLevel === 'view' || !highlightBtn || !editorCanvas || !highlightColorPicker) return;
    if (currentMode !== 'write') enableWriteMode();
    restoreSelection();
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
        document.execCommand('hiliteColor', false, highlightColorPicker.value);
        editorCanvas.focus(); saveSelection(); scheduleSave();
    } else if (selection.rangeCount > 0 && selection.isCollapsed) {
        alert("Please select text to highlight.");
    }
    highlightBtn.classList.remove('active');
}

function checkScreenSizeForSidebar() { }

function updateWordCountAndReadingTime() {
    if (!editorCanvas || !document.getElementById('word-count')) return;
    const text = editorCanvas.innerText || "";
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('word-count').textContent = `${wordCount} words`;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

document.getElementById('grammar-check-btn').addEventListener('click', async function() {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) { 
        showNotification('Select text to check grammar.', 'error'); 
        return; 
    }
    
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
    
    this.disabled = true; 
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    
    try {
        const res = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST', 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({ 
                text: selectedText, 
                language: 'en-US' 
            })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.matches && data.matches.length > 0) {
            let suggestions = 'Grammar Issues Found:\n\n';
            const corrections = [];
            
            data.matches.forEach((match, index) => {
                const errorText = selectedText.substring(match.offset, match.offset + match.length);
                suggestions += `${index + 1}. Issue: ${match.message}\n`;
                suggestions += `   Text: "${errorText}"\n`;
                
                if (match.replacements && match.replacements.length > 0) {
                    const correction = match.replacements[0].value;
                    suggestions += `   Suggested fix: "${correction}"\n\n`;
                    corrections.push({ 
                        offset: match.offset, 
                        length: match.length, 
                        replacement: correction,
                        original: errorText
                    });
                } else {
                    suggestions += `   No automatic correction available\n\n`;
                }
            });
            
            showGrammarSuggestions(suggestions, selectedText, corrections, range);
        } else { 
            showNotification('No grammar issues found! ✓', 'success'); 
        }
    } catch (err) { 
        console.error('Grammar check error:', err);
        showNotification('Error checking grammar. Please try again.', 'error');
    } finally { 
        this.disabled = false; 
        this.innerHTML = '<i class="fas fa-spell-check"></i> Check Grammar'; 
    }
});

function showGrammarSuggestions(suggestions, originalText, corrections, originalRange) {
    const modalForm = document.createElement('div');
    modalForm.innerHTML = `
        <div style="white-space: pre-line; margin-bottom: 15px; max-height: 300px; overflow-y: auto; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">${suggestions}</div>
        <div style="text-align: center;">
            <button id="apply-corr-btn" class="action-button" style="background-color:var(--accent-color);color:var(--button-text-color); margin-right: 10px;">
                <i class="fas fa-check"></i> Apply Corrections
            </button>
        </div>`;
    
    const { modalOverlay, modal } = createModal('Grammar Suggestions', modalForm);
    
    modal.querySelector('#apply-corr-btn').onclick = () => {
        try {
            if (originalRange) {

                window.getSelection().removeAllRanges();
                window.getSelection().addRange(originalRange);
                
                let correctedText = originalText;
                corrections
                    .sort((a, b) => b.offset - a.offset)
                    .forEach(correction => {
                        correctedText = correctedText.substring(0, correction.offset) + 
                                       correction.replacement + 
                                       correctedText.substring(correction.offset + correction.length);
                    });
                
                originalRange.deleteContents();
                originalRange.insertNode(document.createTextNode(correctedText));
                
                window.getSelection().removeAllRanges();
                
                if (typeof scheduleSave === 'function') {
                    scheduleSave();
                }
                
                showNotification(`Applied ${corrections.length} correction(s) successfully!`, 'success');
            } else {
                showNotification('Original selection lost. Please select the text again.', 'error');
            }
        } catch (error) {
            console.error('Error applying corrections:', error);
            showNotification('Error applying corrections. Please try again.', 'error');
        }
        
        document.body.removeChild(modalOverlay);
    };
    

    modal.querySelector('#cancel-corr-btn').onclick = () => {
        document.body.removeChild(modalOverlay);
    };
}

const textToSpeechBtn = document.getElementById('text-to-speech-btn');
const voiceSelect = document.getElementById('voice-select');
let speechSynthesis = window.speechSynthesis;
let speaking = false;
let voices = [];

function populateVoiceList() {
    voices = speechSynthesis.getVoices(); voiceSelect.innerHTML = '';
    voices.sort((a,b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name))
          .forEach((v,i) => {
              const opt = document.createElement('option');
              opt.value = i; opt.textContent = `${v.name} (${v.lang})`;
              if (v.default) opt.selected = true;
              voiceSelect.appendChild(opt);
          });
    if (voices.length > 0 && voiceSelect.selectedIndex < 0) voiceSelect.value = '0';
}
if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = populateVoiceList;
populateVoiceList(); 

textToSpeechBtn.addEventListener('click', () => {
    const text = (window.getSelection().toString().trim() || editorCanvas.innerText.trim());
    if (!text) { showNotification('No text to read.', 'error'); return; }
    if (speaking) {
        speechSynthesis.cancel(); speaking = false;
        textToSpeechBtn.classList.remove('active');
        textToSpeechBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Text to Speech</span>';
        return;
    }
    const utt = new SpeechSynthesisUtterance(text);
    if (voices[voiceSelect.value]) utt.voice = voices[voiceSelect.value];
    utt.onstart = () => { speaking = true; textToSpeechBtn.classList.add('active'); textToSpeechBtn.innerHTML = '<i class="fas fa-stop-circle"></i> <span>Stop</span>'; };
    utt.onend = utt.onerror = () => {
        speaking = false; textToSpeechBtn.classList.remove('active');
        textToSpeechBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Text to Speech</span>';
        if (utt.error) showNotification(`Speech error: ${utt.error}`, 'error');
    };
    speechSynthesis.speak(utt);
});

async function handleSummarizeText() {
    if (currentPageAccessLevel === 'view') {
        showNotification("Summarization is not available in view-only mode.", "error");
        return;
    }
    if (currentMode !== 'write') {
        enableWriteMode(); 
    }

    saveSelection();
    const selectedText = currentSelectionRange ? currentSelectionRange.toString().trim() : "";

    if (!selectedText) {
        showNotification("Please select some text in the editor to summarize.", "error");
        return;
    }

    if (!summarizeTextBtn) return; 

    const originalButtonText = summarizeTextBtn.innerHTML;
    summarizeTextBtn.disabled = true;
    summarizeTextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Summarizing...</span>';

    const GEMINI_API_KEY = "AIzaSyA881IcI8OsvAWJNZRE6nQIotqZGw07Bc0"; 

    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE" || (GEMINI_API_KEY === "AIzaSyA881IcI8OsvAWJNZRE6nQIotqZGw07Bc0" && GEMINI_API_KEY.length < 30) ) {
        showNotification("Please configure a valid Gemini API key in the script.js file.", "error");
        summarizeTextBtn.disabled = false;
        summarizeTextBtn.innerHTML = originalButtonText;
        return;
    }

    const modelName = "gemini-1.5-flash-latest";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: `Please summarize the following text concisely. Aim for clarity and brevity. If the text is short, provide a very brief summary. If it's longer, try to capture the main points in 2-4 sentences or a few bullet points if that's more appropriate. Use simple markdown for formatting if needed (like **bold** or *italic* or * bullet points). Text to summarize:\n\n"${selectedText}"`
            }]
        }],
        generationConfig: {
            // temperature: 0.3,
            // maxOutputTokens: 150,
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (!response.ok) {
            let errorMessage = `AI API Error: ${response.status}`;
            if (responseData && responseData.error && responseData.error.message) {
                errorMessage += ` - ${responseData.error.message}`;
            } else if (typeof responseData === 'string') {
                errorMessage += ` - ${responseData}`;
            }
            throw new Error(errorMessage);
        }

        if (responseData.candidates && responseData.candidates.length > 0 &&
            responseData.candidates[0].content && responseData.candidates[0].content.parts &&
            responseData.candidates[0].content.parts.length > 0 &&
            responseData.candidates[0].content.parts[0].text) {

            let rawGeneratedText = responseData.candidates[0].content.parts[0].text;
            rawGeneratedText = rawGeneratedText.replace(/```[\w\s]*\n?/g, '').replace(/```\n?/g, '');
            const trimmedText = rawGeneratedText.trim();
            
            let formattedTextFromMarkdown = trimmedText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            formattedTextFromMarkdown = formattedTextFromMarkdown.split('\n').map(line => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {

                    return `<li>${trimmedLine.substring(2).trim()}</li>`;
                }
                return line; 
            }).join('\n');
             
            let finalFormattedHtml;
            if (formattedTextFromMarkdown.includes('<li>')) {
                 finalFormattedHtml = `<ul>${
                    formattedTextFromMarkdown.split('\n')
                        .map(line => line.trim()) 
                        .filter(line => line.startsWith('<li>') && line.length > '<li></li>'.length) 
                        .join('') 
                 }</ul>`;
                 if (finalFormattedHtml === "<ul></ul>") { 
                    finalFormattedHtml = `<p>${trimmedText.replace(/\n/g, '<br>')}</p>`; 
                 }
            } else {
                 finalFormattedHtml = `<p>${formattedTextFromMarkdown.replace(/\n/g, '<br>')}</p>`;
            }

            const attributionHtml = `<small>Summarized by Google Gemini AI</small>`;
            const summaryHtml = `<div class="ai-generated-summary deletable-element"><h4>AI Summary:</h4>${finalFormattedHtml}${attributionHtml}</div>`;
            
            if (editorCanvas) editorCanvas.focus();
            restoreSelection(); 

            if (currentSelectionRange && selectedText) { 
                const sel = window.getSelection();

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = summaryHtml;
                const summaryNodeToInsert = tempDiv.firstChild;

                if (summaryNodeToInsert) {

                    const insertionRange = currentSelectionRange.cloneRange();
                    insertionRange.collapse(false); 
                    insertionRange.insertNode(summaryNodeToInsert);

                    if (sel) {
                        sel.removeAllRanges();
                        const newCursorRange = document.createRange();
                        newCursorRange.setStartAfter(summaryNodeToInsert);
                        newCursorRange.collapse(true);
                        sel.addRange(newCursorRange);
                    }
                    
                    makeElementsDeletable();
                    scheduleSave();
                    showNotification("Summary generated and inserted after selection!", "success");
                } else {
                    console.error("Failed to create summary DOM node from HTML.");
                    showNotification("Error: Could not prepare summary for insertion.", "error");
                }
            } else {
                console.warn("Cannot insert summary: selection information is missing or invalid post-generation.");
                showNotification("Error: Could not determine where to insert summary. Please try selecting text again.", "error");
            }

        } else if (responseData.promptFeedback && responseData.promptFeedback.blockReason) {
            throw new Error(`Prompt was blocked. Reason: ${responseData.promptFeedback.blockReason}.`);
        } else {
            console.error("Unexpected AI API response for summary:", responseData);
            throw new Error('AI generated an empty or unreadable summary.');
        }

    } catch (error) {
        console.error("Error summarizing text with Gemini:", error);
        showNotification(`Could not summarize: ${error.message}`, "error");
    } finally {
        summarizeTextBtn.disabled = false;
        summarizeTextBtn.innerHTML = originalButtonText;
    }
}

function handleCanvasTemplate(template) {
    const editorCanvas = document.getElementById('editor-canvas');
    if (!editorCanvas) return;
    
    switch(template) {
        case 'time-schedule':
            editorCanvas.innerHTML = `
                <h2>Daily Schedule</h2>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <th style="border: 1px solid var(--border-color); padding: 10px;">Time</th>
                        <th style="border: 1px solid var(--border-color); padding: 10px;">Activity</th>
                        <th style="border: 1px solid var(--border-color); padding: 10px;">Notes</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid var(--border-color); padding: 10px;">9:00 AM</td>
                        <td style="border: 1px solid var(--border-color); padding: 10px;"></td>
                        <td style="border: 1px solid var(--border-color); padding: 10px;"></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid var(--border-color); padding: 10px;">10:00 AM</td>
                        <td style="border: 1px solid var(--border-color); padding: 10px;"></td>
                        <td style="border: 1px solid var(--border-color); padding: 10px;"></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid var(--border-color); padding: 10px;">11:00 AM</td>
                        <td style="border: 1px solid var(--border-color); padding: 10px;"></td>
                        <td style="border: 1px solid var(--border-color); padding: 10px;"></td>
                    </tr>
                </table>
            `;
            break;
            
        case 'office-work':
            editorCanvas.innerHTML = `
                <h2>Office Work Template</h2>
                <div style="margin: 20px 0;">
                    <h3>Tasks</h3>
                    <div class="checkbox-container">
                        <input type="checkbox" id="task1">
                        <label for="task1">Review emails</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="task2">
                        <label for="task2">Team meeting</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="task3">
                        <label for="task3">Project updates</label>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <h3>Notes</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
            `;
            break;
            
        case 'homework':
            editorCanvas.innerHTML = `
                <h2>Homework Template</h2>
                <div style="margin: 20px 0;">
                    <h3>Subject: </h3>
                    <div contenteditable="true" style="min-height: 50px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Assignment Details:</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Due Date: </h3>
                    <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
            `;
            break;

        case 'meeting-notes':
            editorCanvas.innerHTML = `
                <h2>Meeting Notes</h2>
                <div style="margin: 20px 0;">
                    <h3>Meeting Details</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>Date:</strong> <span contenteditable="true" style="display: inline-block; min-width: 100px; border-bottom: 1px solid var(--border-color);"></span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Attendees:</strong>
                        <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Agenda:</strong>
                        <div contenteditable="true" style="min-height: 50px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <h3>Discussion Points</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
                <div style="margin: 20px 0;">
                    <h3>Action Items</h3>
                    <div class="checkbox-container">
                        <input type="checkbox" id="action1">
                        <label for="action1">Action item 1</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="action2">
                        <label for="action2">Action item 2</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="action3">
                        <label for="action3">Action item 3</label>
                    </div>
                </div>
            `;
            break;

        case 'project-plan':
            editorCanvas.innerHTML = `
                <h2>Project Plan</h2>
                <div style="margin: 20px 0;">
                    <h3>Project Overview</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>Project Name:</strong> <span contenteditable="true" style="display: inline-block; min-width: 200px; border-bottom: 1px solid var(--border-color);"></span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Start Date:</strong> <span contenteditable="true" style="display: inline-block; min-width: 100px; border-bottom: 1px solid var(--border-color);"></span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>End Date:</strong> <span contenteditable="true" style="display: inline-block; min-width: 100px; border-bottom: 1px solid var(--border-color);"></span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Project Description:</strong>
                        <div contenteditable="true" style="min-height: 50px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <h3>Project Phases</h3>
                    <div style="margin-bottom: 15px;">
                        <h4>Phase 1: Planning</h4>
                        <div contenteditable="true" style="min-height: 50px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <h4>Phase 2: Development</h4>
                        <div contenteditable="true" style="min-height: 50px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <h4>Phase 3: Testing</h4>
                        <div contenteditable="true" style="min-height: 50px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <h3>Resources & Budget</h3>
                    <div contenteditable="true" style="min-height: 50px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
            `;
            break;

        case 'study-notes':
            editorCanvas.innerHTML = `
                <h2>Study Notes</h2>
                <div style="margin: 20px 0;">
                    <h3>Topic: </h3>
                    <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Key Concepts:</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Important Definitions:</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Examples:</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Practice Questions:</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
            `;
            break;

        case 'research-paper':
            editorCanvas.innerHTML = `
                <h2>Research Paper Template</h2>
                <div style="margin: 20px 0;">
                    <h3>Title</h3>
                    <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Abstract</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Introduction</h3>
                    <div contenteditable="true" style="min-height: 150px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Literature Review</h3>
                    <div contenteditable="true" style="min-height: 150px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Methodology</h3>
                    <div contenteditable="true" style="min-height: 150px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Results</h3>
                    <div contenteditable="true" style="min-height: 150px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Discussion</h3>
                    <div contenteditable="true" style="min-height: 150px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Conclusion</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>References</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
            `;
            break;

        case 'recipe':
            editorCanvas.innerHTML = `
                <h2>Recipe Template</h2>
                <div style="margin: 20px 0;">
                    <h3>Recipe Name</h3>
                    <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Preparation Time</h3>
                    <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Cooking Time</h3>
                    <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Servings</h3>
                    <div contenteditable="true" style="min-height: 30px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Ingredients</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Instructions</h3>
                    <div contenteditable="true" style="min-height: 200px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                    
                    <h3>Notes</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
            `;
            break;

        case 'travel-planner':
            editorCanvas.innerHTML = `
                <h2>Travel Planner</h2>
                <div style="margin: 20px 0;">
                    <h3>Trip Details</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>Destination:</strong> <span contenteditable="true" style="display: inline-block; min-width: 200px; border-bottom: 1px solid var(--border-color);"></span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Dates:</strong> <span contenteditable="true" style="display: inline-block; min-width: 200px; border-bottom: 1px solid var(--border-color);"></span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Budget:</strong> <span contenteditable="true" style="display: inline-block; min-width: 150px; border-bottom: 1px solid var(--border-color);"></span>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Accommodation</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Transportation</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Itinerary</h3>
                    <div contenteditable="true" style="min-height: 200px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px; margin-bottom: 20px;"></div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Packing List</h3>
                    <div class="checkbox-container">
                        <input type="checkbox" id="pack1">
                        <label for="pack1">Clothes</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="pack2">
                        <label for="pack2">Toiletries</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="pack3">
                        <label for="pack3">Documents</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="pack4">
                        <label for="pack4">Electronics</label>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Notes & Reminders</h3>
                    <div contenteditable="true" style="min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 5px;"></div>
                </div>
            `;
            break;
    }
    // Save the changes
    scheduleSave();
}


window.addEventListener('load', init);
window.addEventListener('resize', resizeCanvas);