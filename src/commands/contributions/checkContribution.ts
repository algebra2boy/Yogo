import { Command } from 'commander';
import fetch from 'node-fetch'; // fetch is not supported prior nodejs.18 but i am using nodejs.17 

export function contribution(program: Command) {
    program
        .command('contribution')
        .description('Check your number of contribution on GitHub contribution calendar.')
        .option('-a, --all', 'Get total contributions on GitHub calendar.') // works for both -a or --all
        .option('-n, --name <name>', 'Specify your name.') // works for both -n or --name
        .option('--today', 'Get today\'s contributions.')
        .option('--week', 'Get this week\'s contributions.')
        .action(async (options) => {
            console.log("Checking your contributions...");

            if (!isOptionsValid(options)) {
                program.help(); // Display the help information (automatically exits the program)
            }

            if (options.all) {
                const totalContributions = await getTotalContributions(options.name);
                console.log(`Total contributions on GitHub calendar for ${options.name}: ${totalContributions}`);
            } else if (options.today) {
                const todayContributions = await getTodayContributions(options.name);
                console.log(`Today contributions on GitHub calendar for ${options.name}: ${todayContributions}`);
            } else if (options.thisWeek) {
                console.log("This week's contributions are not implemented yet.");
            }



        })
        .on('--help', () => {
            console.log('');
            console.log('Examples:');
            console.log('  $ yogo contribution -a --name <github name>');
        });
}

interface Options {
    all?: boolean;
    name?: string;
    today?: boolean;
    week?: boolean;
}

/**
 * Commander.js does not provide support for checking if the options are valid or not.
 * We would need to check if user inputs are provieded or not.
 */
function isOptionsValid(options: Options): boolean {
    const { all, name, today, week } = options;

    if (!name) {
        console.log("Please provide a GitHub username using --name <github name>.\n");
        return false;
    }

    if (!all && !today && !week) {
        console.log("Please specify one of the following options: -a/--all, --today, or --week.\n");
        return false;
    }

    return true;
}

async function setUpGraphQLRequest(userName: string) {

    if (!process.env.GITHUB_TOKEN) {
        console.log("Please provide a GitHub token in the .env file");
        console.log("Set up env variable in your OS: https://www.cyberciti.biz/faq/linux-list-all-environment-variables-env-command/")
        process.exit(1);
    }

    const githubAPI = "https://api.github.com/graphql";
    const token = process.env.GITHUB_TOKEN;

    const query = `
    query($userName:String!) { 
        user(login: $userName){
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const variables = { userName };

    const requestBody = JSON.stringify({ query, variables });

    const request = await fetch(githubAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: requestBody
    });

    const response = await request.json();
    return response;
}

async function getTotalContributions(userName: string): Promise<number> {
    const response: any = await setUpGraphQLRequest(userName);
    const totalContributions = response.data.user?.contributionsCollection?.contributionCalendar?.totalContributions;

    if (!totalContributions) {
        console.log(`No contributions are found for ${userName}.`);
        process.exit(1);
    }

    return totalContributions;
}

async function getTodayContributions(userName: string) {
    const response: any = await setUpGraphQLRequest(userName);
    const weeksContribution = response.data.user?.contributionsCollection?.contributionCalendar?.weeks;

    if (!weeksContribution) {
        console.log(`No contributions are found for ${userName}.`);
        process.exit(1);
    }

    const mostRecentWeekContributions = weeksContribution[weeksContribution.length - 1]?.contributionDays;
    const todayContributions = mostRecentWeekContributions[mostRecentWeekContributions.length - 1]?.contributionCount;

    return todayContributions;
}