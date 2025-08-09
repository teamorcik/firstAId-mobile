import * as React from "react";
import { TextInput } from "react-native";
import { cn } from "@/lib/utils";
import { Platform } from "react-native";
import { Slot } from "@radix-ui/react-slot";

// global default or per component override
// you get shadcn
const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> & {
    asChild?: boolean;
    noFocus?: boolean;
  }
>(
  (
    {
      className,
      placeholderClassName,
      asChild = false,
      noFocus = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : TextInput;

    return (
      <Comp
        ref={ref}
        className={cn(
          "native:h-12 native:text-md native:leading-[1.25] h-10 rounded-md border border-input bg-background px-3 text-base text-foreground file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:flex web:w-full web:py-2 lg:text-sm",
          "web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          noFocus && "web:focus-visible:ring-0 web:focus-visible:ring-offset-0",
          // Platform.OS === "web" &&
          //   "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", // shadcn
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className,
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
