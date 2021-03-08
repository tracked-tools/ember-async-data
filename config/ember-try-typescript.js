module.exports = {
  useYarn: true,
  scenarios: [
    {
      command: "tsc --noEmit --project type-tests/base.json",
      name: "ts-4.1",
      npm: {
        typescript: "~4.1",
      },
    },
    {
      command: "tsc --noEmit --project type-tests/base.json",
      name: "ts-4.2",
      npm: {
        typescript: "~4.2",
      },
    },
    {
      command: "tsc --noEmit --project type-tests/base.json",
      name: "ts-next",
      allowedToFail: true,
      npm: {
        devDependencies: {
          typescript: "next",
        },
      },
    },
  ],
};
