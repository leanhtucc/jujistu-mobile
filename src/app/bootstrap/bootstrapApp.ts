import '@jujistu/shared/config/appConfig';

let isBootstrapped = false;

export function bootstrapApp() {
  if (isBootstrapped) {
    return;
  }

  // Importing the config module validates the environment before this runs.
  isBootstrapped = true;
}
