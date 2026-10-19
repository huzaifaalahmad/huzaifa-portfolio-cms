import { ChartCandlestick, BookOpen, GraduationCap, Gamepad2 } from 'lucide-react';

export default function ProjectMark({name,logo}:{name:string;logo?:string}) {
  const marks:Record<string,string> = {
    'Personal Portfolio CMS':'h-logo.svg',
    'Rare Oud':'rare-oud-logo.png',
    'Social Vision':'social-vision-logo.png',
    'XO 3D Arena':'xo-logo.png',
  };
  return <span className={'pv-project-mark '+(['Personal Portfolio CMS','Social Vision','XO 3D Arena'].includes(name)?'pv-mark-transparent':!marks[name]?'pv-mark-pending':'')}>
    {logo||marks[name] ? <img src={logo||('/assets/personal/'+marks[name])} alt={name+' logo'} loading="lazy"/> : name==='XO 3D Arena'?<Gamepad2 aria-hidden="true" size={36}/>:name==='Engineering Encyclopedia'?<BookOpen aria-hidden="true" size={36}/>:name==='Modern Electronic School'?<GraduationCap aria-hidden="true" size={36}/>:<ChartCandlestick aria-hidden="true" size={36}/>}
  </span>;
}
