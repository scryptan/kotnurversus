import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type UseAutoRedirectParams = {
  isEnabled: boolean;
  path: string;
};

const useAutoRedirect = ({ isEnabled, path }: UseAutoRedirectParams) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isEnabled) {
      navigate(path, { replace: true });
    }
  }, [isEnabled]);
};

export default useAutoRedirect;
