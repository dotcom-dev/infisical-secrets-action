/**
 * Obtain the path to the Infisical executable from cache.
 * If not found in cache, download it, install it, cache it and then return it
 *
 * @param version
 */
export declare const obtainInfisicalCLI: (version?: string) => Promise<string>;
export declare class Infisical {
    private readonly executablePath;
    private constructor();
    static create(version?: string): Promise<Infisical>;
    exec(args: string[]): Promise<string>;
}
