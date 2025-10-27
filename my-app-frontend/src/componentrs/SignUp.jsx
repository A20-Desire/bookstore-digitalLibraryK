import { Link ,useLocation,useNavigate } from "react-router-dom"
import Login from "./Login";
import { useForm } from "react-hook-form"
import axios from 'axios'
import toast from "react-hot-toast";


function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit=  async (data) => {
    const userInfo = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    await axios
      .post("http://localhost:4001/user/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signup Successfully");
          navigate(from, { replace: true });
        }
        localStorage.setItem("Users", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
        }
      }
    );
  };
  return (
    <div className="flex h-screen items-center justify-center border-black shadow-md">
        <div className="">
      <div className="modal-box w-screen dark:bg-slate-900 dark:text-white">
    <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
      {/* if there is a button in form, it will close the modal */}
      <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link>

    <h3 className="font-bold text-lg">Sign Up</h3>
    <div className="mt-3 space-y-2">
    <div className="mt-3">
        <span >User</span>
        <br/>
        <input type="text" className="w-80 px-4 py-1 border-black rounded-md mt-2"
        placeholder="Enter your username"
        {...register("username", { required: true })}/>
         <br/>
         {errors.username && <span className="text-sm text-red-600">This field is required</span>}
    </div>
        <span >Email</span>
        <br/>
        <input type="email" className="w-80 px-4 py-1 border-black rounded-md mt-2"
        placeholder="Enter your Email"
        {...register("email", { required: true })}/>
        <br/>
        {errors.email && <span className="text-sm text-red-600">This field is required</span>}
    </div>
    <div className="mt-3">
        <span >Password</span>
        <br/>
        <input type="password" className="w-80 px-4 py-1 border-black rounded-md mt-2"
        placeholder="Enter your password"
        {...register("password", { required: true })}/>
         <br/>
         {errors.password && <span className="text-sm text-red-600">This field is required</span>}
    </div>

    <div className="mt-4 flex justify-around ">
    <button className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-800 duration-200">Sign Up</button>
    <p className="text-xl">Have Account?<button className="underline text-blue-600 cursor-pointer"
    onClick={()=>document.getElementById("my_modal_3").showModal()
    }
    >Login</button>{" "}
    <Login/>
    </p>
    </div>
    </form>
  </div>
  </div>
    </div>
  )
}

export default SignUp;
