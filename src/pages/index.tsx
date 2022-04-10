import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const IndexPage = () => {

  // const {json: data} = useStaticQuery(graphql`
  //   query IndexPageQuery {
  //     json {
  //       pictureSource
  //       pictureAlt
  //       role
  //       name
  //       description
  //     }
  //   }
  // `);

  return (
    // <main>
    //   <h1>{data.name}</h1>
    //   <img alt={data.pictureAlt} src={data.pictureSource}></img>
    //   <p>{data.role}</p>
    //   <p>{data.description}</p>
    // </main>
    <p>coucou</p>
  )
}

export default IndexPage
