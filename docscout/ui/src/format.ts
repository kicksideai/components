// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// A moment as compact as its distance allows: the time today, the day and time this year, the date before.
export function when(iso:string,now=new Date()):string{
 const d=new Date(iso)
 if(d.toDateString()===now.toDateString())return d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})
 if(d.getFullYear()===now.getFullYear())return d.toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})
 return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})
}
