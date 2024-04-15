import { Command } from 'commander';
import { input, select, confirm } from "@inquirer/prompts";
import OpenAI from "openai";
import ora, { Ora } from 'ora';
import fetch from 'node-fetch';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function imageGenerator(program: Command): void {
    program
        .command('image')
        .description('Generate AI images using OpenAI DALL-E3')
        .action(async () => {

            const options: ImageGeneratorOptions = await askUserInput();

            const imageURL: string = await sendOpenAIRequest(options);

            console.log(`Image URL: ${imageURL}`);

            await saveImageLocally(imageURL);

        })
        .on('--help', () => {
            console.log('');
            console.log('Examples:');
            console.log('  $ yo image ');
        });
}

interface ImageGeneratorOptions {
    prompt: string;
    size: "1024x1024" | "1792x1024" | "1024x1792";
    quality: "standard" | "hd";
}

async function askUserInput(): Promise<ImageGeneratorOptions> {
    const prompt: string = await input({ message: "Enter a prompt:" });
    const size: string = await select({
        message: "Select the size of the image (in pixels):",
        choices: [
            { name: '1024 x 1024', value: '1024x1024' },
            { name: '1792 x 1024', value: '1792x1024' },
            { name: '1024 x 1792', value: '1024x1792' },
        ]
    });

    const quality: string = await select({
        message: "Select the quality of the image:",
        choices: [
            { name: 'standard', value: 'standard' },
            { name: 'hd', value: 'hd', description: "creates images with finer details and greater consistency across the image." },
        ]
    });

    return { prompt, size, quality } as ImageGeneratorOptions;
}

async function sendOpenAIRequest(options: ImageGeneratorOptions): Promise<string> {

    const openai: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const spinner: Ora = ora('Generating image....').start("please wait...");

    type ImageResponse = OpenAI.Images.ImagesResponse;

    try {
        const response: ImageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: options.prompt,
            n: 1,
            quality: options.quality,
            size: options.size,
            response_format: 'url'
        });

        spinner.succeed('Image generated successfully!');

        const imageUrl = response.data[0].url;

        if (!imageUrl || imageUrl === "") {
            spinner.fail('Image generation failed.');
            console.error("No image generated. Please try again.");
            process.exit(1);
        }

        return imageUrl;

    } catch (error) {
        spinner.fail('Image generation failed.');
        console.error("OpenAI server failed to generate image.");
        process.exit(1);
    } finally {
        spinner.stop();
    }

}

async function saveImageLocally(imageURL: string): Promise<void> {
    const save: boolean = await confirm({ message: "Do you want to save the image locally?" });

    if (!save) return;

    const spinner: Ora = ora('Saving image locally....').start("please wait...");

    // create a folder to save the images (folder name is images)
    const folderPath: string = path.join(__dirname, 'images');

    if (!fs.existsSync(folderPath)) { // check if the folder exists
        fs.mkdirSync(folderPath);  // if not, create the folder
    }

    const filename: string = path.basename(imageURL); // get the filename from the URL

    const imagePath: string = path.join(folderPath, filename); // combine the folder path and the filename

    const fileStream: fs.WriteStream = fs.createWriteStream(imagePath); // create a write stream to save the image

    try {
        const response = await fetch(imageURL); // fetch the image from the URL

        const badResponse: boolean = !response.ok || !response || !response.body;
        
        if (badResponse) {
            spinner.fail('Failed to save image:');
            console.error("Failed to fetch image from the URL");
            process.exit(1);
        }

        

        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve); // resolve the promise when the file stream is finished
            fileStream.on('error', reject); // reject the promise if there is an error
        });

        spinner.succeed(`Image saved successfully. Please check the images folder`);
    } catch (error) {
        spinner.fail("Failed to save image:");
    }
}