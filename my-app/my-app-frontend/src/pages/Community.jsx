import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/Authprovider";

function Community() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({ defaultValues: { content: "" } });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await apiClient.get("/book", { params: { limit: 20 } });
        setBooks(response.data?.books ?? []);
      } catch (error) {
        console.error("Failed to load books", error);
      }
    };

    loadBooks();
  }, []);

  useEffect(() => {
    if (!bookId) return;

    const loadDiscussion = async () => {
      setLoading(true);
      try {
        const [bookResponse, discussionResponse] = await Promise.all([
          apiClient.get(`/book/${bookId}`),
          apiClient.get(`/community/${bookId}`),
        ]);
        setSelectedBook(bookResponse.data?.book ?? null);
        setComments(discussionResponse.data?.comments ?? []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load discussion");
      } finally {
        setLoading(false);
      }
    };

    loadDiscussion();
  }, [bookId]);

  const handleCreateComment = async (data) => {
    if (!bookId) return;
    try {
      const response = await apiClient.post(`/community/${bookId}`, data);
      setComments((prev) => [response.data.comment, ...prev]);
      reset({ content: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const handleReply = async (commentId, content) => {
    if (!bookId) return;
    try {
      const response = await apiClient.post(`/community/${bookId}/${commentId}/reply`, { content });
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [response.data.comment, ...(comment.replies || [])] }
            : comment
        )
      );
    } catch (error) {
      toast.error("Failed to reply");
    }
  };

  const handleReaction = async (commentId, reaction) => {
    if (!bookId) return;
    try {
      await apiClient.post(`/community/${bookId}/${commentId}/react`, { reaction });
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                reactions: {
                  ...comment.reactions,
                  [reaction]: (comment.reactions?.[reaction] || 0) + 1,
                },
              }
            : comment
        )
      );
    } catch (error) {
      toast.error("Failed to react");
    }
  };

  const canModerate = useMemo(() => ["admin", "moderator"].includes(user?.role), [user?.role]);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <h2 className="text-lg font-semibold">Books</h2>
        <ul className="space-y-2 text-sm">
          {books.map((book) => (
            <li key={book._id}>
              <button
                className={`w-full rounded-lg border px-3 py-2 text-left transition hover:border-pink-400 ${
                  bookId === book._id ? "border-pink-500 bg-pink-50 dark:bg-slate-800" : "border-base-200"
                }`}
                onClick={() => navigate(`/community/${book._id}`)}
              >
                <p className="font-medium">{book.title}</p>
                <p className="text-xs text-slate-500">{book.author}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="space-y-6">
        {bookId ? (
          <>
            {selectedBook && (
              <div className="rounded-2xl border border-base-200 p-6 shadow-sm dark:border-slate-700">
                <h1 className="text-2xl font-semibold">{selectedBook.title}</h1>
                <p className="text-sm text-slate-500">
                  {selectedBook.author} • {selectedBook.language?.toUpperCase()} • {selectedBook.category || "General"}
                </p>
                {selectedBook.description && (
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{selectedBook.description}</p>
                )}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit(handleCreateComment)}>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Share your thoughts"
                rows={3}
                {...register("content", { required: true })}
              />
              <button className="btn btn-primary" type="submit">
                Post Comment
              </button>
            </form>

            {loading ? (
              <p className="text-sm text-slate-500">Loading discussion...</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li className="rounded-xl border border-base-200 p-4 dark:border-slate-700" key={comment._id}>
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium">{comment.author?.username}</p>
                      <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{comment.content}</p>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <button className="btn btn-ghost btn-xs" onClick={() => handleReaction(comment._id, "like")}>
                        👍 {comment.reactions?.like ?? 0}
                      </button>
                      <button className="btn btn-ghost btn-xs" onClick={() => handleReaction(comment._id, "insightful")}>
                        💡 {comment.reactions?.insightful ?? 0}
                      </button>
                    </div>

                    {canModerate && (
                      <div className="mt-2 text-xs text-slate-500">
                        Flagged: {comment.isFlagged ? "Yes" : "No"}
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      <details>
                        <summary className="cursor-pointer text-xs text-pink-500">Reply</summary>
                        <ReplyForm onSubmit={(value) => handleReply(comment._id, value)} />
                      </details>

                      {comment.replies?.length ? (
                        <ul className="space-y-2 border-l border-base-200 pl-4 text-sm">
                          {comment.replies.map((reply) => (
                            <li key={reply._id}>
                              <p className="font-medium">{reply.author?.username}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(reply.createdAt).toLocaleString()}
                              </p>
                              <p>{reply.content}</p>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
                {comments.length === 0 && <li className="text-sm text-slate-500">No discussion yet.</li>}
              </ul>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-base-200 p-12 text-center dark:border-slate-700">
            <h2 className="text-xl font-semibold">Select a book</h2>
            <p className="mt-3 text-sm text-slate-500">Browse the list to start a discussion.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ReplyForm({ onSubmit }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <form className="mt-2 flex gap-2" onSubmit={handleSubmit}>
      <input
        className="input input-bordered input-sm flex-1"
        placeholder="Write a reply"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button className="btn btn-primary btn-xs" type="submit">
        Reply
      </button>
    </form>
  );
}

export default Community;
