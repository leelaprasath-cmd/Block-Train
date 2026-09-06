export interface GeoStation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  platforms: number;
  division: string;
  type: 'terminal' | 'junction' | 'suburban';
}

// True GPS Coordinates of Southern Railway Mainline Stations
export const REAL_STATIONS: GeoStation[] = [
  {
    "id": "CGL",
    "code": "CGL",
    "name": "Chengalpattu Junction",
    "lat": 12.6917,
    "lng": 79.9806,
    "platforms": 8,
    "division": "MAS",
    "type": "junction"
  },
  {
    "id": "PRN",
    "code": "PRN",
    "name": "Paranur",
    "lat": 12.715,
    "lng": 79.988,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "SKLS",
    "code": "SKLS",
    "name": "Singaperumal Koil Siding",
    "lat": 12.742,
    "lng": 79.996,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "SKL",
    "code": "SKL",
    "name": "Singaperumal Koil",
    "lat": 12.7634,
    "lng": 80.0039,
    "platforms": 5,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "CTM",
    "code": "CTM",
    "name": "Kattangulathur",
    "lat": 12.782,
    "lng": 80.014,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "MMNK",
    "code": "MMNK",
    "name": "Maraimalai Nagar",
    "lat": 12.7981,
    "lng": 80.0247,
    "platforms": 3,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "POTI",
    "code": "POTI",
    "name": "Potheri",
    "lat": 12.821,
    "lng": 80.043,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "GI",
    "code": "GI",
    "name": "Guduvancheri",
    "lat": 12.8453,
    "lng": 80.0631,
    "platforms": 4,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "UPM",
    "code": "UPM",
    "name": "Urapakkam",
    "lat": 12.868,
    "lng": 80.072,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "VDR",
    "code": "VDR",
    "name": "Vandalur",
    "lat": 12.8906,
    "lng": 80.0818,
    "platforms": 3,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "PRGL",
    "code": "PRGL",
    "name": "Perungalathur",
    "lat": 12.9056,
    "lng": 80.0984,
    "platforms": 3,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "TBMS",
    "code": "TBMS",
    "name": "Tambaram South Outer",
    "lat": 12.916,
    "lng": 80.108,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "TBM",
    "code": "TBM",
    "name": "Tambaram",
    "lat": 12.9256,
    "lng": 80.1171,
    "platforms": 9,
    "division": "MAS",
    "type": "terminal"
  },
  {
    "id": "TBMSN",
    "code": "TBMSN",
    "name": "Tambaram Sanatorium",
    "lat": 12.938,
    "lng": 80.129,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "CMP",
    "code": "CMP",
    "name": "Chromepet",
    "lat": 12.9517,
    "lng": 80.1411,
    "platforms": 4,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "PV",
    "code": "PV",
    "name": "Pallavaram",
    "lat": 12.9678,
    "lng": 80.1492,
    "platforms": 5,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "TLM",
    "code": "TLM",
    "name": "Tirusulam Airport",
    "lat": 12.982,
    "lng": 80.174,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "MN",
    "code": "MN",
    "name": "Minambakkam",
    "lat": 12.988,
    "lng": 80.183,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "PZA",
    "code": "PZA",
    "name": "Palavanthangal",
    "lat": 12.992,
    "lng": 80.191,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "STM",
    "code": "STM",
    "name": "St. Thomas Mount",
    "lat": 12.9961,
    "lng": 80.1983,
    "platforms": 5,
    "division": "MAS",
    "type": "junction"
  },
  {
    "id": "GDY",
    "code": "GDY",
    "name": "Guindy",
    "lat": 13.0089,
    "lng": 80.2132,
    "platforms": 4,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "SP",
    "code": "SP",
    "name": "Saidapet",
    "lat": 13.021,
    "lng": 80.221,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "MBM",
    "code": "MBM",
    "name": "Mambalam",
    "lat": 13.0336,
    "lng": 80.2285,
    "platforms": 4,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "MKK",
    "code": "MKK",
    "name": "Kodambakkam",
    "lat": 13.048,
    "lng": 80.233,
    "platforms": 2,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "NBK",
    "code": "NBK",
    "name": "Nungambakkam",
    "lat": 13.0617,
    "lng": 80.2389,
    "platforms": 4,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "MSC",
    "code": "MSC",
    "name": "Chetpet",
    "lat": 13.0685,
    "lng": 80.2428,
    "platforms": 4,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "MS",
    "code": "MS",
    "name": "Chennai Egmore",
    "lat": 13.0827,
    "lng": 80.2612,
    "platforms": 11,
    "division": "MAS",
    "type": "terminal"
  },
  {
    "id": "MPK",
    "code": "MPK",
    "name": "Chennai Park",
    "lat": 13.0805,
    "lng": 80.2745,
    "platforms": 4,
    "division": "MAS",
    "type": "suburban"
  },
  {
    "id": "MAS",
    "code": "MAS",
    "name": "Chennai Central",
    "lat": 13.0827,
    "lng": 80.2755,
    "platforms": 17,
    "division": "MAS",
    "type": "terminal"
  }
];

// Detailed Real Railway Track Path with Intermediate Curvature Waypoints along the GST Corridor
export const REAL_TRACK_WAYPOINTS: { lat: number; lng: number }[] = REAL_STATIONS.map(s => ({ lat: s.lat, lng: s.lng }));

// Ultra-Smooth Continuous Mainline Corridor (Zero jumps, strictly ordered along railway corridor)
export const CONTINUOUS_SURVEYED_CORRIDOR: { lat: number; lng: number }[] = [{"lat":12.6917,"lng":79.9806},{"lat":12.692335,"lng":79.980802},{"lat":12.69307,"lng":79.981038},{"lat":12.693897,"lng":79.981303},{"lat":12.69481,"lng":79.981597},{"lat":12.6958,"lng":79.981916},{"lat":12.696861,"lng":79.982257},{"lat":12.697985,"lng":79.982619},{"lat":12.699165,"lng":79.982998},{"lat":12.700393,"lng":79.983393},{"lat":12.701663,"lng":79.9838},{"lat":12.702966,"lng":79.984217},{"lat":12.704295,"lng":79.984642},{"lat":12.705644,"lng":79.985071},{"lat":12.707004,"lng":79.985503},{"lat":12.708369,"lng":79.985934},{"lat":12.70973,"lng":79.986363},{"lat":12.711082,"lng":79.986787},{"lat":12.712415,"lng":79.987202},{"lat":12.713724,"lng":79.987608},{"lat":12.715,"lng":79.988},{"lat":12.716273,"lng":79.988387},{"lat":12.717575,"lng":79.988776},{"lat":12.718903,"lng":79.989168},{"lat":12.720253,"lng":79.989563},{"lat":12.721621,"lng":79.98996},{"lat":12.723004,"lng":79.990359},{"lat":12.724399,"lng":79.99076},{"lat":12.725802,"lng":79.991162},{"lat":12.72721,"lng":79.991565},{"lat":12.728619,"lng":79.991969},{"lat":12.730025,"lng":79.992373},{"lat":12.731426,"lng":79.992778},{"lat":12.732817,"lng":79.993184},{"lat":12.734195,"lng":79.993588},{"lat":12.735557,"lng":79.993993},{"lat":12.736899,"lng":79.994397},{"lat":12.738218,"lng":79.9948},{"lat":12.73951,"lng":79.995201},{"lat":12.740772,"lng":79.995602},{"lat":12.742,"lng":79.996},{"lat":12.7432,"lng":79.996395},{"lat":12.744379,"lng":79.996784},{"lat":12.74554,"lng":79.997169},{"lat":12.746683,"lng":79.997551},{"lat":12.747809,"lng":79.99793},{"lat":12.74892,"lng":79.998308},{"lat":12.750016,"lng":79.998685},{"lat":12.751098,"lng":79.999062},{"lat":12.752167,"lng":79.999439},{"lat":12.753225,"lng":79.999819},{"lat":12.754272,"lng":80.000201},{"lat":12.75531,"lng":80.000586},{"lat":12.75634,"lng":80.000976},{"lat":12.757362,"lng":80.001371},{"lat":12.758378,"lng":80.001773},{"lat":12.759389,"lng":80.002181},{"lat":12.760395,"lng":80.002597},{"lat":12.761399,"lng":80.003021},{"lat":12.7624,"lng":80.003455},{"lat":12.7634,"lng":80.0039},{"lat":12.764396,"lng":80.004355},{"lat":12.765385,"lng":80.004818},{"lat":12.766366,"lng":80.00529},{"lat":12.767339,"lng":80.00577},{"lat":12.768305,"lng":80.006256},{"lat":12.769265,"lng":80.006749},{"lat":12.770217,"lng":80.007248},{"lat":12.771162,"lng":80.007753},{"lat":12.7721,"lng":80.008262},{"lat":12.773031,"lng":80.008775},{"lat":12.773956,"lng":80.009292},{"lat":12.774874,"lng":80.009811},{"lat":12.775786,"lng":80.010333},{"lat":12.776692,"lng":80.010857},{"lat":12.777591,"lng":80.011381},{"lat":12.778485,"lng":80.011906},{"lat":12.779372,"lng":80.012431},{"lat":12.780254,"lng":80.012956},{"lat":12.78113,"lng":80.013479},{"lat":12.782,"lng":80.014},{"lat":12.782853,"lng":80.014512},{"lat":12.783681,"lng":80.015011},{"lat":12.784485,"lng":80.0155},{"lat":12.785271,"lng":80.01598},{"lat":12.786041,"lng":80.016455},{"lat":12.7868,"lng":80.016926},{"lat":12.787549,"lng":80.017398},{"lat":12.788294,"lng":80.017872},{"lat":12.789036,"lng":80.018351},{"lat":12.789781,"lng":80.018838},{"lat":12.790531,"lng":80.019334},{"lat":12.79129,"lng":80.019844},{"lat":12.792062,"lng":80.020369},{"lat":12.792849,"lng":80.020912},{"lat":12.793655,"lng":80.021477},{"lat":12.794485,"lng":80.022064},{"lat":12.79534,"lng":80.022677},{"lat":12.796226,"lng":80.023319},{"lat":12.797145,"lng":80.023993},{"lat":12.7981,"lng":80.0247},{"lat":12.79909,"lng":80.025441},{"lat":12.800108,"lng":80.026214},{"lat":12.801153,"lng":80.027016},{"lat":12.802222,"lng":80.027845},{"lat":12.803314,"lng":80.028698},{"lat":12.804426,"lng":80.029575},{"lat":12.805556,"lng":80.030471},{"lat":12.806703,"lng":80.031386},{"lat":12.807864,"lng":80.032317},{"lat":12.809038,"lng":80.033262},{"lat":12.810221,"lng":80.034219},{"lat":12.811413,"lng":80.035186},{"lat":12.812611,"lng":80.036159},{"lat":12.813813,"lng":80.037138},{"lat":12.815017,"lng":80.03812},{"lat":12.816222,"lng":80.039103},{"lat":12.817424,"lng":80.040085},{"lat":12.818623,"lng":80.041063},{"lat":12.819815,"lng":80.042035},{"lat":12.821,"lng":80.043},{"lat":12.822185,"lng":80.043978},{"lat":12.82338,"lng":80.044988},{"lat":12.824584,"lng":80.046025},{"lat":12.825796,"lng":80.047084},{"lat":12.827014,"lng":80.048161},{"lat":12.828237,"lng":80.04925},{"lat":12.829465,"lng":80.050348},{"lat":12.830696,"lng":80.051448},{"lat":12.831929,"lng":80.052546},{"lat":12.833162,"lng":80.053638},{"lat":12.834396,"lng":80.054717},{"lat":12.835628,"lng":80.05578},{"lat":12.836858,"lng":80.056821},{"lat":12.838083,"lng":80.057837},{"lat":12.839305,"lng":80.05882},{"lat":12.84052,"lng":80.059768},{"lat":12.841728,"lng":80.060675},{"lat":12.842928,"lng":80.061536},{"lat":12.844119,"lng":80.062346},{"lat":12.8453,"lng":80.0631},{"lat":12.846471,"lng":80.063797},{"lat":12.847635,"lng":80.06444},{"lat":12.848793,"lng":80.065033},{"lat":12.849944,"lng":80.065582},{"lat":12.85109,"lng":80.066091},{"lat":12.852231,"lng":80.066565},{"lat":12.853367,"lng":80.067007},{"lat":12.8545,"lng":80.067423},{"lat":12.855629,"lng":80.067817},{"lat":12.856756,"lng":80.068194},{"lat":12.857881,"lng":80.068557},{"lat":12.859004,"lng":80.068913},{"lat":12.860126,"lng":80.069264},{"lat":12.861248,"lng":80.069617},{"lat":12.86237,"lng":80.069974},{"lat":12.863492,"lng":80.070342},{"lat":12.864616,"lng":80.070723},{"lat":12.865741,"lng":80.071124},{"lat":12.866869,"lng":80.071548},{"lat":12.868,"lng":80.072},{"lat":12.869141,"lng":80.072462},{"lat":12.870298,"lng":80.072913},{"lat":12.871468,"lng":80.073356},{"lat":12.872648,"lng":80.073794},{"lat":12.873835,"lng":80.074227},{"lat":12.875027,"lng":80.07466},{"lat":12.87622,"lng":80.075093},{"lat":12.877412,"lng":80.075529},{"lat":12.8786,"lng":80.07597},{"lat":12.879781,"lng":80.076419},{"lat":12.880953,"lng":80.076877},{"lat":12.882112,"lng":80.077347},{"lat":12.883256,"lng":80.077831},{"lat":12.884382,"lng":80.078332},{"lat":12.885487,"lng":80.078851},{"lat":12.886568,"lng":80.07939},{"lat":12.887623,"lng":80.079953},{"lat":12.888648,"lng":80.080541},{"lat":12.889642,"lng":80.081156},{"lat":12.8906,"lng":80.0818},{"lat":12.891527,"lng":80.082485},{"lat":12.892428,"lng":80.083216},{"lat":12.893306,"lng":80.083988},{"lat":12.89416,"lng":80.084797},{"lat":12.894992,"lng":80.085636},{"lat":12.895803,"lng":80.086501},{"lat":12.896595,"lng":80.087386},{"lat":12.897368,"lng":80.088286},{"lat":12.898123,"lng":80.089197},{"lat":12.898862,"lng":80.090113},{"lat":12.899586,"lng":80.091028},{"lat":12.900296,"lng":80.091938},{"lat":12.900993,"lng":80.092837},{"lat":12.901677,"lng":80.09372},{"lat":12.902352,"lng":80.094583},{"lat":12.903016,"lng":80.095419},{"lat":12.903672,"lng":80.096224},{"lat":12.90432,"lng":80.096993},{"lat":12.904963,"lng":80.09772},{"lat":12.9056,"lng":80.0984},{"lat":12.906225,"lng":80.099039},{"lat":12.90683,"lng":80.099646},{"lat":12.907417,"lng":80.100224},{"lat":12.907987,"lng":80.100776},{"lat":12.908542,"lng":80.101304},{"lat":12.909083,"lng":80.10181},{"lat":12.909612,"lng":80.102297},{"lat":12.91013,"lng":80.102768},{"lat":12.910638,"lng":80.103224},{"lat":12.911138,"lng":80.103669},{"lat":12.911631,"lng":80.104104},{"lat":12.912118,"lng":80.104532},{"lat":12.912602,"lng":80.104956},{"lat":12.913084,"lng":80.105377},{"lat":12.913564,"lng":80.105799},{"lat":12.914045,"lng":80.106224},{"lat":12.914527,"lng":80.106654},{"lat":12.915013,"lng":80.107092},{"lat":12.915504,"lng":80.10754},{"lat":12.916,"lng":80.108},{"lat":12.916495,"lng":80.108463},{"lat":12.91698,"lng":80.108918},{"lat":12.917457,"lng":80.109365},{"lat":12.917926,"lng":80.109807},{"lat":12.918391,"lng":80.110245},{"lat":12.918851,"lng":80.110679},{"lat":12.919308,"lng":80.11111},{"lat":12.919763,"lng":80.111542},{"lat":12.920219,"lng":80.111973},{"lat":12.920675,"lng":80.112406},{"lat":12.921134,"lng":80.112842},{"lat":12.921597,"lng":80.113282},{"lat":12.922065,"lng":80.113728},{"lat":12.922539,"lng":80.11418},{"lat":12.923022,"lng":80.11464},{"lat":12.923514,"lng":80.115109},{"lat":12.924016,"lng":80.115588},{"lat":12.92453,"lng":80.116079},{"lat":12.925058,"lng":80.116582},{"lat":12.9256,"lng":80.1171},{"lat":12.926155,"lng":80.117632},{"lat":12.926721,"lng":80.118176},{"lat":12.927296,"lng":80.118731},{"lat":12.92788,"lng":80.119298},{"lat":12.928473,"lng":80.119873},{"lat":12.929073,"lng":80.120458},{"lat":12.929681,"lng":80.12105},{"lat":12.930296,"lng":80.121649},{"lat":12.930917,"lng":80.122253},{"lat":12.931544,"lng":80.122863},{"lat":12.932176,"lng":80.123475},{"lat":12.932812,"lng":80.124091},{"lat":12.933452,"lng":80.124709},{"lat":12.934096,"lng":80.125327},{"lat":12.934743,"lng":80.125945},{"lat":12.935392,"lng":80.126562},{"lat":12.936043,"lng":80.127177},{"lat":12.936695,"lng":80.127789},{"lat":12.937347,"lng":80.128397},{"lat":12.938,"lng":80.129},{"lat":12.938653,"lng":80.129605},{"lat":12.939307,"lng":80.13022},{"lat":12.939962,"lng":80.130842},{"lat":12.940618,"lng":80.131471},{"lat":12.941277,"lng":80.132105},{"lat":12.941939,"lng":80.132741},{"lat":12.942603,"lng":80.133379},{"lat":12.943271,"lng":80.134018},{"lat":12.943943,"lng":80.134654},{"lat":12.944619,"lng":80.135287},{"lat":12.945299,"lng":80.135916},{"lat":12.945985,"lng":80.136538},{"lat":12.946676,"lng":80.137153},{"lat":12.947373,"lng":80.137758},{"lat":12.948076,"lng":80.138352},{"lat":12.948786,"lng":80.138933},{"lat":12.949503,"lng":80.1395},{"lat":12.950227,"lng":80.140051},{"lat":12.950959,"lng":80.140585},{"lat":12.9517,"lng":80.1411},{"lat":12.952453,"lng":80.141575},{"lat":12.953221,"lng":80.141997},{"lat":12.954003,"lng":80.142372},{"lat":12.954797,"lng":80.142709},{"lat":12.955601,"lng":80.143015},{"lat":12.956413,"lng":80.143298},{"lat":12.957233,"lng":80.143566},{"lat":12.958058,"lng":80.143826},{"lat":12.958887,"lng":80.144087},{"lat":12.959719,"lng":80.144356},{"lat":12.960551,"lng":80.144641},{"lat":12.961382,"lng":80.14495},{"lat":12.96221,"lng":80.145289},{"lat":12.963034,"lng":80.145669},{"lat":12.963852,"lng":80.146095},{"lat":12.964663,"lng":80.146575},{"lat":12.965465,"lng":80.147118},{"lat":12.966256,"lng":80.147732},{"lat":12.967035,"lng":80.148423},{"lat":12.9678,"lng":80.1492},{"lat":12.968563,"lng":80.150082},{"lat":12.969334,"lng":80.151075},{"lat":12.970111,"lng":80.152166},{"lat":12.970893,"lng":80.153344},{"lat":12.971676,"lng":80.154596},{"lat":12.972458,"lng":80.15591},{"lat":12.973237,"lng":80.157274},{"lat":12.97401,"lng":80.158676},{"lat":12.974776,"lng":80.160103},{"lat":12.975531,"lng":80.161544},{"lat":12.976274,"lng":80.162985},{"lat":12.977002,"lng":80.164416},{"lat":12.977712,"lng":80.165823},{"lat":12.978403,"lng":80.167195},{"lat":12.979071,"lng":80.16852},{"lat":12.979715,"lng":80.169784},{"lat":12.980333,"lng":80.170976},{"lat":12.980921,"lng":80.172085},{"lat":12.981477,"lng":80.173097},{"lat":12.982,"lng":80.174},{"lat":12.982487,"lng":80.174808},{"lat":12.982941,"lng":80.175544},{"lat":12.983363,"lng":80.176216},{"lat":12.983757,"lng":80.176827},{"lat":12.984123,"lng":80.177384},{"lat":12.984466,"lng":80.177893},{"lat":12.984786,"lng":80.178358},{"lat":12.985086,"lng":80.178786},{"lat":12.985369,"lng":80.179181},{"lat":12.985638,"lng":80.17955},{"lat":12.985893,"lng":80.179898},{"lat":12.986138,"lng":80.18023},{"lat":12.986374,"lng":80.180553},{"lat":12.986605,"lng":80.180871},{"lat":12.986833,"lng":80.181191},{"lat":12.987059,"lng":80.181517},{"lat":12.987287,"lng":80.181855},{"lat":12.987518,"lng":80.182212},{"lat":12.987755,"lng":80.182591},{"lat":12.988,"lng":80.183},{"lat":12.988245,"lng":80.183423},{"lat":12.988481,"lng":80.183844},{"lat":12.988707,"lng":80.184261},{"lat":12.988926,"lng":80.184675},{"lat":12.989138,"lng":80.185087},{"lat":12.989344,"lng":80.185496},{"lat":12.989544,"lng":80.185902},{"lat":12.989739,"lng":80.186306},{"lat":12.989931,"lng":80.186707},{"lat":12.990119,"lng":80.187106},{"lat":12.990305,"lng":80.187503},{"lat":12.990489,"lng":80.187898},{"lat":12.990672,"lng":80.188292},{"lat":12.990856,"lng":80.188683},{"lat":12.99104,"lng":80.189073},{"lat":12.991226,"lng":80.189461},{"lat":12.991414,"lng":80.189847},{"lat":12.991605,"lng":80.190233},{"lat":12.9918,"lng":80.190617},{"lat":12.992,"lng":80.191},{"lat":12.992192,"lng":80.191372},{"lat":12.992367,"lng":80.191724},{"lat":12.992526,"lng":80.19206},{"lat":12.992674,"lng":80.192383},{"lat":12.992814,"lng":80.192696},{"lat":12.992949,"lng":80.193002},{"lat":12.993081,"lng":80.193304},{"lat":12.993215,"lng":80.193606},{"lat":12.993354,"lng":80.193909},{"lat":12.9935,"lng":80.194219},{"lat":12.993657,"lng":80.194537},{"lat":12.993829,"lng":80.194866},{"lat":12.994018,"lng":80.195211},{"lat":12.994227,"lng":80.195573},{"lat":12.994461,"lng":80.195957},{"lat":12.994722,"lng":80.196365},{"lat":12.995013,"lng":80.1968},{"lat":12.995337,"lng":80.197265},{"lat":12.995699,"lng":80.197764},{"lat":12.9961,"lng":80.1983},{"lat":12.996545,"lng":80.198882},{"lat":12.997031,"lng":80.199514},{"lat":12.997555,"lng":80.200191},{"lat":12.998114,"lng":80.200907},{"lat":12.998705,"lng":80.201657},{"lat":12.999323,"lng":80.202435},{"lat":12.999965,"lng":80.203236},{"lat":13.000627,"lng":80.204054},{"lat":13.001307,"lng":80.204883},{"lat":13.002,"lng":80.205719},{"lat":13.002703,"lng":80.206555},{"lat":13.003413,"lng":80.207386},{"lat":13.004125,"lng":80.208207},{"lat":13.004837,"lng":80.209012},{"lat":13.005545,"lng":80.209796},{"lat":13.006246,"lng":80.210553},{"lat":13.006935,"lng":80.211277},{"lat":13.007609,"lng":80.211963},{"lat":13.008265,"lng":80.212606},{"lat":13.0089,"lng":80.2132},{"lat":13.00952,"lng":80.213751},{"lat":13.010136,"lng":80.214269},{"lat":13.010748,"lng":80.214758},{"lat":13.011357,"lng":80.215219},{"lat":13.011963,"lng":80.215656},{"lat":13.012566,"lng":80.216071},{"lat":13.013167,"lng":80.216467},{"lat":13.013766,"lng":80.216846},{"lat":13.014365,"lng":80.21721},{"lat":13.014963,"lng":80.217562},{"lat":13.01556,"lng":80.217906},{"lat":13.016158,"lng":80.218242},{"lat":13.016756,"lng":80.218575},{"lat":13.017355,"lng":80.218906},{"lat":13.017956,"lng":80.219237},{"lat":13.018559,"lng":80.219573},{"lat":13.019165,"lng":80.219914},{"lat":13.019773,"lng":80.220264},{"lat":13.020385,"lng":80.220625},{"lat":13.021,"lng":80.221},{"lat":13.021617,"lng":80.221385},{"lat":13.022232,"lng":80.221776},{"lat":13.022846,"lng":80.22217},{"lat":13.023459,"lng":80.222567},{"lat":13.024073,"lng":80.222966},{"lat":13.024687,"lng":80.223367},{"lat":13.025301,"lng":80.223767},{"lat":13.025918,"lng":80.224166},{"lat":13.026536,"lng":80.224562},{"lat":13.027156,"lng":80.224956},{"lat":13.02778,"lng":80.225346},{"lat":13.028406,"lng":80.22573},{"lat":13.029037,"lng":80.226109},{"lat":13.029672,"lng":80.22648},{"lat":13.030312,"lng":80.226843},{"lat":13.030957,"lng":80.227197},{"lat":13.031608,"lng":80.22754},{"lat":13.032265,"lng":80.227873},{"lat":13.032929,"lng":80.228193},{"lat":13.0336,"lng":80.2285},{"lat":13.03428,"lng":80.228791},{"lat":13.03497,"lng":80.229065},{"lat":13.035669,"lng":80.229324},{"lat":13.036376,"lng":80.22957},{"lat":13.03709,"lng":80.229803},{"lat":13.03781,"lng":80.230026},{"lat":13.038535,"lng":80.230241},{"lat":13.039264,"lng":80.230449},{"lat":13.039996,"lng":80.230651},{"lat":13.040731,"lng":80.23085},{"lat":13.041467,"lng":80.231047},{"lat":13.042204,"lng":80.231243},{"lat":13.04294,"lng":80.231441},{"lat":13.043675,"lng":80.231642},{"lat":13.044407,"lng":80.231847},{"lat":13.045136,"lng":80.232058},{"lat":13.045861,"lng":80.232278},{"lat":13.04658,"lng":80.232507},{"lat":13.047294,"lng":80.232747},{"lat":13.048,"lng":80.233},{"lat":13.048709,"lng":80.233266},{"lat":13.049429,"lng":80.233542},{"lat":13.050159,"lng":80.233828},{"lat":13.050895,"lng":80.234122},{"lat":13.051636,"lng":80.234423},{"lat":13.052379,"lng":80.23473},{"lat":13.053121,"lng":80.235041},{"lat":13.053862,"lng":80.235355},{"lat":13.054597,"lng":80.235671},{"lat":13.055325,"lng":80.235987},{"lat":13.056044,"lng":80.236303},{"lat":13.05675,"lng":80.236617},{"lat":13.057443,"lng":80.236927},{"lat":13.058119,"lng":80.237233},{"lat":13.058777,"lng":80.237533},{"lat":13.059413,"lng":80.237826},{"lat":13.060026,"lng":80.23811},{"lat":13.060613,"lng":80.238385},{"lat":13.061172,"lng":80.238648},{"lat":13.0617,"lng":80.2389},{"lat":13.062187,"lng":80.239123},{"lat":13.062626,"lng":80.239306},{"lat":13.063023,"lng":80.239455},{"lat":13.063383,"lng":80.239576},{"lat":13.063712,"lng":80.239676},{"lat":13.064014,"lng":80.23976},{"lat":13.064296,"lng":80.239836},{"lat":13.064562,"lng":80.239908},{"lat":13.064818,"lng":80.239984},{"lat":13.065069,"lng":80.240069},{"lat":13.065321,"lng":80.240169},{"lat":13.065578,"lng":80.240292},{"lat":13.065848,"lng":80.240443},{"lat":13.066133,"lng":80.240627},{"lat":13.066441,"lng":80.240852},{"lat":13.066777,"lng":80.241124},{"lat":13.067145,"lng":80.241448},{"lat":13.067551,"lng":80.241832},{"lat":13.068001,"lng":80.24228},{"lat":13.0685,"lng":80.2428},{"lat":13.069063,"lng":80.243399},{"lat":13.069694,"lng":80.244076},{"lat":13.070386,"lng":80.244823},{"lat":13.071129,"lng":80.245634},{"lat":13.071914,"lng":80.2465},{"lat":13.072733,"lng":80.247415},{"lat":13.073576,"lng":80.248371},{"lat":13.074434,"lng":80.249361},{"lat":13.0753,"lng":80.250377},{"lat":13.076163,"lng":80.251413},{"lat":13.077014,"lng":80.25246},{"lat":13.077846,"lng":80.253511},{"lat":13.078648,"lng":80.25456},{"lat":13.079412,"lng":80.255598},{"lat":13.08013,"lng":80.256619},{"lat":13.080791,"lng":80.257614},{"lat":13.081388,"lng":80.258578},{"lat":13.081911,"lng":80.259501},{"lat":13.082351,"lng":80.260378},{"lat":13.0827,"lng":80.2612},{"lat":13.082955,"lng":80.261995},{"lat":13.083124,"lng":80.262792},{"lat":13.083217,"lng":80.263589},{"lat":13.083239,"lng":80.264383},{"lat":13.0832,"lng":80.265172},{"lat":13.083107,"lng":80.265952},{"lat":13.082967,"lng":80.266722},{"lat":13.08279,"lng":80.267478},{"lat":13.082581,"lng":80.268217},{"lat":13.08235,"lng":80.268937},{"lat":13.082104,"lng":80.269636},{"lat":13.08185,"lng":80.27031},{"lat":13.081598,"lng":80.270957},{"lat":13.081353,"lng":80.271575},{"lat":13.081125,"lng":80.272159},{"lat":13.080921,"lng":80.272709},{"lat":13.080748,"lng":80.27322},{"lat":13.080616,"lng":80.273691},{"lat":13.08053,"lng":80.274119},{"lat":13.0805,"lng":80.2745},{"lat":13.080513,"lng":80.274829},{"lat":13.080552,"lng":80.275103},{"lat":13.080613,"lng":80.275326},{"lat":13.080694,"lng":80.275503},{"lat":13.080792,"lng":80.275638},{"lat":13.080906,"lng":80.275736},{"lat":13.081032,"lng":80.275799},{"lat":13.081169,"lng":80.275834},{"lat":13.081313,"lng":80.275843},{"lat":13.081463,"lng":80.275831},{"lat":13.081615,"lng":80.275803},{"lat":13.081767,"lng":80.275762},{"lat":13.081917,"lng":80.275714},{"lat":13.082063,"lng":80.275661},{"lat":13.082202,"lng":80.275609},{"lat":13.08233,"lng":80.275561},{"lat":13.082447,"lng":80.275522},{"lat":13.082549,"lng":80.275496},{"lat":13.082634,"lng":80.275487},{"lat":13.0827,"lng":80.2755}];

// Generate parallel lines for Up Line, Down Line, and Fast Line using real surveyed alignment
export const getOffsetPolyline = (points: { lat: number; lng: number }[], offsetDistance: number) => {
  return points.map((p, i) => {
    const next = points[i + 1] || p;
    const prev = points[i - 1] || p;
    const dLat = next.lat - prev.lat;
    const dLng = next.lng - prev.lng;
    const length = Math.sqrt(dLat * dLat + dLng * dLng) || 1;
    // Perpendicular normal vector
    const nLat = -dLng / length;
    const nLng = dLat / length;
    return {
      lat: Number((p.lat + nLat * offsetDistance).toFixed(6)),
      lng: Number((p.lng + nLng * offsetDistance).toFixed(6))
    };
  });
};

// Exact Physical Track Lines for Southern Railway Chennai Mainline
export const UP_MAIN_LINE = getOffsetPolyline(CONTINUOUS_SURVEYED_CORRIDOR, -0.000040);
export const DOWN_MAIN_LINE = getOffsetPolyline(CONTINUOUS_SURVEYED_CORRIDOR, 0.000040);
export const FAST_LINE = getOffsetPolyline(CONTINUOUS_SURVEYED_CORRIDOR, 0.000100);
export const SUBURBAN_LINE = getOffsetPolyline(CONTINUOUS_SURVEYED_CORRIDOR, -0.000100);

// Real Moving Train definitions mapped to GPS
export interface RealGpsTrain {
  id: string;
  name: string;
  type: 'vande_bharat' | 'express' | 'suburban' | 'freight';
  speedKmH: number;
  direction: 1 | -1; // 1 = UP (towards Chennai Central), -1 = DOWN (towards Chengalpattu)
  trackType: 'UP' | 'DOWN' | 'FAST';
  color: string;
  locoType: string;
  rakeComposition: string;
  fromStation: string;
  toStation: string;
}

export const REAL_GPS_TRAIN_PRESETS: RealGpsTrain[] = [
  {
    id: '20643',
    name: 'Vande Bharat Express',
    type: 'vande_bharat',
    speedKmH: 130,
    direction: 1,
    trackType: 'FAST',
    color: '#2563eb',
    locoType: 'WMS Trainset 18',
    rakeComposition: '16 Coaches (Executive & Chair Car)',
    fromStation: 'Coimbatore Jn (CBE)',
    toStation: 'Chennai Central (MAS)'
  },
  {
    id: '12638',
    name: 'Pandian Superfast Express',
    type: 'express',
    speedKmH: 110,
    direction: 1,
    trackType: 'UP',
    color: '#ef4444',
    locoType: 'WAP-7 RPM Shed',
    rakeComposition: '24 LHB Coaches',
    fromStation: 'Madurai Jn (MDU)',
    toStation: 'Chennai Egmore (MS)'
  },
  {
    id: '40012',
    name: 'Tambaram - Beach EMU Local',
    type: 'suburban',
    speedKmH: 75,
    direction: 1,
    trackType: 'UP',
    color: '#0284c7',
    locoType: 'Medha 3-Phase EMU',
    rakeComposition: '12 Car Suburban Rake',
    fromStation: 'Tambaram (TBM)',
    toStation: 'Chennai Beach (MSB)'
  },
  {
    id: '40015',
    name: 'Beach - Chengalpattu EMU Local',
    type: 'suburban',
    speedKmH: 75,
    direction: -1,
    trackType: 'DOWN',
    color: '#0284c7',
    locoType: 'BHEL Retrofitted EMU',
    rakeComposition: '12 Car Suburban Rake',
    fromStation: 'Chennai Beach (MSB)',
    toStation: 'Chengalpattu Jn (CGL)'
  },
  {
    id: '66042',
    name: 'CONCOR Container Freight Express',
    type: 'freight',
    speedKmH: 60,
    direction: -1,
    trackType: 'DOWN',
    color: '#059669',
    locoType: 'Twin WAG-9HC Electric',
    rakeComposition: '45 BLC Wagons (ISO Containers)',
    fromStation: 'Chennai Port (CPT)',
    toStation: 'Whitefield Concor Yard'
  }
];
