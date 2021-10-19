import { useState } from 'react'
import { useDispatch } from "react-redux";
import firebase from './firebaseApp'
import { Button, Container, Row, Col } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';


const UpdateUser = (props) => {

  const [client, setClient] = useState({ id: props.data.id, name: props.data.name, email: props.data.email, location: props.data.location })
  const [errorValidation, setErrorValidation] = useState("")
  const dispatch = useDispatch()

  const update = async () => {
    let validationClients = await checkValidation(client);
    if (validationClients == "Proper validation") {
      setErrorValidation("")
      await dispatch({ type: "UPDATE", payload: client })
      var jobskill_query = firebase.firestore().collection('persons').where('id', '==', client.id)
      jobskill_query.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update({ name: client.name, email: client.email, location: client.location })
        });
      });
    }
    else {
      setErrorValidation(validationClients)
    }

  }

  const checkValidation = async (data) => {
    console.log(data)
    let dataParse = await firebase.firestore().collection('persons').get();

    let persData = []

    dataParse.forEach(doc => {
      persData.push({
        name: doc.data().name, email: doc.data().email, location: doc.data().location,
        picture: doc.data().picture, id: doc.data().id
      })
    })
    const re = /\S+@\S+\.\S+/;
    let emailExist = persData.find(x => x.email == data.email);
    if (emailExist) {
      return "error !! email exist"
    }
    if (data.location == "" || data.name == "" || data.email == "") {
      return "error !! empty field"
    }
    else if (data.name.length <= 3) {
      return "error || name length should be bigger the 3"
    }
    else if (!re.test(data.email)) {
      return "error || email validation"
    }
    else {
      return "Proper validation"
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          {errorValidation}
          <form>
            name : <input style={{ marginRight: "100px", marginTop: "10px" }} value={client.name} type="text" onChange={(e) => setClient({ ...client, name: e.target.value })} ></input> <br />
            email : <input style={{ marginRight: "70px", marginTop: "10px" }} value={client.email} type="text" onChange={(e) => setClient({ ...client, email: e.target.value })} ></input> <br />
            location : <input type="text" style={{ marginRight: "140px", marginTop: "10px" }} value={client.location} onChange={(e) => setClient({ ...client, location: e.target.value })} ></input> <br />
            <input style={{ marginTop: "5px", marginBottom: "5px", marginRight: "5px" }} type="button" value="Update" onClick={() => update()} />
            <input style={{ marginBottom: "5px", marginRight: "5px" }} type="button" value="Cencel" onClick={() => props.callback(false)} />
          </form>
        </Col>
      </Row>
    </Container>
  )
}
export default UpdateUser;