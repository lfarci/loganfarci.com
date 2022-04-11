import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "Logan Farci",
    siteUrl: "https://www.loganfarci.com",
    description: ""
  },
  plugins: [
    "gatsby-plugin-netlify-cms",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./static/images/uploads",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: "./content/data",
      },
    },
    {
      resolve: "gatsby-transformer-json",
      options: {
        typeName: ({node}) => node.name
      }
    },
  ]
};

export default config;
