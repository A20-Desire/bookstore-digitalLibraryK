
import NavBar from '../componentrs/NavBar';
import Footer from '../componentrs/Footer';
import ListBooks from '../componentrs/ListBooks';
function Books() {

  return (
    <>
    <NavBar/>
    <div className='min-h-screen'>
        <ListBooks/>
    </div>
    <Footer/>
    </>
  )
}

export default Books
