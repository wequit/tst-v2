import ApplicationDetail from './ApplicationDetail';

export async function generateStaticParams() {
  return [
    { id: 'APP-2024-001' },
    { id: 'APP-2024-002' },
    { id: 'APP-2024-003' },
    { id: 'APP-2025-001' },
    { id: 'APP-2025-002' },
    { id: 'APP-2025-003' },
  ];
}

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ApplicationDetail applicationId={resolvedParams.id} />;
}