"use strict";

const getChannelURL = require("ember-source-channel-url");

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: "ember-lts-3.16",
        npm: {
          devDependencies: {
            "ember-source": "~3.16.0",
          },
        },
      },
      {
        name: "ember-lts-3.20",
        npm: {
          devDependencies: {
            "ember-source": "~3.20.0",
          },
        },
      },
      {
        name: "ember-lts-3.24",
        npm: {
          devDependencies: {
            "ember-source": "~3.24.0",
          },
        },
      },
      {
        name: "ember-lts-3.28",
        npm: {
          devDependencies: {
            "ember-source": "~3.28.0",
          },
        },
      },
    ],
  };
};
