import { Command } from 'commander';
import { websites, Websites } from './websiteURL.js';
import { exec } from 'child_process';

export function openSite(program: Command): void {
    program
        .command('open <site>')
        .description('Open a specific website in the default browser')
        .action((site: string) => {

            const url = websites[site as keyof Websites];
            if (url) {
                console.log(`Opening ${site} at ${url}`);
                openBrowser(url);
            } else {
                console.error(`The site ${site} is not supported`);
                console.error('Supported sites are: ' + Object.keys(websites).join('|'));
            }
        })
        .on('--help', () => {
            console.log('');
            console.log('Examples:');
            console.log('  $ yo open google');
            console.log('  $ yo open notion');
        });
}

/*
    * The openBrowser function is used to open a URL in the default browser.
    * It takes a single argument, the URL to open.
    * The function uses the exec function from the child_process module to execute a command based on the platform.
    * The child_process module enables us to access Operating System functionalities by running any system command inside a child process.
    * The command is constructed based on the platform, using open for macOS, start for Windows, and xdg-open for Linux.
    * If the platform is not supported, an error message is logged to the console.
    */
export function openBrowser(url: string) {
    switch (process.platform) { // find the platform
        case 'darwin': // apple
            exec(`open ${url}`);
            break;
        case 'win32':
            exec(`start ${url}`);
            break;
        case 'linux':
            exec(`xdg-open ${url}`);
            break;
        default:
            console.error('Unsupported platform');
    }
}