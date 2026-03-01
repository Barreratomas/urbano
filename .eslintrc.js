module.exports = {
  root: true,
  overrides: [
    {
      files: ['backend/**/*.ts'],
      extends: ['plugin:backend/recommended'],
    },
  ],
};
