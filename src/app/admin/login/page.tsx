import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="container-app flex min-h-[70vh] max-w-sm flex-col justify-center py-16">
      <h1 className="text-2xl font-semibold">Administration</h1>
      <p className="mt-2 text-sm text-muted">
        Accès réservé à l&apos;équipe éditoriale de Poliscope.
      </p>
      <LoginForm next={next} />
    </div>
  );
}
