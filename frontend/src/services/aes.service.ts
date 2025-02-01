import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { environment } from "../environment/environment";


@Injectable({ providedIn: 'root' })
export class AesService{
    private key = '01234567890123456789012345678901';

    encrypt(text: string): string {
        var key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
        var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
        var encrypted = CryptoJS.AES.encrypt(text, key, {iv: iv});
        return encrypted.toString();
    }

    decrypt(encryptedText: string) {
        var key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
        var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
        var decrypted = CryptoJS.AES.decrypt(encryptedText, key, {iv: iv});
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}