/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Authenticator } from "types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadAuthPlugins = async (): Promise<Authenticator[]> => {
    const authPluginFolder = path.join(__dirname, "../authenticators");
    const authPluginFiles = fs.readdirSync(authPluginFolder);

    // Math files ##-Something
    const filenamePattern = /^\d+-[a-zA-Z0-9.]+/i;

    // Sort the files by their numeric prefix
    const sortedFiles = authPluginFiles
        .filter((file) => filenamePattern.test(file))
        .sort((a, b) => {
            const aPrefix = parseInt(a.match(/^\d+/)?.[0] || "0");
            const bPrefix = parseInt(b.match(/^\d+/)?.[0] || "0");
            return aPrefix - bPrefix;
        });
    const authenticators: Authenticator[] = [];

    for (const file of sortedFiles) {
        const pluginPath = path.join(authPluginFolder, file);

        // Load the module
        const pluginModule = await import(pluginPath);

        // Check if the module exports a class that implements Authenticator
        if (
            pluginModule &&
            typeof pluginModule === "object" &&
            "default" in pluginModule
        ) {
            const authenticatorClass = pluginModule.default;
            const authenticatorInstance = new authenticatorClass();

            // Check if the instantiated object implements the Authenticator interface
            if (
                "name" in authenticatorInstance &&
                "authenticate" in authenticatorInstance
            ) {
                authenticators.push(authenticatorInstance);
            }
        }
    }

    return authenticators;
};
