import {renderToString} from 'react-dom/server';
import {LanguageProvider} from '../context/LanguageContext';
import PersonalPortfolio from '../components/public/PersonalPortfolio';
export function render() {
  return renderToString(<LanguageProvider><PersonalPortfolio /></LanguageProvider>);
}
