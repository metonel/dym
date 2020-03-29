const contentful = require('contentful');
const manifestConfig = require('./manifest-config');
require('dotenv').config();

const { ANALYTICS_ID, DETERMINISTIC } = process.env;
const SPACE_ID = '798y9fwy9gi4';
const ACCESS_TOKEN = 'G2hF7iSEIM_V6at2bQuQxrndkmwxP8I5_s5iutA0WX8';

const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

const getAboutEntry = entry => entry.sys.contentType.sys.id === 'about';

const plugins = [
  'gatsby-plugin-react-helmet',
  {
    resolve: 'gatsby-plugin-web-font-loader',
    options: {
      custom: {
        families: ['seidoRound'],
        urls: ['/font/font.css'],
      },
      // google: {
      //   families: ['Cabin', 'Open Sans'],
      // },
    },
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: manifestConfig,
  },
  'gatsby-plugin-styled-components',
  {
    resolve: 'gatsby-source-contentful',
    options: {
      spaceId: SPACE_ID,
      accessToken: ACCESS_TOKEN,
    },
  },
  'gatsby-transformer-remark',
  'gatsby-plugin-offline',
];

module.exports = client.getEntries().then(entries => {
  const { mediumUser } = entries.items.find(getAboutEntry).fields;

  plugins.push({
    resolve: 'gatsby-source-medium',
    options: {
      username: mediumUser || '@medium',
    },
  });

  if (ANALYTICS_ID) {
    plugins.push({
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: ANALYTICS_ID,
      },
    });
  }

  return {
    siteMetadata: {
      isMediumUserDefined: !!mediumUser,
      deterministicBehaviour: !!DETERMINISTIC,
    },
    plugins,
  };
});
