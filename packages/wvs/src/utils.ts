import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';

export const loadFile = (path: string): any => {
    if (existsSync(path)) {
        const rawData = readFileSync(path, 'utf8');
        return JSON.parse(rawData);
    } else {
        throw new Error(`File not found: ${path}`);
    }
}

export const saveFile = (path: string, data: any): void => {
    const dirPath = join(path, '..');
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data written to ${path}`);
}

export const removeFile = (path: string): void => {
    try {
        if (existsSync(path)) {
            unlinkSync(path);
            console.log(`Data deleted from ${path}`);
        }
    } catch (err) {
        console.error(err);
    }
};