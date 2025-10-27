import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const gridVariants = cva("", {
  variants: {
    display: {
      none: "hidden",
      "inline-grid": "inline-grid",
      grid: "grid",
    },
    columns: {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
      "7": "grid-cols-7",
      "8": "grid-cols-8",
      "9": "grid-cols-9",
      "10": "grid-cols-10",
      "11": "grid-cols-11",
      "12": "grid-cols-12",
    },
    rows: {
      "1": "grid-rows-1",
      "2": "grid-rows-2",
      "3": "grid-rows-3",
      "4": "grid-rows-4",
      "5": "grid-rows-5",
      "6": "grid-rows-6",
    },
    flow: {
      row: "grid-flow-row",
      "row-dense": "grid-flow-row-dense",
      col: "grid-flow-col",
      "col-dense": "grid-flow-col-dense",
    },
    align: {
      start: "place-items-start",
      center: "place-items-center",
      end: "place-items-end",
      stretch: "place-items-stretch",
    },
    justify: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch",
    },
    gap: {
      "0": "gap-0",
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "5": "gap-5",
      "6": "gap-6",
      "7": "gap-7",
      "8": "gap-8",
      "9": "gap-9",
      "10": "gap-10",
      "11": "gap-11",
      "12": "gap-12",
    },
  },
  defaultVariants: {
    display: "grid",
  },
})

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  asChild?: boolean
  as?: "div" | "span"
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, display, columns, rows, flow, align, justify, gap, asChild = false, as = "div", ...props }, ref) => {
    const Comp = asChild ? Slot : as === "span" ? "span" : "div"
    return (
      <Comp
        className={cn(
          gridVariants({
            display,
            columns,
            rows,
            flow,
            align,
            justify,
            gap,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

export { Grid, gridVariants }