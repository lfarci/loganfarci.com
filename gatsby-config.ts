import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `loganfarci.com`,
    siteUrl: `https://www.loganfarci.com`
  },
  plugins: ["gatsby-plugin-netlify-cms", "gatsby-plugin-sass"]
};

export default config;
