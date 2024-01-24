/**
 * Create a Kubernetes secret from a JSON file
 *
 * @param name
 * @param fileName
 * @param namespace
 */
export declare const createSecret: (name: string, fileName: string, namespace?: string) => Promise<void>;
