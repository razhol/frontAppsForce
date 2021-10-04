import logo from './logo.svg';
import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css';

function App() {

  const [clients, setclients] = useState([])
  const [clients2, setclients2] = useState([])
  const [client, setClient] = useState({})
  const [adduser, setAdduser] = useState(false)
  const [velidError, setVelidError] = useState(false)
  const [velidErrorServer, setVelidErrorServer] = useState("")


  useEffect(() => {
    async function getData() {
      let clients = await axios.get("http://localhost:8000/clients")
      console.log(clients)
      await setclients(clients.data)
      await setclients2(clients.data)
    }
    getData()
  }, [])

  const addClientoDB = async (client) => {
    let constainsOlettersName = /^[a-z,A-Z ]+$/.test(client.fullname);
    let constainsONumbrtdId = /^\d+$/.test(client.idtz)
    let constainsONumbersPhoneNumber = /^\d+$/.test(client.phonenumber)
    let constainsLettersIpAddress = /^[a-z,A-Z]+$/.test(client.ipaddress)

    if (constainsOlettersName && constainsONumbrtdId && constainsONumbersPhoneNumber
      && !constainsLettersIpAddress && client.fullname != "" && client.idtz != "" &&
      client.phonenumber != "" && client.ipaddress != "") {
      let created = await axios.post("http://localhost:8000/clients", { client })
      if (created.data === "Created") {
        let clients = await axios.get("http://localhost:8000/clients")
        await setclients([...clients.data])
        await setclients2([...clients.data])
        await setVelidError(false)
        await setVelidErrorServer("")
        setAdduser(false)
      }
      else {
        await setVelidError(false)
        setVelidErrorServer(created.data)
      }
    }
    else {
      setVelidError(true)
      await setVelidErrorServer("")
    }
  }

  const filterbyCityOrCounry = async (str) => {
    if (str.length == 0) {
      let clients = await axios.get("http://localhost:8000/clients")
      setclients([...clients.data])
    }
    else {
      let ClientsFiler = clients2.filter(x => x.city.startsWith(str) || x.country.startsWith(str))

      setclients([...ClientsFiler])
    }

  }

  const filterClients = async (str) => {
    console.log(str.length)
    if (str.length == 0) {
      let clients = await axios.get("http://localhost:8000/clients")
      setclients([...clients.data])
    }
    else {
      let ClientsFiler = clients2.filter(x => x.fullname.includes(str) || x.idtz.toString().includes(str) ||
        x.phonenumber.includes(str) || x.ipaddress.includes(str))

      setclients([...ClientsFiler])
    }

  }

  const closeAll = async () => {
    setAdduser(false)
    setVelidError(false)
    await setVelidErrorServer("")
  }

  const deleteClient = async (id) => {
    let deleted = await axios.delete("http://localhost:8000/clients/" + id)
    if (deleted.data === "Deleted") {
      let Clients = clients.filter(x => x._id != id)
      let newclients = [...Clients]
      console.log(newclients)
      await setclients([...newclients])
      await setclients2([...newclients])
    }
  }
  return (
    <div className="App">
      <div className="SearchCity" style={{ marginRight: "130px", marginTop: "10px" }}>
        Search by city or country:   <input type="text" onChange={(e) => filterbyCityOrCounry(e.target.value)} ></input>
      </div>  <br />


      <div className="Search">
        Search :
        <input type="text" onChange={(e) => filterClients(e.target.value)} ></input>
      </div>
      <br />
      <div className="buttomAdd">
        <input type="button" value="Add Client" onClick={() => setAdduser(true)} />
      </div>


      {adduser && <div className="adduser">
        <h3>Add user</h3>
        full name : <input style={{ marginRight: "100px", marginTop: "10px" }} type="text" onChange={(e) => setClient({ ...client, fullname: e.target.value })} ></input> <br />
        id-tz : <input style={{ marginRight: "70px", marginTop: "10px" }} type="text" onChange={(e) => setClient({ ...client, idtz: e.target.value })} ></input> <br />
        phone number : <input type="text" style={{ marginRight: "140px", marginTop: "10px" }} onChange={(e) => setClient({ ...client, phonenumber: e.target.value })} ></input> <br />
        ip address : <input type="text" style={{ marginRight: "110px", marginTop: "10px" }} onChange={(e) => setClient({ ...client, ipaddress: e.target.value })} ></input> <br />
        {velidError && <p>validation error</p>}
        <p>{velidErrorServer}</p>
        <input type="button" value="Add" onClick={() => addClientoDB(client)} />
        <input type="button" value="Cencel" onClick={closeAll} />
      </div>}
      {
        clients.map(x => {
          return (
            <div className="userDate" key={x._id}>
              <p>full name: {x.fullname}</p> <br />
              <p>tz: {x.idtz}</p> <br />
              <p>phone number: {x.phonenumber}</p> <br />
              <p>ip address: {x.ipaddress}</p>  <br />

              {
                x.country && x.city && <div>
                  <p>city: {x.city}</p>  <br />
                  <p>country: {x.country}</p>  <br />
                </div>
              }

              <input type="button" value="Delete" onClick={() => deleteClient(x._id)} /> <br />
            </div>
          )
        }
        )
      }

    </div>
  );

}
export default App;

