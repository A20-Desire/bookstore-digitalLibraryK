import Footer from "./Footer"
import NavBar from "./NavBar"


function About() {
  return (
    <>
        <NavBar/>
        <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '80vh',
        textAlign: 'center',}}>
          <h1 style={{color:'#ec4a96',fontWeight:'600'}}>Welcome to our Book store</h1>
          <p style={{ maxWidth: '600px',  
          margin: '20px auto',
          padding: '15px',
          lineHeight: '1.6',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',}}>
          your cozy haven for all things literary! Founded in 2024 ,
          our bookstore was born out of a deep love for reading and a desire to collect rare books
          and to create a community space where book lovers can connect.
          Whether you’re a lifelong bibliophile or just starting your reading journey, there’s something here for everyone.
          </p>

        </div>

        <Footer/>
    </>
  )
}

export default About
