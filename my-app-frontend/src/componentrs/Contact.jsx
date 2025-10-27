import Footer from "./Footer"
import NavBar from "./NavBar"


function Contact() {
  return (
    <>
        <NavBar/>
        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: '#ec4a96', fontWeight: '600' }}>Contact Us</h1>
        <p style={{
          maxWidth: '600px',
          margin: '20px auto',
          padding: '15px',
          lineHeight: '1.6',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        }}>
          We’d love to hear from you! If you have any questions or would like to request more books,
          feel free to <a href="mailto:nourhantamer17@gmail.com" style={{ color: '#ec4a96', textDecoration: 'underline' }}>connect</a> with us via email or
          <a href="https://www.linkedin.com/in/randa-erfan-6a230b217/" style={{ color: '#ec4a96', marginLeft: '5px', textDecoration: 'underline' }}> connect on LinkedIn</a>.
        </p>
      </div>

        <Footer/>
    </>
  )
}

export default Contact
