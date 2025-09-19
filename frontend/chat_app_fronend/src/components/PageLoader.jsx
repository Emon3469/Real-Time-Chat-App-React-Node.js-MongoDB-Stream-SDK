import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const PageLoader = ({ message = "Loading..." }) => {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary mb-4" />
      <p className="text-lg font-medium text-base-content opacity-70 animate-pulse">
        {message}
      </p>
    </div>
  )
};

export default PageLoader
