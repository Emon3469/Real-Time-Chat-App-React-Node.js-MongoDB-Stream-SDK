import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { useState } from "react";
import logo from "../assets/logo.svg";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const {isPending, error, loginMutation} = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme = "forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
           <div className="mb-4 flex items-center justify-start gap-2">
              <img src={logo} alt ="Necho Logo" className="size-40 text-primary" />
            </div>
            {
              error && (
               <div className="alert alert-error mb-4">
                 <span>{error.response.data.message}</span>
               </div>
              )
            }

            <div className="w-full">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Log In</h2>
                    <p className="text-sm opacity-70">Log In Necho and reconnect with your world in seconds.</p>
                 </div>

                 <div className="flex flex-col gap-3">
                   <div className="form-control w-full space-y-2">
                     <label className="label">
                        <span className="label-text">Email</span>
                     </label>
                     <input
                       type="email"
                       placeholder="Email"
                       className="input input-bordered w-full"
                       value={loginData.email}
                       onChange={(e) => setLoginData({ ...loginData, email: e.target.value})}
                       required
                      />
                   </div>
                   <div className="form-control w-full space-y-2">
                     <label className="label">
                        <span className="label-text">Password</span>
                     </label>
                     <input
                       type="password"
                       placeholder="Password"
                       className="input input-bordered w-full"
                       value={loginData.password}
                       onChange={(e) => setLoginData({ ...loginData, password: e.target.value})}
                       required
                     />
                     <p className="text-xs opacity-70 mt-1">Password Must be al least 6 Characters long</p>
                   </div>

                   <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                      {
                        isPending ? (
                         <>
                           <span className="loading loading-spinner loading-xs"></span>
                           Signing in...
                         </>
                        ) : (
                        "Sign In"
                        )
                      }
                   </button>

                   <div className="text-center mt-4">
                     <p className="text-sm">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline">
                          Sign Up
                       </Link>
                     </p>
                   </div>
                 </div>
               </div>
             </form>
           </div>
         </div>

         <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-w-md p-8">
              <div className="relative aspect-square max-w-sm mx-auto">
                <img src="/login.png" alt="Language Connection illustration" className="w-full h-full" />
              </div>
              <div className="text-center space-y-3 mt-6">
                <h2 className="text-xl font-semibold">Your privacy matters. All messages are end-to-end encrypted.</h2>
                <p className="opacity-70">
                  Your words, your world – always connected.
                </p>
             </div>
           </div>
         </div>
       </div>
     </div>
  )
}

export default LoginPage
