import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";
import { useState } from "react";
import logo from "../assets/logo.svg";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const {isPending, error, signupMutation} = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
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
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create An Account</h2>
                  <p className="text-sm opacity-70">Join Necho and start your language learning Advanture!!</p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                   </label>
                   <input
                      type="text"
                      placeholder="Entet Your Name"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value})}
                      required
                    />
                 </div>
                 <div className="form-control w-full">
                   <label className="label">
                     <span className="label-text">Email</span>
                   </label>
                   <input
                     type="email"
                     placeholder="Email"
                     className="input input-bordered w-full"
                     value={signupData.email}
                     onChange={(e) => setSignupData({ ...signupData, email: e.target.value})}
                     required
                   />
                 </div>
                 <div className="form-control w-full">
                   <label className="label">
                     <span className="label-text">Password</span>
                   </label>
                   <input
                     type="password"
                     placeholder="Password"
                     className="input input-bordered w-full"
                     value={signupData.password}
                     onChange={(e) => setSignupData({ ...signupData, password: e.target.value})}
                     required
                   />
                   <p className="text-xs opacity-70 mt-1">Password Must be al least 6 Characters long</p>
                 </div>

                 <div className="form-control">
                   <label className="label cursor-pointer justify-start gap-2">
                     <input type="checkbox" className="checkbox checkbox-sm" required/>
                     <span className="text-xs leading-tight">
                       I agree to the{" "}
                       <span className="text-primary hover:underline">Terms of Services</span> and{" "}
                       <span className="text-primary hover:underline">Privacy Policy</span>
                     </span>
                   </label>
                 </div>
               </div>

               <button className="btn btn-primary w-full">
                 {
                   isPending ? (
                     <>
                       <span className="loading loading-spinner loading-xs"></span>
                       Loading...
                     </>
                   ) : (
                     "Create Account"
                   )
                 }
               </button>

               <div className="text-center mt-4">
                 <p className="text-sm">
                   Already have an Account?{" "}
                   <Link to="/login" className="text-primary hover:underline">
                     Sign In
                   </Link>
                 </p>
               </div>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspcet-square max--w-sm mx-auto">
              <img src="/Challenge-bro.png" alt="Connection Illustration" className="w-full h-full"/>
            </div>

            <div className="text-center space-y-4 mt-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in">Talk Freely. Connect Deeply.</h2>
              <p className="text-base opacity-70 max-w-md mx-auto leading-relaxed animate-slide-up">
                Feel the vibe. Share your story. Sync with friends. Go beyond borders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage
