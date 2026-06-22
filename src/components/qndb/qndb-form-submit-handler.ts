import {
  QndbCreatePayload,
  QndbPersonnelDetail,
  QndbUpdatePayload,
  qndbApi,
} from "@/services/api/qndb";

const clean = (v?: string) => v || undefined;

export async function submitQndbForm(
  mode: "create" | "edit",
  form: QndbCreatePayload,
  initial: QndbPersonnelDetail | null | undefined,
): Promise<void> {
  const payload: QndbCreatePayload = {
    full_name: form.full_name,
    date_of_birth: form.date_of_birth,
    permanent_address: clean(form.permanent_address),
    temporary_address: clean(form.temporary_address),
    phone: clean(form.phone),
    education_level: clean(form.education_level),
    military_rank: clean(form.military_rank),
    unit: clean(form.unit),
    service_start_date: clean(form.service_start_date),
    service_end_date: clean(form.service_end_date),
    reserve_class: form.reserve_class || undefined,
    note: clean(form.note),
  };

  if (mode === "create") {
    await qndbApi.create(payload);
    return;
  }

  if (!initial) return;
  const diff: QndbUpdatePayload = {};
  (Object.keys(payload) as (keyof QndbCreatePayload)[]).forEach((k) => {
    const newVal = payload[k] ?? "";
    const oldVal = (initial as any)[k] ?? "";
    if (String(newVal) !== String(oldVal)) {
      (diff as any)[k] = payload[k];
    }
  });
  if (Object.keys(diff).length > 0) {
    await qndbApi.update(initial.id, diff);
  }
}

export function validateQndbForm(form: QndbCreatePayload): string | null {
  if (!form.full_name.trim()) return "Họ và tên không được để trống";
  if (!form.date_of_birth) return "Ngày sinh không được để trống";
  return null;
}
