export class SpamService{private readonly SPAM_KEYWORDS=['viagra','casino','lottery'];
calculateSpamScore(m:string,e:string){let s=0;const l=m.toLowerCase();const k=this.SPAM_KEYWORDS.filter(kw=>l.includes(kw));s+=k.length*0.3;const d=['tempmail.com','guerrillamail.com'];if(d.some(dm=>e.endsWith(dm)))s+=0.5;return Math.min(s,1.0);}
isSpam(s:number,t=0.5){return s>=t;}}
