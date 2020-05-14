// Para resolver o problema das propriedades privadas # com o test coverage do jest
// https://github.com/facebook/jest/issues/9022#issuecomment-561210430

module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: true,
          },
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ]
  };