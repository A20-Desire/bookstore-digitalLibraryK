import { Link } from "react-router-dom";

function Card({ book, ...legacyProps }) {
  const data = book || legacyProps;
  const {
    title,
    author,
    category,
    description,
    coverImageUrl,
    imageLink,
    price,
    language,
    publicationYear,
    fileUrl,
    _id,
  } = data;

  const displayImage = coverImageUrl || imageLink || "https://placehold.co/400x560?text=Book";
  const metaLine = [author, language?.toUpperCase(), publicationYear].filter(Boolean).join(" • ");

  return (
    <div className="group rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="relative mb-4 overflow-hidden rounded-xl bg-base-200">
        <img
          alt={title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          src={displayImage}
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug">{title}</h3>
          {category && <span className="badge badge-secondary">{category}</span>}
        </div>
        {metaLine && <p className="text-sm text-slate-500 dark:text-slate-300">{metaLine}</p>}
        {description && (
          <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-200">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-pink-500">
            {price ? `$${price}` : "Free"}
          </span>
          {fileUrl ? (
            <a className="btn btn-outline btn-sm" href={fileUrl} rel="noopener noreferrer" target="_blank">
              Read
            </a>
          ) : _id ? (
            <Link className="btn btn-outline btn-sm" to={`/books/${_id}`}>
              Details
            </Link>
          ) : (
            <span className="btn btn-outline btn-sm">Preview</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
