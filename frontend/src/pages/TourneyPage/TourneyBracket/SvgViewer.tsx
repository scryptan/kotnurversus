import { Flex, FlexProps, useColorModeValue } from "@chakra-ui/react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { ReactSVGPanZoom, Value } from "react-svg-pan-zoom";

type Props = {
  bracketWidth: number;
  bracketHeight: number;
  startAt: number[];
  containerProps?: FlexProps;
  children: ReactElement;
};

const SvgViewer = ({
  bracketWidth,
  bracketHeight,
  startAt,
  containerProps,
  children,
}: Props) => {
  const [width, setWidth] = useState(0);
  const [value, setValue] = useState<Value>({} as Value);
  const bgColor = useColorModeValue("#FFFFFF", "#222222");
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<ReactSVGPanZoom>(null);

  useEffect(() => {
    const [x = 0, y = 0] = startAt;
    ref.current?.pan(x, y);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width - 4;
      setWidth(width > bracketWidth ? bracketWidth : width);
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [bracketWidth]);

  const handleChangeValue = (v: Value) => {
    const zoomFactor = v.a || v.d;
    const scaledMaxW = v.SVGWidth * zoomFactor - v.viewerWidth;
    const scaledMaxH = v.SVGHeight * zoomFactor - v.viewerHeight;
    setValue({
      ...v,
      e: v.e > 0 ? 0 : v.e < 0 - scaledMaxW ? 0 - scaledMaxW : v.e,
      f: v.f > 0 ? 0 : v.f < 0 - scaledMaxH ? 0 - scaledMaxH : v.f,
    });
  };

  return (
    <Flex
      ref={containerRef}
      w="full"
      borderRadius={4}
      justify="center"
      {...containerProps}
    >
      <ReactSVGPanZoom
        width={width}
        height={bracketHeight}
        background={bgColor}
        SVGBackground={bgColor}
        detectWheel={false}
        detectAutoPan={false}
        disableDoubleClickZoomWithToolAuto
        tool="auto"
        onChangeTool={noAction}
        value={value}
        onChangeValue={handleChangeValue}
        customMiniature={noAction}
        customToolbar={noAction}
        children={children}
      />
    </Flex>
  );
};

const noAction = () => <></>;

export default SvgViewer;
