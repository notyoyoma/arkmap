var mapUrl = 'https://s3.amazonaws.com/arkmaptiles/{z}/{x}/{y}.png';

var map = L.map('map').setView([0,0],0);

var mapMap = L.tileLayer(mapUrl, {
  minZoom: 1,
  maxZoom: 6,
  attribution: 'ARK: Survival Evolved',
  tms: true,
  continuousWorld: false,
  noWrap: true,
  detectRetina: true,
  worldCopyJump: false, 
  crs: L.CRS.Direct
}).addTo(map);
