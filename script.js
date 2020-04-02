require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Feature"
], function(ArcGISMap, MapView, FeatureLayer, Feature) {
  // const parent = document.getElementById("viewDiv");
  // const tooltip = document.createElement("div"); 
  // tooltip.id = "tooltip";
  // tooltip.role = "tooltip";
  // tooltip.style.dispaly = 'none';
  // parent.parentElement.appendChild(tooltip);

  const tooltip = document.getElementById("tooltip");


  const layer = new FeatureLayer({
    portalItem: {
      id: "a3c1297d7ca64a02a14edd3b70406011"
    },
    outFields: ["*"],
    popupEnabled: false
  });

  const map = new ArcGISMap({
    layers: [layer],
    basemap: "gray-vector"
  });
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-100, 42],
    zoom: 5
  });

  const featureWidget = new Feature({ view, container: tooltip });
  
  let layerView;
  
  view.whenLayerView(layer).then(result => layerView = result);

  view.on("pointer-move", event => {
    const { x, y } = event;
    view.hitTest(event).then(({ results }) => {
      if (layerView) {
        layerView.effect = null;
      }
      if (results.length) {
        tooltip.style.display = "block";
        tooltip.style.top = `${y - 75}px`;
        tooltip.style.left = `${x - 310/2}px`;
        const g = results[0].graphic;
        if (g.geometry) {
          const oid = g.attributes.OBJECTID;

          const graphic = {
            attributes : g.attributes,
            popupTemplate: {
              content: g.layer.popupTemplate.title
            }
          };
          
          featureWidget.graphic = graphic;
          if (layerView) {
            layerView.effect = {
              filter: {
                where: `OBJECTID = ${oid}`
              },
              excludedEffect: "opacity(20%) saturate(30%)",
              // includedEffect: "sepia(50%)"
            };
          }
        } else {
          tooltip.style.display = "none";
        }
      } else {
        tooltip.style.display = "none";
      }
    });
  });
});
