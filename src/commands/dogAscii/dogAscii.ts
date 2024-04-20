import { Command } from 'commander';
import fetch from 'node-fetch';

// @ts-ignore
import imageToAscii from "image-to-ascii";

// Recommend to download: https://github.com/IonicaBizau/image-to-ascii/blob/a375f896214429f01d552502a69e889d1b1c00ee/INSTALLATION.md
export function dogAscii(program: Command): void {
    program
        .command('dog')
        .description('Print a dog in ASCII art using Dog API')
        .option('-c, --count <count>', 'Select the number of dogs from API, max is 50')
        .action(async (option: { count: string }) => performDogAscii(option));
}

export async function performDogAscii(option: { count: string }): Promise<void> {

    const count = option.count;

    if (count && !Number.isInteger(parseInt(option.count))) {
        console.error("Please enter a valid number between 1 and 50");
        process.exit(1);
    }

    const dogAPIResponse = await sendRequestToDogAPI(parseInt(count));
    const URL = dogAPIResponse.message;
    if (Array.isArray(URL)) {
        URL.forEach((url) => imageToAsciiFromURL(url));
    } else {
        imageToAsciiFromURL(URL);
    }
}

interface DogAPIResponse {
    "message": string | string[];
    "status": string;
}

export async function sendRequestToDogAPI(count?: number): Promise<DogAPIResponse> {
    const API_Link = "https://dog.ceo/api/breeds/image/random" + (count ? "/" + count : "");
    try {
        const response = await fetch(API_Link);
        const data = await response.json();
        return data as DogAPIResponse;
    } catch (error) {
        console.error("Error occurred while fetching data from Dog API");
        process.exit(1);
    }
}


function imageToAsciiFromURL(imageURL: string) {
    imageToAscii(imageURL, (err: any, converted: any) => {
        console.log("url of the image: " + imageURL);
        console.log(err || converted);
        console.log("\n");
    });
}