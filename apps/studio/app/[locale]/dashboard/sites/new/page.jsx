import { templateList } from '@aiweb/templates';
import Wizard from './Wizard.jsx';

export default function NewSitePage({ params }) {
  return <Wizard locale={params.locale} templates={templateList} />;
}
