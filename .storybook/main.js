const config = {
  framework: "@storybook/nextjs",
  stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Optional
  addons: ["@storybook/addon-essentials"],
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
};
export default config;
