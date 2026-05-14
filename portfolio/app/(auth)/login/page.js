import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, #f9fafb, #edf2ff 45%, #e2e8f0 100%)",
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-lg items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
