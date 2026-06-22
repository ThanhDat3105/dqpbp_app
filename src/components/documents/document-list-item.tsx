import dayjs from "dayjs";
import { Download, FileSpreadsheet, FileText, Globe, Image, Lock } from "lucide-react-native";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { DocumentItem } from "@/services/api/document";

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return { icon: FileText, color: "#ef4444" };
  if (["doc", "docx"].includes(ext)) return { icon: FileText, color: "#3b82f6" };
  if (["xls", "xlsx"].includes(ext)) return { icon: FileSpreadsheet, color: "#16a34a" };
  if (["png", "jpg", "jpeg", "gif"].includes(ext)) return { icon: Image, color: "#f59e0b" };
  return { icon: FileText, color: "#6b7280" };
}

function getFileMeta(fileName: string): string {
  return fileName.split(".").pop()?.toUpperCase() ?? "FILE";
}

interface Props {
  item: DocumentItem;
}

export function DocumentListItem({ item }: Props) {
  const { icon: Icon, color } = getFileIcon(item.file_name);
  const ext = getFileMeta(item.file_name);
  const date = dayjs(item.created_at).format("DD/MM/YYYY");

  return (
    <View style={s.row}>
      <View style={[s.iconWrap, { backgroundColor: color + "18" }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={s.info}>
        <ThemedText style={s.title} numberOfLines={2}>{item.title}</ThemedText>
        {item.description ? (
          <ThemedText style={s.desc} numberOfLines={1}>{item.description}</ThemedText>
        ) : null}
        <View style={s.meta}>
          <ThemedText style={s.metaText}>{ext} • {date}</ThemedText>
          {item.is_public ? (
            <View style={s.publicBadge}>
              <Globe size={9} color="#15803d" />
              <ThemedText style={s.publicText}>Công khai</ThemedText>
            </View>
          ) : (
            <View style={s.privateBadge}>
              <Lock size={9} color="#6b7280" />
              <ThemedText style={s.privateText}>Nội bộ</ThemedText>
            </View>
          )}
        </View>
      </View>
      <Pressable
        style={s.dlBtn}
        onPress={() => Linking.openURL(item.file_url)}
        hitSlop={8}
      >
        <Download size={16} color="#3b82f6" />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#f3f4f6", gap: 12, backgroundColor: "#fff" },
  iconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: "600", color: "#111827", lineHeight: 20 },
  desc: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  metaText: { fontSize: 11, color: "#9ca3af" },
  publicBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20, backgroundColor: "#f0fdf4" },
  publicText: { fontSize: 10, color: "#15803d", fontWeight: "600" },
  privateBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20, backgroundColor: "#f3f4f6" },
  privateText: { fontSize: 10, color: "#6b7280", fontWeight: "500" },
  dlBtn: { padding: 8, borderRadius: 10, backgroundColor: "#eff6ff" },
});
