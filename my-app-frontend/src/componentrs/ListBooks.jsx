import Card from "./Card";
import bookdataback from '../assets/bookdataback.json'
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

function ListBooks() {
  const [book, setBook] = useState([]);
   useEffect(() => {
     const getBook = async () => {
      try {
         const res = await axios.get("http://localhost:4001/book");
         console.log(res.data);
         setBook(res.data);
       } catch (error) {
         console.log(error);
       }
     };
     getBook();
   }, []);

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 dark:bg-slate-900">
      <div className="mt-20 items-center justify-center text-center ">
        <h1 className="text-2xl font-semibold md:text-4xl">
          Welcome to Our Digital Library
          <span className="text-pink-500"> Here ^^!</span>
        </h1>
        <p className="mt-12">
          We are thrilled to have you here. Our Digital Library is your gateway to a vast collection of knowledge and resources. Whether you are a student, researcher, or just a curious mind, you will find a wealth of information at your fingertips. Explore our extensive collection of free books and buy books. With just a few clicks, you can dive into a world of learning. Our user-friendly interface makes it easy to find exactly what you want.
          <span className="text-pink-500"> Enjoy your time in our Digital Library and happy exploring!</span>
        </p>
        <Link to="/">
        <button className="bg-pink-500 text-white px-4 py-2 rounded-md mt-12 hover:bg-pink-800 duration-300">
          Back
        </button>
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3">
        {bookdataback.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            imageLink={item.imageLink}
            price={item.price}
            author={item.author}
            category={item.category}
            description={item.description}
            pages={item.pages}
          />
        ))}
      </div>
    </div>
  );
}

export default ListBooks;
