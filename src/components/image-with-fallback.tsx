"use client";

import React from "react";




import { cn } from "@/lib/utils";

type ImageWithFallbackProps = any & {
  fallback: any["src"];
};

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const { fallback, alt, src, className, ...restProps } = props;

  const [error, setError] = React.useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  React.useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      onError={setError}
      className={cn(className, error && "dark:invert")}
      {...restProps}
    />
  );
}
