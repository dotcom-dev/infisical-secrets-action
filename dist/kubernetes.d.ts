/**
 * Upsert a Kubernetes secret from a JSON file
 *
 * @param name The name of the secret
 * @param fileName The path to the JSON file
 * @param namespace The namespace for the secret (optional)
 */
export declare const upsertSecret: (name: string, fileName: string, namespace?: string) => Promise<void>;
