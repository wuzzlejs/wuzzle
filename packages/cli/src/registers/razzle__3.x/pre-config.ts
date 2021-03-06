import { cosmiconfigSync } from 'cosmiconfig';
import path from 'path';
import type webpack from 'webpack';
import { merge } from 'webpack-merge';
import { EK_COMMAND_ARGS, EK_COMMAND_NAME } from '../../constants';

const babelConfigExplorer = cosmiconfigSync('babel');
const commandName = process.env[EK_COMMAND_NAME]!;
const razzleCommand = JSON.parse(process.env[EK_COMMAND_ARGS]!)[0];

export default (webpackConfig: webpack.Configuration) => {
  if (commandName != 'razzle') return;
  if (razzleCommand == 'test') {
    return merge(webpackConfig, {
      module: {
        rules: [
          {
            test: /\.(js|jsx|mjs|cjs|ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: babelConfigExplorer.search()
                    ? []
                    : [require.resolve(path.resolve('node_modules/razzle/babel'))],
                },
              },
            ],
          },
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('null-loader'),
              },
            ],
          },
          {
            exclude: [/\.(js|jsx|mjs|cjs|json|ts|tsx|css)$/, /node_modules/],
            use: [
              {
                loader: require.resolve('file-loader'),
                options: {
                  emitFile: false,
                },
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx', '.mjs', '.cjs', '.json', '.ts', '.tsx'],
      },
    });
  }
};
