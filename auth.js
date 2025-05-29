const loginFormEl = document.getElementById('login-form');
const registerFormEl = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');

let db;
const DB_NAME = 'ListITSharedV1_DB';
const DB_VERSION = 1; 
const USERS_STORE = 'users';
const PAGES_STORE = 'pages'; 
const SHARES_STORE = 'shares'; 

function initAuthPage() {
    initIndexedDB(setupAuthForms);
}

function initIndexedDB(callback) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => console.error('Error opening database:', event.target.error);
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log('Database opened successfully for auth');
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

function setupAuthForms() {
    if (loginFormEl && loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    if (registerFormEl && registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
}

function handleLogin() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) return showErrorInModal(loginFormEl, 'Please enter username and password');
    
    if (!db) {
        showErrorInModal(loginFormEl, 'Database not ready. Please wait and try again.');
        initIndexedDB(() => handleLogin());
        return;
    }

    const transaction = db.transaction([USERS_STORE], 'readonly');
    const request = transaction.objectStore(USERS_STORE).get(username);
    
    request.onsuccess = (event) => {
        const user = event.target.result;
        if (user && user.password === password) { 
            localStorage.setItem('listITUser', username);
            window.location.href = 'workspace.html';
        } else {
            showErrorInModal(loginFormEl,'Invalid username or password');
        }
    };
    request.onerror = () => showErrorInModal(loginFormEl,'Error during login');
}

function handleRegister() {
    const usernameInput = document.getElementById('register-username');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');

    if (!usernameInput || !passwordInput || !confirmPasswordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!username || !password) return showErrorInModal(registerFormEl,'Please enter username and password');
    if (password.length < 6) return showErrorInModal(registerFormEl, 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return showErrorInModal(registerFormEl,'Passwords do not match');

    if (!db) {
        showErrorInModal(registerFormEl, 'Database not ready. Please wait and try again.');
        initIndexedDB(() => handleRegister()); 
        return;
    }
    
    const transaction = db.transaction([USERS_STORE], 'readwrite');
    const usersStore = transaction.objectStore(USERS_STORE);
    const checkRequest = usersStore.get(username);

    checkRequest.onsuccess = (event) => {
        if (event.target.result) return showErrorInModal(registerFormEl,'Username already exists');
        
        const addRequest = usersStore.add({ username, password }); 
        addRequest.onsuccess = () => { 
            alert('Registration successful! Please login.'); 
            window.location.href = 'login.html';
        };
        addRequest.onerror = () => showErrorInModal(registerFormEl,'Error during registration');
    };
    checkRequest.onerror = () => showErrorInModal(registerFormEl,'Error checking username');
}

function showErrorInModal(formElement, message) {
    let errorEl;
    if (formElement) {
            errorEl = formElement.querySelector('.error-alert');
    }

    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        setTimeout(() => { errorEl.classList.add('hidden'); errorEl.textContent = ''; }, 5000);
    } else if (formElement) { 
            let tempErrorContainer = formElement.querySelector('.error-alert-temp');
            if (!tempErrorContainer) { 
                tempErrorContainer = document.createElement('div'); 
                tempErrorContainer.className = 'error-alert error-alert-temp hidden'; 
                const submitButton = formElement.querySelector('button[id$="-btn"]'); 
                if (submitButton && submitButton.parentElement) {
                    submitButton.parentElement.insertBefore(tempErrorContainer, submitButton.nextSibling);
                } else {
                formElement.appendChild(tempErrorContainer);
                }
            }
            tempErrorContainer.textContent = message;
            tempErrorContainer.classList.remove('hidden');
            setTimeout(() => { if (tempErrorContainer) tempErrorContainer.classList.add('hidden'); }, 5000);
    } else {
        alert(message); 
    }
}

window.addEventListener('load', initAuthPage);