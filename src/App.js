
import { useState, useEffect } from 'react'
import axios from "axios"
import firebase from './firebaseApp'
import UpdateUser from './updateUser'
import AddUser from './addUser'
import { Button, Container, Row, Col } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";

import './App.css';

function App() {

  const [updateuser, setUpdateuser] = useState(false)
  const [id, setId] = useState(0)
  const [addeuser, setAddeuser] = useState(false)
  const [velidError, setVelidError] = useState("")
  const dispatch = useDispatch()
  const storeData = useSelector(state => state)

  useEffect(() => {
    async function getData() {
      let clients = await axios.get("https://randomuser.me/api/?results=10")

      let Cliets = clients.data.results.map(x => ({
        name: x.name.title + " " + x.name.first + " " + x.name.last,
        email: x.email, picture: x.picture.medium,
        location: x.location.street.name + " " + x.location.city + " " + x.location.country,
        id: x.login.uuid
      }))
      let dataParse = await firebase.firestore().collection('persons').get();

      let persData = []

      dataParse.forEach(doc => {
        persData.push({
          name: doc.data().name, email: doc.data().email, location: doc.data().location,
          picture: doc.data().picture, id: doc.data().id
        })
      })
      let validationClients = Cliets.map(x => { checkValidation(x) })

      let errorValidation = validationClients.filter(x => x == "Proper validation")

      console.log(errorValidation)
      if (errorValidation.length == 0) {
        if (persData.length == 1) {
          Cliets.forEach(x => firebase.firestore().collection('persons').add(x).then(status => {
            console.log('Created');
          }));
        }
        if (storeData.users.length == 0) {
          persData.forEach(x => dispatch({ type: "ADD", payload: x }));
        }
      }
      else {
        setVelidError(errorValidation[0])
      }


    }
    getData()
  }, [])


  const filter = async (str) => {
    if (str.length == 0) {
      let clients = await firebase.firestore().collection('persons').get();
      let persData = []
      clients.forEach(doc => {
        persData.push({
          name: doc.data().name, email: doc.data().email, location: doc.data().location,
          picture: doc.data().picture, id: doc.data().id
        })
      })
      await dispatch({ type: "REPLECE", payload: persData })
    }
    else {
      let ClientsFiler = storeData.users.filter(x => x.id.includes(str) || x.email.includes(str) ||
        x.location.includes(str) || x.name.includes(str))

      await dispatch({ type: "REPLECE", payload: ClientsFiler })
    }

  }




  const checkValidation = async (data) => {
    const re = /\S+@\S+\.\S+/;
    if (data.location == "" || data.picture == "" || data.name || data.id || data.email == "") {
      return "error !! empty field"
    }
    else if (data.name.length <= 3) {
      return "error || name length should be bigger the 3"
    }
    else if (!re.test(data.email)) {
      return "error || email length shold "
    }
    else {
      return "Proper validation"
    }
  }

  const choseOne = async (id) => {
    setUpdateuser(true)
    setId(id)
  }


  const deleteDb = async (id) => {
    var jobskill_query = firebase.firestore().collection('persons').where('id', '==', id);
    jobskill_query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
    dispatch({ type: "DELETE", payload: id })
  }





  return (
    <div className="App">

      <div className="SearchCity" style={{ marginRight: "130px", marginTop: "10px" }}>
        Search:   <input type="text" onChange={(e) => filter(e.target.value)} ></input>
      </div>  <br />


      <Button variant="primary" onClick={() => setAddeuser(true)}>Add</Button> <br />
      {console.log(addeuser)}
      {addeuser && < AddUser callback={() => setAddeuser(false)} />}
      <p>{velidError}</p>
      {

        storeData.users.map(x => {
          return (
            <Container className="userDate" key={x._id}>
              <Row>
                <Col>
                  <p>name:{x.name}</p> <br />
                  <p>email: {x.email}</p> <br />
                  <img src={x.picture}></img>
                  <p>location: {x.location}</p>  <br />
                  <p>Id: {x.id}</p>  <br />
                  <Button style={{ marginBottom: "5px" }} variant="primary" onClick={() => deleteDb(x.id)}>Delete</Button>  <br />
                  <Button variant="primary" onClick={() => choseOne(x.id)}>Update</Button>

                  {

                    x.id == id ? updateuser && <UpdateUser data={x} callback={() => setUpdateuser(false)} /> : ""
                  }
                </Col>
              </Row>
            </Container>
          )

        }

        )
      }


    </div>
  );

}
export default App;

