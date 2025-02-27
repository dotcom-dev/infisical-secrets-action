import { getInput } from '@actions/core';

import { Infisical } from './infisical';
import { upsertSecret } from './kubernetes';

const main = async (): Promise<void> => {
  const infisical = await Infisical.create();

  const domain = getInput('domain', { required: false });
  const token = getInput('token', { required: true });
  const projectId = getInput('projectId', { required: true });
  const environment = getInput('env', { required: true });
  const path = getInput('path', { required: false });
  const format = getInput('format', { required: false }) || 'json';
  const destinationFile =
    getInput('destinationFile', { required: false }) || 'secrets.json';
  const kubernetes =
    String(getInput('kubernetes', { required: false })) === 'true';
  const kubernetesSecretName = getInput('kubernetesSecretName', {
    required: false,
  });
  const kubernetesNamespace = getInput('kubernetesNamespace', {
    required: false,
  });

  await infisical.exec([
    'export',
    `--domain=${domain}`,
    `--token=${token}`,
    `--projectId=${projectId}`,
    `--env=${environment}`,
    ...(path ? [`--path=${path}`] : []),
    `--format=${format}`,
    `> ${destinationFile}`,
  ]);

  if (kubernetes) {
    if (!kubernetesSecretName.length) {
      throw new Error(
        '"kubernetes" is enabled but "kubernetesSecretName" is not set'
      );
    }

    await upsertSecret(
      kubernetesSecretName,
      destinationFile,
      kubernetesNamespace
    );
  }

  console.log('✨ Done');
};

void main();
