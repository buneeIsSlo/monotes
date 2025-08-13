import NotesEditor from "@/components/notes/notes-editor";
import ThemeToggeler from "@/components/theme-toggeler";

export default function Home() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <NotesEditor />
      <ThemeToggeler />
    </main>
  );
}
