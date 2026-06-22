import { Plus } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import useDebounce from "@/hooks/useDebounce";
import { ActivityInterface, getActivities } from "@/services/api/activity";

import { ActivityCreateForm } from "./activity-create-form";
import { ActivityDetailSheet } from "./activity-detail-sheet";
import { MonthNav, StatusFilterBar } from "./activity-filter-bar";
import { ActivityListItem } from "./activity-list-item";

export function ActivityListTab() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [activities, setActivities] = useState<ActivityInterface[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const debouncedPage = useDebounce(page, 200);
  const debouncedStatus = useDebounce(status, 200);
  const debouncedDate = useDebounce(currentDate, 200);

  const canCreate = user?.role === "CHI_HUY" || user?.role === "TO_TRUONG";

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getActivities({
        status: debouncedStatus,
        month: (debouncedDate as Date).getMonth() + 1,
        year: (debouncedDate as Date).getFullYear(),
        page: debouncedPage as number,
        limit: 10,
      });
      setActivities((prev) =>
        (debouncedPage as number) === 1
          ? res.results
          : [...prev, ...res.results],
      );
      setTotal(res.total);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [debouncedStatus, debouncedDate, debouncedPage]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const resetAndFilter = (cb: () => void) => {
    cb();
    setPage(1);
    setActivities([]);
  };

  if (showCreate) {
    return (
      <ActivityCreateForm
        onBack={() => setShowCreate(false)}
        onSuccess={(newActivity) => {
          setShowCreate(false);
          setActivities((prev) => [newActivity, ...prev]);
          setTotal((t) => t + 1);
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <MonthNav
        date={currentDate}
        onPrev={() =>
          resetAndFilter(() =>
            setCurrentDate((d) => {
              const n = new Date(d);
              n.setMonth(n.getMonth() - 1);
              return n;
            }),
          )
        }
        onNext={() =>
          resetAndFilter(() =>
            setCurrentDate((d) => {
              const n = new Date(d);
              n.setMonth(n.getMonth() + 1);
              return n;
            }),
          )
        }
        onToday={() => resetAndFilter(() => setCurrentDate(new Date()))}
      />
      <StatusFilterBar
        value={status}
        onChange={(v) => resetAndFilter(() => setStatus(v))}
      />

      {loading && page === 1 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#556B2F" />
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 100,
          }}
          renderItem={({ item }) => (
            <ActivityListItem
              activity={item}
              onPress={() => setSelectedId(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <ThemedText style={{ color: "#9ca3af", fontSize: 14 }}>
                Không có công tác nào phù hợp
              </ThemedText>
            </View>
          }
          ListFooterComponent={
            activities.length < total ? (
              <Pressable
                onPress={() => setPage((p) => p + 1)}
                style={{ alignItems: "center", paddingVertical: 12 }}
              >
                {loading ? (
                  <ActivityIndicator color="#556B2F" />
                ) : (
                  <ThemedText
                    style={{
                      color: "#556B2F",
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    Tải thêm
                  </ThemedText>
                )}
              </Pressable>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {canCreate && (
        <Pressable
          onPress={() => setShowCreate(true)}
          style={{
            position: "absolute",
            bottom: insets.bottom + 90,
            right: 20,
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "#3b4a2e",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Plus size={24} color="#fff" />
        </Pressable>
      )}

      <ActivityDetailSheet
        activityId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </View>
  );
}
