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
                "notion": "https://www.notion.so",
                "github": "https://www.github.com",
                "gpt": "https://chat.openai.com",
                "medium": "https://www.medium.com",
                "chemwebapp": "https://github.com/cics-web-dev/Chem-Web-App",
            }

            const url = websites[site];
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
            console.log('  $ openSite open google');
            console.log('  $ openSite open notion');
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