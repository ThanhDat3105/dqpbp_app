import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { DocumentItem, documentApi } from "@/services/api/document";

const PAGE_LIMIT = 15;

export function useDocumentList(search: string, departmentId: number | null) {
  const [rows, setRows] = useState<DocumentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const debouncedSearch = useDebounce(search, 400) as string;

  const fetchPage = useCallback(async (page: number, append: boolean) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await documentApi.fetchList({
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch || undefined,
        departmentId: departmentId ?? undefined,
      });
      setTotal(res.total);
      hasMoreRef.current = page * PAGE_LIMIT < res.total;
      setRows(append ? (prev) => [...prev, ...res.data] : res.data);
    } catch {
      if (!append) setRows([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, departmentId]);

  useEffect(() => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    fetchPage(1, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMoreRef.current) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchPage(nextPage, true);
  }, [loadingMore, fetchPage]);

  const refresh = useCallback(() => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    fetchPage(1, false);
  }, [fetchPage]);

  return { rows, total, loading, loadingMore, loadMore, refresh, debouncedSearch };
}
