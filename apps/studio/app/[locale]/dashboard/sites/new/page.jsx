import { templateList } from '@aiweb/templates';
import AiBuilder from './AiBuilder.jsx';

export default function NewSitePage({ params, searchParams }) {
  return (
    <AiBuilder
      locale={params.locale}
      templates={templateList}
      initialPrompt={searchParams?.prompt ?? ''}
      initialTemplate={searchParams?.template ?? ''}
    />
  );
}
