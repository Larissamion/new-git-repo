# 🔒 Secure Text Encryptor

A client-side web application that allows you to securely encrypt and decrypt text using the Web Crypto API. All encryption/decryption happens in your browser - no data is sent to any server.

## Features

- **End-to-End Encryption**: Uses AES-GCM 256-bit encryption
- **Password-Based**: Securely derives encryption keys from your password
- **Client-Side**: All processing happens in your browser
- **No Dependencies**: Pure JavaScript with Web Crypto API
- **Responsive Design**: Works on both desktop and mobile devices

## How It Works

1. Enter your text in the input area
2. Provide a strong password (remember this for decryption)
3. Click "Encrypt" to encrypt your text
4. To decrypt, paste the encrypted text, enter the same password, and click "Decrypt"

## Security Notes

- The encryption key is derived from your password using PBKDF2 with 100,000 iterations
- A random salt and initialization vector (IV) are generated for each encryption
- The encrypted output includes the salt and IV needed for decryption
- Your password is never stored or transmitted anywhere

## Browser Support

This application requires a modern browser with support for:
- Web Crypto API
- ES6+ JavaScript

## Usage

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No installation or server required!

## Keyboard Shortcuts

- **Ctrl+Enter**: Encrypt text
- **Ctrl+Shift+Enter**: Decrypt text

## License

This project is open source and available under The [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This tool is provided for educational and personal use. While it uses strong encryption, the authors make no guarantees about the security of your data. Use at your own risk.
