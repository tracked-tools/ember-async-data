"use strict";

const getChannelURL = require("ember-source-channel-url");

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: "ember-lts-3.28",
        npm: {
          devDependencies: {
            "ember-source": "~3.28.0",
          },
        },
      },
      {
        name: "ember-lts-4.4",
        npm: {
          devDependencies: {
            "ember-source": "~4.4.0",
          },
        },
      },
      {
        name: "ember-release",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("release"),
          },
        },
      },
      {
        name: "ember-beta",
        allowedToFail: true,
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("beta"),
          },
        },
      },
      {
        name: "ember-canary",
        allowedToFail: true,
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("canary"),
          },
        },
      },
    ],
  };
};
