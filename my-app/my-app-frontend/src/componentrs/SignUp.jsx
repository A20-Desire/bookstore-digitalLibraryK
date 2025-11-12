import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useAuth } from "../context/Authprovider"
import apiClient from "../services/apiClient"

function SignUp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const from = location.state?.from?.pathname || "/"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      role: "user",
      preferredLanguage: "en",
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post("/user/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
        preferredLanguage: data.preferredLanguage,
        role: data.role,
        inviteCode: data.inviteCode || undefined,
      })

      toast.success("Account created")
      login({ token: response.data.token, user: response.data.user })
      reset()
      navigate(from, { replace: true })
    } catch (error) {
      const message = error.response?.data?.message || "Unable to sign up"
      toast.error(message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center border-black shadow-md">
      <div className="modal-box w-screen max-w-lg dark:bg-slate-900 dark:text-white">
        <form method="dialog" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </Link>

          <h3 className="font-bold text-lg">Sign Up</h3>

          <label className="form-control w-full">
            <span className="label-text">Name</span>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Enter your name"
              {...register("username", { required: "Name is required" })}
            />
            {errors.username && <span className="text-sm text-red-600">{errors.username.message}</span>}
          </label>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <span className="label-text">Password</span>
              <input
                type="password"
                className="input input-bordered"
                placeholder="Minimum 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
            </label>

            <label className="form-control w-full">
              <span className="label-text">Preferred Language</span>
              <select className="select select-bordered" {...register("preferredLanguage")}>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text">Role</span>
              <select className="select select-bordered" {...register("role")}>
                <option value="user">Student</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Administrator</option>
              </select>
              <span className="text-xs text-slate-500">
                Admin & moderator access requires an invite code.
              </span>
            </label>

            <label className="form-control">
              <span className="label-text">Invite Code</span>
              <input
                className="input input-bordered"
                placeholder="Optional"
                {...register("inviteCode")}
              />
            </label>
          </div>

          <button
            disabled={isSubmitting}
            className="btn btn-primary w-full"
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm">
            Already have an account? <Link to="/login" className="link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
