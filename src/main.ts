import { getInput } from '@actions/core';

import { Infisical } from './infisical';
import { writeToFile } from './utils/fs';
import { createSecret } from "./kubernetes";

const main = async (): Promise<void> => {
  const infisical = await Infisical.create();

  const domain = getInput('domain', { required: false });
  const token = getInput('token', { required: true });
  const projectId = getInput('projectId', { required: true });
  const environment = getInput('env', { required: true });
  const path = getInput('path', { required: false });
  // const format = getInput('format', { required: false }) ?? 'dotenv';
  const destinationFile =
    getInput('destinationFile', { required: false }) ?? '.env';
  const kubernetes = String(getInput('kubernetes', { required: false })) === 'true';
  const kubernetesSecretName = getInput('kubernetesSecretName', { required: false });
  const kubernetesSecretNamespace = getInput('kubernetesSecretNamespace', { required: false });

  await infisical.exec([
    'export',
    `--domain=${domain}`,
    `--token=${token}`,
    `--projectId=${projectId}`,
    `--env=${environment}`,
    ...(path ? [`--path=${path}`] : []),
    // `--format=${format}`,
    `> ${destinationFile}`,
  ]);

  if (kubernetes) {
    if (!kubernetesSecretName.length) {
      throw new Error('"kubernetes" is enabled but "kubernetesSecretName" is not set');
    }

    await createSecret(kubernetesSecretName, destinationFile, kubernetesSecretNamespace);
  }

  console.log('✨ Done');
};

void main();
