import { useEffect, useState } from "react";
import styles from "./app.module.css";
import GoogleMapReact from "google-map-react";
import ReactGoogleAutocomplete from "react-google-autocomplete";

function App() {
  const [lat, setLat] = useState(20.290276);
  const [lng, setLng] = useState(79.655479);

  const [position, setPosition] = useState();

  const updatePosition = (map) => {
    const newPosition = new google.maps.Marker({
      position: { lat: Number(lat), lng: Number(lng) },
      map,
      draggable: true,
      geodesic: true,
    });

    google.maps.event.addListener(newPosition, "dragend", () => {
      const updatedCoordinates = newPosition.getPosition();
      setLat(updatedCoordinates.lat());
      setLng(updatedCoordinates.lng());
    });

    setPosition(newPosition);
  };

  useEffect(() => {
    if (position) {
      position.setOptions({ position: { lat: Number(lat), lng: Number(lng) } });
    }
  }, [lat, lng]);

  return (
    <section className={`${styles.page}`}>
      <div className={`${styles.leftDiv}`}>
        <label>latitude</label>
        <input
          placeholder="Enter the latitude"
          type="number"
          value={lat}
          onChange={(e) => setLat(+e.target.value)}
        />
        <label>longitudes</label>
        <input
          placeholder="Enter the longitude"
          type="number"
          value={lng}
          onChange={(e) => setLng(+e.target.value)}
        />

        <p>or</p>
        <label>enter your address</label>
        <ReactGoogleAutocomplete
          libraries={["places"]}
          apiKey={import.meta.env.VITE_GOOGLE_KEY}
          onPlaceSelected={(place) => {
            setLat(place.geometry.location.lat());
            setLng(place.geometry.location.lat());
          }}
        />
      </div>
      <div className={`${styles.rightDiv}`}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: import.meta.env.VITE_GOOGLE_KEY,
            libraries: ["places"],
          }}
          defaultCenter={{ lat: Number(lat), lng: Number(lng) }}
          center={{ lat: Number(lat), lng: Number(lng) }}
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => updatePosition(map)}
          // onChange={(e) => console.log(e)}
          onZoomAnimationEnd={(e) => {
            position.setOptions({
              radius: 10000 / (e * 10),
            });
          }}
        />
      </div>
    </section>
  );
}

export default App;
