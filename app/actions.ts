"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  "use server";
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email as string;

  try {
    await prisma.note.create({
      data: {
        title: title,
        content: content,
        email: email,
      },
    });
    revalidatePath("/note");
  } catch (error) {
    console.log(error);
  }
}

export async function update(formData: FormData) {
  "use server";
  const cookieStore = cookies();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const noteId = formData.get("noteId") as string;
  try {
    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: title,
        content: content,
      },
    });
    revalidatePath("/note");
  } catch (error) {}
}

export async function deleteNote(formData: FormData) {
  "use server";
  const cookieStore = cookies();
  const noteId = formData.get("noteId") as string;
  try {
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });
    revalidatePath("/note")
  } catch (error) {}
}
