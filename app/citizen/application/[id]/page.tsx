import ApplicationDetail from './ApplicationDetail';

export async function generateStaticParams() {
  return [
    { id: 'APP-2024-001' },
    { id: 'APP-2024-002' },
    { id: 'APP-2024-003' },
  ];
}

export default function ApplicationPage({ params }: { params: { id: string } }) {
  return <ApplicationDetail applicationId={params.id} />;
}