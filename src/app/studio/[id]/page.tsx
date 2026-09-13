import Link from "next/link";
import { notFound } from "next/navigation";
import { getContract } from "@/lib/store";
import { ContractEditor } from "@/components/ContractEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ContractPage({ params }: Props) {
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted">
        <Link href="/studio" className="hover:text-signal">
          Studio
        </Link>
        <span>/</span>
        <span className="text-paper">{contract.id}</span>
      </div>
      <ContractEditor initial={contract} />
    </div>
  );
}
