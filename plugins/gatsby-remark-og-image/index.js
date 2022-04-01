/* eslint-disable */
const catchy = require('catchy-image');

module.exports = async ({ markdownNode }, pluginOptions) => {
  if (
    pluginOptions.generatedTarget.includes(markdownNode.frontmatter.contentType)
  ) {
    const result = await catchy.generate({
      ...pluginOptions.catchyOptions,
      output: {
        ...pluginOptions.catchyOptions.output,
        directory: `./public${markdownNode.fields.slug}`,
        fileName: pluginOptions.catchyOptions.output.fileName,
      },
      meta: {
        ...pluginOptions.catchyOptions.meta,
        title: markdownNode.frontmatter.title,
      },
    });

    console.info(`gatsby-remark-og-image: Successful generated: ${result}`);
  } else {
    console.info(
      `gatsby-remark-og-image: Do not generated. Becase content-type is not generated target`
    );
  }
};
