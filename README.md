# Yogo 

Yogo is a simple command line tool written in Node.js that provides shortcut to many platforms.

## Installation

To install Yogo, make sure you have Node.js installed on your machine. Then, you can install Yogo globally using npm:
```bash
git clone https://github.com/algebra2boy/Yogo
cd Yogo
npm run build
npm link 
```

## Command line
1. `yo -v` or `yo --version`: outputs the current version
2. `yo -h` or `yo --help`: lists all the command and flags
3. `yo open <site>`
    - Allows you to open your desired website without visiting a browser.
    - Currently supports three operating system: macOS, Windows, and Linux. 
    - You can add any website shortcut and its url in `src/commands/openSite/websiteURL.ts`.
```bash
# Examples
yo open canvas
yo open notion
yo open gpt
```

4. To check your GitHub contributions, use the following command:
```
yo contribution [options]
```

Options:
- `-a, --all`: Get total contributions on GitHub calendar.
- `-n, --name <name>`: Specify your GitHub username.
- `--today`: Get today's contributions.
- `--week`: Get this week's contributions.
- `--month`: Get this month's contributions (excluding the current week).
- `-c, --count <count>`: Get the number of contributions for the first/last n week(s) on the calendar.
- `-f, --filter <filter>`: Filter by the number of contributions on the calendar.

```bash
Examples:
# To get the total contributions for a user:
yo contribution --name <github username> -a

# To get today contributions for a user:
yo contribution --name <github username> --today

# To get contributions for current week:
yo contribution --name <github username> --week 

# To get contributions for last four weeks/one month:
yo contribution --name <github username> --month 

# To get contributions for a specific number of weeks:
yo contribution --name <github username> -c 3
yo contribution --name <github username> --count -2

# To filter contribution
yo contribution --name <github username> -f 20
```

5. To generate an image using OpenAI Dall-E3:
- Images will be stored in the `images` folder.
- Ora is used for the spinning wheel, and inquirer is used for I/O. 
- You will be asked to give a prompt, size of image, quality of an image.
- You will also have an option to save the image locally or not.
```
yo image
```

## Important Link
- I learned how to fetch the Github API using graphQL query. The Github GraphQL explorer was very useful for me to visualize graphQL query schema and its documentation was robust and easy to understand.
    - https://docs.github.com/en/graphql/guides/using-the-explorer
    - https://docs.github.com/en/graphql/overview/explorer
- DallE-3 image generation API documentation: https://platform.openai.com/docs/guides/images?context=node

## Permission Denied 
It is possible that you need to manually grant write access to exectute the file.
```bash
cd /home/codespace/nvm/current/bin/
chmod +x yo
```