export default {
  'src/**/*.{js,jsx,ts,tsx}': 'eslint --fix --max-warnings=0',
  '**/*.{ts,tsx,js,jsx,css,md,json}': 'prettier --config prettier.config.cli.mjs --write',
};
