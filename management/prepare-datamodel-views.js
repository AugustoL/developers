const path = require('path'),
  fs = require('fs'),
  request = require('request'),
  prequest = require('request-promise'),
  tar = require('tar')
  YAML = require('yamljs');

const targetSpecPrefix = '/data-model/specs/';
const baseSourcePath = path.resolve(__dirname, '../node_modules/');
const tempYamlLocation = path.resolve('/tmp/');
const targetSpecLocation = path.resolve(__dirname, `../book/${targetSpecPrefix}`);
const targetViewerPath = path.resolve(__dirname, `../book/data-model`);

const list = [
  {
    name: 'hotels',
    package: '@windingtree/wt-hotel-schemas',
    docs: 'dist/swagger.yaml',
  },
  {
    name: 'airlines',
    package: '@windingtree/wt-airline-schemas',
    docs: 'dist/swagger.yaml',
  }
];

const swaggerTemplate = fs.readFileSync(path.resolve(__dirname, './swagger-ui.template.html'), { encoding: 'utf-8'});
const modelPromises = [];
let versionPromises;

for(let model of list) {
  const modelVersions = [];
  
  // we can't use git, because artifacts are built before they get published to npm
  const pipeline = prequest(`https://registry.npmjs.org/${model.package}`, { json: true })
    .then((packageData) => {
      // get version list
      versionPromises = Object.keys(packageData.versions)
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
                return entry.path === `package/${model.docs}`;
              }
            }))
            .on('entry', entry => {
              entry.on('data', c => data.push(c))
              entry.on('end', v => {
                const specFile = YAML.parse((Buffer.concat(data)).toString());
                fs.writeFileSync(`${targetSpecLocation}/${model.name}-${specFile.info.version}.yaml`, YAML.stringify(specFile));
                return resolve({
                  name: specFile.info.version,
                  url: `${targetSpecPrefix}${model.name}-${specFile.info.version}.yaml`,
                });
              });
            }).on('end', () => {
              return resolve({})
            });
          }));
      
      return Promise.all(versionPromises)
        .then((modelVersions) => {
          const swaggerPage = swaggerTemplate
            .replace('<%YAML_SPEC_URLS%>', JSON.stringify(modelVersions.filter((d) => !! d.name)));
          fs.writeFileSync(`${targetViewerPath}/${model.name}.html`, swaggerPage);
        });
    });
  modelPromises.push(pipeline);
}

Promise.all(modelPromises)
  .then(() => {
    console.log('done');
  });