const path = require('path'),
  fs = require('fs'),
  request = require('request'),
  prequest = require('request-promise'),
  tar = require('tar')
  YAML = require('yamljs');

const targetSpecPrefix = '/apis/specs/';
const targetViewerPrefix = '/apis/';
const baseSourcePath = path.resolve(__dirname, '../node_modules/');
const baseTargetSpecPath = path.resolve(__dirname, `../book${targetSpecPrefix}`);
const baseTargetViewerPath = path.resolve(__dirname, `../book${targetViewerPrefix}`);
const list = [
  {
    name: 'wt-write-api',
    docs: 'docs/swagger.yaml',
    package: '@windingtree/wt-write-api',
    servers: [
      {
        description: 'Playground',
        url: 'https://playground-write-api.windingtree.com'
      }
    ]
  },
  {
    name: 'wt-read-api',
    docs: 'docs/swagger.yaml',
    package: '@windingtree/wt-read-api',
    servers: [
      {
        description: 'Playground',
        url: 'https://playground-api.windingtree.com'
      }
    ]
  },
  {
    name: 'wt-booking-api',
    docs: 'docs/swagger.yaml',
    package: '@windingtree/wt-booking-api',
    servers: [
      {
        description: 'Mazurka test hotel',
        url: 'https://mazurka-booking.windingtree.com'
      }
    ]
  },
  {
    name: 'wt-search-api',
    docs: 'docs/swagger.yaml',
    package: '@windingtree/wt-search-api',
    servers: [
      {
        description: 'Playground',
        url: 'https://playground-search-api.windingtree.com'
      }
    ]
  },
  {
    name: 'wt-notification-api',
    docs: 'docs/swagger.yaml',
    package: '@windingtree/wt-notification-api',
    servers: [
      {
        description: 'Playground',
        url: 'https://playground-notification-api.windingtree.com'
      }
    ]
  },
]

const swaggerTemplate = fs.readFileSync(path.resolve(__dirname, './swagger-ui.template.html'), { encoding: 'utf-8'});
const apiPromises = [];

for(let api of list) {
  const packageFile = JSON.parse(fs.readFileSync(`${baseSourcePath}/${api.package}/package.json`, { encoding: 'utf-8'}));

  // we can't use git, because artifacts are built before they get published to npm
  const pipeline = prequest(`https://registry.npmjs.org/${api.package}`, { json: true })
    .then((packageData) => {
      // get version list
      const versionPromises = Object.keys(packageData.versions)
        .filter((v) => v.indexOf('-') === -1)
        .sort((a, b) => {
          return a > b ? -1 : 1;
        })
        .map((version) => new Promise((resolve, reject) => {
          // build a local yaml file for all versions
          const data = [];
          request(packageData.versions[version].dist.tarball)
            .pipe(tar.t({
              filter: (path, entry) => {
                return entry.path === `package/${api.docs}`;
              }
            }))
            .on('entry', entry => {
              entry.on('data', c => data.push(c))
              entry.on('end', v => {
                const specFile = YAML.parse((Buffer.concat(data)).toString());
                // TODO these have to be a part of build process in the respective APIs eventually
                specFile.info.version = version;
                if (version === packageFile.version) {
                  specFile.servers = api.servers;
                } else {
                  specFile.servers = [];
                }

                fs.writeFileSync(`${baseTargetSpecPath}/${api.name}-${version}.yaml`, YAML.stringify(specFile));
                return resolve({
                  name: version,
                  url: `${targetSpecPrefix}${api.name}-${version}.yaml`,
                });
              });
            }).on('end', () => {
              return resolve({})
            });
          }));
      return Promise.all(versionPromises)
        .then((apiVersions) => {
          const swaggerPage = swaggerTemplate
            .replace('<%YAML_SPEC_URLS%>', JSON.stringify(apiVersions.filter((d) => !! d.name)));
          fs.writeFileSync(`${baseTargetViewerPath}/${api.name}.html`, swaggerPage);
        })
    });
  apiPromises.push(pipeline);
}

Promise.all(apiPromises)
  .then(() => {
    console.log('done');
  });