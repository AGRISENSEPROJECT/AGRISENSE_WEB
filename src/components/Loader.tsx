interface LoaderProps {
  /** Show as a full-screen overlay (default) or inline. */
  fullScreen?: boolean;
  /** Optional message under the spinner. */
  message?: string;
}

const Loader = ({ fullScreen = true, message = "Loading…" }: LoaderProps) => {
  const content = (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-16 w-16">
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-green-100" />
        <div className="absolute inset-0 rounded-full border-4 border-[#2C6E49] border-t-transparent animate-spin" />
        {/* Logo in the center */}
        <img
          src="/assets/logo.png"
          alt="AgriSense"
          className="absolute inset-0 m-auto h-8 w-8 object-contain"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-bold tracking-tight">
          <span className="text-green-600">AGRI</span>
          <span className="text-gray-800">SENSE</span>
        </p>
        {message && <p className="text-sm text-gray-500 animate-pulse">{message}</p>}
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="flex items-center justify-center py-16">{content}</div>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F5F2]">
      {content}
    </div>
  );
};

export default Loader;
