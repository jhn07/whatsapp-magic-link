type EnvironmentVariable = {
  name: string;
  required: boolean;
  description: string;
}

export const requiredFirebaseAdminConfig: EnvironmentVariable[] = [
  {
    name: 'FIREBASE_PROJECT_ID',
    required: true,
    description: 'Firebase Project ID from Service Account'
  },
  {
    name: 'FIREBASE_CLIENT_EMAIL',
    required: true,
    description: 'Firebase Client Email from Service Account'
  },
  {
    name: 'FIREBASE_PRIVATE_KEY',
    required: true,
    description: 'Firebase Private Key from Service Account'
  }
];

export function validateServerEnvironment(
  variables: EnvironmentVariable[],
  prefix: string = ''
): void {
  const missing: string[] = [];

  variables.forEach((variable) => {
    if (variable.required && !process.env[variable.name]) {
      missing.push(`${variable.name} (${variable.description})`);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required ${prefix} environment variables:\n` +
      missing.map(name => `  - ${name}`).join('\n') +
      '\nPlease check your .env.local file and make sure all required variables are set.'
    );
  }
}