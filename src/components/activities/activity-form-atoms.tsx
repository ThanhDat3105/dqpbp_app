import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";

export function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <ThemedText
      style={{
        fontSize: 12,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 4,
      }}
    >
      {label}
      {required && <ThemedText style={{ color: "#ef4444" }}> *</ThemedText>}
    </ThemedText>
  );
}

export function StyledInput({
  value,
  onChangeText,
  placeholder,
  multiline,
  error,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  error?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      style={{
        borderWidth: 1,
        borderColor: error ? "#ef4444" : "#e5e7eb",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
        color: "#111827",
        backgroundColor: "#f9fafb",
        minHeight: multiline ? 72 : undefined,
        textAlignVertical: multiline ? "top" : "center",
      }}
    />
  );
}

// value: "YYYY-MM-DD", onChange: (v: string) => void
export function DatePickerInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const date = value ? dayjs(value).toDate() : new Date();
  const displayText = value ? dayjs(value).format("DD/MM/YYYY") : "Chọn ngày";

  const onChangeNative = (_: any, selected?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
      if (selected) onChange(dayjs(selected).format("YYYY-MM-DD"));
    } else {
      if (selected) setTempDate(selected);
    }
  };

  const handleIOSConfirm = () => {
    if (tempDate) onChange(dayjs(tempDate).format("YYYY-MM-DD"));
    setShow(false);
    setTempDate(null);
  };

  const handleIOSCancel = () => {
    setShow(false);
    setTempDate(null);
  };

  return (
    <View>
      <Pressable
        onPress={() => {
          setTempDate(date);
          setShow(true);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: error ? "#ef4444" : "#e5e7eb",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: "#f9fafb",
        }}
      >
        <ThemedText
          style={{
            fontSize: 13,
            color: value ? "#111827" : "#9ca3af",
          }}
        >
          {displayText}
        </ThemedText>
        <CalendarDays size={16} color="#6b7280" />
      </Pressable>

      {Platform.OS === "ios" ? (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={handleIOSCancel}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <Pressable style={{ flex: 1 }} onPress={handleIOSCancel} />
            <View style={{ backgroundColor: "#fff" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e7eb",
                }}
              >
                <Pressable onPress={handleIOSCancel}>
                  <ThemedText style={{ fontSize: 15, color: "#6b7280" }}>
                    Huỷ
                  </ThemedText>
                </Pressable>
                <Pressable onPress={handleIOSConfirm}>
                  <ThemedText
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#3b4a2e",
                    }}
                  >
                    Xong
                  </ThemedText>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate ?? date}
                mode="date"
                display="spinner"
                onChange={onChangeNative}
                locale="vi"
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeNative}
            locale="vi"
          />
        )
      )}
    </View>
  );
}

// value: "YYYY-MM-DDTHH:mm", onChange: (v: string) => void
export function DateTimePickerInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false); // Android only
  const [showIOS, setShowIOS] = useState(false); // iOS datetime spinner

  const date = value ? dayjs(value).toDate() : new Date();
  const displayText = value
    ? dayjs(value).format("HH:mm DD/MM/YYYY")
    : "Chọn ngày giờ";

  const openPicker = () => {
    if (Platform.OS === "ios") {
      setShowIOS(true);
    } else {
      setShowDate(true);
    }
  };

  // Android: chọn ngày xong tự mở giờ
  const onChangeDateAndroid = (_: any, selected?: Date) => {
    setShowDate(false);
    if (selected) {
      const base = value ? dayjs(value) : dayjs();
      const next = dayjs(selected).hour(base.hour()).minute(base.minute());
      onChange(next.format("YYYY-MM-DDTHH:mm"));
      setShowTime(true);
    }
  };

  const onChangeTimeAndroid = (_: any, selected?: Date) => {
    setShowTime(false);
    if (selected) {
      const base = value ? dayjs(value) : dayjs();
      const next = dayjs(base.format("YYYY-MM-DD"))
        .hour(dayjs(selected).hour())
        .minute(dayjs(selected).minute());
      onChange(next.format("YYYY-MM-DDTHH:mm"));
    }
  };

  // iOS: 1 picker datetime, dùng state tạm để có nút "Xong"
  const [tempDate, setTempDate] = useState(date);

  const onChangeIOS = (_: any, selected?: Date) => {
    if (selected) setTempDate(selected);
  };

  const confirmIOS = () => {
    onChange(dayjs(tempDate).format("YYYY-MM-DDTHH:mm"));
    setShowIOS(false);
  };

  return (
    <View>
      <Pressable
        onPress={openPicker}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: error ? "#ef4444" : "#e5e7eb",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: "#f9fafb",
        }}
      >
        <ThemedText
          style={{ fontSize: 13, color: value ? "#111827" : "#9ca3af" }}
        >
          {displayText}
        </ThemedText>
        <CalendarDays size={16} color="#6b7280" />
      </Pressable>

      {/* Android: 2 picker nối tiếp */}
      {Platform.OS === "android" && showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDateAndroid}
          locale="vi"
        />
      )}
      {Platform.OS === "android" && showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onChangeTimeAndroid}
          locale="vi"
        />
      )}

      {/* iOS: modal chứa spinner datetime + nút Xong */}
      {Platform.OS === "ios" && (
        <Modal visible={showIOS} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <View style={{ backgroundColor: "#fff", paddingBottom: 20 }}>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="spinner"
                onChange={onChangeIOS}
                locale="vi"
              />
              <Pressable
                onPress={confirmIOS}
                style={{
                  padding: 14,
                  alignItems: "center",
                  borderTopWidth: 1,
                  borderColor: "#e5e7eb",
                }}
              >
                <ThemedText style={{ color: "#2563eb", fontWeight: "600" }}>
                  Xong
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export function SelectPill({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -2 }}
    >
      <View style={{ flexDirection: "row", gap: 6, paddingHorizontal: 2 }}>
        {options.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => onChange(value === opt.value ? "" : opt.value)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 99,
              borderWidth: 1,
              borderColor: value === opt.value ? "#3b4a2e" : "#e5e7eb",
              backgroundColor: value === opt.value ? "#3b4a2e" : "#fff",
            }}
          >
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: value === opt.value ? "#fff" : "#374151",
              }}
            >
              {opt.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
