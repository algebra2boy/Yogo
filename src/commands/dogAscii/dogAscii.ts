import { Command } from 'commander';
import fetch from 'node-fetch';
import Jimp from 'jimp';

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
    console.log(dogAPIResponse);
    const URL = dogAPIResponse.message;
    imageToAsciiFromURL(URL as string);
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


async function imageToAsciiFromURL(imageURL: string) {

    // ASCII characters set from dark to light
    const asciiChars = ' .:-=+*#%@';
    console.log(imageURL);
    try {

        const image = await Jimp.read(imageURL);
        image.resize(80, Jimp.AUTO) // Resize image to fit output width
            .greyscale()           // Convert to greyscale
            .contrast(1);          // Optional: Increase contrast for better ASCII output

        for (let y = 0; y < image.bitmap.height; y++) {
            let line = '';
            for (let x = 0; x < image.bitmap.width; x++) {
                const idx = image.getPixelIndex(x, y);
                const red = image.bitmap.data[idx + 0];
                const green = image.bitmap.data[idx + 1];
                const blue = image.bitmap.data[idx + 2];
                const brightness = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
                const character = asciiChars[Math.floor(brightness * (asciiChars.length - 1))];
                line += character;
            }
            console.log(line);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}