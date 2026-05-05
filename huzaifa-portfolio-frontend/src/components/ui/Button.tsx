import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
export function Button({to,children,variant='primary'}:{to?:string;children:ReactNode;variant?:'primary'|'secondary'|'ghost'}){ const cls=`btn btn-${variant}`; return to ? <Link className={cls} to={to}>{children}</Link> : <button className={cls}>{children}</button> }
