import * as React from "react";

import { cn } from "@/lib/utils";

import { getUniqueErrors } from "./utils";

const FieldError = ({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) => {
  const uniqueErrors = React.useMemo(() => getUniqueErrors(errors), [errors]);

  const content =
    children ??
    (uniqueErrors.length === 1 ? (
      uniqueErrors[0]
    ) : uniqueErrors.length > 1 ? (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    ) : null);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  );
};

export default FieldError;
