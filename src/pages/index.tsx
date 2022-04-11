import * as React from "react"
import {graphql} from "gatsby"
import Layout from "../components/Layout";
import Header from "../components/Header";

interface IndexPageContent {
  name: string;
  pictureAlt: string;
  pictureSource: string;
  role: string;
  description: string;
}

interface IndexData {
  index: IndexPageContent;
}

const IndexPage = ({data}: {data: IndexData}) => {
  return <Layout
    title={data.index.name}
    description={data.index.description}
  >
    <Header
      name={data.index.name}
      role={data.index.role}
      picture={{alt: data.index.pictureAlt, src: data.index.pictureSource}}
      description={data.index.description}
    />
  </Layout>;
}

export const query = graphql`query IndexPageQuery {
  index {
    name
    pictureAlt
    pictureSource
    role
    description
  }
}`;

export default IndexPage;