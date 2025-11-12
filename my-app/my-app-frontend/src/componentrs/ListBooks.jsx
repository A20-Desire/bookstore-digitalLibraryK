import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "./Card";
import apiClient from "../services/apiClient";

function ListBooks() {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchBooks = async () => {
      try {
        const response = await apiClient.get("/book");
        if (!isSubscribed) return;
        setBooks(response.data?.books ?? []);
      } catch (err) {
        if (!isSubscribed) return;
        setError(err.response?.data?.message || "Failed to load books");
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <section className="space-y-10">
      <header className="text-center">
        <h1 className="text-3xl font-semibold md:text-4xl">
          {t("dashboard.uploadBook")}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-slate-600 dark:text-slate-300">
          Welcome to the curated digital library. Browse featured research, course materials, and community-submitted
          books. Use the advanced search for precise filtering across metadata and tags.
        </p>
        <Link className="btn btn-outline btn-sm mt-6" to="/search">
          {t("nav.search")}
        </Link>
      </header>

      {isLoading && <p className="text-center text-sm text-slate-500">Loading collection...</p>}
      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <Card key={book._id} book={book} />
        ))}
      </div>

      {!isLoading && !error && books.length === 0 && (
        <div className="text-center text-sm text-slate-500">No books uploaded yet. Check back soon!</div>
      )}
    </section>
  );
}

export default ListBooks;
