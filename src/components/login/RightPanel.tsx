import GoogleButton from "./GoogleButton";

export default function RightPanel() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl p-6 sm:p-8 lg:p-12 border border-gray-100 relative overflow-hidden">
          {/* Background Pattern - Only on desktop */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>

          <div className="relative">
            {/* Header */}
            <div className="text-center mb-6 ">
              <div className="mb-3 lg:mb-4">
                <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-3 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm lg:text-lg">
                Access your smart contacts dashboard
              </p>
            </div>

            <GoogleButton />

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs lg:text-sm text-gray-500 leading-relaxed px-2">
                By signing in, you agree to our{" "}
                <span className="text-slate-700 hover:text-slate-900 hover:underline cursor-pointer font-medium transition-colors">
                  Terms
                </span>{" "}
                and{" "}
                <span className="text-slate-700 hover:text-slate-900 hover:underline cursor-pointer font-medium transition-colors">
                  Privacy
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
