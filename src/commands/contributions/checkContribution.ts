import { Command } from 'commander';
import type {
    Options,
    UserData,
    ContributionGraphQLResponse,
    ContributionCalendar,
    ContributionDay,
    Week
} from './contribution.d.ts';
import fetch from 'node-fetch'; // fetch is not supported prior nodejs.18 but i am using nodejs.17 

export function contribution(program: Command) {
    program
        .command('contribution')
        .description('Check your number of contribution on GitHub contribution calendar.')
        .option('-a, --all', 'Get total contributions on GitHub calendar.') // works for both -a or --all
        .option('-n, --name <name>', 'Specify your Github username.') // works for both -n or --name
        .option('--today', 'Get today\'s contributions.')
        .option('--week', 'Get this week\'s contributions.')
        .option('--month', 'Get this month\'s contributions (not including current week).')
        .option('-c, --count <count>', 'Get the number of contributions for the first n week(s) on calendar.')
        .action(async (options: Options) => {
            console.log("Checking your contributions...");

            if (!isOptionsValid(options)) {
                program.help(); // Display the help information (automatically exits the program)
            }

            // fetch the data from GitHub graphQL API
            const response: ContributionGraphQLResponse = await setUpGraphQLRequest(options.name!);
            const calendar: ContributionCalendar = getCalendar(response.data.user, options.name!);

            if (options.all) {

                const totalContributions: number = getTotalContributions(calendar);
                console.log(`Total contributions on GitHub calendar for ${options.name}: ${totalContributions}`);

            } else if (options.today) {

                const todayContributions: number = getTodayContributions(calendar);
                console.log(`Today contributions on GitHub calendar for ${options.name}: ${todayContributions}`);

            } else if (options.week) {

                const weeksContribution: Week[] = calendar.weeks;
                const currentWeek: Week[] = [weeksContribution[weeksContribution.length - 1]]; // an array of one week
                const weekContributions: number = getWeekContributions(currentWeek);
                console.log(`This week contributions on GitHub calendar for ${options.name}: ${weekContributions}`);

            } else if (options.month) {

                const monthContributions: number = getMonthContributions(calendar);
                console.log(`This month contributions on GitHub calendar for ${options.name}: ${monthContributions}`);

            } else if (options.count) {

                const count = parseInt(options.count);
                const absCount = Math.abs(count);

                const firstNWeeksContributions: number = getFirstNWeeksContributions(calendar, count);
                console.log(`${count > 0 ? "First" : "Last"} ${absCount} ${absCount === 1 ? "Week" : "Weeks"} contributions on GitHub calendar for ${options.name}: ${firstNWeeksContributions}`);

            }

        })
        .on('--help', () => {
            console.log('');
            console.log('Examples:');
            console.log('  $ yogo contribution -a --name <github username>');
        });
}

/**
 * Commander.js does not provide support for checking if the options are valid or not.
 * We would need to check if user inputs are provided or not.
 */
function isOptionsValid(options: Options): boolean {
    const { all, name, today, week, month, count } = options;

    if (!name) {
        console.log("Please provide a GitHub username using --name <github name>.\n");
        return false;
    }

    if (!all && !today && !week && !month && !count) {
        console.log("Please specify one of the following options: -a/--all, --today, --week, --month or -c/--count <count>.\n");
        return false;
    }

    return true;
}

async function setUpGraphQLRequest(userName: string): Promise<ContributionGraphQLResponse> {

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
    return response as ContributionGraphQLResponse;
}

function getCalendar(userData: UserData, userName: string): ContributionCalendar {
    if (!userData) {
        console.log("No user data found for " + userName);
        process.exit(1);
    }

    return userData.contributionsCollection.contributionCalendar;
}

function getTotalContributions(calendar: ContributionCalendar): number {
    return calendar.totalContributions;
}

function getTodayContributions(calendar: ContributionCalendar): number {
    const weeksContribution: Week[] = calendar.weeks;
    const mostRecentWeekContributions: ContributionDay[] = weeksContribution[weeksContribution.length - 1]?.contributionDays;
    const todayContributions: number = mostRecentWeekContributions[mostRecentWeekContributions.length - 1]?.contributionCount;

    return todayContributions;
}

function printInfoAndCountContributions(weeks: Week[]): number {

    return weeks.reduce((acc: number, week: Week) => {

        return acc + week.contributionDays.reduce((acc: number, dayContribution: ContributionDay) => {

            console.log(`Date: ${dayContribution.date}, Contributions: ${dayContribution.contributionCount}`);
            return acc + dayContribution.contributionCount

        }, 0);

    }, 0);
}

function getWeekContributions(weeks: Week[]): number {

    const totalContributionsForCurrentWeek: number = printInfoAndCountContributions(weeks);

    return totalContributionsForCurrentWeek;
}

function getMonthContributions(calendar: ContributionCalendar): number {

    const weeksContribution: Week[] = calendar.weeks;

    // not including the current week
    const thisMonthContributions: Week[] = weeksContribution.slice(
        weeksContribution.length - 5,
        weeksContribution.length - 1
    );

    const totalContributionsForCurrentMonth: number = getWeekContributions(thisMonthContributions);

    return totalContributionsForCurrentMonth;
}

function getFirstNWeeksContributions(calendar: ContributionCalendar, n: number): number {

    const weeksContribution: Week[] = calendar.weeks;

    if (n === 0) {
        console.log("Please provide a number other than 0.");
        process.exit(1);

    } else if (Math.abs(n) > weeksContribution.length) {
        console.log("Please provide a number within the range of the weeks on the calendar.");
        process.exit(1);

    }

    const firstNWeeks: Week[] = n >= 1
        ? weeksContribution.slice(0, n) // counting from the beginning 
        : weeksContribution.slice( // counting from the end
            weeksContribution.length - Math.abs(n),
            weeksContribution.length
        );

    const totalContributionsForFirstNWeeks: number = getWeekContributions(firstNWeeks);

    return totalContributionsForFirstNWeeks;
}