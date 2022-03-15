import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();
  const { center, zoom } = props;

  // will run after the JSX has been rendered, so the ref has been binded --> our goal
  // if we don't create map inside useEffect,
  //   it'll try to render the map BEFORE binding it with the component
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    // create a new marker at the center of the map
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
