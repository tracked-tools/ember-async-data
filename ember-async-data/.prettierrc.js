'use strict';

module.exports = {
  overrides: [
    {
      files: '*.{js,cjs,ts}',
      options: {
        singleQuote: true,
      },
    },
  ],
  plugins: ['prettier-plugin-ember-template-tag'],
};
