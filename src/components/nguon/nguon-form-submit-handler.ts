import {
  NguonCreatePayload,
  NguonPersonnelDetail,
  NguonUpdatePayload,
  nguonApi,
} from "@/services/api/nguon";

export async function submitNguonForm(
  mode: "create" | "edit",
  form: NguonCreatePayload,
  initial: NguonPersonnelDetail | null | undefined,
): Promise<void> {
  if (mode === "create") {
    await nguonApi.create({
      ...form,
      permanent_address: form.permanent_address || undefined,
      temporary_address: form.temporary_address || undefined,
      phone: form.phone || undefined,
      education_level: form.education_level || undefined,
      note: form.note || undefined,
    });
    return;
  }

  if (!initial) return;
  const diff: NguonUpdatePayload = {};
  if (form.full_name !== initial.full_name) diff.full_name = form.full_name;
  if (form.date_of_birth !== initial.date_of_birth?.split("T")[0]) diff.date_of_birth = form.date_of_birth;
  if ((form.permanent_address || "") !== (initial.permanent_address || "")) diff.permanent_address = form.permanent_address;
  if ((form.temporary_address || "") !== (initial.temporary_address || "")) diff.temporary_address = form.temporary_address;
  if ((form.phone || "") !== (initial.phone || "")) diff.phone = form.phone;
  if ((form.education_level || "") !== (initial.education_level || "")) diff.education_level = form.education_level;
  if ((form.note || "") !== (initial.note || "")) diff.note = form.note;
  await nguonApi.update(initial.id, diff);
}

export function validateNguonForm(form: NguonCreatePayload): string | null {
  if (!form.full_name.trim()) return "Họ và tên không được để trống";
  if (!form.date_of_birth) return "Ngày sinh không được để trống";
  return null;
}
