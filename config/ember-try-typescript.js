module.exports = {
  useYarn: true,
  command: "tsc --noEmit && tsc --noEmit --project type-tests/base.json",
  scenarios: [
    {
      name: "ts-4.1",
      npm: {
        typescript: "~4.1",
      },
    },
    {
      name: "ts-4.2",
      npm: {
        typescript: "~4.2",
      },
    },
    {
      name: "ts-4.3",
      npm: {
        typescript: "~4.3",
      },
    },
    {
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
