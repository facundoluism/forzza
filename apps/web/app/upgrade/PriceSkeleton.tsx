/**
 * Skeleton de precio PRO — usado como fallback de Suspense
 * mientras PriceBlock resuelve la query a country_config.
 */
export function PriceSkeleton(): React.JSX.Element {
  return (
    <>
      {/* Valor principal */}
      <div
        className="h-10 w-32 rounded-lg bg-surface-2 animate-pulse"
        aria-hidden="true"
      />
      {/* Subtítulo */}
      <div
        className="h-4 w-48 mt-2 rounded bg-surface-2 animate-pulse"
        aria-hidden="true"
      />
    </>
  );
}
