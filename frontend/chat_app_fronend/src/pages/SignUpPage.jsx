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
        {/* Form side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <img src={logo} alt="Necho Logo" className="size-40 text-primary" />
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error?.response?.data?.message ||
                  "Cannot reach the server. Please wait a moment and try again."}
              </span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create An Account</h2>
                  <p className="text-sm opacity-70">Join Necho and start your language learning adventure!</p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Name"
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
                    <p className="text-xs opacity-70 mt-1">Password must be at least 6 characters long</p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required/>
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">Terms of Service</span> and{" "}
                        <span className="text-primary hover:underline">Privacy Policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Decorative side — no external image dependency */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8 text-center space-y-6">
            {/* SVG illustration inline — no missing file risk */}
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-56 h-56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" fill="currentColor" className="text-primary/10"/>
                {/* Left chat bubble */}
                <rect x="30" y="60" width="90" height="50" rx="12" fill="currentColor" className="text-primary/70"/>
                <polygon points="45,110 45,125 65,110" fill="currentColor" className="text-primary/70"/>
                <rect x="42" y="74" width="66" height="8" rx="4" fill="white" opacity="0.8"/>
                <rect x="42" y="88" width="46" height="8" rx="4" fill="white" opacity="0.6"/>
                {/* Right chat bubble */}
                <rect x="80" y="110" width="90" height="50" rx="12" fill="currentColor" className="text-secondary/80"/>
                <polygon points="140,160 155,175 155,160" fill="currentColor" className="text-secondary/80"/>
                <rect x="92" y="124" width="66" height="8" rx="4" fill="white" opacity="0.8"/>
                <rect x="92" y="138" width="46" height="8" rx="4" fill="white" opacity="0.6"/>
                {/* Globe icon */}
                <circle cx="100" cy="40" r="18" fill="currentColor" className="text-accent/60"/>
                <path d="M 85 40 Q 100 28 115 40 Q 100 52 85 40" fill="white" opacity="0.4"/>
                <circle cx="100" cy="40" r="18" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
              </svg>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Talk Freely. Connect Deeply.
              </h2>
              <p className="text-base opacity-70 leading-relaxed">
                Feel the vibe. Share your story. Sync with friends. Go beyond borders.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-left">
              {[
                "Real-time chat with friends worldwide",
                "Practice languages with native speakers",
                "Connect across cultures, break barriers",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-sm opacity-80">
                  <span className="text-primary text-lg">✓</span>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
