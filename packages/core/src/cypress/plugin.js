import path from 'path';
import fs from 'fs';

export const addPlugin = on => {
    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            const extensionPath = path.join(__dirname, '../browser-extension');

            if (!fs.existsSync(extensionPath)) {
                throw new Error(`Cannot find browser-extension directory at ${extensionPath}`);
            }

            launchOptions.extensions.push(extensionPath);
            launchOptions.args.push('--auto-open-devtools-for-tabs');
            launchOptions.args.push('--enable-logging');
            launchOptions.args.push('--v=1');
            return launchOptions;
        }
    });

    on('task', {
        saveSessionRecording({ fileName, content }) {
            const filePath = path.join(process.cwd(), './flows/', fileName);
            fs.writeFileSync(filePath, content);

            return null;
        },
    });
};
