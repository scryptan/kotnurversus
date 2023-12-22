import {
  Box,
  Textarea as ChakraTextarea,
  useMergeRefs,
} from "@chakra-ui/react";
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from "react";
import Textarea, { TextareaProps } from "./Textarea";

type Props = {
  minHeight?: number;
} & Omit<TextareaProps, "minHeight">;

const AutoSizeTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      minHeight = 86,
      defaultValue,
      value: controlledValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const hiddenAreaRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaRefs = useMergeRefs(textareaRef, ref);
    const [value, setValue] = useState(defaultValue);

    const isControlled = controlledValue !== undefined;

    const resizeTextarea = () => {
      const height = (hiddenAreaRef.current?.scrollHeight || 0) + 4;
      textareaRef.current?.style.setProperty(
        "height",
        `${Math.max(height, minHeight)}px`,
        "important"
      );
    };

    useEffect(() => {
      window.addEventListener("resize", resizeTextarea, { passive: true });
      return () => {
        window.removeEventListener("resize", resizeTextarea);
      };
    }, []);

    useEffect(resizeTextarea, [value, controlledValue]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.currentTarget.value);
      onChange?.(e);
    };

    return (
      <Box w="full" pos="relative">
        <ChakraTextarea
          aria-hidden
          isReadOnly
          rows={1}
          w="full"
          pos="absolute"
          visibility="hidden"
          tabIndex={-1}
          zIndex={-1000}
          overflow="hidden"
          ref={hiddenAreaRef}
          value={isControlled ? controlledValue : value}
        />
        <Textarea
          defaultValue={defaultValue}
          ref={textareaRefs}
          onChange={handleChange}
          overflowY="clip"
          {...props}
        />
      </Box>
    );
  }
);

export default AutoSizeTextarea;
