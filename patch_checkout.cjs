const fs = require('fs');
const path = 'src/pages/Checkout.jsx';
let content = fs.readFileSync(path, 'utf8');

const hqIconCode = `// Custom Company HQ Icon
const hqIcon = L.divIcon({
  className: 'custom-div-icon',
  html: \`
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-pink-500/30 rounded-full animate-ping"></div>
      <div class="absolute w-8 h-8 bg-pink-500/50 rounded-full animate-pulse"></div>
      <div class="relative w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
        <span class="text-[10px] font-black text-white">SH</span>
      </div>
    </div>
  \`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});
`;

const mapCode = `
                 <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 relative z-0 shadow-2xl group/map">
                    <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none z-10 rounded-2xl opacity-50"></div>
                    <MapContainer 
                        center={[30.3753, 69.3451]} 
                        zoom={5} 
                        style={{ height: "100%", width: "100%", background: "#030014" }}
                        maxBounds={PAKISTAN_BOUNDS}
                        minZoom={5}
                    >
                         <TileLayer 
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' 
                         />
                         
                         {/* Pakistan Highlight */}
                         {pakistanGeoJson && (
                            <L.GeoJSON 
                                data={pakistanGeoJson} 
                                style={() => ({
                                    color: "#EC4899",
                                    weight: 2,
                                    opacity: 0.6,
                                    fillColor: "#EC4899",
                                    fillOpacity: 0.05,
                                    dashArray: '5, 10'
                                })}
                            />
                         )}

                         {/* ShopHub.pro HQ Marker */}
                         <Marker 
                            position={[30.5229, 72.6981]} 
                            icon={hqIcon}
                         >
                            <L.Popup className="custom-popup">
                                <div className="text-center p-2">
                                    <h4 className="font-black text-pink-500 uppercase tracking-tighter mb-1">ShopHub.pro HQ</h4>
                                    <p className="text-[10px] text-gray-600 font-bold">Chichawatni, Pakistan</p>
                                    <a 
                                        href="https://maps.app.goo.gl/Zy26FTzxMHys5mSu9" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-block mt-2 text-[10px] bg-pink-500 text-white px-2 py-1 rounded-full font-bold"
                                    >
                                        View on Google Maps
                                    </a>
                                </div>
                            </L.Popup>
                         </Marker>

                         <LocationMarker position={location} setPosition={setLocation} />
                    </MapContainer>
                 </div>`;

// Ensure hqIcon is there (it might already be there from a partial success)
if (!content.includes('const hqIcon =')) {
    content = content.replace('L.Marker.prototype.options.icon = DefaultIcon;', 'L.Marker.prototype.options.icon = DefaultIcon;\n\n' + hqIconCode);
}

// Clean up incorrectly inserted map code in ComingSoonModal if present
content = content.replace(/We're currently fine-tuning our.*?Credit Card.*?<\/span> payment gateway to ensure maximum security\.\s*<\/p>\s*<div className="h-\[400px\].*?<\/MapContainer>\s*<\/div>/s, (match) => {
    return match.split('<div className="h-[400px]')[0];
});

// Insert map into the correct slot
if (!content.includes('group/map')) {
    content = content.replace('<div className="flex justify-between items-center mt-3">', mapCode + '\n                 <div className="flex justify-between items-center mt-3">');
}

fs.writeFileSync(path, content);
console.log('Patch applied successfully');
