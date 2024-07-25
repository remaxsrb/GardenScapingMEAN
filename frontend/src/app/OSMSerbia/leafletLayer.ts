import * as L from 'leaflet';

export const OSMSrbija = L.TileLayer.extend({
  getTileUrl: function(coords: L.Coords) { // Explicitly define coords as L.Coords
    const layerBounds = new L.LatLngBounds(
      new L.LatLng(47.14, 11.15),
      new L.LatLng(40.88, 25.41)
    );
    const coordBounds = this._tileCoordsToBounds(coords);

    if (coords.z >= 6 && layerBounds.contains(coordBounds)) {
      return `https://tiles.openstreetmap.rs/cir/${coords.z}/${coords.x}/${coords.y}.png`;
    } else {
      return `https://c.tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`;
    }
  },

  getAttribution: function() {
    return "<a href='https://openstreetmap.rs'>OpenStreetMap Serbia</a>";
  }
});

export function tileLayerOSMSrbija() {
  return new OSMSrbija();
}
