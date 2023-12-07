import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

type Props = {
  bracketWidth: number;
} & BoxProps;

const TourneyBracketContainer = ({ bracketWidth, ...props }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const scrollBarColor = useColorModeValue("#00000029", "#ffffff29");

  useEffect(() => {
    const container = boxRef.current;
    if (!container) return;
    if (container.scrollWidth <= container.clientWidth) return;

    let isGrabbed: boolean = false;

    const mouseDown = () => {
      isGrabbed = true;
      document.body.style.setProperty("cursor", "grabbing");
    };

    const mouseUp = () => {
      isGrabbed = false;
      document.body.style.removeProperty("cursor");
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isGrabbed) return;
      container.scrollTo({ left: container.scrollLeft - e.movementX });
      e.preventDefault();
    };

    container.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    return () => {
      container.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return (
    <Box
      ref={boxRef}
      mx="auto"
      overflowX="auto"
      w={{
        base: "95vw",
        md: `min(800px, ${bracketWidth}px)`,
        lg: `min(950px, ${bracketWidth}px)`,
        xl: `min(1200px, ${bracketWidth}px)`,
      }}
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: 8,
          background: scrollBarColor,
        },
      }}
      {...props}
    />
  );
};

export default TourneyBracketContainer;
