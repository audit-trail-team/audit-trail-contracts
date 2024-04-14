import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

require('dotenv').config();

const privateKey = randomBytes(32);
// Key should be appropriate for the AES variant you choose: AES-256 uses a 32-byte key.
const algorithm = 'aes-256-ctr';

// Function to encrypt text
export function encrypt(text: string, index: number) {
    // create buffer of length 16 with the index as the value
    const iv = Buffer.alloc(16);
    iv.writeUInt16BE(index, 0);
    const cipher = createCipheriv(algorithm, privateKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}



export function sha256(input: string) {
    return createHash('sha256').update(input).digest('hex').substring(0, 32);
}
