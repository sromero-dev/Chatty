import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User } from "lucide-react";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica de signup aquí
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create an account</h1>
              <p className="text-muted-foreground">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label m-1">
                <span className="label-text font-medium">Full name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="input input-bordered w-full pl-10" // pl-10 deja espacio para el icono
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
              </div>
            </div>
            {/* Aquí irían los otros campos del formulario */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
