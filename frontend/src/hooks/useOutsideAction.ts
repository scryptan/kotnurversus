import { useOutsideClick } from "@chakra-ui/react";
import { RefObject, useEffect } from "react";

type UseOutsideActionParams = {
  boxRef: RefObject<HTMLElement>;
  portalRef?: RefObject<HTMLElement>;
  callBackOnExit: () => void;
  isActive?: boolean;
};

const useOutsideAction = ({
  boxRef,
  portalRef,
  callBackOnExit,
  isActive,
}: UseOutsideActionParams) => {
  useOutsideClick({
    ref: boxRef,
    handler: (e) => {
      const target = e.target;
      if (target instanceof Node && !portalRef?.current?.contains(target)) {
        callBackOnExit();
      }
    },
    enabled: isActive,
  });

  useEffect(() => {
    if (isActive) {
      const handleKeyDown = (event: KeyboardEvent) => {
        event.key === "Tab" && callBackOnExit();
      };

      boxRef.current?.addEventListener("keydown", handleKeyDown);

      return () => {
        boxRef.current?.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isActive]);
};

export default useOutsideAction;
