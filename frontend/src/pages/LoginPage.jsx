import { useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { AuthImagePattern } from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader, Eye, EyeOff, LogInIcon } from "lucide-react";
import toast from "react-hot-toast";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { logout, login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    console.log("Email: " + formData.email);
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email");
    if (!formData.password.trim()) return toast.error("Password is required");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    console.log("Success: " + success);

    // In JS return false or toast.error does not mean that the form is invalid that's why we need to check if success is true
    if (success === true) {
      await login(formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <LogInIcon className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Log In</h1>
              <i className="text-sm text-muted-foreground">
                with you credentials
              </i>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label m-1">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label m-1">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="**********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* <button type="submit" className="btn btn-primary w-full"> */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* footer */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
                onClick={logout}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title="Join our community"
        subtitle="Share moments, connect with friends."
      />
    </div>
  );
}

export default LoginPage;
