/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'all-property': true,
        'color-functional-notation': true,
        'custom-properties': false,
      },
    },
  },
};

export default config;
