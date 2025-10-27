import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      "1": "max-w-[448px]",
      "2": "max-w-[688px]",
      "3": "max-w-[880px]",
      "4": "max-w-[1136px]",
    },
  },
  defaultVariants: {
    size: "4",
  },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={cn(containerVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container, containerVariants }