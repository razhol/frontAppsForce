

import { useState } from 'react'
import { useDispatch } from "react-redux";
import firebase from './firebaseApp'
import { Container, Row, Col } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';


const AddUser = (props) => {

    const [client, setClient] = useState({ name: "", id: "", email: "", image: "", location: "" })
    const [errorValidation, setErrorValidation] = useState("")
    const dispatch = useDispatch()

    const Add = async () => {

        let validationClients = await checkValidation(client);
        if (validationClients == "Proper validation") {
            await dispatch({ type: "ADD", payload: client })
            await firebase.firestore().collection('persons').add(client)
        }
        else {
            await setErrorValidation(validationClients)
        }

    }

    const checkValidation = async (data) => {
        console.log(data)
        console.log(data.name.length)
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
        if (data.location == "" || data.picture == "" || data.name == "" || data.id == "" || data.email == "") {
            return "error !! empty field"
        }
        if (data.name.length <= 3) {
            return "error || name length should be bigger the 3"
        }
        if (!re.test(data.email)) {
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
                        name : <input style={{ marginRight: "100px", marginTop: "10px" }} type="text" onChange={(e) => setClient({ ...client, name: e.target.value })} ></input> <br />
                        id : <input style={{ marginRight: "100px", marginTop: "10px" }} type="text" onChange={(e) => setClient({ ...client, id: e.target.value })} ></input> <br />
                        image : <input style={{ marginRight: "100px", marginTop: "10px" }} type="text" onChange={(e) => setClient({ ...client, image: e.target.value })} ></input> <br />
                        email : <input style={{ marginRight: "70px", marginTop: "10px" }} type="text" onChange={(e) => setClient({ ...client, email: e.target.value })} ></input> <br />
                        location : <input type="text" style={{ marginRight: "140px", marginTop: "10px" }} onChange={(e) => setClient({ ...client, location: e.target.value })} ></input> <br />
                        <input style={{ marginBottom: "5px", marginRight: "5px", marginTop: "5px" }} type="button" value="Add" onClick={() => Add()} />
                        <input style={{ marginBottom: "5px" }} type="button" value="Cencel" onClick={() => props.callback(false)} />
                    </form>
                </Col>
            </Row>
        </Container>
    )
}
export default AddUser;