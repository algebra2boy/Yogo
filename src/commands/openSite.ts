import { Command } from 'commander';
import { exec } from 'child_process';

interface Websites {
    [key: string]: string;
}

export function openSite(program: Command) {
    program
        .command('open <site>')
        .description('Open a specific website in the default browser')
        .action((site: string) => {
            const websites: Websites = {
                "google": "https://www.google.com",
            }

            const url = websites[site];
            if (url) {
                console.log(`Opening ${site} at ${url}`);
                openBrowser(url);
            } else {
                console.error(`The site ${site} is not supported`);
            }
        })
}

/*
    * The openBrowser function is used to open a URL in the default browser.
    * It takes a single argument, the URL to open.
    * The function uses the exec function from the child_process module to execute a command based on the platform.
    * The command is constructed based on the platform, using open for macOS, start for Windows, and xdg-open for Linux.
    * If the platform is not supported, an error message is logged to the console.
    */
export function openBrowser(url: string) {
    switch (process.platform) {
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