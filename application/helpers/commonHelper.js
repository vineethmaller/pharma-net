'use strict';

const fs = require('fs');

class CommonHelper {

    /**
     * 
     * @param {*} privateKeyDirPath 
     * @returns 
     */
    static getPrivateKeyFullPathFromDir(privateKeyDirPath) {
    
        const files = fs.readdirSync(privateKeyDirPath);
        let privateKeyFileName = files.find(fileName => fileName.endsWith('_sk'));
    
        if(privateKeyFileName === undefined) {
            throw new Error('Private key not found');
        }
    
        return privateKeyDirPath + '/' + privateKeyFileName;
    }
    
}

module.exports = { CommonHelper };