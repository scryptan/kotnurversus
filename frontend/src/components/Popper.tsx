import { Box, BoxProps, Collapse, Placement, Portal } from "@chakra-ui/react";
import { RefObject, useEffect, useMemo, useState } from "react";
import { Modifier, usePopper } from "react-popper";
import useDebounce from "~/hooks/useDebounce";

type PopperProps = {
  isOpen: boolean;
  anchorRef: RefObject<HTMLElement>;
  placement?: Placement;
  isSameWidth?: boolean;
  unmountOnExit?: boolean;
  withPortal?: boolean;
  popperGap?: number;
} & BoxProps;

const Popper = ({
  isOpen,
  anchorRef,
  placement = "bottom",
  isSameWidth = true,
  unmountOnExit = true,
  withPortal,
  popperGap = 8,
  children,
  ...props
}: PopperProps) => {
  const [popper, setPopper] = useState<HTMLDivElement | null>(null);
  const debounce = useDebounce(300);

  const virtualAnchor = useMemo(
    () => ({
      getBoundingClientRect: () => {
        return anchorRef.current?.getBoundingClientRect() || new DOMRect();
      },
    }),
    []
  );

  const { styles, attributes, update } = usePopper(virtualAnchor, popper, {
    placement,
    modifiers: isSameWidth
      ? [sameWidth, makeOffset(popperGap)]
      : [makeOffset(popperGap)],
  });

  useEffect(() => {
    // обновление позиции
    // 1) после открытия
    // 2) после завершения анимации
    // 3) после изменения размеров якоря
    if (isOpen && anchorRef.current) {
      update?.();
      debounce.set(() => update?.());
      const observer = new ResizeObserver(() => update?.());
      observer.observe(anchorRef.current);
      return () => {
        debounce.reset();
        observer.disconnect();
      };
    }
  }, [isOpen]);

  const content = (
    <Box
      pos="absolute"
      ref={setPopper}
      zIndex="modal"
      css={{
        "&[data-popper-reference-hidden=true]": {
          visibility: "hidden",
          pointerEvents: "none",
        },
      }}
      style={styles.popper}
      {...props}
      {...attributes.popper}
    >
      <Collapse
        animateOpacity
        in={isOpen}
        unmountOnExit={unmountOnExit}
        children={children}
      />
    </Box>
  );

  if (withPortal) {
    return <Portal appendToParentPortal children={content} />;
  }

  return content;
};

const sameWidth: Modifier<string, object> = {
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: ({ state }) => {
    state.elements.popper.style.width = `${
      state.elements.reference.getBoundingClientRect().width
    }px`;
  },
};

const makeOffset = (gap: number) => ({
  name: "offset",
  options: { offset: [0, gap] },
});

export default Popper;
