import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  sassOptions: {
    includePaths: ['./src'],
  },
  turbopack: {
    rules: {
      '*.svg': {
        as: '*.js',
        loaders: ['@svgr/webpack'],
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    removeUnknownsAndDefaults: false,
                  },
                },
              },
            ],
          },
        },
      }],
    });
    return config;
  },
};

export default nextConfig;
