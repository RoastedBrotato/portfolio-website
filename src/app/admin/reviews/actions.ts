"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, signIn, signOut } from "@/lib/adminAuth";
import { approveReview, deleteReview, unapproveReview } from "@/lib/reviews";

/*
 * Moderation actions. Each one re-checks the session: rendering the admin page
 * behind a cookie gate is a UI convenience, not a security boundary, since a
 * Server Action can be POSTed without ever loading that page.
 */

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const token = formData.get("token");
  if (typeof token !== "string" || !(await signIn(token))) {
    return { error: "Wrong token." };
  }
  return {};
}

export async function logout(): Promise<void> {
  await signOut();
}

/** Both public surfaces read the approved set, so both go stale on any change. */
function revalidatePublicPages(): void {
  revalidatePath("/");
  revalidatePath("/reviews");
}

export async function approve(id: string): Promise<void> {
  await requireAdmin();
  await approveReview(id);
  revalidatePublicPages();
  revalidatePath("/admin/reviews");
}

export async function unapprove(id: string): Promise<void> {
  await requireAdmin();
  await unapproveReview(id);
  revalidatePublicPages();
  revalidatePath("/admin/reviews");
}

export async function remove(id: string): Promise<void> {
  await requireAdmin();
  await deleteReview(id);
  revalidatePublicPages();
  revalidatePath("/admin/reviews");
}
