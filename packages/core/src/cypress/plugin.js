import path from 'path';
import fs from 'fs';

export const addPlugin = on => {
    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            let extensionPath = path.join(__dirname, '../../../browser-extension/build');

            if (!fs.existsSync(extensionPath)) {
                extensionPath = path.resolve('../browser-extension');
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
