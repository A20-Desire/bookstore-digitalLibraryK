import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useAuth } from "../context/Authprovider"
import apiClient from "../services/apiClient"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post("/user/login", {
        email: data.email,
        password: data.password,
      })

      login({ token: response.data.token, user: response.data.user })
      toast.success("Welcome back")
      reset()
      document.getElementById("my_modal_3")?.close()
      navigate("/books")
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
    }
  }

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-90 h-75 dark:bg-slate-900 dark:text-white">
          <form method="dialog" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_3")?.close()}
            >
              ✕
            </Link>

            <h3 className="font-bold text-lg">Login</h3>

            <label className="form-control w-full">
              <span className="label-text">Email</span>
              <input
                type="email"
                className="input input-bordered"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
            </label>

            <label className="form-control w-full">
              <span className="label-text">Password</span>
              <input
                type="password"
                className="input input-bordered"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
            </label>

            <button className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            <p className="text-center text-sm">
              Not registered? <Link to="/signup" className="link">Sign up</Link>
            </p>
          </form>
        </div>
      </dialog>
    </div>
  )
}

export default Login
