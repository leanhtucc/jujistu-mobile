// Runs on staged files only, from the husky pre-commit hook.
module.exports = {
  '*.{ts,tsx,js}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
