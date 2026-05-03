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
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Form side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <img src={logo} alt="Necho Logo" className="size-40 text-primary" />
          </div>

          {error && (
            <div className="alert alert-error mb-4 flex flex-col items-start gap-2">
              <span>
                {error?.response?.data?.message ||
                  "Cannot reach the server. It may be starting up — please wait a moment."}
              </span>
              {!error?.response && (
                <button
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => loginMutation(loginData)}
                  disabled={isPending}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Log In</h2>
                  <p className="text-sm opacity-70">Log in to Necho and reconnect with your world in seconds.</p>
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
                  </div>

                  <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
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

        {/* Decorative side — no external image dependency */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8 text-center space-y-6">
            {/* SVG illustration inline — no missing file risk */}
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-56 h-56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" fill="currentColor" className="text-primary/10"/>
                {/* Lock body */}
                <rect x="60" y="95" width="80" height="65" rx="10" fill="currentColor" className="text-primary/70"/>
                {/* Lock shackle */}
                <path d="M 72 95 L 72 72 Q 72 48 100 48 Q 128 48 128 72 L 128 95"
                  stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none"
                  className="text-primary/70"/>
                {/* Keyhole */}
                <circle cx="100" cy="122" r="10" fill="white" opacity="0.9"/>
                <rect x="96" y="130" width="8" height="16" rx="4" fill="white" opacity="0.9"/>
                {/* Shield sparkles */}
                <circle cx="48" cy="60" r="5" fill="currentColor" className="text-accent/60"/>
                <circle cx="152" cy="60" r="5" fill="currentColor" className="text-secondary/60"/>
                <circle cx="40" cy="130" r="4" fill="currentColor" className="text-primary/40"/>
                <circle cx="160" cy="130" r="4" fill="currentColor" className="text-secondary/40"/>
              </svg>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Your privacy matters. All messages are end-to-end encrypted.
              </h2>
              <p className="opacity-70 leading-relaxed">
                Your words, your world — always connected.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-left">
              {[
                "Secure login with JWT authentication",
                "End-to-end encrypted messaging",
                "Your data stays yours, always",
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

export default LoginPage;
