export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent animate-spin animation-delay-200" style={{animationDirection:'reverse'}}></div>
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )
}
