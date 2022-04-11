import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const indexPageQuery = graphql`query IndexPageQuery {
  indexJson {
    name
    pictureAlt
    pictureSource
    role
    description
  }
}`;

const IndexPage = () => {

  const {indexJson: data} = useStaticQuery(indexPageQuery);

  return <main>
    <h1>{data.name}</h1>

    <img alt={data.pictureAlt} src={data.pictureSource} width="64"/>
    <p>{data.role}</p>
    <p>{data.description}</p>
  </main>;
}

export default IndexPage
