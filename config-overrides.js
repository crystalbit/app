const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@root': resolvePath('src/'),
      '@features': resolvePath('src/features/'),
      '@avatars': resolvePath('src/features/avatars/'),
      '@global': resolvePath('src/features/global/'),
      '@redux': resolvePath('src/redux/'),
      '@slices': resolvePath('src/redux/slices'),
      '@selectors': resolvePath('src/redux/selectors'),
      '@utils': resolvePath('src/utils/'),
      '@api': resolvePath('src/api/'),
      '@crypto': resolvePath('src/crypto/'),
      '@components': resolvePath('src/components/'),
      '@pages': resolvePath('src/pages/'),
      '@classes': resolvePath('src/classes/'),
      '@images': resolvePath('src/images/')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.d.ts']
  };
  return config;
};
