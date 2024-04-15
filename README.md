# Yogo 

Yogo is a simple command line tool written in Node.js that provides shortcut to many platforms.

## Installation

To install Yogo, make sure you have Node.js installed on your machine. Then, you can install Yogo globally using npm:
```
git clone https://github.com/algebra2boy/Yogo
cd Yogo
npm run build
npm link 
```

## Command line
1. `yogo -v` or `yogo --version`: outputs the current version
2. `yogo -h` or `yogo --help`: lists all the command and flags
3. `yogo open <site>`
    - Allows you to open your desired website without visiting a browser.
    - Currently supports three operating system: macOS, Windows, and Linux. 
    - You can add any website shortcut and its url in `src/commands/openSite/websiteURL.ts`.
```
# Examples
$ yogo open canvas
$ yogo open notion
$ yogo open gpt
```

4. To check your GitHub contributions, use the following command:
```
yogo contribution [options]
```

Options:
- `-a, --all`: Get total contributions on GitHub calendar.
- `-n, --name <name>`: Specify your GitHub username.
- `--today`: Get today's contributions.
- `--week`: Get this week's contributions.
- `--month`: Get this month's contributions (excluding the current week).
- `-c, --count <count>`: Get the number of contributions for the first/last n week(s) on the calendar.
- `-f, --filter <filter>`: Filter by the number of contributions on the calendar.

```
Examples:
# To get the total contributions for a user:
$ yogo contribution --name <github username> -a

# To get today contributions for a user:
$ yogo contribution --name <github username> --today

# To get contributions for current week:
$ yogo contribution --name <github username> --week 

# To get contributions for last four weeks/one month:
$ yogo contribution --name <github username> --month 

# To get contributions for a specific number of weeks:
$ yogo contribution --name <github username> -c 3
$ yogo contribution --name <github username> --count -2

# To filter contribution
$ yogo contribution --name <github username> -f 20
```

## Important Link
- I learned how to fetch the Github API using graphQL query. The Github GraphQL explorer was very useful for me to visualize graphQL query schema and its documentation was robust and easy to understand.
    - https://docs.github.com/en/graphql/guides/using-the-explorer
    - https://docs.github.com/en/graphql/overview/explorer
