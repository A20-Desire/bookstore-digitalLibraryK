import all_books from "../assets/data.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from "./Card.jsx";
// import axios from "axios ;"

function Book() {
  // const [book, setBook] = useState([]);
  // useEffect(() => {
  //   const getBook = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:4001/book");

  //       const data = res.data.filter((data) => data.category === "Free");
  //       console.log(data);
  //       setBook(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getBook();
  // }, []);
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    const filterData = all_books.filter((books)=>books.category === "Free")

  return (
  <>
        <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
        <div>
        <h1 className="font-semibold text-xl pd2">Free Offered Books</h1>
        <p className="">Great selection of modern and classic books waiting to be discovered.
             Most free and available in most ereader formats.
            Read, borrow, and discover more than 3M books for free.</p>
            </div>
        <div>
        <div className="slider-container">
      <Slider {...settings}>
            {filterData.map((item)=>{
              return <Card props={item} key={item.id} title={item.title} imageLink={item.imageLink}
              price={item.price} author={item.author} category={item.category}
              description={item.description} pages={item.pages}/>
              })}

      </Slider>
        </div>
        </div>

    </div>
</>
  )
}

export default Book
