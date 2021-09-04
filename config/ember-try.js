"use strict";

const getChannelURL = require("ember-source-channel-url");
const typeTests = require("./ember-try-typescript");

const typeScriptScenarios = typeTests.scenarios.map((s) => ({
  ...s,
  command: typeTests.command,
}));

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

      // Include the type tests, while still leaving them in their own file so
      // they can be run independently, for example to run all the type tests but
      // *only* the type tests locally.
      ...typeScriptScenarios,
    ],
  };
};
