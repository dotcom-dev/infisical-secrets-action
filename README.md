# Infisical Secrets Action

Helps you retrieve secrets from [Infisical](https://infisical.com) and deploy them to your Kubernetes cluster.

Behind the scenes we are installing the Infisical CLI and using it to retrieve the secrets. All the secrets are then piped into the file specified in the `destinationFile` parameter, default: `secrets.json`, in the `json` format.

## Usage

```yaml
name: My workflow
jobs:
  prepare:
    runs-on: ubuntu-latest
    steps:
      - name: Create secrets file
        uses: dotcom-dev/infisical-secrets@main
        with:
          token: ${{ secrets.INFISICAL_TOKEN }}
          projectId: "5a503cbd2369e9143ad88fr5"
          env: "prod"
```

### Parameters

| Parameter              | Description                                                                                               | Default    |
|------------------------|-----------------------------------------------------------------------------------------------------------|------------|
| `domain`               | Infisical API domain. Helpful for self-hosted deployments, if not provided, will use the official domain. | `Official` |
| `token`                | Your Infisical API token.                                                                                 |            |
| `projectId`            | The ID of the project you want to retrieve secrets from.                                                  |            |
| `env`                  | The environment you want to retrieve secrets from.                                                        |            |
| `path`                 | Secrets path inside the environment.                                                                      | /          |
| `destinationFile`      | The file you want to write the secrets to.                                                                | `.env`     |
| `kubernetes`           | Whether to deploy the secrets to Kubernetes.                                                              | `false`    |
| `kubernetesSecretName` | The name of the Kubernetes secret. (Required if `kubernetes` is `true`)                                   |            |
| `kubernetesNamespace`  | The namespace of the Kubernetes secret.                                                                   |            |

> **Note:** This action is currently in beta. Please use it with caution and at your own risk.

## Development

1. Adjust the code and then.
2. Build with `yarn build`
3. Commit the changes 
4. Update the version in the `package.json` file and commit the change with the message `vX.Y.Z`
5. Create a new tag with the version: `git tag -a vX.Y.Z -m vX.Y.Z`
6. Push the changes to the repository
7. Create a new release with the tag `vX.Y.Z` and the release notes
