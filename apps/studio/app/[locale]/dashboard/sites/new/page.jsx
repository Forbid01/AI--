import { templateList } from '@aiweb/templates';
import BuilderShell from './BuilderShell.jsx';

export default function NewSitePage({ params, searchParams }) {
  const initialTrack = searchParams?.track === 'ai' ? 'ai' : 'template';
  return (
    <BuilderShell
      locale={params.locale}
      templates={templateList}
      initialPrompt={searchParams?.prompt ?? ''}
      initialTemplate={searchParams?.template ?? ''}
      initialTrack={initialTrack}
    />
  );
}
