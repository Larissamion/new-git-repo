// Encryption/Decryption using Web Crypto API

// DOM Elements
const textInput = document.getElementById('text-input');
const keyInput = document.getElementById('key-input');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const resultOutput = document.getElementById('result-output');
const resultGroup = document.getElementById('result-group');
const statusEl = document.getElementById('status');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    encryptBtn.addEventListener('click', handleEncrypt);
    decryptBtn.addEventListener('click', handleDecrypt);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearAll);
    
    // Enable copy button only when there's text in the result
    resultOutput.addEventListener('input', () => {
        copyBtn.disabled = !resultOutput.value.trim();
    });
});

// Generate encryption key from password
async function getKeyMaterial(password) {
    const enc = new TextEncoder();
    return await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );
}

// Derive a secure key from the password
async function getKey(keyMaterial, salt) {
    return await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// Show status message
function showStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.className = 'status ' + (isError ? 'error' : 'success');
    setTimeout(() => {
        statusEl.className = 'status';
    }, 5000);
}

// Encrypt function
async function encryptData(text, password) {
    try {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        const keyMaterial = await getKeyMaterial(password);
        const key = await getKey(keyMaterial, salt);
        
        const encoded = new TextEncoder().encode(text);
        const encryptedContent = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoded
        );
        
        // Combine salt, iv, and encrypted data
        const encryptedArray = new Uint8Array(encryptedContent);
        const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
        combined.set(salt);
        combined.set(iv, salt.length);
        combined.set(encryptedArray, salt.length + iv.length);
        
        // Convert to base64 for easy storage/transmission
        return btoa(String.fromCharCode.apply(null, combined));
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed. Please try again.');
    }
}

// Decrypt function
async function decryptData(encryptedData, password) {
    try {
        // Convert from base64
        const binaryString = atob(encryptedData);
        const binaryData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            binaryData[i] = binaryString.charCodeAt(i);
        }
        
        // Extract salt, iv, and encrypted content
        const salt = binaryData.slice(0, 16);
        const iv = binaryData.slice(16, 28);
        const encrypted = binaryData.slice(28);
        
        const keyMaterial = await getKeyMaterial(password);
        const key = await getKey(keyMaterial, salt);
        
        const decryptedContent = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encrypted
        );
        
        return new TextDecoder().decode(decryptedContent);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed. Please check your key and try again.');
    }
}

// Handle encryption button click
async function handleEncrypt() {
    const text = textInput.value.trim();
    const password = keyInput.value.trim();
    
    if (!text) {
        showStatus('Please enter some text to encrypt', true);
        return;
    }
    
    if (!password) {
        showStatus('Please enter an encryption key', true);
        return;
    }
    
    try {
        const encrypted = await encryptData(text, password);
        resultOutput.value = encrypted;
        resultGroup.style.display = 'block';
        showStatus('Text encrypted successfully!');
    } catch (error) {
        showStatus(error.message, true);
    }
}

// Handle decryption button click
async function handleDecrypt() {
    const text = textInput.value.trim();
    const password = keyInput.value.trim();
    
    if (!text) {
        showStatus('Please enter some text to decrypt', true);
        return;
    }
    
    if (!password) {
        showStatus('Please enter the decryption key', true);
        return;
    }
    
    try {
        const decrypted = await decryptData(text, password);
        resultOutput.value = decrypted;
        resultGroup.style.display = 'block';
        showStatus('Text decrypted successfully!');
    } catch (error) {
        showStatus(error.message, true);
    }
}

// Copy result to clipboard
function copyToClipboard() {
    resultOutput.select();
    document.execCommand('copy');
    showStatus('Copied to clipboard!');
}

// Clear all inputs
function clearAll() {
    textInput.value = '';
    resultOutput.value = '';
    keyInput.value = '';
    resultGroup.style.display = 'none';
    textInput.focus();
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter to encrypt
    if (e.ctrlKey && e.key === 'Enter') {
        handleEncrypt();
    }
    // Ctrl+Shift+Enter to decrypt
    if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
        handleDecrypt();
    }
});
