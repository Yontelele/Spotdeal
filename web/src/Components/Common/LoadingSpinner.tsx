interface Props {
  text?: string
  variant?: "component" | "global"
}

export const LoadingSpinner = ({ text, variant = "component" }: Props) => {
  const containerClasses =
    variant === "global" ? "fixed inset-0 flex flex-col items-center justify-center" : "flex flex-col items-center justify-center min-h-[calc(100vh-400px)]"

  return (
    <div className={containerClasses} data-testid="loading-spinner">
      <div className="relative">
        <div className={`animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-blue-500`} />
      </div>

      {text && <p className={`mt-4 text-gray-300 text-lg font-medium`}>{text}</p>}
    </div>
  )
}

export default LoadingSpinner
