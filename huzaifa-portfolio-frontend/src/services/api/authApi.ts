import { apiClient } from './client';
export const authApi={
 async bootstrap(){return apiClient.get('/health')},
 async login(email:string,password:string){await this.bootstrap().catch(()=>null); const res=await apiClient.post('/auth/login',{email,password}); return res.data},
 async refresh(refreshToken:string){const res=await apiClient.post('/auth/refresh',{refreshToken}); return res.data},
 async logout(){const refreshToken=localStorage.getItem('refresh-token'); if(refreshToken) await apiClient.post('/auth/logout',{refreshToken});},
 async me(){const res=await apiClient.get('/auth/me'); return res.data}
};
