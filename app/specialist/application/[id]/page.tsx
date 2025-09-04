import ApplicationReview from './ApplicationReview';

export async function generateStaticParams() {
  return [
    { id: 'APP-2025-001' },
    { id: 'APP-2025-002' },
    { id: 'APP-2025-003' },
  ];
}

 export default async function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApplicationReview applicationId={id} />;
}