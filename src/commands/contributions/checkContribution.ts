import { Command } from 'commander';
import fetch from 'node-fetch'; // fetch is not supported prior nodejs.18 but i am using nodejs.17 

export function contribution(program: Command) {
    program
        .command('contribution')
        .description('Check your number of contribution on GitHub contribution calendar.')
        .option('-a, --all', 'Get total contributions on GitHub calendar.')
        .action(async (options) => {
            if (options.all) {
                const totalContributions = await getTotalContributions();
                console.log(`Total contributions on GitHub calendar: ${totalContributions}`);
            }
        });
}


export async function setUpGraphQLRequest() {

    if (!process.env.GITHUB_TOKEN) {
        console.log("Please provide a GitHub token in the .env file");
        process.exit(1);
    }

    const githubAPI = "https://api.github.com/graphql";
    const token = process.env.GITHUB_TOKEN;
    const userName = "algebra2boy";

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

export async function getTotalContributions() {
    const response: any = await setUpGraphQLRequest();
    const totalContributions = response.data.user.contributionsCollection.contributionCalendar.totalContributions;
    return totalContributions;
}