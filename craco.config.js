const CracoLessPlugin = require('craco-less');
const CracoAliasPlugin = require('craco-alias');
const { DefinePlugin } = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new DefinePlugin({
          process: { env: {} },
        }),
      ],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#0156ff' },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAliasPlugin,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: '.',
        /* tsConfigPath should point to the file where "baseUrl" and "paths" 
         are specified*/
        tsConfigPath: './tsconfig.extends.json',
        unsafeAllowModulesOutsideOfSrc: true,
      },
    },
  ],
};
