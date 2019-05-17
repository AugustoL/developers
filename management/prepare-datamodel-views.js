const path = require('path'),
  fs = require('fs'),
  YAML = require('yamljs'),
  https = require('https');

const targetSpecPrefix = '/data-model/specs/';
const baseSourcePath = path.resolve(__dirname, '../node_modules/');
const tempYamlLocation = path.resolve('/tmp/');
const targetSpecLocation = path.resolve(__dirname, `../book/${targetSpecPrefix}`);
const targetViewerPath = path.resolve(__dirname, `../book/data-model`);

const list = [
  {
    name: 'hotels',
    docs: '@windingtree/wt-hotel-schemas/dist/swagger.yaml',
    rootModels: [
      {
        name: 'On chain data',
        ref: '#/components/schemas/HotelOnChain'
      },
      {
        name: 'HotelDataIndex',
        ref: '#/components/schemas/HotelDataIndex'
      },
      {
        name: 'HotelDescription',
        ref: '#/components/schemas/HotelDescription'
      },
      {
        name: 'RatePlans',
        ref: '#/components/schemas/RatePlans'
      },
      {
        name: 'Availability',
        ref: '#/components/schemas/Availability'
      }
    ]
  },
  {
    name: 'airlines',
    docs: '@windingtree/wt-airline-schemas/dist/swagger.yaml',
    rootModels: [
      {
        name: 'On chain data',
        ref: '#/components/schemas/AirlineOnChain'
      },
      {
        name: 'AirlineDataIndex',
        ref: '#/components/schemas/AirlineDataIndex'
      },
      {
        name: 'AirlineDescription',
        ref: '#/components/schemas/AirlineDescription'
      },
      {
        name: 'Flights',
        ref: '#/components/schemas/Flights'
      },
      {
        name: 'FlightInstances',
        ref: '#/components/schemas/FlightInstances'
      }
    ]
  }
];

function downloadFile(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}

const swaggerTemplate = fs.readFileSync(path.resolve(__dirname, './swagger-ui.template.html'), { encoding: 'utf-8'});

for(let model of list) {
  const modelVersions = [];
  const specFile = YAML.load(`${baseSourcePath}/${model.docs}`);
  fs.writeFileSync(`${targetSpecLocation}/${model.name}-${specFile.info.version}.yaml`, YAML.stringify(specFile));
  modelVersions.push({
    name: specFile.info.version,
    url: `${targetSpecPrefix}${model.name}-${specFile.info.version}.yaml`,
  });

  const swaggerPage = swaggerTemplate
    .replace('<%YAML_SPEC_URLS%>', JSON.stringify(modelVersions));
  fs.writeFileSync(`${targetViewerPath}/${model.name}.html`, swaggerPage);
}
