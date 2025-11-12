import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/Authprovider";

const defaultValues = {
  title: "",
  author: "",
  description: "",
  category: "",
  language: "en",
  publicationYear: "",
  tags: "",
  accessLevel: "public",
  isFeatured: false,
};

function AdminDashboard() {
  const { user } = useAuth();
  const [recentBooks, setRecentBooks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    const loadRecentBooks = async () => {
      try {
        const response = await apiClient.get("/book", { params: { limit: 5 } });
        setRecentBooks(response.data?.books?.slice(0, 5) ?? []);
      } catch (error) {
        console.error("Failed to load recent books", error);
      }
    };

    loadRecentBooks();
  }, []);

  const onSubmit = async (formData) => {
    if (!formData.bookFile?.[0]) {
      toast.error("Please attach the book file (PDF/EPUB)");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "bookFile" || key === "coverImage") return;
      if (key === "tags" && value) {
        payload.append(key, value.split(",").map((tag) => tag.trim()).join(","));
      } else if (key === "isFeatured") {
        payload.append(key, value ? "true" : "false");
      } else {
        payload.append(key, value ?? "");
      }
    });

    if (formData.coverImage?.[0]) {
      payload.append("coverImage", formData.coverImage[0]);
    }
    payload.append("bookFile", formData.bookFile[0]);

    try {
      setIsUploading(true);
      setUploadError(null);
      const response = await apiClient.post("/book", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Book uploaded successfully");
      setRecentBooks((prev) => [response.data.book, ...prev].slice(0, 5));
      reset(defaultValues);
    } catch (error) {
      console.error("Upload error", error);
      const message = error.response?.data?.message || "Failed to upload book";
      setUploadError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Administrator Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Manage the institution's digital collection. Upload new course materials, research, and publications. Recent
          uploads appear in the library automatically.
        </p>
        <p className="text-xs text-slate-400">Logged in as: {user?.username} ({user?.role})</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <form className="space-y-4 rounded-2xl border border-base-200 p-6 shadow-sm dark:border-slate-700" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-semibold">Upload Book</h2>
          <p className="text-sm text-slate-500">Provide metadata to power search and recommendations.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="label-text">Title</span>
              <input className="input input-bordered" placeholder="Book title" {...register("title", { required: "Title is required" })} />
              {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
            </label>

            <label className="form-control">
              <span className="label-text">Author</span>
              <input className="input input-bordered" placeholder="Author name" {...register("author", { required: "Author is required" })} />
              {errors.author && <span className="text-xs text-red-500">{errors.author.message}</span>}
            </label>
          </div>

          <label className="form-control">
            <span className="label-text">Description</span>
            <textarea className="textarea textarea-bordered" placeholder="Summary and highlights" rows={4} {...register("description")} />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="label-text">Category</span>
              <input className="input input-bordered" placeholder="e.g. Computer Science" {...register("category")} />
            </label>

            <label className="form-control">
              <span className="label-text">Language</span>
              <select className="select select-bordered" {...register("language")}>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="label-text">Publication Year</span>
              <input className="input input-bordered" placeholder="2024" type="number" {...register("publicationYear")} />
            </label>

            <label className="form-control">
              <span className="label-text">Tags</span>
              <input className="input input-bordered" placeholder="Comma separated keywords" {...register("tags")} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="label-text">Access Level</span>
              <select className="select select-bordered" {...register("accessLevel")}> 
                <option value="public">Public</option>
                <option value="students">Students</option>
                <option value="staff">Staff</option>
                <option value="restricted">Restricted</option>
              </select>
            </label>

            <label className="form-control">
              <span className="label-text">Feature on homepage</span>
              <input className="toggle" type="checkbox" {...register("isFeatured")} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="label-text">Cover Image</span>
              <input accept="image/png,image/jpeg,image/webp" className="file-input file-input-bordered" type="file" {...register("coverImage")} />
            </label>

            <label className="form-control">
              <span className="label-text">Book File (PDF/EPUB)</span>
              <input accept="application/pdf,application/epub+zip" className="file-input file-input-bordered" type="file" {...register("bookFile", { required: "Book file is required" })} />
              {errors.bookFile && <span className="text-xs text-red-500">{errors.bookFile.message}</span>}
            </label>
          </div>

          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

          <button className="btn btn-primary" disabled={isUploading} type="submit">
            {isUploading ? "Uploading..." : "Save to Library"}
          </button>
        </form>

        <aside className="space-y-4 rounded-2xl border border-base-200 p-6 shadow-sm dark:border-slate-700">
          <h2 className="text-xl font-semibold">Recent Uploads</h2>
          <ul className="space-y-3 text-sm">
            {recentBooks.map((book) => (
              <li className="rounded-lg border border-base-200 p-3 dark:border-slate-700" key={book._id}>
                <p className="font-medium">{book.title}</p>
                <p className="text-xs text-slate-500">{book.author}</p>
                <p className="text-xs text-slate-400">
                  {book.language?.toUpperCase()} • {book.category || "General"}
                </p>
              </li>
            ))}
            {recentBooks.length === 0 && <li className="text-xs text-slate-400">No uploads yet.</li>}
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default AdminDashboard;
