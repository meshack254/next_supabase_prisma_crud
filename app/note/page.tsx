import { cookies } from "next/headers";
import { createNote, update, deleteNote } from "../actions";
import { createClient } from "@/utils/supabase/server";

async function fetchNotes() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  const notes = await prisma?.note.findMany({
    where: {
      email: user?.email,
    },
  });
  return notes;
}

async function page() {
  const notes = await fetchNotes();

  return (
    <section className="w-[100vw] h-[100svh] flex flex-col justify-center items-center">
      {/* Create */}
      <div className="">
        <form action={createNote} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="p-3 rounded-md border-2 border-blue-600 bg-transparent"
          />
          <textarea
            name="content"
            cols={30}
            rows={3}
            className="rounded-md p-3 border-2 border-blue-600 bg-transparent"
            placeholder="Content"
          ></textarea>
          <button className="bg-blue-700 px-2 py-3 rounded-md">Create</button>
        </form>
      </div>

      {/* Read */}
      <div className="flex mt-10 gap-3 flex-wrap items-center justify-center">
        {notes?.map((note) => (
          <form
            action={update}
            key={note.id}
            className="flex flex-col rounded-md border-2 border-blue-600"
          >
            <input
              type="text"
              name="title"
              defaultValue={note.title}
              className="p-3 rounded-md bg-transparent"
            />
            <textarea
              name="content"
              id=""
              cols={30}
              rows={3}
              defaultValue={note.content}
              className="rounded-md p-3 bg-transparent"
            ></textarea>
            <input type="hidden" name="noteId" value={note.id} />
            <button className="bg-blue-700 px-2 py-3 rounded-md">Edit</button>
            <button
              formAction={deleteNote}
              className="bg-red-700 px-2 py-3 rounded-md mt-3"
            >
              Delete
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}

export default page;
