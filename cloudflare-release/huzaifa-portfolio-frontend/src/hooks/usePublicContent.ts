import {useEffect,useState} from 'react';
import seed from '@/data/personalProfile.json';
export type PortfolioContent=typeof seed;
export type ContentEnvelope={content:PortfolioContent;revision:number;updatedAt:string};
export function usePublicContent(){
 const [content,setContent]=useState<PortfolioContent>(seed);
 const isPreview=typeof window!=='undefined'&&window.location.pathname==='/cms-preview';
 useEffect(()=>{
  if(isPreview){try{const draft=sessionStorage.getItem('huzaifa-cms-draft');if(draft)setContent(JSON.parse(draft));}catch{}return;}
  const controller=new AbortController();
  fetch('/api/cms/content',{signal:controller.signal}).then(r=>r.ok?r.json():null).then((data:ContentEnvelope|null)=>{if(data?.content?.site&&Array.isArray(data.content.jobs))setContent(data.content);}).catch(()=>{/* Static seed remains available if the service is offline. */});
  return ()=>controller.abort();
 },[isPreview]);
 return {content,isPreview};
}
