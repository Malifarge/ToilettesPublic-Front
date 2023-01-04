/* eslint-disable react-hooks/exhaustive-deps */

import { Icon} from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer,Marker,Popup } from "react-leaflet";
import styled from "styled-components";
import Input from "./Input";

const MapBox= styled.article`
width: 50%;
@media screen and (max-width: 768px) {
  width: 100%
}
`

const Container = styled.section`
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    padding: 100px;
    display: flex;
    @media screen and (max-width: 768px) {
        flex-direction: column;
        padding: 50px;
      }
`

const PositionBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const FormBox= styled.article`
  width: 50%;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  gap: 10px
  @media screen and (max-width: 768px) {
    width: 100%
  }
`

const Form = styled.form`
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  gap: 10px
`
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon-2x.png',
  iconSize: [32, 50]
})

const markerIcon2 = new Icon({
  iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|e85141&chf=a,s,ee00FFFF',
  iconSize: [32, 50]
})

const Map = ()=>{

  const [geo,setGeo]=useState(false)
  const [latitude,setlatitude] =useState("48.858370")
  const [longitude,setLongitude] =useState("2.294481")
  const [position,setPosition] = useState({lat: "48.858370",lng:"2.294481"})
  const [r,setR] = useState(1)
  const [toilettes,setToilettes] = useState([])
  const [newLatitude,setNewLatitude] = useState("")
  const [newLongitude,setNewLongitude] = useState("")


    useEffect(()=>{
      if(geo){
        navigator.geolocation.getCurrentPosition((position) => {
          setlatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setPosition({lat:position.coords.latitude, lng:position.coords.longitude})
        }, (error) => {
          console.error(error);
        })
      }
    },[geo])

    useEffect(()=>{
      fetchtoilettes()
    },[position])

    useEffect(()=>{
      fetchtoilettes()
    },[r])

    const fetchtoilettes = async()=>{
      const request = await fetch(`http://localhost:5000/toilettes?r=${r}&latitude=${latitude}&longitude=${longitude}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const response = await request.json()
      setToilettes(response)
    }

    const handleGeoChange = e =>{
      if(e.target.checked){
        setGeo(true)
      }else{
        setGeo(false)
        setlatitude("48.858370")
        setLongitude("2.294481")
        setPosition({lat: "48.858370",lng:"2.294481"})
      }
    }

    const handleLatitudeChange = e =>{
      setNewLatitude(e.target.value)
    }

    const handleLongitudeChange = e =>{
      setNewLongitude(e.target.value)
    }

    const handleRadiusChange = e =>{
      setR(e.target.value)
    }

    const handlePosSubmit = e =>{
      e.preventDefault()
      setlatitude(newLatitude)
      setLongitude(newLongitude)
      setPosition({lat: newLatitude, lng: newLongitude})
    }

    return(
        <Container>
            <MapBox>
              <PositionBox>
                <p>lat: {latitude} / lng: {longitude}</p>
                <Input name="geo" texte="Voulez-vous activez la geolocalisation" handleChange={handleGeoChange} type="checkbox"/>
              </PositionBox>
              <MapContainer center={position} zoom={20} scrollWheelZoom={true} style={{
              "height": "100%"
              }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={markerIcon2}>
              <Popup>
                Ma position
              </Popup>
            </Marker>
            {toilettes.length>0 && toilettes.map(toilette=>{
              return(<Marker position={{lat:toilette.position.coordinates[1],lng:toilette.position.coordinates[0]}} icon={markerIcon} key={toilette.id}>
                  <Popup>
                    <p>{toilette.adresse}  </p>                  
                    <p>{toilette.arrondissement}</p>
                    <p>{toilette.horaire}</p>
                  </Popup>
              </Marker>)
            })}
          </MapContainer>
        </MapBox>
        <FormBox>
            <Form onSubmit={handlePosSubmit}>
                <Input type="text" name="latitude" handleChange={handleLatitudeChange} value={newLatitude} texte="latitude"/>
                <Input type="text" name="longitude" handleChange={handleLongitudeChange} value={newLongitude} texte="longitude"/>
                <button type="input">Valider</button>
            </Form>
            <Input type="range" name="radius" handleChange={handleRadiusChange} min='0' max="10"/>
        </FormBox>

      </Container>
        
    )
}

export default Map