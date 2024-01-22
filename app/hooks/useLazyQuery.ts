import {
  QueryFunction,
  useQuery,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";

export default function useLazyQuery(
  key: string[],
  fn: QueryFunction<unknown, string[], never>,
  options: UndefinedInitialDataOptions<unknown, Error, unknown, string[]>
) {
  const query = useQuery({
    ...options,
    queryKey: key,
    queryFn: fn,
    enabled: false,
  });

  return [query.refetch, query];
}
