/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

import ogpImage from '../images/thumbnail_default.png';

type SeoProps = {
  description?: string;
  lang?: string;
  meta?: HTMLMetaElement[];
  title: string;
  ogImage?: string;
};

const Seo: React.FC<SeoProps> = ({
  description,
  lang,
  meta,
  title,
  ogImage,
}) => {
  const { site } = useStaticQuery<GatsbyTypes.SeoQuery>(
    graphql`
      query Seo {
        site {
          siteMetadata {
            title
            description
            siteUrl
            social {
              twitter
            }
          }
        }
      }
    `
  );

  const metaDescription = description || site?.siteMetadata?.description;
  const defaultTitle = site?.siteMetadata?.title;
  const defaultOgImage = `${site?.siteMetadata?.siteUrl}${ogpImage}`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: ogImage ? ogImage : defaultOgImage,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: site?.siteMetadata?.social?.twitter || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta ?? [])}
    />
  );
};

export default Seo;
