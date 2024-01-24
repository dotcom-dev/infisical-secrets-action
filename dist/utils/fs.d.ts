import type { ExecOptions } from '@actions/exec';
/**
 * Return an array containing all recursive files and directories under a given directory for a given file name
 *
 * @param directoryPath
 * @param fileToFind
 * @param foundFiles
 */
export declare const walkSync: (directoryPath: string, fileToFind: string, foundFiles?: string[]) => string[];
export declare const writeToFile: (filePath: string, content: string) => Promise<void>;
/**
 * Execute a command and return the output
 * @param executablePath
 * @param args
 * @param withBash
 * @param options
 */
export declare const execCommand: (executablePath: string, args: string[], withBash?: boolean, options?: ExecOptions) => Promise<string>;
