import { useCallback, useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Users, userApi } from "@/services/api/user";

export function useDqcdList(search: string) {
  const [rows, setRows] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400) as string;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getUsers({ role: "DQCD", search: debouncedSearch || undefined });
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetch(); }, [fetch]);

  return { rows, loading, refresh: fetch, debouncedSearch };
}
