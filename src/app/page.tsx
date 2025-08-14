import NotesEditor from "@/components/notes/notes-editor";
import ThemeToggeler from "@/components/theme-toggeler";

export default function Home() {
  return (
    <main className="p-4 sm:p-8 md:max-w-4xl mx-auto">
      <NotesEditor />
      <ThemeToggeler />
    </main>
  );
}
