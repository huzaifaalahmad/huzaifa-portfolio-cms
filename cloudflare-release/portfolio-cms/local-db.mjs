import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
export function database(filename,seed){
 const db=new DatabaseSync(filename);db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
 const now=new Date().toISOString();db.prepare('INSERT OR IGNORE INTO content VALUES(1,?,1,?)').run(JSON.stringify(seed),now);db.prepare('INSERT OR IGNORE INTO history SELECT revision,json,updated_at FROM content').run();
 function prepare(sql){let values=[];const result={bind(...v){values=v;return result},async first(){return db.prepare(sql).get(...values)||null},async all(){return {results:db.prepare(sql).all(...values)}},async run(){const r=db.prepare(sql).run(...values);return {success:true,meta:{changes:Number(r.changes)}}}};return result}
 let queue=Promise.resolve();
 return {prepare,batch(statements){const task=queue.then(async()=>{db.exec('BEGIN IMMEDIATE');try{const results=[];for(const stmt of statements)results.push(await stmt.run());db.exec('COMMIT');return results}catch(e){db.exec('ROLLBACK');throw e}});queue=task.catch(()=>{});return task;},close(){db.close()}};
}
