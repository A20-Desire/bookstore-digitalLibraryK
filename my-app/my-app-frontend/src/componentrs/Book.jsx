import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "./Card.jsx";
import apiClient from "../services/apiClient";

function Book() {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadFeatured = async () => {
      try {
        const response = await apiClient.get("/book/featured");
        if (!mounted) return;
        setFeaturedBooks(response.data?.books ?? []);
      } catch (error) {
        console.error("Failed to load featured books", error);
      }
    };

    loadFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h2 className="text-2xl font-semibold">Featured Books</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Curated recommendations from faculty and librarians. Upload new titles from the admin dashboard to highlight
          them here.
        </p>
      </header>

      <div className="slider-container">
        <Slider {...settings}>
          {featuredBooks.map((book) => (
            <div className="px-2" key={book._id}>
              <Card book={book} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Book;
