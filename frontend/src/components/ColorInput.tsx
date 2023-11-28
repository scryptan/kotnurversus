import {
  Box,
  Circle,
  forwardRef,
  useBoolean,
  useMergeRefs,
} from "@chakra-ui/react";
import { useRef, ClipboardEvent } from "react";
import { HexColorPicker } from "react-colorful";
import Input, { InputProps } from "~/components/Input";
import Popper from "~/components/Popper";
import useOutsideAction from "~/hooks/useOutsideAction";

type Props = {
  value?: string;
  onChange?: (newValue: string) => void;
} & InputProps;

const ColorInput = forwardRef<Props, "input">(
  ({ value, onChange, ...props }, ref) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefs = useMergeRefs(inputRef, ref);
    const [isOpen, setIsOpen] = useBoolean(false);

    useOutsideAction({
      boxRef,
      isActive: isOpen,
      callBackOnExit: setIsOpen.off,
    });

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      const value = e.clipboardData.getData("text").trim().toLowerCase();
      if (hexRegexp.test(value)) {
        onChange?.(value);
      }
    };

    return (
      <Box ref={boxRef} {...props.containerProps}>
        <Input
          {...props}
          isReadOnly
          ref={inputRefs}
          value={value || ""}
          onClick={setIsOpen.on}
          onPaste={handlePaste}
          rightElement={<Circle size={5} bg={value} />}
          rightElementProps={{ pointerEvents: "none" }}
        />
        <Popper
          isOpen={isOpen}
          isSameWidth={false}
          anchorRef={inputRef}
          placement="bottom-start"
        >
          <HexColorPicker color={value} onChange={onChange} />
        </Popper>
      </Box>
    );
  }
);

const hexRegexp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export default ColorInput;
