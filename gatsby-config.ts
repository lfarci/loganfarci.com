import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `loganfarci.com`,
    siteUrl: `https://www.loganfarci.com`
  },
  plugins: [
    "gatsby-plugin-netlify-cms",
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `./content/data`,
      },
    },
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: "Json",
      },
    },
  ]
};

export default config;
