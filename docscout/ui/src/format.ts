// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Formats today as time, this year as day and time, and earlier years as dates.
export function when(iso:string,now=new Date()):string{
 const d=new Date(iso)
 if(d.toDateString()===now.toDateString())return d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})
 if(d.getFullYear()===now.getFullYear())return d.toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})
 return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})
}
