import { db } from "@/lib/prisma";
import { MomentViewer } from "@/components/MomentViewer";
import { notFound } from "next/navigation";

// VERSÃO CORRETA:
interface MomentPageProps {
  params: { id: string }; // <--- 'params' é um objeto simples, não uma Promise
}

// O resto do seu componente permanece igual:
export default async function MomentPage({ params }: MomentPageProps) {
  const moment = await db.moment.findUnique({
    where: { id: params.id }, // Agora 'params.id' será a string do ID
  });

  if (!moment) {
    notFound();
  }

  return <MomentViewer moment={moment} />;
}