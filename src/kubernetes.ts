import * as fs from 'fs';

import { exec } from '@actions/exec';

const getObjectFromJsonFile = (
  fileName: string
): { key: string; value: string }[] => {
  const jsonString = fs.readFileSync(fileName, 'utf8');
  return JSON.parse(jsonString);
};

const createSecretYaml = (
  name: string,
  namespace: string | undefined,
  secrets: { key: string; value: string }[]
): string => {
  const base64Data = secrets
    .map(({ key, value }) => `${key}: ${Buffer.from(value).toString('base64')}`)
    .join('\n');

  return `apiVersion: v1
kind: Secret
metadata:
  name: ${name}
  ${namespace ? `namespace: ${namespace}` : ''}
type: Opaque
data:
  ${base64Data}
`;
};

/**
 * Upsert a Kubernetes secret from a JSON file
 *
 * @param name The name of the secret
 * @param fileName The path to the JSON file
 * @param namespace The namespace for the secret (optional)
 */
export const upsertSecret = async (
  name: string,
  fileName: string,
  namespace?: string
) => {
  const secretData = getObjectFromJsonFile(fileName);
  const yamlContent = createSecretYaml(name, namespace, secretData);

  console.log('yamlContent', yamlContent);

  const tempFilePath = 'temp-secret.yaml';
  fs.writeFileSync(tempFilePath, yamlContent);

  await exec('kubectl', ['apply', '-f', tempFilePath]);

  // Delete the temporary file after applying
  fs.unlinkSync(tempFilePath);
};
