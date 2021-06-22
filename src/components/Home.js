import React, {useEffect, useState} from 'react';
import './Home.css';
import {Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'

function Home() {
  const [breedList, setBreedList] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [subBreedList, setSubBreedList] = useState([]);
  const [selectedSubBreed, setSelectedSubBreed] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(0);
  const [images, setImages] = useState([]);
  const [breedSelected, setBreedSelected] = useState(true);
  const [subBreedSelected, setSubBreedSelected] = useState(true);
  const [numberSelected, setNumberSelected] = useState(true);

  useEffect(()=> {
      return fetch('https://dog.ceo/api/breeds/list/all')
      .then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson);
          setBreedList(responseJson.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getContent = () => {
    const content = [];
    const breedListArranged = [];
    const subBreedListArranged = [];
    if(breedList) {
      Object.keys(breedList).map((key) => {
        breedListArranged.push (<option value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>);
      });
    }
    if(subBreedList) {
      (subBreedList).map((key) => {
        subBreedListArranged.push ({value : key, label: key.charAt(0).toUpperCase() + key.slice(1)});
      });
    }
    const numbers = [];
    for(let index=1; index<15; index++) {
      numbers.push(<option value={index}>{index}</option>);
    }
    const classNameBreed = breedSelected ? "selectNode selectElement" : "selectNode selectElement alertColor";
    content.push(
      <div className="selectContainer">
        <span>Breed</span>
        <select className={classNameBreed} style={{borderColor: breedSelected ? "" : "alertColor" }} onChange={(e)=>{loadSubBreed(e.target.value)}}>
          <option value="">Selelct</option>
          {Object.keys(breedList).map((key) => (
           <option value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          ))}
        </select>
      </div>);
    const classNameSubBreed = subBreedSelected ? "selectNode selectElement" : "selectNode selectElement alertColor";
    (subBreedList && subBreedList.length > 0) && content.push(
      <div className="selectContainer">
        <span>Sub breed</span>
          <select key={Math.random} className={classNameSubBreed}  onChange={(e)=>{setSelectedSubBreed(e.target.value); setSubBreedSelected(true);}}>
          <option value="">Selelct</option>
          {(subBreedList).map((key) => (
            <option value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          ))}
          </select>
      </div>);
    const classNameNumber = numberSelected ? "selectNode selectElement" : "selectNode selectElement alertColor";
    content.push(
      <div className="selectContainer">
        <span>Number Of Images</span>
        <select className={classNameNumber} onChange={(e)=>{setNumberOfImages(e.target.value); setNumberSelected(true);}}>
        <option value="">Selelct</option>
        {numbers}
        </select>
      </div>);
    content.push(<div className="buttonContainer"><span></span><Button variant={numberOfImages == 0 ? "secondary" : "primary"} onClick ={()=>loadImages()}>View Images</Button></div>);
    return(content);
  };

  const loadSubBreed = (breed) => {
    setSelectedBreed(breed);
    setSubBreedList([]);
    setSelectedSubBreed('');
    setImages([]);
    setNumberOfImages(0);
    breed ? setBreedSelected(true) : setBreedSelected(false);
    return fetch('https://dog.ceo/api/breed/'+ breed +'/list')
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "success") {
          setSubBreedList(responseJson.message);
        } else {
          setSubBreedList([]);
        }
      })
      .catch((error) => {
        console.error(error);
    });
  };

  const loadImages = () => {
    selectedBreed ? setBreedSelected(true) : setBreedSelected(false);
    (subBreedList.length > 0 && selectedSubBreed ) ? setSubBreedSelected(true) : setSubBreedSelected(false);
    numberOfImages ? setNumberSelected(true) : setNumberSelected(false);
    let URL = 'https://dog.ceo/api/breed/' +selectedBreed+ '/images/random/' + numberOfImages;
    if (selectedSubBreed) {
      URL = 'https://dog.ceo/api/breed/' + selectedBreed + '/' + selectedSubBreed + '/images/random/' + numberOfImages;
    }
    if  (selectedBreed || selectedSubBreed) {
      return fetch(URL)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "success") {
          setImages(responseJson.message);
        } else {
          setImages([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

 const getImages = () => {
    const result = [];
    if (images && images.length > 0) {
      images.forEach((item) => {
        result.push(<img className="image" src={item} alt="new" />);
      });
    }
    return result;
 };

  return(
    <div className="mainHome">
      <Row className="mainHeader">
        <Col className="header">
          <h1>Find Dog Details</h1>
        </Col>
      </Row>
      <Row>
        <Col className="content">
          {getContent()}
          <div className="imageContainer">{(images && images.length > 0) &&  getImages()}</div>
        </Col>
      </Row>
    </div>
  )
}

export default Home;
