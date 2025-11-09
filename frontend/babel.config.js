module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    // Thêm dòng này để biên dịch JSX
    ['@babel/preset-react', {runtime: 'automatic'}]
  ],
};