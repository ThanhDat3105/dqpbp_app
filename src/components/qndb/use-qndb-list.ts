import { useCallback, useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { QndbPersonnel, qndbApi } from "@/services/api/qndb";

export function useQndbList(search: string) {
  const [rows, setRows] = useState<QndbPersonnel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search, 400) as string;

  const fetchPage = useCallback(async (pageNum: number, reset: boolean) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await qndbApi.getList({
        page: pageNum,
        limit: 15,
        search: debouncedSearch || undefined,
      });
      setRows((prev) => (reset ? res.data : [...prev, ...res.data]));
      setTotal(res.total);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = () => {
    if (loadingMore || rows.length >= total) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next, false);
  };

  const refresh = () => {
    setPage(1);
    fetchPage(1, true);
  };

  return { rows, total, loading, loadingMore, loadMore, refresh, debouncedSearch };
}
