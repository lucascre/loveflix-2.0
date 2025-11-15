import { db } from "@/lib/prisma";
import { MomentViewer } from "@/components/MomentViewer";
import { notFound } from "next/navigation";
// Não precisamos do 'use' do React se usarmos await

// 1. A interface define 'params' como a Promise que esperamos
interface MomentPageProps {
  params: Promise<{ id: string }>;
}

// 2. A assinatura do componente recebe as props e desestrutura 'params'
export default async function MomentPage({ params }: MomentPageProps) {
  
  // 3. Dê 'await' na Promise 'params' para obter o objeto
  const resolvedParams = await params;

  // 4. Agora 'resolvedParams' é o objeto { id: string }
  //    e 'resolvedParams.id' é a string que o Prisma precisa.
  const moment = await db.moment.findUnique({
    where: { id: resolvedParams.id }, 
  });

  if (!moment) {
    notFound();
  }

  // 5. Renderize o seu componente com os dados
  return <MomentViewer moment={moment} />;
}