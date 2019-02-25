const path = require('path'),
  fs = require('fs'),
  YAML = require('yamljs'),
  https = require('https');

const targetSpecPrefix = '/data-model/specs';
const tempYamlLocation = path.resolve('/tmp/');
const targetSpecLocation = path.resolve(__dirname, `../book/${targetSpecPrefix}`);
const targetViewerPath = path.resolve(__dirname, `../book/data-model`);

const list = [
  {
    name: 'hotels',
    // TODO change this to local FS reference once swagger docs are npm-ized
    url: 'https://raw.githubusercontent.com/windingtree/wiki/868b5d2685b1cd70647020978141be820ddccd30/hotel-data-swagger.yaml',
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
    // TODO change this to local FS reference once swagger docs are npm-ized
    url: 'https://raw.githubusercontent.com/windingtree/wiki/868b5d2685b1cd70647020978141be820ddccd30/airline-data-swagger.yaml',
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
  const localFilePath = `${tempYamlLocation}/${model.name}.yaml`;

  downloadFile(model.url, localFilePath, () => {
    const specFile = YAML.load(localFilePath);
    fs.writeFileSync(`${targetSpecLocation}/${model.name}.yaml`, YAML.stringify(specFile));
    const swaggerPage = swaggerTemplate.replace('<%YAML_SPEC_URL%>', `${targetSpecPrefix}/${model.name}.yaml`);
    fs.writeFileSync(`${targetViewerPath}/${model.name}.html`, swaggerPage);
  });
}
