'use strict';

module.exports = {
  overrides: [
    {
      files: '*.{js,mjs,cjs,ts}',
      options: {
        singleQuote: true,
      },
    },
  ],
  plugins: ['prettier-plugin-ember-template-tag'],
};
