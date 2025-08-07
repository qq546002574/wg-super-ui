// 构建目标是否为库
const isBuildLib = process.env.VUE_CLI_BUILD_TARGET === 'lib';

module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: isBuildLib ? false : 'entry',
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",


  ]
};
