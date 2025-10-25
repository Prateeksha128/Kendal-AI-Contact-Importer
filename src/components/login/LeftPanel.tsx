import Logo from "./Logo";
import FeatureList from "./FeatureList";

export default function LeftPanel() {
  return (
    <>
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-center">
        <Logo size="sm" className="justify-center mb-4" />
        <h2 className="text-xl font-bold text-white">
          Smart Contact Management
        </h2>
        <p className="text-sm text-gray-300 mt-2">
          AI-powered intelligence for your contacts
        </p>
      </div>

      {/* Desktop Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 flex-col px-8 xl:px-12 py-6">
        <div className="flex items-center mb-12 xl:mb-16">
          <Logo size="lg" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="mb-8 xl:mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 xl:mb-6 leading-tight">
              Smart Contact Management
            </h2>
            <p className="text-lg xl:text-xl text-gray-300 mb-6 xl:mb-8 leading-relaxed">
              Effortlessly import, organize, and manage your contacts with
              AI-powered intelligence.
            </p>
            <div className="w-12 xl:w-16 h-1 bg-white/30 rounded"></div>
          </div>

          <FeatureList />
        </div>

        <div className="text-center pt-4 mt-6 border-t border-white/10">
          <p className="text-gray-400 text-xs xl:text-sm font-medium">
            Copyright Kendal AI. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
